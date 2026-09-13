#!/usr/bin/env node
'use strict';

// Offline mirror server: no upstream requests or network fallback.
// node scripts/serve.js [root=.] [port=8080] [--spa] [--isolate]
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { Transform, pipeline } = require('node:stream');
const { StringDecoder } = require('node:string_decoder');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.map': 'application/json',
  '.wasm': 'application/wasm', '.ktx2': 'image/ktx2', '.basis': 'application/octet-stream',
  '.drc': 'application/octet-stream', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json',
  '.exr': 'image/x-exr', '.hdr': 'application/octet-stream', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.avif': 'image/avif',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.ogg': 'audio/ogg', '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
  '.otf': 'font/otf', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
};

function canonicalUrl(value) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Expected an HTTP(S) URL');
  url.hash = '';
  return url.href;
}

function originToken(origin) { return Buffer.from(new URL(origin).origin).toString('base64url'); }

function localUrl(original, baseOrigin) {
  const url = new URL(original);
  const prefix = url.origin === new URL(baseOrigin).origin ? '' : '/_mirror/' + originToken(url.origin);
  return prefix + url.pathname + url.search + url.hash;
}

function key(method, url, bodyHash = '') { return method.toUpperCase() + ' ' + canonicalUrl(url) + ' ' + bodyHash; }

function inside(root, file) {
  const rel = path.relative(root, file);
  return rel === '' || (!path.isAbsolute(rel) && rel !== '..' && !rel.startsWith('..' + path.sep));
}

async function safeFile(root, relative) {
  const candidate = path.resolve(root, relative);
  if (!inside(root, candidate)) return { error: 403 };
  try {
    let real = await fs.promises.realpath(candidate);
    if (!inside(root, real)) return { error: 403 };
    let stat = await fs.promises.stat(real);
    if (stat.isDirectory()) {
      real = await fs.promises.realpath(path.join(real, 'index.html'));
      if (!inside(root, real)) return { error: 403 };
      stat = await fs.promises.stat(real);
    }
    return stat.isFile() ? { file: real, stat } : { error: 404 };
  } catch (error) {
    if (['ENOENT', 'ENOTDIR'].includes(error.code)) return { error: 404 };
    if (['EACCES', 'EPERM', 'ELOOP'].includes(error.code)) return { error: 403 };
    throw error;
  }
}

function loadManifest(root) {
  const file = path.join(root, 'manifest.json');
  if (!fs.existsSync(file)) return null;
  if (!inside(root, fs.realpathSync(file))) throw new Error('Manifest must stay inside the archive root');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (data.version !== 1 || !Array.isArray(data.entries)) throw new Error('Unsupported manifest format');
  const baseOrigin = new URL(canonicalUrl(data.baseUrl)).origin;
  const origins = new Set([baseOrigin, ...(data.origins || []).map(origin => new URL(canonicalUrl(origin)).origin)]);
  const entries = new Map();
  for (const entry of data.entries) {
    const url = canonicalUrl(entry.url);
    const method = (entry.method || 'GET').toUpperCase();
    if (!origins.has(new URL(url).origin)) throw new Error('Manifest entry origin must appear in origins');
    const entryKey = key(method, url, entry.requestBodyHash || '');
    if (entries.has(entryKey)) throw new Error('Duplicate manifest entry: ' + method + ' ' + url);
    entries.set(entryKey, { ...entry, url, method });
  }
  return { baseOrigin, origins, entries };
}

