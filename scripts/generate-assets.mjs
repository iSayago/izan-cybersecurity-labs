import { mkdir, readFile } from 'node:fs/promises';
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

console.log('Generated og-default.png, apple-touch-icon.png and PWA icons.');
