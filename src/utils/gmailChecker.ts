import { google } from 'googleapis';
import { logger } from './logger';

export class GmailChecker {
    private auth: any;

    constructor(credentials: {
        client_id: string;
        client_secret: string;
        redirect_uri: string;
        refresh_token: string;
    }) {
        this.auth = new google.auth.OAuth2(
            credentials.client_id,
            credentials.client_secret,
            credentials.redirect_uri
        );
        this.auth.setCredentials({
            refresh_token: credentials.refresh_token
        });
    }

    async checkEmail(query: string, maxResults = 10): Promise<any[]> {
        try {
            const gmail = google.gmail({ version: 'v1', auth: this.auth });
            logger.info(`Searching emails with query: ${query}`);

            const response = await gmail.users.messages.list({
                userId: 'me',
                q: query,
                maxResults
            });

            const messages = response.data.messages || [];
            const emailDetails = await Promise.all(
                messages.map(async (message) => {
                    const email = await gmail.users.messages.get({
                        userId: 'me',
                        id: message.id!
                    });
                    return email.data;
                })
            );

            logger.debug(`Found ${emailDetails.length} matching emails`);
            return emailDetails;
        } catch (error) {
            logger.error('Failed to check Gmail:', error);
            throw error;
        }
    }

    async waitForEmail(query: string, timeout = 30000): Promise<any> {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const emails = await this.checkEmail(query, 1);
            if (emails.length > 0) {
                return emails[0];
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        throw new Error(`Email not found within timeout: ${query}`);
    }
}
