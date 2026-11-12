import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

const crcTable = createCRC32Table();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = data ? data.length : 0;
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(len, 0);

  const crcData = Buffer.concat([typeBuf, data || Buffer.alloc(0)]);
  const crcVal = crc32(crcData);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, crcData, crcBuf]);
}

function createPng(width, height, drawFn) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bit
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdrChunk = writeChunk('IHDR', ihdrData);

  // Raw rows with filter byte 0
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: none
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = writeChunk('IDAT', compressed);
  const iendChunk = writeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Draw professional school OPR logo
function drawAppIcon(x, y, w, h, isMaskable = false) {
  // Normalize coords
  const nx = x / w;
  const ny = y / h;

  // Background deep royal blue (#1e3a8a to #1d4ed8)
  const bgR = Math.round(30 + ny * 10);
  const bgG = Math.round(58 + ny * 35);
  const bgB = Math.round(138 + ny * 60);

  // Outer rounded border or circular mask safe margin check
  if (!isMaskable) {
    const cornerR = 0.2;
    // Check rounded corners
    const dx = Math.min(nx, 1 - nx);
    const dy = Math.min(ny, 1 - ny);
    if (dx < cornerR && dy < cornerR) {
      const dist = Math.hypot(cornerR - dx, cornerR - dy);
      if (dist > cornerR) return [0, 0, 0, 0]; // transparent outside corner
    }
  }

  // Draw Document / Report sheet in center (safe area)
  // safe zone: center 0.22 to 0.78
  const docLeft = 0.26;
  const docRight = 0.74;
  const docTop = 0.20;
  const docBottom = 0.80;

  if (nx >= docLeft && nx <= docRight && ny >= docTop && ny <= docBottom) {
    // Folded top-right corner
    if (nx > 0.60 && ny < 0.34 && (nx - 0.60) + (0.34 - ny) > 0.14) {
      // Corner fold shadow / background
      return [bgR, bgG, bgB, 255];
    }
    // White document background
    // Header banner inside document (emerald / gold accent)
    if (ny >= 0.22 && ny <= 0.32) {
      return [37, 99, 235, 255]; // Blue header inside document
    }

    // Lines representing text in report
    const inLine1 = ny >= 0.38 && ny <= 0.42 && nx >= 0.32 && nx <= 0.68;
    const inLine2 = ny >= 0.46 && ny <= 0.50 && nx >= 0.32 && nx <= 0.64;
    const inLine3 = ny >= 0.54 && ny <= 0.58 && nx >= 0.32 && nx <= 0.68;

    // Photo placeholder grid inside document
    const inPhotoBox1 = ny >= 0.62 && ny <= 0.74 && nx >= 0.32 && nx <= 0.48;
    const inPhotoBox2 = ny >= 0.62 && ny <= 0.74 && nx >= 0.52 && nx <= 0.68;

    if (inLine1 || inLine2 || inLine3) {
      return [148, 163, 184, 255]; // Gray text lines
    }
    if (inPhotoBox1 || inPhotoBox2) {
      // Photo icon placeholder (cyan-blue tint)
      return [219, 234, 254, 255];
    }

    return [255, 255, 255, 255]; // Pure white document
  }

  // Golden star/badge badge at bottom right
  const badgeCx = 0.74;
  const badgeCy = 0.74;
  const bDist = Math.hypot(nx - badgeCx, ny - badgeCy);
  if (bDist < 0.14) {
    if (bDist > 0.12) return [180, 83, 9, 255]; // border
    return [245, 158, 11, 255]; // Amber / Gold badge
  }

  return [bgR, bgG, bgB, 255];
}

const outDir = path.resolve('public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Generate required PWA icons
console.log('Generating PWA icons...');

fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), createPng(192, 192, (x, y, w, h) => drawAppIcon(x, y, w, h, false)));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), createPng(512, 512, (x, y, w, h) => drawAppIcon(x, y, w, h, false)));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), createPng(512, 512, (x, y, w, h) => drawAppIcon(x, y, w, h, true)));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), createPng(180, 180, (x, y, w, h) => drawAppIcon(x, y, w, h, false)));

// Generate favicon.ico (using 32x32 or 48x48 PNG)
fs.writeFileSync(path.join(outDir, 'favicon.png'), createPng(48, 48, (x, y, w, h) => drawAppIcon(x, y, w, h, false)));

console.log('Icons successfully generated!');
