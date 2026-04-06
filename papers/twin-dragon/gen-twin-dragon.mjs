#!/usr/bin/env node
// Generates twin-dragon.png: Twin Dragon attractor with principal-axis ellipse overlay.
// Run from the repo root: node scratch/gen-twin-dragon.mjs

import { readFileSync, writeFileSync } from 'fs';
import { deflateSync } from 'zlib';

// ── Minimal PNG encoder ──────────────────────────────────────────────────────
function makePng(width, height, rgba) {
  const crcTable = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    crcTable[n] = c;
  }
  function crc32(buf) {
    let c = ~0;
    for (const b of buf) c = (c >>> 8) ^ crcTable[(c ^ b) & 0xFF];
    return (~c) >>> 0;
  }
  function chunk(type, data) {
    const t = Buffer.from(type, 'ascii');
    const d = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const len = Buffer.allocUnsafe(4); len.writeUInt32BE(d.length, 0);
    const crc = Buffer.allocUnsafe(4); crc.writeUInt32BE(crc32(Buffer.concat([t, d])), 0);
    return Buffer.concat([len, t, d, crc]);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB, no alpha
  const raw = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 3)] = 0; // filter byte: None
    for (let x = 0; x < width; x++) {
      const src = (y * width + x) * 4;
      const dst = y * (1 + width * 3) + 1 + x * 3;
      raw[dst] = rgba[src]; raw[dst + 1] = rgba[src + 1]; raw[dst + 2] = rgba[src + 2];
    }
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── Load and initialise ifslib ───────────────────────────────────────────────
const wasmBuf = readFileSync('public/ifslib.wasm');
const { instance } = await WebAssembly.instantiate(wasmBuf, {});
instance.exports._initialize();

const W = 800, H = 800;

// Twin Dragon IFS:  f_{1,2}(z) = (1-i)/2 * (z ± 1)
const aifs = `@
$dim=2
f1=[0.5,-0.5]*[0.5,0.5,-0.5,0.5]
f2=[-0.5,0.5]*[0.5,0.5,-0.5,0.5]
S=(f1|f2)*S`;

const aifsBytes = new TextEncoder().encode(aifs + '\0');
const ptr = instance.exports.malloc(aifsBytes.length);
new Uint8Array(instance.exports.memory.buffer).set(aifsBytes, ptr);
const ok = instance.exports.ifslib_init(ptr);
instance.exports.free(ptr);
if (!ok) { console.error('ifslib_init returned 0 — check AIFS syntax'); process.exit(1); }

const pixPtr = instance.exports.ifslib_render(W, H, 4, 1);
// Copy pixels out of WASM memory before any further allocations
const mem = new Uint8Array(instance.exports.memory.buffer);
const imgRaw = Buffer.alloc(W * H * 4);
imgRaw.set(mem.subarray(pixPtr, pixPtr + W * H * 4));

// Flip vertically: ifslib Y-up → PNG Y-down
const img = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++)
  imgRaw.copy(img, y * W * 4, (H - 1 - y) * W * 4, (H - y) * W * 4);

// ── Save raw ifslib output ────────────────────────────────────────────────────
writeFileSync('scratch/twin-dragon-raw.png', makePng(W, H, img));
console.log('Written scratch/twin-dragon-raw.png (raw ifslib output)');

// ── Compute centroid and covariance from raw fractal pixels (before binarise)
// Fractal pixels are bright/coloured; background is pure black.
let cnt = 0, sx = 0, sy = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const b = (y * W + x) * 4;
    const bri = (img[b] + img[b+1] + img[b+2]) / 3;
    if (bri > 30) { cnt++; sx += x; sy += y; }
  }
}
const cx = sx / cnt, cy = sy / cnt;

let mxx = 0, mxy = 0, myy = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const b = (y * W + x) * 4;
    const bri = (img[b] + img[b+1] + img[b+2]) / 3;
    if (bri > 30) {
      const dx = x - cx, dy = y - cy;
      mxx += dx*dx; mxy += dx*dy; myy += dy*dy;
    }
  }
}
mxx /= cnt; mxy /= cnt; myy /= cnt;

// ── Binarise: bright fractal → black, dark background → white ───────────────
for (let i = 0; i < W * H; i++) {
  const b = i * 4;
  const brightness = (img[b] + img[b + 1] + img[b + 2]) / 3;
  const v = brightness > 30 ? 0 : 255;
  img[b] = img[b + 1] = img[b + 2] = v;
  img[b + 3] = 255;
}

// Eigendecomposition of 2×2 pixel-space covariance
const tr = mxx + myy;
const disc = Math.sqrt(Math.max(0, (mxx-myy)**2/4 + mxy**2));
const lam1_px = tr/2 - disc;   // smaller (minor)
const lam2_px = tr/2 + disc;   // larger  (major)

