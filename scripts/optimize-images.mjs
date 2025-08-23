import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve('./assets/images');
const outDir = path.resolve('./assets/images/optimized');
await fs.mkdir(outDir, { recursive: true });

const targets = [
  'aboutus.png',
  'pic1.jpg', 'pic2.jpg', 'pic3.jpg', 'pic4.jpg', 'pic5.jpg', 'pic6.jpg', 'pic7.jpg', 'pic8.jpg', 'pic9.jpg', 'pic10.jpg', 'pic11.jpg',
  // Services hero/service tiles
  'painting-service.jpg', 'drywall-service.jpg', 'taping-service.jpg', 'carpet-service.jpg',
  // Portfolio grid images
  'portfolio-painting-1.jpg', 'portfolio-painting-2.jpg',
  'portfolio-drywall-1.jpg', 'portfolio-drywall-2.jpg',
  'portfolio-taping-1.jpg',
  'portfolio-carpet-1.jpg', 'portfolio-carpet-2.jpg',
  'portfolio-mixed-1.jpg'
];

const sizes = [768, 1280, 1920];

async function optimizeOne(file) {
  const inPath = path.join(root, file);
  const base = path.parse(file).name;

  const buffer = await fs.readFile(inPath);
  const img = sharp(buffer);
  const metadata = await img.metadata();

  for (const width of sizes) {
    const resized = sharp(buffer).resize({ width, withoutEnlargement: true });
    // JPG
    const jpgName = `${base}-${width}.jpg`;
    const jpgPath = path.join(outDir, jpgName);
    await resized.jpeg({ quality: 78, chromaSubsampling: '4:2:0', mozjpeg: true }).toFile(jpgPath);
    // WebP
    const webpName = `${base}-${width}.webp`;
    const webpPath = path.join(outDir, webpName);
    await resized.webp({ quality: 75 }).toFile(webpPath);
  }

  // Also copy original as a fallback baseline
  const origExt = path.parse(file).ext.replace('.', '');
  const origCopy = path.join(outDir, `${base}-orig.${origExt}`);
  await fs.writeFile(origCopy, buffer);
}

for (const t of targets) {
  try {
    await optimizeOne(t);
    console.log('Optimized', t);
  } catch (e) {
    console.error('Failed optimizing', t, e.message);
  }
}

console.log('Image optimization complete. Outputs in assets/images/optimized');

