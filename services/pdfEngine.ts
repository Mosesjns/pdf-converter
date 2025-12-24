
// @ts-nocheck - pdf-lib, pdfjs, and mammoth are loaded via CDN in index.html
import { PDFAnnotation } from '../types';

const { PDFDocument, rgb, StandardFonts } = window.PDFLib;
const pdfjsLib = window.pdfjsLib;
const mammoth = window.mammoth;

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const applySecurity = async (pdfDoc, password) => {
  if (password) {
    pdfDoc.encrypt({
      userPassword: password,
      ownerPassword: password,
      permissions: {
        printing: 'highResolution',
        modifications: true,
        copying: true,
        annotating: true,
        fillingForms: true,
        contentAccessibility: true,
        documentAssembly: true,
      },
    });
  }
};

export const PDFEngine = {
  async mergePDFs(files: Uint8Array[], password?: string): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();
    for (const fileData of files) {
      const pdf = await PDFDocument.load(fileData);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    await applySecurity(mergedPdf, password);
    return await mergedPdf.save();
  },

  async splitPDF(fileData: Uint8Array, pageRanges: string, password?: string): Promise<Uint8Array[]> {
    const srcPdf = await PDFDocument.load(fileData);
    const results: Uint8Array[] = [];
    
    const ranges = pageRanges.split(',').map(r => r.trim());
    
    for (const range of ranges) {
      const newPdf = await PDFDocument.create();
      if (range.includes('-')) {
        const [start, end] = range.split('-').map(Number);
        const indices = Array.from({ length: end - start + 1 }, (_, i) => start + i - 1);
        const pages = await newPdf.copyPages(srcPdf, indices);
        pages.forEach(p => newPdf.addPage(p));
      } else {
        const index = Number(range) - 1;
        const [page] = await newPdf.copyPages(srcPdf, [index]);
        newPdf.addPage(page);
      }
      await applySecurity(newPdf, password);
      results.push(await newPdf.save());
    }
    return results;
  },

  async applyAnnotationsToPDF(fileData: Uint8Array, annotations: PDFAnnotation[], password?: string): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(fileData);
    const pages = pdfDoc.getPages();
    
    // Embed all variants to handle mixed styles
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    const fontBoldItalic = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);
    
    for (const ann of annotations) {
      const pageIdx = Math.max(0, Math.min(ann.page - 1, pages.length - 1));
      const page = pages[pageIdx];
      
      if (ann.type === 'text' && ann.text) {
        let fontToUse = fontRegular;
        if (ann.isBold && ann.isItalic) {
          fontToUse = fontBoldItalic;
        } else if (ann.isBold) {
          fontToUse = fontBold;
        } else if (ann.isItalic) {
          fontToUse = fontItalic;
        }

        page.drawText(ann.text, {
          x: ann.x,
          y: ann.y,
          size: 14,
          font: fontToUse,
          color: rgb(0, 0, 0),
        });
      } else if (ann.type === 'signature' && ann.imageData) {
        // signature is always PNG from canvas
        const imageBytes = Uint8Array.from(atob(ann.imageData.split(',')[1]), c => c.charCodeAt(0));
        const signatureImage = await pdfDoc.embedPng(imageBytes);
        
        // Adjust scale if needed, default to original size or fixed box
        const dims = signatureImage.scale(0.5);
        page.drawImage(signatureImage, {
          x: ann.x,
          y: ann.y,
          width: dims.width,
          height: dims.height,
        });
      }
    }
    
    await applySecurity(pdfDoc, password);
    return await pdfDoc.save();
  },

  async pdfToImages(fileData: Uint8Array): Promise<string[]> {
    const loadingTask = pdfjsLib.getDocument({ data: fileData });
    const pdf = await loadingTask.promise;
    const images: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context!, viewport }).promise;
      images.push(canvas.toDataURL('image/png'));
    }
    return images;
  },

  async imagesToPDF(imageUrls: string[], ocrTexts?: string[], password?: string): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      const response = await fetch(url);
      const imgBytes = await response.arrayBuffer();
      const image = url.includes('png') 
        ? await pdfDoc.embedPng(imgBytes) 
        : await pdfDoc.embedJpg(imgBytes);
      
      const page = pdfDoc.addPage([image.width, image.height]);

      if (ocrTexts && ocrTexts[i]) {
        const lines = ocrTexts[i].split('\n');
        let currentY = image.height - 40;
        for (const line of lines) {
          if (currentY < 20) break;
          page.drawText(line, {
            x: 40,
            y: currentY,
            size: 10,
            font,
            color: rgb(0, 0, 0),
            opacity: 0.01,
          });
          currentY -= 14;
        }
      }

      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }
    await applySecurity(pdfDoc, password);
    return await pdfDoc.save();
  },

  async convertDocToPdf(fileData: Uint8Array, password?: string): Promise<Uint8Array> {
    const result = await mammoth.extractRawText({ arrayBuffer: fileData.buffer });
    const text = result.value;

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 11;
    const margin = 50;
    const width = 595.28; // A4
    const height = 841.89; // A4

    const lines = text.split('\n');
    let page = pdfDoc.addPage([width, height]);
    let currentY = height - margin;

    for (const line of lines) {
      if (line.trim() === '') {
        currentY -= fontSize * 1.5;
        if (currentY < margin) {
          page = pdfDoc.addPage([width, height]);
          currentY = height - margin;
        }
        continue;
      }

      const maxWidth = width - (margin * 2);
      const words = line.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + word + ' ';
        const testLineWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (testLineWidth > maxWidth && currentLine !== '') {
          page.drawText(currentLine, { x: margin, y: currentY, size: fontSize, font });
          currentY -= fontSize * 1.2;
          currentLine = word + ' ';
          if (currentY < margin) {
            page = pdfDoc.addPage([width, height]);
            currentY = height - margin;
          }
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine !== '') {
        page.drawText(currentLine, { x: margin, y: currentY, size: fontSize, font });
        currentY -= fontSize * 1.2;
      }
      
      if (currentY < margin) {
        page = pdfDoc.addPage([width, height]);
        currentY = height - margin;
      }
    }
    
    await applySecurity(pdfDoc, password);
    return await pdfDoc.save();
  }
};
