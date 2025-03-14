import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/loginPage';
import { APIClient } from '@utils/apiClient';
import { SQLConnector } from '@utils/sqlConnector';
import { MongoConnector } from '@utils/mongoConnector';
import { GmailChecker } from '@utils/gmailChecker';
import { config } from '@config/config';

type TestFixtures = {
    loginPage: LoginPage;
    apiClient: APIClient;
    sqlConnector: SQLConnector;
    mongoConnector: MongoConnector;
    gmailChecker: GmailChecker;
};

export const test = base.extend<TestFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    apiClient: async ({ request }, use) => {
        const apiClient = new APIClient(config.api.baseUrl, request);
        await use(apiClient);
    },

    sqlConnector: async ({}, use) => {
        const sqlConnector = new SQLConnector();
        await sqlConnector.connect({
            host: process.env.PGHOST || 'localhost',
            user: process.env.PGUSER || 'postgres',
            password: process.env.PGPASSWORD || 'password',
            database: process.env.PGDATABASE || 'testdb'
        });
        await use(sqlConnector);
        await sqlConnector.close();
    },

    mongoConnector: async ({}, use) => {
        const mongoConnector = new MongoConnector();
        await mongoConnector.connect(
            process.env.MONGODB_URL || 'mongodb://localhost:27017',
            process.env.MONGODB_DATABASE || 'testdb'
        );
        await use(mongoConnector);
        await mongoConnector.close();
    },

    gmailChecker: async ({}, use) => {
        const gmailChecker = new GmailChecker(config.gmail);
        await use(gmailChecker);
    }
});

export { expect } from '@playwright/test';