#!/usr/bin/env node
'use strict';

const fs = require('node:fs');

function checkEnvironment() {
  const checks = { node: { version: process.versions.node, ok: Number(process.versions.node.split('.')[0]) >= 20 }, playwright: { ok: false }, chromium: { ok: false } };
  try {
    const modulePath = require.resolve('playwright', { paths: [process.cwd(), __dirname] });
    const playwright = require(modulePath);
    checks.playwright = { ok: Boolean(playwright.chromium), modulePath };
    if (!playwright.chromium) throw new Error('The resolved playwright module has no Chromium launcher');
    const executablePath = playwright.chromium.executablePath();
    checks.chromium = { executablePath, ok: fs.existsSync(executablePath) && fs.statSync(executablePath).isFile() };
  } catch (error) { checks.playwright.error = error.message; }
  const missing = Object.entries(checks).filter(([, value]) => !value.ok).map(([name]) => name);
  const nextSteps = [];
  if (!checks.node.ok) nextSteps.push('Install Node.js 20 or newer, then run this check again.');
  if (!checks.playwright.ok) nextSteps.push('From your working project directory: npm install playwright');
  if (!checks.chromium.ok) nextSteps.push('From the same directory: npx playwright install chromium');
  return { ok: missing.length === 0, checks, missing, nextSteps, note: 'Read-only availability checks; does not install packages, launch Chromium, or verify browser system dependencies.' };
}

function main(args = process.argv.slice(2)) {
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node scripts/doctor.js\nRead-only checks for Node.js 20+, the playwright module, and its Chromium executable. Prints missing items and installation steps; never installs automatically.');
    return;
  }
  if (args.length) throw new Error('Usage: node scripts/doctor.js');
  const result = checkEnvironment();
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
}

module.exports = { checkEnvironment, main };
if (require.main === module) { try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; } }
