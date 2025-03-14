import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

export class DataGenerator {
    static generateUUID(): string {
        return uuidv4();
    }

    static generateTimestamp(): number {
        return Date.now();
    }

    static generateEmail(): string {
        return faker.internet.email();
    }

    static generateUsername(): string {
        return faker.internet.userName();
    }

    static generatePassword(): string {
        return faker.internet.password();
    }

    static generatePhoneNumber(): string {
        return faker.phone.number();
    }

    static generateAddress(): {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    } {
        return {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode()
        };
    }
}
