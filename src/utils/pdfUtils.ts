import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { promises as fs } from 'fs';
import { logger } from '@utils/logger';

interface PDFOptions {
    content: string;
    title?: string;
}

export class PDFUtils {
    static async createPDF(outputPath: string, options: PDFOptions): Promise<void> {
        try {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            const fontSize = 12;
            const lineHeight = fontSize * 1.2;
            const margin = 50;

            // Draw title
            const title = options.title || 'Report';
            page.drawText(title, {
                x: margin,
                y: page.getHeight() - margin,
                size: fontSize + 4,
                font,
                color: rgb(0, 0, 0)
            });

            // Draw content
            const words = options.content.split(' ');
            let line = '';
            let yPosition = page.getHeight() - margin - lineHeight * 2;

            for (const word of words) {
                const testLine = line + (line ? ' ' : '') + word;
                const width = font.widthOfTextAtSize(testLine, fontSize);

                if (width > page.getWidth() - margin * 2) {
                    page.drawText(line, {
                        x: margin,
                        y: yPosition,
                        size: fontSize,
                        font,
                        color: rgb(0, 0, 0)
                    });
                    line = word;
                    yPosition -= lineHeight;
                } else {
                    line = testLine;
                }
            }

            if (line) {
                page.drawText(line, {
                    x: margin,
                    y: yPosition,
                    size: fontSize,
                    font,
                    color: rgb(0, 0, 0)
                });
            }

            const pdfBytes = await pdfDoc.save();
            await fs.writeFile(outputPath, pdfBytes);
            logger.info(`PDF created successfully at ${outputPath}`);
        } catch (error) {
            logger.error('Failed to create PDF:', error);
            throw error;
        }
    }

    static async modifyPDF(sourcePath: string, outputPath: string, options: { addText: string; page: number }): Promise<void> {
        try {
            const pdfBytes = await fs.readFile(sourcePath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();
            const page = pages[options.page - 1];
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            page.drawText(options.addText, {
                x: 50,
                y: 50,
                size: 12,
                font,
                color: rgb(0, 0, 0)
            });

            const modifiedPdfBytes = await pdfDoc.save();
            await fs.writeFile(outputPath, modifiedPdfBytes);
            logger.info(`PDF modified successfully at ${outputPath}`);
        } catch (error) {
            logger.error('Failed to modify PDF:', error);
            throw error;
        }
    }

    static async mergePDFs(inputPaths: string[], outputPath: string): Promise<void> {
        try {
            const mergedPdf = await PDFDocument.create();

            for (const path of inputPaths) {
                const pdfBytes = await fs.readFile(path);
                const pdf = await PDFDocument.load(pdfBytes);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const mergedPdfBytes = await mergedPdf.save();
            await fs.writeFile(outputPath, mergedPdfBytes);
            logger.info(`PDFs merged successfully at ${outputPath}`);
        } catch (error) {
            logger.error('Failed to merge PDFs:', error);
            throw error;
        }
    }

    static async extractText(pdfPath: string): Promise<string> {
        try {
            const pdfBytes = await fs.readFile(pdfPath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();

            // Note: pdf-lib doesn't support text extraction
            // This is a placeholder that returns page count info
            return `PDF document with ${pages.length} pages`;
        } catch (error) {
            logger.error('Failed to read PDF file:', error);
            throw new Error('Failed to read PDF file');
        }
    }
}