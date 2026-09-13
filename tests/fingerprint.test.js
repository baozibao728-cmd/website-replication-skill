'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { createHash } = require('node:crypto');
const { fingerprint, fetchBounded, extractDocument } = require('../scripts/fingerprint');

async function withServer(handler, run) {
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try { await run(`http://127.0.0.1:${server.address().port}`); }
  finally {
    await new Promise((resolve, reject) => { server.close((error) => error ? reject(error) : resolve()); server.closeAllConnections(); });
  }
}

function reply(res, status, type, body) { res.writeHead(status, { 'content-type': type }); res.end(body); }

test('a tiny valid page stays static; root-origin probe supplies an exact UTF-8 hash', async () => {
  const body = '<html><body>不存在</body></html>';
  await withServer((req, res) => reply(res, 200, 'text/html; charset=utf-8', req.url === '/nested/page' ? '<html><body>Hi</body></html>' : body), async (origin) => {
    const result = await fingerprint(`${origin}/nested/page`);
    assert.equal(result.archetype, 'static');
    assert.equal(result.soft404.isSoft404, true);
    assert.match(result.soft404.probeUrl, new RegExp(`^${origin}/__replication_probe_`));
    assert.equal(result.soft404.bodySha256, createHash('sha256').update(body).digest('hex'));
    assert.equal(result.soft404.size, Buffer.byteLength(body));
  });
});

test('redirect and base href resolve classic and module scripts with entities and arbitrary attributes', async () => {
  const requests = [];
  await withServer((req, res) => {
    requests.push(req.url);
    if (req.url === '/start') { res.writeHead(302, { location: '/site/page.html' }); return res.end(); }
    if (req.url === '/site/page.html') return reply(res, 200, 'text/html', `<html><head><base href='../assets/'></head><body><script src='classic.js?a=1&amp;b=2'></script><script src="module.js?x=&#x31;" defer TYPE = 'module'></script></body></html>`);
    if (req.url === '/assets/classic.js?a=1&b=2') return reply(res, 200, 'application/javascript', 'new THREE.WebGLRenderer(); fetch("/api/content")');
    if (req.url === '/assets/module.js?x=1') return reply(res, 200, 'text/javascript', 'export const a = 1');
    return reply(res, 404, 'text/html', '<html><body>Missing</body></html>');
  }, async (origin) => {
    const result = await fingerprint(`${origin}/start`);
    assert.equal(result.finalUrl, `${origin}/site/page.html`);
    assert.equal(result.baseUrl, `${origin}/assets/`);
    assert.equal(result.archetype, 'webgl-spa');
    assert.equal(result.apiSuspected, true);
    assert.equal(result.soft404.isSoft404, false);
    assert.ok(requests.includes('/assets/classic.js?a=1&b=2'));
    assert.ok(requests.includes('/assets/module.js?x=1'));
  });
});

test('SSR hydration takes priority over WebGL and module signals regardless of page length', async () => {
  await withServer((req, res) => {
    if (req.url === '/') return reply(res, 200, 'text/html', '<html><script id="__NEXT_DATA__" type="application/json">{}</script><script type="module">new THREE.WebGLRenderer()</script></html>');
    return reply(res, 404, 'text/plain', 'missing');
  }, async (origin) => {
    const result = await fingerprint(origin);
    assert.equal(result.archetype, 'ssr-hydration');
    assert.equal(result.recommendedPlaybook, 'playbook-spa');
  });
});

test('failed or HTML-disguised scripts do not supply architecture signals', async () => {
  await withServer((req, res) => {
    if (req.url === '/') return reply(res, 200, 'text/html', '<html><body><script src="/bad.js"></script><script src="/fake.js"></script></body></html>');
    if (req.url === '/bad.js') return reply(res, 404, 'text/javascript', 'new THREE.WebGLRenderer()');
    if (req.url === '/fake.js') return reply(res, 200, 'text/javascript', '<html><body>THREE.WebGLRenderer()</body></html>');
    return reply(res, 200, 'text/plain', '<html>text/html not declared</html>');
  }, async (origin) => {
    const result = await fingerprint(origin);
    assert.equal(result.signals.webglHits, 0);
    assert.equal(result.signals.skippedScripts.length, 2);
    assert.equal(result.archetype, 'unknown');
    assert.equal(result.recommendedPlaybook, 'manual-triage');
    assert.equal(result.soft404.isSoft404, false);
  });
});

test('entry plus one import layer are bounded to four script requests', async () => {
  const scripts = [];
  await withServer((req, res) => {
    if (req.url === '/') return reply(res, 200, 'text/html', '<html><script type="module" src="/entry.js"></script></html>');
    if (req.url.endsWith('.js')) {
      scripts.push(req.url);
      return reply(res, 200, 'text/javascript', req.url === '/entry.js' ? 'import "./a.js"; import "./b.js"; import "./c.js"; import "./d.js";' : 'import "./deeper.js"; export const a = 1');
    }
    return reply(res, 404, 'text/plain', 'missing');
  }, async (origin) => {
    const result = await fingerprint(origin);
    assert.equal(scripts.length, 4);
    assert.ok(!scripts.includes('/deeper.js'));
    assert.equal(result.archetype, 'spa-uncertain');
    assert.ok(result.signals.warnings.length);
  });
});

test('entry HTTP errors, non-HTML, oversized bodies, redirect loops and timeouts reject', async () => {
  await withServer((req, res) => {
    if (req.url === '/error') return reply(res, 503, 'text/html', '<html>Unavailable</html>');
    if (req.url === '/json') return reply(res, 200, 'application/json', '{"a":1}');
    if (req.url === '/large') return reply(res, 200, 'text/html', '<html>' + 'x'.repeat(1024) + '</html>');
    if (req.url === '/loop') { res.writeHead(302, { location: '/loop' }); return res.end(); }
    if (req.url === '/slow') return;
    reply(res, 200, 'text/html', '<html>Okay</html>');
  }, async (origin) => {
    await assert.rejects(fingerprint(`${origin}/error`), /HTTP 503/);
    await assert.rejects(fingerprint(`${origin}/json`), /not an HTML/);
    await assert.rejects(fetchBounded(`${origin}/large`, { maxResponseBytes: 100 }), /byte limit/);
    await assert.rejects(fetchBounded(`${origin}/loop`), /Redirect limit/);
    await assert.rejects(fetchBounded(`${origin}/slow`, { timeoutMs: 30 }), /exceeded|abort/i);
  });
});

test('attribute parsing ignores comments, handles quoted greater-than, and excludes JSON data', () => {
  const document = extractDocument(`<!-- <script src='/no.js'></script> --><script data-x='>' src='./real.js?a=&#38;b=2' type=module></script><script type='application/ld+json'>{"x":"fetch('/api/')"}</script>`, 'https://example.test/deep/page');
  assert.equal(document.scripts.length, 1);
  assert.equal(document.scripts[0].url, 'https://example.test/deep/real.js?a=&b=2');
  assert.equal(document.moduleCount, 1);
  assert.equal(document.inlineScripts.length, 0);
});
