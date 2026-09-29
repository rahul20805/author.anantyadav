import fs from "fs";
import path from "path";

function createSimplePdf(): Buffer {
  const content = `%PDF-1.4
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 612 792]
  /Contents 4 0 R
  /Resources <<
    /Font <<
      /F1 5 0 R
      /F2 6 0 R
    >>
  >>
>>
endobj
4 0 obj
<<
  /Length 740
>>
stream
BT
/F1 22 Tf
50 720 Td
(Don't Make Women Goddesses, Treat Them Like Humans) Tj
ET
BT
/F2 12 Tf
50 690 Td
(By Anant Yadav  |  29 September 2026) Tj
ET
BT
/F2 13 Tf
50 640 Td
(Calling a woman Devi costs nothing.) Tj
0 -20 Td
(Giving her the rights a man already has costs a great deal more.) Tj
0 -35 Td
(To elevate a human being onto an unreachable altar is often the most sophisticated) Tj
0 -20 Td
(way to deny them their fundamental earthly dignities.) Tj
0 -35 Td
(When society deifies women, it exempts itself from treating them with equal justice,) Tj
0 -20 Td
(liberty, and autonomy. A goddess requires reverence; a human being requires freedom,) Tj
0 -20 Td
(equal wage, safe streets, and the uninhibited right to make choices.) Tj
0 -35 Td
(Let us dismantle the pedestal and build an equal foundation of dignity and respect.) Tj
ET
endstream
endobj
5 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica-Bold
>>
endobj
6 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica
>>
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000001058 00000 n 
0000001129 00000 n 
trailer
<<
  /Size 7
  /Root 1 0 R
>>
startxref
1195
%%EOF
`;

  return Buffer.from(content, "utf-8");
}

const targetDir = path.join(process.cwd(), "public", "uploads", "pdfs");
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const targetPath = path.join(targetDir, "dont-make-women-goddesses-treat-them-like-humans.pdf");
const buffer = createSimplePdf();
fs.writeFileSync(targetPath, buffer);
console.log(`Created sample PDF at ${targetPath} (${buffer.length} bytes)`);