// Major eigenvector in pixel space
let e1_px, e2_px;
if (Math.abs(mxy) > 1e-6) {
  const vx = mxy, vy = lam2_px - mxx;
  const n = Math.hypot(vx, vy);
  e1_px = [vx/n, vy/n];
  e2_px = [-vy/n, vx/n];
} else {
  e1_px = mxx >= myy ? [1, 0] : [0, 1];
  e2_px = mxx >= myy ? [0, 1] : [1, 0];
}

const phi = (1 + Math.sqrt(5)) / 2;
const kSigma = 1.5;
const semiA_px = kSigma * Math.sqrt(lam2_px);
const semiB_px = kSigma * Math.sqrt(lam1_px);

console.log(`Centroid:   (${cx.toFixed(1)}, ${cy.toFixed(1)}) px  (image centre = ${W/2}, ${H/2})`);
console.log(`Semi-major: ${semiA_px.toFixed(1)} px`);
console.log(`Semi-minor: ${semiB_px.toFixed(1)} px`);
console.log(`AR check:   ${(semiB_px/semiA_px).toFixed(4)}  (1/phi = ${(1/phi).toFixed(4)})`);

// Anti-aliased filled disk
const R = 200, G = 20, B = 20;
function plotDisk(px, py, radius, r, g, b) {
  const ir = Math.ceil(radius + 1);
  for (let dy = -ir; dy <= ir; dy++) {
    for (let dx = -ir; dx <= ir; dx++) {
      const xi = Math.round(px + dx), yi = Math.round(py + dy);
      if (xi < 0 || xi >= W || yi < 0 || yi >= H) continue;
      const alpha = Math.min(1, Math.max(0, radius + 0.8 - Math.hypot(dx, dy)));
      if (alpha <= 0) continue;
      const idx = (yi * W + xi) * 4;
      img[idx]   = Math.round(img[idx]   * (1-alpha) + r * alpha);
      img[idx+1] = Math.round(img[idx+1] * (1-alpha) + g * alpha);
      img[idx+2] = Math.round(img[idx+2] * (1-alpha) + b * alpha);
    }
  }
}

// Ellipse
const nEllipse = 800;
for (let i = 0; i <= nEllipse; i++) {
  const t = 2 * Math.PI * i / nEllipse;
  const ct = Math.cos(t), st = Math.sin(t);
  const px = cx + semiA_px * ct * e1_px[0] + semiB_px * st * e2_px[0];
  const py = cy + semiA_px * ct * e1_px[1] + semiB_px * st * e2_px[1];
  plotDisk(px, py, 2.2, R, G, B);
}

// Major axis
const nLine = 500;
for (let i = 0; i <= nLine; i++) {
  const t = -semiA_px * 1.1 + 2 * semiA_px * 1.1 * i / nLine;
  plotDisk(cx + t * e1_px[0], cy + t * e1_px[1], 1.3, R, G, B);
}

// Minor axis
for (let i = 0; i <= nLine; i++) {
  const t = -semiB_px * 1.1 + 2 * semiB_px * 1.1 * i / nLine;
  plotDisk(cx + t * e2_px[0], cy + t * e2_px[1], 1.3, R, G, B);
}

// ── Autocrop: find bounding box of non-black pixels, add padding ─────────────
const pad = 40;
let xMin = W, xMax = 0, yMin = H, yMax = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const b = (y * W + x) * 4;
    if (img[b] > 20 || img[b+1] > 20 || img[b+2] > 20) {
      if (x < xMin) xMin = x; if (x > xMax) xMax = x;
      if (y < yMin) yMin = y; if (y > yMax) yMax = y;
    }
  }
}
xMin = Math.max(0, xMin - pad); xMax = Math.min(W - 1, xMax + pad);
yMin = Math.max(0, yMin - pad); yMax = Math.min(H - 1, yMax + pad);
const CW = xMax - xMin + 1, CH = yMax - yMin + 1;

// Make output square by centering in a square canvas
const CS = Math.max(CW, CH);
const outImg = Buffer.alloc(CS * CS * 4);  // white background
outImg.fill(255);
const offX = Math.floor((CS - CW) / 2), offY = Math.floor((CS - CH) / 2);
for (let y = 0; y < CH; y++) {
  for (let x = 0; x < CW; x++) {
    const src = ((yMin + y) * W + (xMin + x)) * 4;
    const dst = ((offY + y) * CS + (offX + x)) * 4;
    outImg[dst] = img[src]; outImg[dst+1] = img[src+1];
    outImg[dst+2] = img[src+2]; outImg[dst+3] = 255;
  }
}

// ── Write PNG ─────────────────────────────────────────────────────────────────
const outPath = 'scratch/twin-dragon.png';
writeFileSync(outPath, makePng(CS, CS, outImg));
console.log(`Written ${outPath} (${CS}×${CS} px, cropped from ${W}×${H})`);
