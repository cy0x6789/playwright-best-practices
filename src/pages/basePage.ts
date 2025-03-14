import { Page } from '@playwright/test';
import { logger } from '@utils/logger';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(url: string): Promise<void> {
        try {
            await this.page.goto(url);
            logger.info(`Navigated to ${url}`);
        } catch (error) {
            logger.error(`Failed to navigate to ${url}: ${error}`);
            throw error;
        }
    }

    async waitForElement(selector: string, timeout = 5000): Promise<void> {
        try {
            await this.page.waitForSelector(selector, { timeout });
            logger.debug(`Element ${selector} found`);
        } catch (error) {
            logger.error(`Element ${selector} not found: ${error}`);
            throw error;
        }
    }

    async click(selector: string): Promise<void> {
        try {
            await this.waitForElement(selector);
            await this.page.click(selector);
            logger.info(`Clicked element: ${selector}`);
        } catch (error) {
            logger.error(`Failed to click element ${selector}: ${error}`);
            throw error;
        }
    }

    async type(selector: string, text: string): Promise<void> {
        try {
            await this.waitForElement(selector);
            await this.page.fill(selector, text);
            logger.info(`Typed text into element: ${selector}`);
        } catch (error) {
            logger.error(`Failed to type text into element ${selector}: ${error}`);
            throw error;
        }
    }

    async getText(selector: string): Promise<string> {
        try {
            await this.waitForElement(selector);
            const text = await this.page.textContent(selector);
            return text || '';
        } catch (error) {
            logger.error(`Failed to get text from element ${selector}: ${error}`);
            throw error;
        }
    }
}