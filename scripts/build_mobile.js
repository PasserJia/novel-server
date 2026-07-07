const { copyFileSync, cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const sourcePath = join(root, 'src/modules/web/web.controller.ts');
const appDir = join(root, 'apps/mobile-web');
const assetDir = join(appDir, 'assets');
const distDir = join(root, 'mobile-dist');

const source = readFileSync(sourcePath, 'utf8');
const start = source.indexOf('return `');
const end = source.lastIndexOf('`;\n  }\n}');

if (start < 0 || end < 0 || end <= start) {
  throw new Error('Unable to locate WebController HTML template');
}

const rawTemplate = source.slice(start + 'return `'.length, end);
const html = Function('return `' + rawTemplate + '`;')();
const styleMatch = html.match(/<style>\n([\s\S]*?)\n  <\/style>/);
const scriptMatch = html.match(/<script>\n([\s\S]*?)\n  <\/script>/);

if (!styleMatch || !scriptMatch) {
  throw new Error('Unable to split WebController HTML into CSS and JS');
}

const css = styleMatch[1].replace(/^    /gm, '');
let js = scriptMatch[1].replace(/^    /gm, '');

js = js.replace(
  'const state = {',
  [
    "const API_BASE_URL = 'https://ai.passerjia.com:8848/api';",
    "const ASSET_BASE_URL = 'https://ai.passerjia.com:8848';",
    "const TOKEN_KEY = 'novel_token';",
    '',
    'let nativeShellInitialized = false;',
    '',
    'function toAssetUrl(value) {',
    '  if (!value) return value;',
    "  if (/^(https?:|data:|blob:)/.test(value)) return value;",
    "  return ASSET_BASE_URL + (String(value).startsWith('/') ? value : '/' + value);",
    '}',
    'function getCapacitorPlugin(name) {',
    '  const cap = window.Capacitor;',
    '  return cap && cap.Plugins && cap.Plugins[name] ? cap.Plugins[name] : null;',
    '}',
    'function getStoredTokenSync() {',
    '  try { return localStorage.getItem(TOKEN_KEY) || \'\'; } catch { return \'\'; }',
    '}',
    'async function setStoredToken(value) {',
    '  try { localStorage.setItem(TOKEN_KEY, value); } catch {}',
    '  const Preferences = getCapacitorPlugin(\'Preferences\');',
    '  if (Preferences && Preferences.set) {',
    '    try { await Preferences.set({ key: TOKEN_KEY, value }); } catch {}',
    '  }',
    '}',
    'async function removeStoredToken() {',
    '  try { localStorage.removeItem(TOKEN_KEY); } catch {}',
    '  const Preferences = getCapacitorPlugin(\'Preferences\');',
    '  if (Preferences && Preferences.remove) {',
    '    try { await Preferences.remove({ key: TOKEN_KEY }); } catch {}',
    '  }',
    '}',
    'async function restoreStoredToken() {',
    '  const Preferences = getCapacitorPlugin(\'Preferences\');',
    '  if (!Preferences || !Preferences.get) return false;',
    '  try {',
    '    const saved = await Preferences.get({ key: TOKEN_KEY });',
    '    if (saved && saved.value) {',
    '      state.token = saved.value;',
    '      try { localStorage.setItem(TOKEN_KEY, saved.value); } catch {}',
    '      return true;',
    '    }',
    '  } catch {}',
    '  return false;',
    '}',
    'async function initNativeShell() {',
    '  if (nativeShellInitialized) return;',
    '  nativeShellInitialized = true;',
    '  const StatusBar = getCapacitorPlugin(\'StatusBar\');',
    '  if (StatusBar) {',
    '    try { if (StatusBar.setOverlaysWebView) await StatusBar.setOverlaysWebView({ overlay: false }); } catch {}',
    '    try { if (StatusBar.setBackgroundColor) await StatusBar.setBackgroundColor({ color: \'#111111\' }); } catch {}',
    '    try { if (StatusBar.setStyle) await StatusBar.setStyle({ style: \'LIGHT\' }); } catch {}',
    '  }',
    '  const SplashScreen = getCapacitorPlugin(\'SplashScreen\');',
    '  if (SplashScreen && SplashScreen.hide) {',
    '    try { await SplashScreen.hide({ fadeOutDuration: 180 }); } catch {}',
    '  }',
    '}',
    '',
    'const state = {',
  ].join('\n'),
);

js = js
  .replace("token: localStorage.getItem('novel_token') || '',", 'token: getStoredTokenSync(),')
  .replace("fetch('/api' + path", 'fetch(API_BASE_URL + path')
  .replace("fetch('/api/auth/me'", "fetch(API_BASE_URL + '/auth/me'")
  .replaceAll("localStorage.setItem('novel_token', state.token);", 'await setStoredToken(state.token);')
  .replace("localStorage.removeItem('novel_token');", 'await removeStoredToken();')
  .replace('async function loadMe() {\n  if (!state.token) {', 'async function loadMe() {\n  await initNativeShell();\n  if (!state.token) await restoreStoredToken();\n  if (!state.token) {')
  .replace('img.src = url;', 'img.src = toAssetUrl(url);')
  .replace('const url = encodeURI(book.customCoverUrl);', 'const url = encodeURI(toAssetUrl(book.customCoverUrl));')
  .replace("'<div class=\"shelf-cover has-image\" data-idx=\"' + index + '\"><img src=\"' + escapeHtml(book.customCoverUrl) + '\" alt=\"' + escapeHtml(novel.title) + '\" /></div>'", "'<div class=\"shelf-cover has-image\" data-idx=\"' + index + '\"><img src=\"' + escapeHtml(toAssetUrl(book.customCoverUrl)) + '\" alt=\"' + escapeHtml(novel.title) + '\" /></div>'");

let mobileHtml = html
  .replace(/<title>.*?<\/title>/, '<title>小说阅读器</title>')
  .replace(
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />\n  <meta name="apple-mobile-web-app-capable" content="yes" />\n  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />',
  )
  .replace(/  <style>\n[\s\S]*?\n  <\/style>/, '  <link rel="stylesheet" href="./styles.css" />')
  .replace(/  <script>\n[\s\S]*?\n  <\/script>/, '  <script src="./app.js"></script>');

rmSync(appDir, { recursive: true, force: true });
rmSync(distDir, { recursive: true, force: true });
mkdirSync(assetDir, { recursive: true });
mkdirSync(distDir, { recursive: true });

writeFileSync(join(appDir, 'index.html'), mobileHtml, 'utf8');
writeFileSync(join(appDir, 'styles.css'), css + '\n', 'utf8');
writeFileSync(join(appDir, 'app.js'), js + '\n', 'utf8');

cpSync(appDir, distDir, { recursive: true });

const assetSourceDir = join(root, 'assets');
try {
  cpSync(assetSourceDir, join(distDir, 'assets'), { recursive: true });
  cpSync(assetSourceDir, assetDir, { recursive: true });
} catch {
  // Assets are optional for the first mobile build.
}

try {
  copyFileSync(join(root, 'novel-logo.png'), join(distDir, 'novel-logo.png'));
  copyFileSync(join(root, 'novel-logo.png'), join(appDir, 'novel-logo.png'));
} catch {}

console.log('Generated apps/mobile-web and mobile-dist');
