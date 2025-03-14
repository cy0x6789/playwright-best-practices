import { MongoClient, Db } from 'mongodb';
import { logger } from '@utils/logger';

export class MongoConnector {
    private client: MongoClient | null = null;
    private db: Db | null = null;

    async connect(url: string, dbName: string): Promise<void> {
        try {
            this.client = await MongoClient.connect(url);
            this.db = this.client.db(dbName);
            logger.info('MongoDB connection established');
        } catch (error) {
            logger.error('MongoDB connection failed:', error);
            throw error;
        }
    }

    async executeQuery<T>(
        collection: string,
        operation: 'find' | 'insertOne' | 'updateOne' | 'deleteOne',
        query: any,
        data?: any
    ): Promise<T> {
        if (!this.db) {
            throw new Error('MongoDB connection not established');
        }
        try {
            const coll = this.db.collection(collection);
            logger.debug(`Executing MongoDB ${operation} on ${collection}`);
            
            switch (operation) {
                case 'find':
                    return (await coll.find(query).toArray()) as T;
                case 'insertOne':
                    return (await coll.insertOne(data)) as T;
                case 'updateOne':
                    return (await coll.updateOne(query, { $set: data })) as T;
                case 'deleteOne':
                    return (await coll.deleteOne(query)) as T;
                default:
                    throw new Error(`Unsupported operation: ${operation}`);
            }
        } catch (error) {
            logger.error('MongoDB operation failed:', error);
            throw error;
        }
    }

    async close(): Promise<void> {
        if (this.client) {
            await this.client.close();
            logger.info('MongoDB connection closed');
        }
    }
}
