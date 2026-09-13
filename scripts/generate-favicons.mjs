import fs from "fs";
import path from "path";
import sharp from "sharp";

// 1. The SVG source matching the website's logo:
// Navbar:
// <span className="w-8 h-8 rounded-full border border-amber-500/30 flex items-center justify-center bg-stone-900 group-hover:border-amber-400/80 transition-colors">
//   <Feather className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
// </span>

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1c1917"/>
      <stop offset="100%" stop-color="#0c0a09"/>
    </linearGradient>
    <linearGradient id="border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#d97706" stop-opacity="0.45"/>
    </linearGradient>
    <linearGradient id="feather-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="40%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#f59e0b" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Circular background badge -->
  <circle cx="256" cy="256" r="236" fill="url(#bg-grad)" stroke="url(#border-grad)" stroke-width="20"/>

  <!-- Subtle interior ambient ring -->
  <circle cx="256" cy="256" r="222" fill="none" stroke="#fbbf24" stroke-width="2" stroke-opacity="0.2"/>

  <!-- Centered Feather Quill Icon (exact lucide-react feather geometry) -->
  <!-- 24x24 viewBox scaled by 12.8, translated to center inside 512x512 -->
  <g transform="translate(102, 102) scale(12.8)"
     fill="none"
     stroke="url(#feather-grad)"
     stroke-width="2.2"
     stroke-linecap="round"
     stroke-linejoin="round"
     filter="url(#glow)">
    <path d="M14.086 18.412A2 2 0 0112.67 19H5v-7.672a2 2 0 01.586-1.414L11.75 3.75a6 6 0 118.49 8.49z"/>
    <path d="M16 8 2 22"/>
    <path d="M17.488 15H9"/>
  </g>
</svg>`;

// Helper function to package PNG buffers into a multi-resolution ICO file
function createIco(pngBuffers) {
  // pngBuffers: array of { width, height, buffer }
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(count, 4); // number of images

  let currentOffset = 6 + count * 16;
  const directoryEntries = [];

  for (const img of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0); // width (0 = 256)
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1); // height (0 = 256)
    entry.writeUInt8(0, 2); // color palette count (0 for 32bpp)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // image size in bytes
    entry.writeUInt32LE(currentOffset, 12); // image offset

    directoryEntries.push(entry);
    currentOffset += img.buffer.length;
  }

  return Buffer.concat([
    header,
    ...directoryEntries,
    ...pngBuffers.map((img) => img.buffer),
  ]);
}

async function run() {
  console.log("Generating favicons and icons from brand logo SVG...");

  const svgBuffer = Buffer.from(svgContent, "utf-8");

  // Render various sizes
  const [png16, png32, png48, png180, png192, png512] = await Promise.all([
    sharp(svgBuffer).resize(16, 16).png().toBuffer(),
    sharp(svgBuffer).resize(32, 32).png().toBuffer(),
    sharp(svgBuffer).resize(48, 48).png().toBuffer(),
    sharp(svgBuffer).resize(180, 180).png().toBuffer(),
    sharp(svgBuffer).resize(192, 192).png().toBuffer(),
    sharp(svgBuffer).resize(512, 512).png().toBuffer(),
  ]);

  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 },
  ]);

  // Targets:
  // 1. src/app/favicon.ico (Next.js file convention)
  // 2. src/app/icon.svg (Next.js file convention for modern SVG favicon)
  // 3. src/app/apple-icon.png (Next.js file convention for apple touch icon)
  // 4. public/favicon.ico (Direct requests to /favicon.ico)
  // 5. public/icon.svg (Direct requests to /icon.svg)
  // 6. public/apple-touch-icon.png (Direct requests for iOS)
  // 7. public/icon-192.png & public/icon-512.png (PWA / manifest)

  fs.writeFileSync(path.join(process.cwd(), "src/app/favicon.ico"), icoBuffer);
  fs.writeFileSync(path.join(process.cwd(), "src/app/icon.svg"), svgContent);
  fs.writeFileSync(path.join(process.cwd(), "src/app/apple-icon.png"), png180);

  fs.writeFileSync(path.join(process.cwd(), "public/favicon.ico"), icoBuffer);
  fs.writeFileSync(path.join(process.cwd(), "public/icon.svg"), svgContent);
  fs.writeFileSync(path.join(process.cwd(), "public/apple-touch-icon.png"), png180);
  fs.writeFileSync(path.join(process.cwd(), "public/icon-192.png"), png192);
  fs.writeFileSync(path.join(process.cwd(), "public/icon-512.png"), png512);

  console.log("Favicons generated successfully!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
