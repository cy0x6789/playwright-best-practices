import { test, expect } from '@fixtures/testFixtures';
import { DataGenerator } from '@utils/dataGenerator';
import { API_ERRORS, DATABASE_ERRORS } from '@utils/errors';

interface RegistrationTestCase {
    scenario: string;
    data: {
        username: string;
        email: string;
        password: string;
    };
    expectedStatus: number;
    expectedMessage?: string;
}

const testCases: RegistrationTestCase[] = [
    {
        scenario: 'Valid user registration',
        data: {
            username: DataGenerator.generateUsername(),
            email: DataGenerator.generateEmail(),
            password: 'ValidPass123!'
        },
        expectedStatus: 201,
        expectedMessage: 'User registered successfully'
    },
    {
        scenario: 'Invalid email format',
        data: {
            username: DataGenerator.generateUsername(),
            email: 'invalid-email',
            password: 'ValidPass123!'
        },
        expectedStatus: 400,
        expectedMessage: 'Invalid email format'
    }
];

test.describe('Data-Driven Registration Tests', () => {
    for (const { scenario, data, expectedStatus, expectedMessage } of testCases) {
        test(`Registration - ${scenario}`, async ({ apiClient, sqlConnector }) => {
            // API Test
            const registrationApi = apiClient
                .setUri('/register')
                .setHeader('X-Registration-Source', 'automated-test');

            const response = await registrationApi
                .post(data)
                .catch(e => e.response);

            expect(response.status, API_ERRORS.VALIDATION_FAILED).toBe(expectedStatus);
            if (expectedMessage) {
                expect(response.data.message, API_ERRORS.VALIDATION_FAILED).toBe(expectedMessage);
            }

            // Database Verification (only for successful registration)
            if (expectedStatus === 201) {
                const dbUser = await sqlConnector.executeQuery(
                    'SELECT * FROM users WHERE email = ?',
                    [data.email]
                );
                expect(dbUser, DATABASE_ERRORS.QUERY_FAILED).toBeTruthy();
                expect(dbUser.username, DATABASE_ERRORS.QUERY_FAILED).toBe(data.username);
            }
        });
    }

    // Test with dynamically generated data
    test('Multiple registrations with generated data', async ({ apiClient }) => {
        const usersToCreate = Array.from({ length: 3 }, () => ({
            username: DataGenerator.generateUsername(),
            email: DataGenerator.generateEmail(),
            password: 'ValidPass123!'
        }));

        for (const userData of usersToCreate) {
            const response = await apiClient
                .setUri('/register')
                .post(userData);

            expect(response.status, API_ERRORS.VALIDATION_FAILED).toBe(201);
            expect(response.data.id, API_ERRORS.VALIDATION_FAILED).toBeTruthy();
        }
    });
});