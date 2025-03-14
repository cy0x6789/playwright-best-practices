import { test, expect } from '@fixtures/testFixtures';
import { FileUtils } from '@utils/fileUtils';
import { FILE_OPERATION_ERRORS } from '@utils/errors';
import path from 'path';

test.describe('FileUtils Tests', () => {
    const testDataPath = path.join(process.cwd(), 'test-data');

    test.beforeAll(async () => {
        // Create test data directory if it doesn't exist
        await FileUtils.createDirectory(testDataPath);
    });

    test('should read and write CSV files', async () => {
        const csvPath = path.join(testDataPath, 'test.csv');
        const testData = [
            { name: 'John', age: 30 },
            { name: 'Jane', age: 25 }
        ];

        // Write CSV
        await FileUtils.writeCSV(csvPath, testData);

        // Read CSV
        const readData = await FileUtils.readCSV(csvPath);
        expect(readData).toHaveLength(2);
        expect(readData[0].name).toBe('John');
        expect(readData[1].age).toBe('25'); // CSV reads numbers as strings
    });

    test('should read and write Excel files', async () => {
        const excelPath = path.join(testDataPath, 'test.xlsx');
        const testData = [
            { name: 'John', age: 30 },
            { name: 'Jane', age: 25 }
        ];

        // Write Excel
        await FileUtils.writeExcel(excelPath, testData);

        // Read Excel
        const readData = await FileUtils.readExcel(excelPath);
        expect(readData).toHaveLength(2);
        expect(readData[0].name).toBe('John');
        expect(readData[1].age).toBe(25); // Excel preserves number types
    });

    test('should read and write JSON files', async () => {
        const jsonPath = path.join(testDataPath, 'test.json');
        const testData = {
            users: [
                { name: 'John', age: 30 },
                { name: 'Jane', age: 25 }
            ]
        };

        // Write JSON
        await FileUtils.writeJSON(jsonPath, testData);

        // Read JSON
        const readData = await FileUtils.readJSON(jsonPath);
        expect(readData.users).toHaveLength(2);
        expect(readData.users[0].name).toBe('John');
        expect(readData.users[1].age).toBe(25);
    });

    test('should handle file operation errors gracefully', async () => {
        // Try to read non-existent file
        const nonExistentPath = path.join(testDataPath, 'non-existent.csv');
        await expect(FileUtils.readCSV(nonExistentPath))
            .rejects
            .toThrow(FILE_OPERATION_ERRORS.READ_ERROR);
    });
});