function escapeRegExp(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// Runtime rewriting leaves archived bytes untouched. This bounded streaming
// replacement is not a JS/CSS parser: it handles known origins and ordinary CSS
// url()/quoted @import tokens up to 8192 chars. CSS escapes, computed JS URLs,
// non-UTF-8 text and unknown origins require a site-specific adapter.
class RewriteText extends Transform {
  constructor(manifest, originalUrl, css) {
    super();
    this.decoder = new StringDecoder('utf8');
    this.pending = '';
    this.manifest = manifest;
    this.originalUrl = originalUrl;
    this.css = css;
    this.replacements = new Map();
    for (const origin of manifest.origins) {
      const prefix = origin === manifest.baseOrigin ? '' : '/_mirror/' + originToken(origin);
      for (const form of [origin, origin.replace(/^https?:/, '')]) {
        if (!this.replacements.has(form)) this.replacements.set(form, prefix);
        const escaped = form.replace(/\//g, '\\/');
        if (!this.replacements.has(escaped)) this.replacements.set(escaped, prefix);
      }
    }
    const origins = [...this.replacements.keys()].sort((a, b) => b.length - a.length).map(escapeRegExp).join('|');
    const originPattern = '(?:' + origins + ')(?=$|[\\\\/?#\\s\"\'<>),;\\]\\}])';
    const cssPattern = String.raw`url\(\s{0,64}(?:"[^"\r\n]{0,8192}"|'[^'\r\n]{0,8192}'|[^()'"\s]{0,8192})\s{0,64}\)|@import\s{1,64}(?:"[^"\r\n]{0,8192}"|'[^'\r\n]{0,8192}')`;
    this.pattern = new RegExp(css ? cssPattern + '|' + originPattern : originPattern, 'gi');
  }

  replacement(value) {
    if (this.css && /^(url\(|@import\s)/i.test(value)) {
      const match = /^url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s]*?))\s*\)$/i.exec(value)
        || /^@import\s+(?:"([^"]*)"|'([^']*)')$/i.exec(value);
      if (!match) return value;
      const original = match[1] ?? match[2] ?? match[3];
      if (!original || /^(?:#|data:|blob:)/i.test(original) || /\\/.test(original)) return value;
      try {
        const absolute = new URL(original, this.originalUrl);
        if (!this.manifest.origins.has(absolute.origin)) return value;
        const local = localUrl(absolute, this.manifest.baseOrigin);
        return /^@import/i.test(value) ? '@import "' + local + '"' : 'url("' + local + '")';
      } catch { return value; }
    }
    return this.replacements.get(value) ?? [...this.replacements].find(([from]) => from.toLowerCase() === value.toLowerCase())?.[1] ?? value;
  }

  flushText(final) {
    let cutoff = final ? this.pending.length : Math.max(0, this.pending.length - 16384);
    if (!cutoff) return;
    this.pattern.lastIndex = 0;
    let last = 0;
    let output = '';
    let match;
    while ((match = this.pattern.exec(this.pending)) && match.index < cutoff) {
      output += this.pending.slice(last, match.index) + this.replacement(match[0]);
      last = match.index + match[0].length;
      cutoff = Math.max(cutoff, last);
    }
    output += this.pending.slice(last, cutoff);
    this.pending = this.pending.slice(cutoff);
    this.push(output);
  }

  _transform(chunk, encoding, callback) {
    try { this.pending += this.decoder.write(chunk); this.flushText(false); callback(); }
    catch (error) { callback(error); }
  }

  _flush(callback) {
    try { this.pending += this.decoder.end(); this.flushText(true); callback(); }
    catch (error) { callback(error); }
  }
}

function parseRange(header, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header || '');
  if (!match || (!match[1] && !match[2]) || size === 0) return null;
  let start;
  let end;
  if (!match[1]) {
    const suffix = Number(match[2]);
    if (!Number.isSafeInteger(suffix) || suffix <= 0) return null;
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
  }
  return Number.isSafeInteger(start) && Number.isSafeInteger(end) && start <= end && start < size ? { start, end } : null;
}

function isDocument(req, decodedPath, crossOrigin) {
  if (crossOrigin || !['GET', 'HEAD'].includes(req.method)) return false;
  const accept = String(req.headers.accept || '').toLowerCase();
  const dest = String(req.headers['sec-fetch-dest'] || '').toLowerCase();
  if (!accept.includes('text/html') || (dest && !['document', 'iframe'].includes(dest))) return false;
  if (/^\/(?:api|graphql|_mirror)(?:\/|$)/i.test(decodedPath)) return false;
  const extension = path.posix.extname(decodedPath).toLowerCase();
  return !extension || ['.html', '.htm'].includes(extension);
}

