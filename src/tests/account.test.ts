import { test, expect } from '@fixtures/testFixtures';
import { DataGenerator } from '@utils/dataGenerator';
import { API_ERRORS } from '@utils/errors';
import { Account, LoginCredentials, RegistrationData } from '@models/account';

test.describe('Account Management Tests', () => {
    test('successful user registration', async ({ apiClient }) => {
        const registrationData: RegistrationData = {
            username: DataGenerator.generateUsername(),
            email: DataGenerator.generateEmail(),
            password: 'ValidPass123!'
        };

        const registrationApi = apiClient
            .setUri('/register')
            .setHeader('X-Registration-Source', 'automated-test');

        const response = await registrationApi.post(registrationData);
        expect(response.id, API_ERRORS.VALIDATION_FAILED).toBeTruthy();
        expect(response.message, API_ERRORS.VALIDATION_FAILED).toBe('User registered successfully');
    });

    test('successful user login', async ({ apiClient }) => {
        const loginData: LoginCredentials = {
            email: DataGenerator.generateEmail(),
            password: 'ValidPass123!'
        };

        // First register the user
        await apiClient
            .setUri('/register')
            .post({
                username: DataGenerator.generateUsername(),
                email: loginData.email,
                password: loginData.password
            });

        // Then attempt login
        const loginApi = apiClient
            .setUri('/login')
            .setHeader('X-Login-Source', 'automated-test');

        const response = await loginApi.post(loginData);
        expect(response.token, API_ERRORS.VALIDATION_FAILED).toBeTruthy();
        expect(response.account, API_ERRORS.VALIDATION_FAILED).toBeDefined();

        const account: Account = response.account;
        expect(account.email, API_ERRORS.VALIDATION_FAILED).toBe(loginData.email);
        expect(account.isActive, API_ERRORS.VALIDATION_FAILED).toBe(true);
    });

    test('invalid login credentials', async ({ apiClient }) => {
        const loginApi = apiClient
            .setUri('/login')
            .setHeader('X-Login-Source', 'automated-test');

        const response = await loginApi
            .post({
                email: 'nonexistent@example.com',
                password: 'WrongPass123!'
            })
            .catch(e => e.response);

        expect(response.status, API_ERRORS.VALIDATION_FAILED).toBe(401);
        expect(response.data.message, API_ERRORS.VALIDATION_FAILED).toBe('Invalid credentials');
    });
});
