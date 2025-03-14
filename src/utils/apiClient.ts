import { APIRequestContext } from '@playwright/test';
import { logger } from '@utils/logger';

export class APIClient {
    private context: APIRequestContext;
    private config: {
        headers?: Record<string, string>;
        params?: Record<string, any>;
        baseURL: string;
    };
    private uri: string = '';

    constructor(baseURL: string, context: APIRequestContext) {
        this.context = context;
        this.config = {
            baseURL,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }

    setBaseUrl(url: string): APIClient {
        this.config.baseURL = url;
        return this;
    }

    setUri(uri: string): APIClient {
        this.uri = uri;
        return this;
    }

    setHeader(key: string, value: string): APIClient {
        this.config.headers = {
            ...this.config.headers,
            [key]: value
        };
        return this;
    }

    setBearerToken(token: string): APIClient {
        return this.setHeader('Authorization', `Bearer ${token}`);
    }

    setQueryParams(params: Record<string, any>): APIClient {
        this.config.params = params;
        return this;
    }

    private getFullUrl(): string {
        const url = new URL(this.uri, this.config.baseURL);
        if (this.config.params) {
            Object.entries(this.config.params).forEach(([key, value]) => {
                url.searchParams.append(key, String(value));
            });
        }
        return url.toString();
    }

    async get<T>(): Promise<T> {
        try {
            const response = await this.context.get(this.getFullUrl(), {
                headers: this.config.headers
            });
            return await response.json();
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async post<T>(data?: any): Promise<T> {
        try {
            const response = await this.context.post(this.getFullUrl(), {
                headers: this.config.headers,
                data: data ? JSON.stringify(data) : undefined
            });
            return await response.json();
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async put<T>(data?: any): Promise<T> {
        try {
            const response = await this.context.put(this.getFullUrl(), {
                headers: this.config.headers,
                data: data ? JSON.stringify(data) : undefined
            });
            return await response.json();
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async delete<T>(): Promise<T> {
        try {
            const response = await this.context.delete(this.getFullUrl(), {
                headers: this.config.headers
            });
            return await response.json();
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private handleError(error: any): Error {
        const message = error.message || 'API Request failed';
        logger.error(`API Request failed: ${message}`);
        return new Error(`API Error: ${message}`);
    }
}