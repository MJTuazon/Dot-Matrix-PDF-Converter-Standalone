const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const iconPath = process.platform === 'darwin'
  ? path.join(__dirname, 'assets', 'logo.icns')
  : path.join(__dirname, 'assets', 'logo.ico');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    title: "Dot Matrix PDF Converter",
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('select-txt-file', async () => {
  const result = await dialog.showOpenDialog({
    filters: [{ name: 'Text Files', extensions: ['txt'] }],
    properties: ['openFile']
  });

  return result.filePaths[0] || null;
});

ipcMain.handle('generate-pdf', async (event, filePath, cpiValue) => {
  try {
    const rawText = fs.readFileSync(filePath, 'utf8');
    const pages = rawText.split('\f');

    const pdfDoc = await PDFDocument.create();
    const courierFont = await pdfDoc.embedFont(StandardFonts.Courier);

    const isLandscape = parseInt(cpiValue) === 10;

    const config = {
      width: isLandscape ? 1008 : 612,
      height: isLandscape ? 612 : 1008,
      fontSize: isLandscape ? 6.5 : 7.25,
      doubleFontSize: isLandscape ? 13 : 14,
      lineHeight: isLandscape ? 9 : 14,
      marginX: isLandscape ? 40 : 20,
      marginY: 40,
    };

    // Generate timestamp in UTC+8
    const now = new Date();
    now.setHours(now.getHours() + 8);
    const dateFolder = now.toISOString().split('T')[0];
    const timestamp = now.toISOString().replace(/[:T]/g, '-').split('.')[0];

    const desktopDir = app.getPath('desktop');
    const baseDir = path.join(desktopDir, 'DotMatrixPDFsConverted', dateFolder);

    // Create folder if it doesn't exist
    fs.mkdirSync(baseDir, { recursive: true });

    const baseFileName = isLandscape
      ? `landscape-output_${timestamp}.pdf`
      : `portrait-output_${timestamp}.pdf`;

    const fullPath = path.join(baseDir, baseFileName);

    for (let rawPage of pages) {
      const page = pdfDoc.addPage([config.width, config.height]);

      let x = config.marginX;
      let y = config.height - config.marginY;
      let currentFontSize = config.fontSize;
      let isDouble = false;

      const chars = Array.from(rawPage);

      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        const code = ch.charCodeAt(0);

        if (code === 0x0F) {
          isDouble = false;
          currentFontSize = config.fontSize;
          continue;
        }

        if (code === 0x12) {
          isDouble = true;
          currentFontSize = isLandscape ? config.doubleFontSize : config.fontSize;
          continue;
        }

        if (code === 0x0A) {
          y -= config.lineHeight;
          x = config.marginX;
          continue;
        }

        if (code === 0x0D) continue;

        if (code >= 32 && code < 127) {
          page.drawText(ch, {
            x,
            y,
            size: currentFontSize,
            font: courierFont,
            color: rgb(0, 0, 0),
          });

          x += currentFontSize * 0.6;
        }
      }
    }

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(fullPath, pdfBytes);

    event.sender.send('pdf-ready', fullPath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
