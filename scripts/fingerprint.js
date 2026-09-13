#!/usr/bin/env node
'use strict';

const { createHash, randomUUID } = require('node:crypto');

const HTML_TYPES = /^(?:text\/html|application\/xhtml\+xml)(?:\s*;|$)/i;
const JS_TYPES = /^(?:(?:text|application)\/(?:x-)?(?:java|ecma)script)(?:\s*;|$)/i;
const HTML_CONTENT = /<!doctype\s+html\b|<(?:html|head|body|script|main|title)\b/i;

function httpUrl(value, base) {
  const url = new URL(value, base);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only HTTP(S) URLs are supported');
  if (url.username || url.password) throw new Error('URLs containing credentials are not supported');
  url.hash = '';
  return url.href;
}

function decodeEntities(value) {
  const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', colon: ':', sol: '/', Tab: '\t', NewLine: '\n' };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|colon|sol|Tab|NewLine);/gi, (match, entity) => {
    if (entity[0] !== '#') return named[entity] ?? named[entity.toLowerCase()] ?? match;
    const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    return code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff) ? String.fromCodePoint(code) : '\uFFFD';
  });
}

function attributes(source) {
  const result = {};
  const pattern = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of source.matchAll(pattern)) {
    const key = match[1].toLowerCase();
    if (!(key in result)) result[key] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? '');
  }
  return result;
}

function extractDocument(html, finalUrl) {
  const clean = html.replace(/<!--[\s\S]*?-->/g, '');
  let baseUrl = finalUrl;
  const base = /<base\b((?:"[^"]*"|'[^']*'|[^'">])*)>/i.exec(clean);
  if (base) {
    const href = attributes(base[1]).href;
    if (href) { try { baseUrl = httpUrl(href, finalUrl); } catch {} }
  }
  const scripts = [];
  const inlineScripts = [];
  let moduleCount = 0;
  const tags = /<script\b((?:"[^"]*"|'[^']*'|[^'">])*)>([\s\S]*?)<\/script\s*>/gi;
  for (const match of clean.matchAll(tags)) {
    const attrs = attributes(match[1]);
    const type = (attrs.type || '').trim().toLowerCase();
    const executable = !type || type === 'module' || JS_TYPES.test(type);
    if (type === 'module') moduleCount++;
    if (!executable) continue;
    if (attrs.src) {
      try { scripts.push({ url: httpUrl(attrs.src, baseUrl), module: type === 'module' }); } catch {}
    } else if (match[2].trim()) inlineScripts.push(match[2]);
  }
  const visibleText = clean.replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '').replace(/<[^>]+>/g, '').trim();
  return { baseUrl, scripts, inlineScripts, moduleCount, visibleContent: Boolean(visibleText || /<(?:img|picture|video|audio|svg)\b/i.test(clean)) };
}

