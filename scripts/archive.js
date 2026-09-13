#!/usr/bin/env node
'use strict';

// Preserve request identity and recorded bytes. No upstream requests unless explicitly enabled.
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const digest = value => crypto.createHash('sha256').update(value).digest('hex');
function canonicalUrl(value, base) {
  const url = new URL(value, base);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('Expected an HTTP(S) URL without embedded credentials');
  url.hash = '';
  return url.href; // Query parameters, their order, and duplicate keys are significant.
}
function requestBody(request) {
  const data = request.postData;
  if (!data) return Buffer.alloc(0);
  if (typeof data.text !== 'string') throw new Error('Request body unavailable; cannot construct a replay key');
  return Buffer.from(data.text, data.encoding === 'base64' ? 'base64' : 'utf8');
}
function requestKey(method, url, bodyHash = '') { return `${method.toUpperCase()} ${canonicalUrl(url)} ${bodyHash}`; }
function inferKind(entry) {
  if (entry.kind) return entry.kind;
  const type = entry._resourceType || entry.resourceType;
  if (type === 'document') return 'page';
  if (['script', 'stylesheet', 'image', 'font', 'media', 'manifest', 'worker'].includes(type)) return 'asset';
  if (['xhr', 'fetch'].includes(type)) return 'data';
  const url = new URL(entry.request.url);
  if (/\.(?:html?|xhtml)$/i.test(url.pathname)) return 'page';
  if (/\.(?:m?js|css|wasm|woff2?|ttf|otf|png|jpe?g|gif|webp|avif|svg|ico|mp[34]|webm|ogg|wav|gl[bt]f?|ktx2|drc|exr|json|map)$/i.test(url.pathname)) return 'asset';
  const dest = entry.request.headers?.find(h => h.name.toLowerCase() === 'sec-fetch-dest')?.value;
  if (dest === 'document') return 'page';
  if (dest && dest !== 'empty') return 'asset';
  return 'unknown';
}
function validatePayload({url, status, mime = '', body, kind = 'asset', soft404Hash}) {
  if (!Number.isInteger(status) || status < 200 || status >= 300) throw new Error(`HTTP ${status}`);
  if (status === 206) throw new Error('Partial response (206); capture or fetch the complete resource');
  if (!body.length && ![204, 205].includes(status)) throw new Error('Empty response');
  if ([204, 205].includes(status)) return;
  const head = body.subarray(0, 4096).toString('utf8').replace(/^\uFEFF/, '').trimStart();
  const html = /^(?:<!doctype\s+html|<html\b|<head\b|<body\b)/i.test(head) || /^text\/html\b/i.test(mime);
  const knownAsset = /\.(?:m?js|css|wasm|woff2?|ttf|png|jpe?g|gif|webp|avif|svg|ico|mp[34]|webm|ogg|glb|gltf|ktx2|drc|exr|json|map)$/i.test(new URL(url).pathname);
  if (html && (kind === 'asset' || kind === 'data' || knownAsset)) throw new Error('HTML returned for a resource request (possible soft-404)');
  if (kind !== 'page' && soft404Hash && digest(body) === soft404Hash) throw new Error('Response matches the sampled soft-404 body');
  const mimeExt = {'image/png':'.png','image/webp':'.webp','image/jpeg':'.jpg','image/avif':'.avif','image/gif':'.gif','image/svg+xml':'.svg'};
  const ext = mimeExt[mime.split(';')[0].trim().toLowerCase()] || path.posix.extname(new URL(url).pathname).toLowerCase();
  if (ext === '.webp' && (body.subarray(0,4).toString() !== 'RIFF' || body.subarray(8,12).toString() !== 'WEBP')) throw new Error('Invalid .webp signature');
  const signatures = {
    '.wasm': Buffer.from([0, 97, 115, 109]), '.woff': Buffer.from('wOFF'), '.woff2': Buffer.from('wOF2'),
    '.png': Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), '.glb': Buffer.from('glTF'),
    '.ktx2': Buffer.from([171, 75, 84, 88, 32, 50, 48, 187, 13, 10, 26, 10]),
  };
  if (signatures[ext] && !body.subarray(0, signatures[ext].length).equals(signatures[ext])) throw new Error(`Invalid ${ext} signature`);
  if (ext === '.json' || /^(?:application\/(?:[\w.-]+\+)?json)\b/i.test(mime)) {
    try { JSON.parse(body.toString('utf8')); } catch { throw new Error('Invalid JSON response'); }
  }
}
async function atomicWrite(file, bytes) {
  await fs.mkdir(path.dirname(file), {recursive: true});
  const temp = `${file}.${crypto.randomUUID()}.part`;
  try { await fs.writeFile(temp, bytes); await fs.rename(temp, file); }
  finally { await fs.rm(temp, {force: true}); }
}
async function filesIn(input) {
  const st = await fs.stat(input);
  if (st.isFile()) return [path.resolve(input)];
  const files = [];
  for (const item of await fs.readdir(input, {withFileTypes: true})) {
    const file = path.join(input, item.name);
    if (item.isDirectory()) files.push(...await filesIn(file));
    else if (item.isFile() && item.name.endsWith('.har')) files.push(path.resolve(file));
  }
  return files.sort();
}
async function recordedBody(entry, source) {
  const content = entry.response?.content || {};
  if (typeof content.text === 'string') {
    if (content.encoding && content.encoding !== 'base64') throw new Error(`Unsupported HAR encoding: ${content.encoding}`);
    return Buffer.from(content.text, content.encoding === 'base64' ? 'base64' : 'utf8');
  }
  if (typeof content._file === 'string') {
    const base = await fs.realpath(path.dirname(source));
    const target = await fs.realpath(path.resolve(base, content._file));
    const rel = path.relative(base, target);
    if (rel.startsWith(`..${path.sep}`) || rel === '..' || path.isAbsolute(rel)) throw new Error('HAR attachment is outside its directory');
    return fs.readFile(target);
  }
  if ([204, 205].includes(entry.response?.status)) return Buffer.alloc(0);
  return null;
}
async function fetchComplete(url, {timeoutMs = 30000, maxBytes = 256 * 1024 * 1024, attempts = 3, kind = 'asset', soft404Hash} = {}) {
  let last;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const response = await fetch(url, {redirect: 'follow', signal: AbortSignal.timeout(timeoutMs)});
      if (!response.ok || response.status === 206) {
        await response.body?.cancel();
        const error = new Error(`HTTP ${response.status}`);
        error.permanent = response.status < 500 && response.status !== 429;
        throw error;
      }
      const chunks = []; let size = 0;
      try {
        if (response.body) for await (const chunk of response.body) {
          size += chunk.length;
          if (size > maxBytes) throw new Error(`Response exceeds ${maxBytes} bytes`);
          chunks.push(Buffer.from(chunk));
        }
      } catch (error) { throw new Error(`Incomplete response: ${error.message}`); }
      const body = Buffer.concat(chunks);
      const mime = response.headers.get('content-type') || 'application/octet-stream';
      validatePayload({url, status: response.status, mime, body, kind, soft404Hash});
      return {body, mime, status: response.status, finalUrl: response.url};
    } catch (error) {
      last = error;
      if (error.permanent || attempt + 1 === attempts) break;
      await new Promise(resolve => setTimeout(resolve, Math.min(250 * 2 ** attempt, 2000)));
    }
  }
  throw last;
}
function extension(url, mime) {
  const ext = path.posix.extname(new URL(url).pathname).toLowerCase();
  if (/^\.[a-z0-9]{1,8}$/.test(ext)) return ext;
  const types = {'text/html': '.html', 'text/css': '.css', 'text/javascript': '.js', 'application/javascript': '.js', 'application/json': '.json', 'application/wasm': '.wasm'};
  return types[mime.split(';')[0].trim()] || '.bin';
}
async function archive(input, output, options = {}) {
  const inputs = await filesIn(input);
  if (!inputs.length) throw new Error('No HAR files found');
  const root = path.resolve(output);
  await fs.mkdir(root, {recursive: true});
  const records = [];
  for (const source of inputs) {
    const data = JSON.parse((await fs.readFile(source, 'utf8')).replace(/^\uFEFF/, ''));
    if (Array.isArray(data.log?.entries)) {
      for (const entry of data.log.entries) records.push({entry, source, fromHar: true});
    } else {
      const list = Array.isArray(data) ? data : data.requests;
      if (!Array.isArray(list)) throw new Error(`${source}: expected HAR or an array of {url, kind}`);
      for (const item of list) {
        const request = typeof item === 'string' ? {url: item, kind: 'asset'} : item;
        records.push({entry: {request: {url: request.url, method: 'GET'}, kind: request.kind || 'asset'}, source, fromHar: false});
      }
    }
  }
  const baseUrl = canonicalUrl(options.baseUrl || records.find(r => r.entry.request?.url?.startsWith('http'))?.entry.request.url);
  const allowed = options.origins?.length ? new Set(options.origins.map(u => new URL(u).origin)) : null;
  const manifest = {version: 1, baseUrl, createdAt: new Date().toISOString(), origins: [], entries: [], failures: [], conflicts: [], skipped: []};
  const byKey = new Map();
  for (const {entry, source, fromHar} of records) {
    const request = entry.request || {};
    let url, key;
    try {
      if (!/^https?:/i.test(request.url || '')) { manifest.skipped.push({url: request.url || '', reason: 'Non-HTTP URL'}); continue; }
      url = canonicalUrl(request.url);
      if (allowed && !allowed.has(new URL(url).origin)) { manifest.skipped.push({url, reason: 'Outside selected origins'}); continue; }
      const method = (request.method || 'GET').toUpperCase();
      if (method === 'HEAD' || method === 'OPTIONS') { manifest.skipped.push({url, reason: `${method} is not a content response`}); continue; }
      const bodyHash = ['GET', 'HEAD'].includes(method) ? '' : digest(requestBody(request));
      key = requestKey(method, url, bodyHash);
      const kind = inferKind(entry);
      let status = entry.response?.status;
      const redirect = entry.response?.redirectURL || entry.response?.headers?.find(h => h.name.toLowerCase() === 'location')?.value;
      if ([301, 302, 303, 307, 308].includes(status) && redirect) {
        const item = {url, method, requestBodyHash: bodyHash, status, redirectUrl: canonicalUrl(redirect, url)};
        const previous = byKey.get(key);
        if (!previous) { byKey.set(key, item); manifest.entries.push(item); }
        else if (previous.redirectUrl !== item.redirectUrl || previous.status !== item.status) manifest.conflicts.push({url, method, reason: 'Different responses for the same request key; narrow the capture scope'});
        continue;
      }
      let body = fromHar ? await recordedBody(entry, source) : null;
      let mime = entry.response?.content?.mimeType || entry.response?.headers?.find(h => h.name.toLowerCase() === 'content-type')?.value || 'application/octet-stream';
      let provenance = 'har'; let finalUrl;
      if (body === null) {
        if (fromHar && !options.fetchMissing) throw new Error('HAR response body missing; recapture with HAR_CONTENT=embed, or explicitly use --fetch-missing');
        if (method !== 'GET') throw new Error('Will not repeat a non-GET request to recover its body');
        ({body, mime, status, finalUrl} = await fetchComplete(url, {...options, kind}));
        provenance = 'download';
      }
      // HAR content.size describes decoded bytes. It is separate from compressed bodySize.
      const recordedSize = entry.response?.content?.size;
      if (provenance === 'har' && Number.isFinite(recordedSize) && recordedSize > 0 && body.length !== recordedSize) throw new Error(`HAR body size mismatch: expected ${recordedSize}, got ${body.length}`);
      validatePayload({url, status, mime, body, kind, soft404Hash: options.soft404Hash});
      const hash = digest(body);
      const previous = byKey.get(key);
      if (previous) {
        if (previous.sha256 !== hash || previous.status !== status || previous.mime !== mime) manifest.conflicts.push({url, method, reason: 'Different responses for the same URL/method/body; selected first, recapture one consistent version/profile'});
        continue;
      }
      const file = `_assets/${hash}${extension(url, mime)}`;
      const target = path.join(root, file);
      let intact = false;
      try { intact = digest(await fs.readFile(target)) === hash; } catch (error) { if (error.code !== 'ENOENT') throw error; }
      if (!intact) await atomicWrite(target, body);
      const item = {url, method, requestBodyHash: bodyHash, file, mime, status, sha256: hash, size: body.length, kind, source: provenance};
      if (finalUrl) item.finalUrl = finalUrl;
      byKey.set(key, item); manifest.entries.push(item);
    } catch (error) { manifest.failures.push({url: url || request.url || '', method: request.method || 'GET', reason: error.message}); }
  }
  manifest.origins = [...new Set([new URL(baseUrl).origin, ...manifest.entries.flatMap(e => [new URL(e.url).origin, ...(e.redirectUrl ? [new URL(e.redirectUrl).origin] : [])])])];
  // A later successful recording can fill an earlier failed request in the same capture.
  manifest.failures = manifest.failures.filter(f => !manifest.entries.some(e => e.url === f.url && e.method === f.method && ['GET', 'HEAD'].includes(e.method)));
  await atomicWrite(path.join(root, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  await atomicWrite(path.join(root, 'DONE.list'), manifest.entries.map(e => `${e.method} ${e.url}`).join('\n') + (manifest.entries.length ? '\n' : ''));
  await atomicWrite(path.join(root, 'MISSING.log'), [...manifest.failures, ...manifest.conflicts].map(e => JSON.stringify(e)).join('\n') + (manifest.failures.length + manifest.conflicts.length ? '\n' : ''));
  return manifest;
}
function parseArgs(args) {
  const pos = []; const options = {origins: []};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--fetch-missing') options.fetchMissing = true;
    else if (['--base', '--origin', '--fingerprint', '--max-bytes', '--timeout-ms'].includes(arg)) {
      const value = args[++i]; if (!value || value.startsWith('--')) throw new Error(`${arg} needs a value`);
      if (arg === '--base') options.baseUrl = value;
      if (arg === '--origin') options.origins.push(value);
      if (arg === '--fingerprint') options.fingerprint = value;
      if (arg === '--max-bytes') options.maxBytes = Number(value);
      if (arg === '--timeout-ms') options.timeoutMs = Number(value);
    } else if (arg.startsWith('--')) throw new Error(`Unknown option: ${arg}`);
    else pos.push(arg);
  }
  if (pos.length !== 2) throw new Error('Expected input HAR/directory/URL-list and output directory');
  for (const n of ['maxBytes', 'timeoutMs']) if (options[n] !== undefined && (!Number.isSafeInteger(options[n]) || options[n] <= 0)) throw new Error(`${n} must be a positive integer`);
  return {input: pos[0], output: pos[1], options};
}
async function main(args) {
  if (args.includes('--help') || !args.length) {
    console.log('Usage: node scripts/archive.js <HAR-file|HAR-run-directory|urls.json> <mirror> --base <original-url> [--origin <allowed-origin>] [--fetch-missing] [--fingerprint <json>] [--max-bytes N] [--timeout-ms N]\nHAR uses recorded bodies by default; URL-list entries are {"url":"https://...","kind":"page|asset|data"}. Full query strings are preserved. Non-GET requests are never sent upstream.');
    return;
  }
  const {input, output, options} = parseArgs(args);
  if (options.fingerprint) {
    const fingerprint = JSON.parse((await fs.readFile(options.fingerprint, 'utf8')).replace(/^\uFEFF/, ''));
    if (fingerprint.soft404?.isSoft404 || fingerprint.soft404?.present) options.soft404Hash = fingerprint.soft404.bodySha256;
  }
  const result = await archive(input, output, options);
  console.log(JSON.stringify({entries: result.entries.length, failures: result.failures.length, conflicts: result.conflicts.length, skipped: result.skipped.length, manifest: path.resolve(output, 'manifest.json')}, null, 2));
  if (!result.entries.length || result.failures.length || result.conflicts.length) process.exitCode = 1;
}
if (require.main === module) main(process.argv.slice(2)).catch(error => {console.error(error.message); process.exitCode = 1;});
module.exports = {canonicalUrl, requestKey, inferKind, validatePayload, recordedBody, fetchComplete, archive, parseArgs, digest};
