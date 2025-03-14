import { test, expect } from '@fixtures/testFixtures';
import { DateTimeUtils } from '@utils/dateTime';
import { addDays, subDays, format } from 'date-fns';

test.describe('DateTimeUtils Tests', () => {
    test('should format date correctly', () => {
        const date = new Date('2025-03-14T10:30:00Z');
        expect(DateTimeUtils.formatDate(date, 'yyyy-MM-dd')).toBe('2025-03-14');
        expect(DateTimeUtils.formatDate(date, 'dd/MM/yyyy')).toBe('14/03/2025');
    });

    test('should parse date string correctly', () => {
        const dateStr = '2025-03-14';
        const parsed = DateTimeUtils.parseDate(dateStr, 'yyyy-MM-dd');
        expect(format(parsed, 'yyyy-MM-dd')).toBe(dateStr);
    });

    test('should add days to date', () => {
        const date = new Date('2025-03-14');
        const result = DateTimeUtils.addDays(date, 5);
        expect(format(result, 'yyyy-MM-dd')).toBe('2025-03-19');
    });

    test('should subtract days from date', () => {
        const date = new Date('2025-03-14');
        const result = DateTimeUtils.subtractDays(date, 5);
        expect(format(result, 'yyyy-MM-dd')).toBe('2025-03-09');
    });

    test('should check if date is between range', () => {
        const date = new Date('2025-03-14');
        const start = subDays(date, 5);
        const end = addDays(date, 5);

        expect(DateTimeUtils.isDateBetween(date, start, end)).toBe(true);
        expect(DateTimeUtils.isDateBetween(date, end, addDays(end, 5))).toBe(false);
    });

    test('should generate date ranges', () => {
        const start = new Date('2025-03-14');
        const end = addDays(start, 3);
        const range = DateTimeUtils.generateDateRange(start, end);

        expect(range).toHaveLength(4); // inclusive
        expect(format(range[0], 'yyyy-MM-dd')).toBe('2025-03-14');
        expect(format(range[3], 'yyyy-MM-dd')).toBe('2025-03-17');
    });
});
