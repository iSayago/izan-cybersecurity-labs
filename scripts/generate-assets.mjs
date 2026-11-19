import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const favicon = await readFile(resolve(root, 'public/favicon.svg'));
const og = await readFile(resolve(root, 'scripts/og-default.svg'));

await mkdir(resolve(root, 'public/icons'), { recursive: true });

await sharp(og).png({ quality: 92 }).toFile(resolve(root, 'public/og-default.png'));
await sharp(favicon).resize(180, 180).png().toFile(resolve(root, 'public/apple-touch-icon.png'));
await sharp(favicon).resize(192, 192).png().toFile(resolve(root, 'public/icons/icon-192.png'));
await sharp(favicon).resize(512, 512).png().toFile(resolve(root, 'public/icons/icon-512.png'));

// Chrome still requests /favicon.ico even when an SVG icon is linked.
// Wrap a 32x32 PNG in a valid ICO container so that request is not a 404.
const png32 = await sharp(favicon).resize(32, 32).png().toBuffer();
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(1, 4);
const icoEntry = Buffer.alloc(16);
icoEntry.writeUInt8(32, 0);
icoEntry.writeUInt8(32, 1);
icoEntry.writeUInt8(0, 2);
icoEntry.writeUInt8(0, 3);
icoEntry.writeUInt16LE(1, 4);
icoEntry.writeUInt16LE(32, 6);
icoEntry.writeUInt32LE(png32.length, 8);
icoEntry.writeUInt32LE(22, 12);
await writeFile(resolve(root, 'public/favicon.ico'), Buffer.concat([icoHeader, icoEntry, png32]));

console.log('Generated og-default.png, apple-touch-icon.png, favicon.ico and PWA icons.');
