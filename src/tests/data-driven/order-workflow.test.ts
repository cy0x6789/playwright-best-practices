import { test, expect } from '@fixtures/testFixtures';
import { DataGenerator } from '@utils/dataGenerator';
import { API_ERRORS, DATABASE_ERRORS, EMAIL_ERRORS } from '@utils/errors';
import { TEST_TIMEOUTS, TEST_DATA } from '@config/constants';

interface OrderTestCase {
    scenario: string;
    user: {
        email: string;
        address: {
            street: string;
            city: string;
            state: string;
            zipCode: string;
        };
    };
    order: {
        items: Array<{
            productId: string;
            quantity: number;
        }>;
        expectedTotal: number;
    };
    expectedEmailSubject: string;
}

test.describe('Order Processing Workflow', () => {
    const testCases: OrderTestCase[] = [
        {
            scenario: 'Single item order with valid address',
            user: {
                email: DataGenerator.generateEmail(),
                address: DataGenerator.generateAddress()
            },
            order: {
                items: [{ productId: 'PROD-1', quantity: 1 }],
                expectedTotal: 29.99
            },
            expectedEmailSubject: 'Order Confirmation'
        },
        {
            scenario: 'Multiple items with express shipping',
            user: {
                email: DataGenerator.generateEmail(),
                address: DataGenerator.generateAddress()
            },
            order: {
                items: [
                    { productId: 'PROD-1', quantity: 2 },
                    { productId: 'PROD-2', quantity: 1 }
                ],
                expectedTotal: 89.97
            },
            expectedEmailSubject: 'Express Order Confirmation'
        }
    ];

    for (const { scenario, user, order, expectedEmailSubject } of testCases) {
        test(`Order Processing - ${scenario}`, async ({ apiClient, sqlConnector, mongoConnector, gmailChecker }) => {
            // Create user via API
            const userApi = apiClient
                .setUri('/users')
                .setHeader('X-Source', 'automated-test');

            const createUserResponse = await userApi.post({
                email: user.email,
                address: user.address
            });

            expect(createUserResponse.id, API_ERRORS.VALIDATION_FAILED).toBeTruthy();
            const userId = createUserResponse.id;

            // Verify user in MySQL
            const dbUser = await sqlConnector.executeQuery(
                'SELECT * FROM users WHERE id = ?',
                [userId]
            );
            expect(dbUser.email, DATABASE_ERRORS.QUERY_FAILED).toBe(user.email);

            // Create order in MongoDB
            const orderData = {
                userId,
                items: order.items,
                shippingAddress: user.address,
                timestamp: DataGenerator.generateTimestamp()
            };

            const createOrderResponse = await mongoConnector.executeQuery(
                'orders',
                'insertOne',
                null,
                orderData
            );
            expect(createOrderResponse.insertedId, DATABASE_ERRORS.QUERY_FAILED).toBeTruthy();

            // Process order via API
            const processApi = apiClient
                .setUri(`/orders/${createOrderResponse.insertedId}/process`)
                .setBearerToken('test-token')
                .setQueryParams({ validateInventory: true });

            const processResponse = await processApi.post({
                processType: order.items.length > 1 ? 'express' : 'standard'
            });

            expect(processResponse.status, API_ERRORS.VALIDATION_FAILED).toBe('processed');
            expect(processResponse.total, API_ERRORS.VALIDATION_FAILED).toBe(order.expectedTotal);

            // Verify order email
            const emailReceived = await gmailChecker.waitForEmail(
                `subject:"${expectedEmailSubject}" to:${user.email}`,
                TEST_TIMEOUTS.EMAIL_CHECK
            );
            expect(emailReceived, EMAIL_ERRORS.NOT_RECEIVED).toBeTruthy();

            // Verify final order state in MongoDB
            const finalOrder = await mongoConnector.executeQuery(
                'orders',
                'find',
                { _id: createOrderResponse.insertedId }
            );
            expect(finalOrder[0].status, DATABASE_ERRORS.QUERY_FAILED).toBe('processed');
            expect(finalOrder[0].total, DATABASE_ERRORS.QUERY_FAILED).toBe(order.expectedTotal);
        });
    }

    // Test with dynamically generated orders
    test('Batch order processing with generated data', async ({ apiClient, mongoConnector }) => {
        const orders = Array.from({ length: TEST_DATA.BATCH_SIZE }, () => ({
            userId: DataGenerator.generateUUID(),
            items: [
                {
                    productId: `PROD-${Math.floor(Math.random() * 100)}`,
                    quantity: Math.floor(Math.random() * 5) + 1
                }
            ],
            shippingAddress: DataGenerator.generateAddress(),
            timestamp: DataGenerator.generateTimestamp()
        }));

        for (const orderData of orders) {
            const orderApi = apiClient
                .setUri('/orders')
                .setHeader('X-Batch-Operation', 'true');

            const createResponse = await orderApi.post(orderData);
            expect(createResponse.orderId, API_ERRORS.VALIDATION_FAILED).toBeTruthy();

            // Verify in MongoDB
            const savedOrder = await mongoConnector.executeQuery(
                'orders',
                'find',
                { _id: createResponse.orderId }
            );
            expect(savedOrder[0].userId, DATABASE_ERRORS.QUERY_FAILED).toBe(orderData.userId);
        }
    });
});