import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const publicDir = process.argv[2] || 'public';
const sizes = [16, 32, 48];

const images = sizes.map((size) => {
  const data = readFileSync(join(publicDir, `icon-${size}.png`));
  return { size, data };
});

const headerSize = 6;
const entrySize = 16;
const dataOffset = headerSize + entrySize * images.length;

const header = Buffer.alloc(headerSize);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);

let offset = dataOffset;
const entries = images.map(({ size, data }) => {
  const entry = Buffer.alloc(entrySize);
  entry.writeUInt8(size === 256 ? 0 : size, 0);
  entry.writeUInt8(size === 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(data.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += data.length;
  return entry;
});

const ico = Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
writeFileSync(join(publicDir, 'favicon.ico'), ico);

console.log(`favicon.ico written: ${images.length} sizes, ${ico.length} bytes`);