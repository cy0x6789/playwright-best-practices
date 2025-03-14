import { test, expect } from '@fixtures/testFixtures';
import { DataGenerator } from '@utils/dataGenerator';
import { API_ERRORS, DATABASE_ERRORS } from '@utils/errors';
import { API_TIMEOUTS, TEST_TIMEOUTS } from '@config/constants';

test.describe('API Tests', () => {
    test('create and verify user via API', async ({ apiClient, sqlConnector }) => {
        const userData = {
            username: DataGenerator.generateUsername(),
            email: DataGenerator.generateEmail(),
            password: DataGenerator.generatePassword()
        };

        // Create user via API
        const userApi = apiClient
            .setUri('/users')
            .setHeader('X-Source', 'automated-test');
        const createResponse = await userApi.post(userData);

        expect(createResponse.id, API_ERRORS.VALIDATION_FAILED).toBeTruthy();

        // Verify user in database
        const dbUser = await sqlConnector.executeQuery(
            'SELECT * FROM users WHERE email = ?',
            [userData.email]
        );
        expect(dbUser, DATABASE_ERRORS.QUERY_FAILED).toBeTruthy();
    });

    test('verify email notification', async ({ apiClient, gmailChecker }) => {
        const email = DataGenerator.generateEmail();

        // Trigger email notification
        const notificationApi = apiClient
            .setUri('/notifications/email')
            .setHeader('X-Notification-Type', 'email');
        await notificationApi.post({ email });

        // Wait for email and verify
        const receivedEmail = await gmailChecker.waitForEmail(
            `to:${email}`,
            TEST_TIMEOUTS.EMAIL_CHECK
        );
        expect(receivedEmail).toBeTruthy();
    });
});