async function bodyHash(req, limit) {
  const declaredSize = Number(req.headers['content-length']);
  if (Number.isFinite(declaredSize) && declaredSize > limit) {
    const error = new Error('Body too large'); error.status = 413; throw error;
  }
  const hash = crypto.createHash('sha256');
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) { const error = new Error('Body too large'); error.status = 413; throw error; }
    hash.update(chunk);
  }
  return hash.digest('hex');
}

function createMirrorServer(options = {}) {
  const root = fs.realpathSync(path.resolve(options.root || '.'));
  if (!fs.statSync(root).isDirectory()) throw new Error('Archive root must be a directory');
  const manifest = loadManifest(root);
  const maxBodyBytes = options.maxBodyBytes ?? 10 * 1024 * 1024;
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
  if (options.isolate) Object.assign(headers, {
    'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Resource-Policy': 'same-origin',
  });
  function fail(req, res, status, extra = {}) {
    res.writeHead(status, { ...headers, 'Content-Type': 'text/plain; charset=utf-8', ...extra });
    res.end(req.method === 'HEAD' ? undefined : http.STATUS_CODES[status]);
  }
  async function handle(req, res) {
    // Check raw pathname before URL() can normalize dot segments away.
    const target = req.url || '/';
    if (!target.startsWith('/') || target.startsWith('//')) return fail(req, res, 400);
    const rawPath = target.split('?')[0];
    let decodedPath;
    try { decodedPath = decodeURIComponent(rawPath); }
    catch { return fail(req, res, 400); }
    if (/[\0\\]/.test(decodedPath)) return fail(req, res, 400);
    if (!inside(root, path.resolve(root, '.' + decodedPath))) return fail(req, res, 403);
    if (!['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'].includes(req.method)) {
      return fail(req, res, 405, { Allow: 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS' });
    }
    let originalUrl;
    let crossOrigin = false;
    let entry;
    if (manifest) {
      let originalTarget = target;
      let origin = manifest.baseOrigin;
      if (rawPath.startsWith('/_mirror/')) {
        const match = /^\/_mirror\/([A-Za-z0-9_-]+)(\/[^?]*)?(\?.*)?$/.exec(target);
        if (!match) return fail(req, res, 404);
        try {
          origin = Buffer.from(match[1], 'base64url').toString('utf8');
          if (new URL(origin).origin !== origin || originToken(origin) !== match[1]) return fail(req, res, 400);
        } catch { return fail(req, res, 400); }
        if (!manifest.origins.has(origin)) return fail(req, res, 404);
        originalTarget = (match[2] || '/') + (match[3] || '');
        crossOrigin = true;
      }
      originalUrl = canonicalUrl(origin + originalTarget);
      const requestHash = ['GET', 'HEAD'].includes(req.method) ? '' : await bodyHash(req, maxBodyBytes);
      entry = manifest.entries.get(key(req.method, originalUrl, requestHash));
      if (!entry && req.method === 'HEAD') entry = manifest.entries.get(key('GET', originalUrl));
    }
    if (entry?.redirectUrl) {
      const destination = new URL(entry.redirectUrl, originalUrl);
      if (!manifest.origins.has(destination.origin)) return fail(req, res, 502);
      const status = Number(entry.status);
      if (![301, 302, 303, 307, 308].includes(status)) return fail(req, res, 500);
      res.writeHead(status, { ...headers, Location: localUrl(destination, manifest.baseOrigin) });
      return res.end();
    }
    let found;
    if (entry) {
      if (typeof entry.file !== 'string' || !entry.file || path.isAbsolute(entry.file)) return fail(req, res, 500);
      found = await safeFile(root, entry.file);
    } else if (crossOrigin || !['GET', 'HEAD'].includes(req.method)) {
      return fail(req, res, manifest ? 404 : 405, manifest ? {} : { Allow: 'GET, HEAD' });
    } else {
      found = await safeFile(root, '.' + decodedPath);
    }
    if (found.error === 403) return fail(req, res, 403);
    if (found.error && !entry && options.spa && isDocument(req, decodedPath, crossOrigin)) {
      const indexEntry = manifest?.entries.get(key('GET', manifest.baseOrigin + '/'))
        || manifest?.entries.get(key('GET', manifest.baseOrigin + '/index.html'));
      if (indexEntry?.file) {
        entry = indexEntry;
        originalUrl = indexEntry.url;
        found = await safeFile(root, indexEntry.file);
      } else found = await safeFile(root, 'index.html');
    }
    if (found.error) return fail(req, res, found.error);
    const status = Number(entry?.status ?? 200);
    if (!Number.isInteger(status) || status < 200 || status > 599) return fail(req, res, 500);
    const mime = entry?.mime || MIME[path.extname(found.file).toLowerCase()] || 'application/octet-stream';
    if (/[\r\n]/.test(mime)) return fail(req, res, 500);
    const rewrite = manifest && /^(?:text\/(?:html|css|javascript)|application\/(?:javascript|json|[^;]+\+json))(?:;|$)/i.test(mime)
      && !/charset\s*=\s*(?!utf-8(?:[;\s]|$)|utf8(?:[;\s]|$))/i.test(mime);
    const responseHeaders = { ...headers, 'Content-Type': mime, 'Accept-Ranges': rewrite ? 'none' : 'bytes' };
    if ([204, 205, 304].includes(status)) { res.writeHead(status, responseHeaders); return res.end(); }
    let range;
    if (req.headers.range && status === 200 && !rewrite) {
      range = parseRange(req.headers.range, found.stat.size);
      if (!range) return fail(req, res, 416, { 'Content-Range': 'bytes */' + found.stat.size });
      responseHeaders['Content-Range'] = 'bytes ' + range.start + '-' + range.end + '/' + found.stat.size;
    }
    if (!rewrite) responseHeaders['Content-Length'] = range ? range.end - range.start + 1 : found.stat.size;
    res.writeHead(range ? 206 : status, responseHeaders);
    if (req.method === 'HEAD') return res.end();
    const streams = [fs.createReadStream(found.file, range || {})];
    if (rewrite) streams.push(new RewriteText(manifest, originalUrl || manifest.baseOrigin + target, /^text\/css/i.test(mime)));
    streams.push(res);
    pipeline(...streams, error => { if (error && !res.destroyed) res.destroy(error); });
  }
  return http.createServer((req, res) => {
    handle(req, res).catch(error => {
      if (res.headersSent) res.destroy(error);
      else if (!res.destroyed) fail(req, res, error.status || 500);
      if (!req.complete) req.resume();
    });
  });
}

module.exports = { createMirrorServer, localUrl };
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node scripts/serve.js [root=.] [port=8080] [--spa] [--isolate]\nListens on 127.0.0.1. Uses manifest.json when present; never fetches upstream.');
    process.exit(0);
  }
  const unknown = args.filter(arg => arg.startsWith('--') && !['--spa', '--isolate'].includes(arg));
  const positional = args.filter(arg => !arg.startsWith('--'));
  const port = Number(positional[1] ?? 8080);
  if (unknown.length || positional.length > 2 || !Number.isInteger(port) || port < 0 || port > 65535) {
    console.error('Usage: node serve.js [root=.] [port=8080] [--spa] [--isolate]');
    process.exitCode = 1;
  } else {
    try {
      const server = createMirrorServer({ root: positional[0] || '.', spa: args.includes('--spa'), isolate: args.includes('--isolate') });
      server.on('error', error => { console.error(error.message); process.exitCode = 1; });
      server.listen(port, '127.0.0.1', () => console.log('http://127.0.0.1:' + server.address().port));
    } catch (error) { console.error(error.message); process.exitCode = 1; }
  }
}
