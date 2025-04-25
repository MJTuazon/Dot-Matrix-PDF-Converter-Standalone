const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function generatePdfFromText(inputFilePath, outputFilePath) {
  const text = fs.readFileSync(inputFilePath, 'utf-8');

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(PDFDocument.Font.Helvetica);
  const fontSize = 12;

  page.drawText(text, { x: 50, y: height - 50, font, size: fontSize });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputFilePath, pdfBytes);
}

module.exports = { generatePdfFromText };
