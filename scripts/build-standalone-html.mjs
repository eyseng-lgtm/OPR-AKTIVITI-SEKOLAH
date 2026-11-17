import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const tempOutDir = path.join(rootDir, 'dist-standalone');
const outputFile = path.join(rootDir, 'public', 'OPR-2026-SJK-Chung-Hua-Bau.html');

function stubPwaPlugin() {
  const virtualId = 'virtual:pwa-register';
  const resolvedVirtualId = '\0' + virtualId;
  return {
    name: 'stub-pwa-register',
    resolveId(id) {
      if (id === virtualId) return resolvedVirtualId;
    },
    load(id) {
      if (id === resolvedVirtualId) {
        return 'export function registerSW() { return function () {}; }';
      }
    },
  };
}

function toDataUri(filePath, mimeType) {
  const buf = fs.readFileSync(filePath);
  return `data:${mimeType};base64,${buf.toString('base64')}`;
}

async function run() {
  console.log('Building standalone single-file HTML...');

  await build({
    root: rootDir,
    configFile: false,
    publicDir: false,
    logLevel: 'warn',
    plugins: [react(), tailwindcss(), stubPwaPlugin()],
    resolve: {
      alias: {
        '@': rootDir,
      },
    },
    build: {
      outDir: tempOutDir,
      emptyOutDir: true,
      assetsInlineLimit: 10 * 1024 * 1024,
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
  });

  const assetsDir = path.join(tempOutDir, 'assets');
  const assetFiles = fs.readdirSync(assetsDir);
  const jsFile = assetFiles.find((f) => f.endsWith('.js'));
  const cssFile = assetFiles.find((f) => f.endsWith('.css'));

  if (!jsFile) {
    throw new Error('Standalone JS bundle not found in ' + assetsDir);
  }

  let html = fs.readFileSync(path.join(tempOutDir, 'index.html'), 'utf-8');
  let jsCode = fs.readFileSync(path.join(assetsDir, jsFile), 'utf-8');
  const cssCode = cssFile ? fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8') : '';

  // Inline school logo & favicon as base64 data URIs so file:// works 100% offline
  const logoPath = path.join(rootDir, 'public', 'logo-sekolah.png');
  const faviconPath = path.join(rootDir, 'public', 'favicon.png');

  if (fs.existsSync(logoPath)) {
    const logoDataUri = toDataUri(logoPath, 'image/png');
    jsCode = jsCode
      .replaceAll('"/logo-sekolah.png"', JSON.stringify(logoDataUri))
      .replaceAll("'/logo-sekolah.png'", JSON.stringify(logoDataUri));
  }

  const faviconDataUri = fs.existsSync(faviconPath)
    ? toDataUri(faviconPath, 'image/png')
    : '';

  // Escape any literal </script occurrences inside JS strings/regexes
  const safeJsCode = jsCode.replace(/<\/script/gi, '<\\/script');

  // Remove external script & stylesheet tags emitted by Vite
  html = html.replace(/<script[^>]*type="module"[^>]*src="[^"]+"[^>]*><\/script>/gi, '');
  html = html.replace(/<link[^>]*rel="stylesheet"[^>]*href="[^"]+"[^>]*>/gi, '');

  // Update icons to inline data URI so no broken /icon.svg or /favicon.png requests occur offline
  if (faviconDataUri) {
    html = html.replace(/<link[^>]*rel="icon"[^>]*href="\/icon\.svg"[^>]*>/gi, '');
    html = html.replace(
      /<link[^>]*rel="icon"[^>]*href="\/favicon\.png"[^>]*>/gi,
      `<link rel="icon" type="image/png" href="${faviconDataUri}">`
    );
    html = html.replace(
      /href="\/apple-touch-icon\.png"/gi,
      `href="${faviconDataUri}"`
    );
  }

  // Inline CSS into <head>
  if (cssCode) {
    html = html.replace('</head>', `<style>\n${cssCode}\n</style>\n</head>`);
  }

  // Mark standalone mode and inline JS bundle before </body> (classic script works across file://, content://, and http://)
  const inlineScripts = `<script>window.__IS_STANDALONE_HTML__ = true;</script>\n<script>\n(function(){\n${safeJsCode}\n})();\n</script>`;
  html = html.replace('</body>', `${inlineScripts}\n</body>`);

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, html, 'utf-8');

  // Also copy into dist/ if dist already exists
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, path.basename(outputFile)), html, 'utf-8');
  }

  fs.rmSync(tempOutDir, { recursive: true, force: true });

  const sizeKB = (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1);
  console.log(`Standalone HTML generated: ${outputFile} (${sizeKB} KB)`);
}

run().catch((err) => {
  console.error('Failed to build standalone HTML:', err);
  process.exit(1);
});
