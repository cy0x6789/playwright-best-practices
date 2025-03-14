import { format, parse, addDays, subDays, isValid, differenceInDays } from 'date-fns';
import { logger } from '@utils/logger';

export class DateTimeUtils {
    static getCurrentDateTime(): Date {
        return new Date();
    }

    static formatDate(date: Date, formatString: string = 'yyyy-MM-dd'): string {
        try {
            return format(date, formatString);
        } catch (error) {
            logger.error(`Failed to format date: ${error}`);
            throw error;
        }
    }

    static parseDate(dateString: string, formatString: string = 'yyyy-MM-dd'): Date {
        const parsedDate = parse(dateString, formatString, new Date());
        if (!isValid(parsedDate)) {
            throw new Error(`Invalid date string: ${dateString}`);
        }
        return parsedDate;
    }

    static addDaysToDate(date: Date, days: number): Date {
        return addDays(date, days);
    }

    static subtractDaysFromDate(date: Date, days: number): Date {
        return subDays(date, days);
    }

    static getDaysBetweenDates(startDate: Date, endDate: Date): number {
        return differenceInDays(endDate, startDate);
    }

    static isWeekend(date: Date): boolean {
        const day = date.getDay();
        return day === 0 || day === 6;
    }

    static getStartOfDay(date: Date): Date {
        return new Date(date.setHours(0, 0, 0, 0));
    }

    static getEndOfDay(date: Date): Date {
        return new Date(date.setHours(23, 59, 59, 999));
    }

    static getTimeStamp(): number {
        return Date.now();
    }

    static formatDateTime(date: Date): string {
        return format(date, 'yyyy-MM-dd HH:mm:ss');
    }
}
