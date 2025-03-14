import { test, expect } from '@fixtures/testFixtures';
import { PDFUtils } from '@utils/pdfUtils';
import { promises as fs } from 'fs';
import path from 'path';

test.describe('PDFUtils Tests', () => {
    const testDataPath = path.join(process.cwd(), 'test-data');

    test.beforeAll(async () => {
        // Create test data directory if it doesn't exist
        await fs.mkdir(testDataPath, { recursive: true });
    });

    test.afterAll(async () => {
        // Clean up test files
        try {
            await fs.rm(testDataPath, { recursive: true, force: true });
        } catch (error) {
            console.error('Failed to clean up test files:', error);
        }
    });

    test('should create PDF with text', async () => {
        const pdfPath = path.join(testDataPath, 'test.pdf');
        await PDFUtils.createPDF(pdfPath, {
            content: 'Test PDF Content',
            title: 'Test Document'
        });

        const fileExists = await fs.access(pdfPath)
            .then(() => true)
            .catch(() => false);
        expect(fileExists).toBe(true);

        const content = await PDFUtils.extractText(pdfPath);
        expect(content).toBeTruthy();
    });

    test('should modify existing PDF', async () => {
        const sourcePath = path.join(testDataPath, 'source.pdf');
        const modifiedPath = path.join(testDataPath, 'modified.pdf');

        // Create initial PDF
        await PDFUtils.createPDF(sourcePath, {
            content: 'Original Content',
            title: 'Original Document'
        });

        // Modify PDF
        await PDFUtils.modifyPDF(sourcePath, modifiedPath, {
            addText: 'Additional Content',
            page: 1
        });

        const fileExists = await fs.access(modifiedPath)
            .then(() => true)
            .catch(() => false);
        expect(fileExists).toBe(true);

        const content = await PDFUtils.extractText(modifiedPath);
        expect(content).toBeTruthy();
    });

    test('should merge multiple PDFs', async () => {
        const pdf1Path = path.join(testDataPath, 'test1.pdf');
        const pdf2Path = path.join(testDataPath, 'test2.pdf');
        const mergedPath = path.join(testDataPath, 'merged.pdf');

        // Create two PDFs
        await PDFUtils.createPDF(pdf1Path, {
            content: 'Content 1',
            title: 'Document 1'
        });

        await PDFUtils.createPDF(pdf2Path, {
            content: 'Content 2',
            title: 'Document 2'
        });

        // Merge PDFs
        await PDFUtils.mergePDFs([pdf1Path, pdf2Path], mergedPath);

        const fileExists = await fs.access(mergedPath)
            .then(() => true)
            .catch(() => false);
        expect(fileExists).toBe(true);

        const content = await PDFUtils.extractText(mergedPath);
        expect(content).toBeTruthy();
    });

    test('should handle PDF operation errors gracefully', async () => {
        const nonExistentPath = path.join(testDataPath, 'non-existent.pdf');
        await expect(PDFUtils.extractText(nonExistentPath))
            .rejects
            .toThrow('Failed to read PDF file');
    });
});