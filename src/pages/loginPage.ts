import { BasePage } from '@pages/basePage';
import { Page } from '@playwright/test';
import { logger } from '@utils/logger';

export class LoginPage extends BasePage {
    private readonly selectors = {
        usernameInput: '#username',
        passwordInput: '#password',
        loginButton: '#login-button',
        errorMessage: '.error-message'
    };

    constructor(page: Page) {
        super(page);
    }

    async login(username: string, password: string): Promise<void> {
        try {
            logger.info(`Attempting to login with username: ${username}`);
            await this.type(this.selectors.usernameInput, username);
            await this.type(this.selectors.passwordInput, password);
            await this.click(this.selectors.loginButton);
        } catch (error) {
            logger.error(`Login failed: ${error}`);
            throw error;
        }
    }

    async getErrorMessage(): Promise<string> {
        return await this.getText(this.selectors.errorMessage);
    }
}