function scanCode(source) {
  const matches = (pattern) => [...source.matchAll(pattern)].length;
  return {
    webgl: matches(/\bWebGL(?:2)?RenderingContext\b|\bWebGLRenderer\b|\bTHREE\.|getContext\s*\(\s*['"](?:experimental-)?webgl2?['"]|\b(?:KTX2|DRACO)Loader\b|\bBABYLON\./g),
    workers: matches(/\bnew\s+(?:Shared)?Worker\s*\(/g),
    api: matches(/\bfetch\s*\(|\baxios(?:\.[a-z]+)?\s*\(|\/api\/|\bgraphql\b/gi),
    hydration: matches(/\bhydrateRoot\s*\(|\b(?:ReactDOM\.)?hydrate\s*\(|\b__NUXT__\b|\b__NEXT_DATA__\b|self\.__next_f\s*\./g),
    clientRendering: matches(/\b(?:ReactDOM\.)?createRoot\s*\(|\bcreateApp\s*\(/g)
  };
}

function extractImports(source, baseUrl) {
  const urls = [];
  const imports = /(?:\bimport\s*(?:\(\s*|)|\bfrom\s*)['"]([^'"]+)['"]/g;
  for (const match of source.matchAll(imports)) {
    if (!/^(?:\.{1,2}\/|\/|https?:\/\/)/i.test(match[1])) continue;
    try { urls.push(httpUrl(match[1], baseUrl)); } catch {}
  }
  return [...new Set(urls)];
}

async function fetchBounded(url, options = {}) {
  const fetchImpl = options.fetchImpl || fetch;
  const timeoutMs = options.timeoutMs ?? 15000;
  const maxBytes = options.maxResponseBytes ?? 2 * 1024 * 1024;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error(`Request exceeded ${timeoutMs} ms`)), timeoutMs);
  let current = httpUrl(url);
  try {
    for (let redirects = 0; redirects <= 4; redirects++) {
      const response = await fetchImpl(current, { redirect: 'manual', signal: controller.signal, headers: { 'User-Agent': 'WebsiteReplicationFingerprint/2.0', Accept: '*/*' } });
      if ([301, 302, 303, 307, 308].includes(response.status) && response.headers.get('location')) {
        await response.body?.cancel();
        if (redirects === 4) throw new Error('Redirect limit (4) exceeded');
        current = httpUrl(response.headers.get('location'), current);
        continue;
      }
      const declared = Number(response.headers.get('content-length'));
      if (declared > maxBytes) {
        await response.body?.cancel();
        throw new Error(`Response exceeds ${maxBytes} byte limit`);
      }
      const parts = [];
      let size = 0;
      if (response.body) {
        const reader = response.body.getReader();
        try {
          for (;;) {
            const { value, done } = await reader.read();
            if (done) break;
            size += value.byteLength;
            if (size > maxBytes) { await reader.cancel(); throw new Error(`Response exceeds ${maxBytes} byte limit`); }
            parts.push(Buffer.from(value));
          }
        } finally { reader.releaseLock(); }
      }
      return { url: current, status: response.status, ok: response.ok, headers: response.headers, contentType: response.headers.get('content-type') || '', text: Buffer.concat(parts).toString('utf8'), size };
    }
    throw new Error('Redirect limit exceeded');
  } finally { clearTimeout(timer); }
}

function platformFrom(headers) {
  const server = (headers.get('server') || '').toLowerCase();
  let platform = 'unknown';
  if (headers.has('x-vercel-id') || server === 'vercel') platform = 'vercel';
  else if (headers.has('x-nf-request-id')) platform = 'netlify';
  else if (server === 'github.com') platform = 'github-pages';
  else if (/amazons3/.test(server) || headers.has('x-amz-request-id')) platform = 's3-cdn';
  if (headers.has('cf-ray') || server === 'cloudflare') platform = platform === 'unknown' ? 'cloudflare' : `${platform}-behind-cloudflare`;
  return platform;
}

async function fingerprint(input, options = {}) {
  const inputUrl = httpUrl(input);
  const page = await fetchBounded(inputUrl, options);
  if (!page.ok) throw new Error(`Entry returned HTTP ${page.status}: ${page.url}`);
  if (!HTML_TYPES.test(page.contentType) || !HTML_CONTENT.test(page.text)) throw new Error(`Entry is not an HTML document (HTTP ${page.status}, Content-Type ${page.contentType || 'missing'}): ${page.url}`);
  const document = extractDocument(page.text, page.url);
  const signals = {
    rootHtmlBytes: page.size,
    moduleEntries: document.moduleCount,
    scriptRefs: document.scripts.length,
    hydrationMarkers: /(?:id\s*=\s*['"]__NEXT_DATA__['"]|\b__NUXT__\b|data-server-rendered\s*=|data-reactroot\b|self\.__next_f\s*\.)/.test(page.text) ? 1 : 0,
    webglHits: 0, workerRefs: 0, apiHits: 0, clientRenderingHits: 0,
    scannedScripts: [], skippedScripts: [], warnings: []
  };
  const applyCode = (code) => {
    const hits = scanCode(code);
    signals.webglHits += hits.webgl;
    signals.workerRefs += hits.workers;
    signals.apiHits += hits.api;
    signals.hydrationMarkers += hits.hydration;
    signals.clientRenderingHits += hits.clientRendering;
  };
  const queue = document.scripts.map((script) => ({ url: script.url, depth: 0 }));
  for (const code of document.inlineScripts) {
    applyCode(code);
    for (const url of extractImports(code, document.baseUrl)) queue.push({ url, depth: 1 });
  }
  const seen = new Set();
  const maxScripts = Math.max(0, Math.min(4, options.maxScripts ?? 4));
  while (queue.length && seen.size < maxScripts) {
    const item = queue.shift();
    if (seen.has(item.url)) continue;
    seen.add(item.url);
    try {
      const script = await fetchBounded(item.url, options);
      if (!script.ok || !JS_TYPES.test(script.contentType) || HTML_CONTENT.test(script.text.slice(0, 512).trimStart()) && /^\s*(?:<!doctype|<html|<head|<body)/i.test(script.text)) {
        signals.skippedScripts.push({ url: item.url, status: script.status, contentType: script.contentType, reason: 'Not a successful JavaScript response' });
        continue;
      }
      signals.scannedScripts.push({ url: script.url, size: script.size });
      applyCode(script.text);
      if (item.depth === 0) for (const url of extractImports(script.text, script.url)) queue.push({ url, depth: 1 });
    } catch (error) { signals.skippedScripts.push({ url: item.url, reason: error.message }); }
  }
  if (queue.length) signals.warnings.push('Script scan stopped at the bounded budget: at most 4 entry/chunk URLs and one import layer.');

  const probeUrl = new URL(`/__replication_probe_${randomUUID()}.bin`, page.url).href;
  let soft404;
  try {
    const probe = await fetchBounded(probeUrl, options);
    const isSoft404 = probe.ok && HTML_TYPES.test(probe.contentType) && HTML_CONTENT.test(probe.text);
    soft404 = {
      probeUrl, finalUrl: probe.url, status: probe.status, contentType: probe.contentType, size: probe.size,
      isSoft404, present: isSoft404,
      bodySha256: createHash('sha256').update(probe.text, 'utf8').digest('hex'),
      scope: 'Evidence for this random path only. This hash must not invalidate a legitimate HTML navigation or SPA shell.'
    };
  } catch (error) {
    soft404 = { probeUrl, isSoft404: null, present: null, error: error.message };
  }

  let archetype = 'unknown';
  let recommendedPlaybook = 'manual-triage';
  if (signals.hydrationMarkers) { archetype = 'ssr-hydration'; recommendedPlaybook = 'playbook-spa'; }
  else if (signals.webglHits) { archetype = 'webgl-spa'; recommendedPlaybook = 'playbook-webgl'; }
  else if (signals.moduleEntries || signals.clientRenderingHits) { archetype = 'spa-uncertain'; recommendedPlaybook = 'playbook-spa'; }
  else if (document.visibleContent && !signals.skippedScripts.length) { archetype = 'static'; recommendedPlaybook = 'playbook-static'; }
  return {
    inputUrl, baseUrl: document.baseUrl, finalUrl: page.url, platform: platformFrom(page.headers), soft404,
    archetype, recommendedPlaybook, apiSuspected: signals.apiHits > 0, signals,
    note: 'Bounded source heuristic, not a crawl or proof of completeness. Confirm the recommended playbook in a browser; API keyword hits require network confirmation. A WebGL signal can also belong to an embedded component.'
  };
}

async function main(args = process.argv.slice(2)) {
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node scripts/fingerprint.js <http(s)-url>\nRead-only JSON fingerprint. Node.js 20+. Entry, random-origin probe, and at most 4 scripts/chunks; each logical request is limited to 15 s, 2 MiB, and 4 redirects.');
    return;
  }
  if (args.length !== 1) throw new Error('Usage: node scripts/fingerprint.js <http(s)-url>');
  console.log(JSON.stringify(await fingerprint(args[0]), null, 2));
}

module.exports = { fingerprint, fetchBounded, extractDocument, decodeEntities, extractImports, scanCode, main };
if (require.main === module) main().catch((error) => { console.error(JSON.stringify({ error: error.message })); process.exitCode = 1; });
