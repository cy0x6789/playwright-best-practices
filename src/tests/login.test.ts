import { test, expect } from '@fixtures/testFixtures';
import { DataGenerator } from '@utils/dataGenerator';

test.describe('Login Tests', () => {
    test('successful login', async ({ loginPage }) => {
        await loginPage.navigate('/login');
        await loginPage.login('testuser', 'password123');

        // Add assertions for successful login
        await expect(loginPage.page).toHaveURL('/dashboard');
    });

    test('failed login with invalid credentials', async ({ loginPage }) => {
        await loginPage.navigate('/login');
        await loginPage.login(
            DataGenerator.generateUsername(),
            DataGenerator.generatePassword()
        );

        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe('Invalid username or password');
    });
});