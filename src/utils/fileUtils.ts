import { promises as fs } from 'fs';
import { parse as csvParse } from 'csv-parse';
import { stringify as csvStringify } from 'csv-stringify';
import xlsx from 'xlsx';
import { FILE_OPERATION_ERRORS } from './errors';
import { logger } from './logger';

export class FileUtils {
    static async readCSV<T>(filePath: string): Promise<T[]> {
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            return new Promise((resolve, reject) => {
                csvParse(fileContent, {
                    columns: true,
                    skip_empty_lines: true
                }, (error, records: T[]) => {
                    if (error) reject(error);
                    resolve(records);
                });
            });
        } catch (error) {
            logger.error(FILE_OPERATION_ERRORS.READ_ERROR, error);
            throw new Error(FILE_OPERATION_ERRORS.READ_ERROR);
        }
    }

    static async writeCSV<T>(filePath: string, data: T[]): Promise<void> {
        try {
            const csvData = await new Promise((resolve, reject) => {
                csvStringify(data, {
                    header: true
                }, (error, output) => {
                    if (error) reject(error);
                    resolve(output);
                });
            });
            await fs.writeFile(filePath, csvData as string);
        } catch (error) {
            logger.error(FILE_OPERATION_ERRORS.WRITE_ERROR, error);
            throw new Error(FILE_OPERATION_ERRORS.WRITE_ERROR);
        }
    }

    static async readExcel<T>(filePath: string, sheetName?: string): Promise<T[]> {
        try {
            const workbook = xlsx.readFile(filePath);
            const sheet = sheetName ? 
                workbook.Sheets[sheetName] : 
                workbook.Sheets[workbook.SheetNames[0]];
            return xlsx.utils.sheet_to_json<T>(sheet);
        } catch (error) {
            logger.error(FILE_OPERATION_ERRORS.READ_ERROR, error);
            throw new Error(FILE_OPERATION_ERRORS.READ_ERROR);
        }
    }

    static async writeExcel<T>(filePath: string, data: T[], sheetName = 'Sheet1'): Promise<void> {
        try {
            const worksheet = xlsx.utils.json_to_sheet(data);
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
            xlsx.writeFile(workbook, filePath);
        } catch (error) {
            logger.error(FILE_OPERATION_ERRORS.WRITE_ERROR, error);
            throw new Error(FILE_OPERATION_ERRORS.WRITE_ERROR);
        }
    }

    static async readJSON<T>(filePath: string): Promise<T> {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            logger.error(FILE_OPERATION_ERRORS.READ_ERROR, error);
            throw new Error(FILE_OPERATION_ERRORS.READ_ERROR);
        }
    }

    static async writeJSON<T>(filePath: string, data: T): Promise<void> {
        try {
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            logger.error(FILE_OPERATION_ERRORS.WRITE_ERROR, error);
            throw new Error(FILE_OPERATION_ERRORS.WRITE_ERROR);
        }
    }
}
