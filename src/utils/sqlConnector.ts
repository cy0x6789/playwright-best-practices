import { Pool } from 'pg';
import { logger } from '@utils/logger';

export class SQLConnector {
    private pool: Pool | null = null;

    async connect(config: {
        host: string;
        user: string;
        password: string;
        database: string;
    }): Promise<void> {
        try {
            this.pool = new Pool({
                host: process.env.PGHOST || config.host,
                user: process.env.PGUSER || config.user,
                password: process.env.PGPASSWORD || config.password,
                database: process.env.PGDATABASE || config.database,
                port: parseInt(process.env.PGPORT || '5432')
            });
            logger.info('PostgreSQL connection established');
        } catch (error) {
            logger.error('PostgreSQL connection failed:', error);
            throw error;
        }
    }

    async executeQuery<T>(query: string, params: any[] = []): Promise<T> {
        if (!this.pool) {
            throw new Error('PostgreSQL connection not established');
        }
        try {
            logger.debug(`Executing PostgreSQL query: ${query}`);
            const { rows } = await this.pool.query(query, params);
            return rows[0] as T;
        } catch (error) {
            logger.error('PostgreSQL query execution failed:', error);
            throw error;
        }
    }

    async close(): Promise<void> {
        if (this.pool) {
            await this.pool.end();
            logger.info('PostgreSQL connection closed');
        }
    }
}