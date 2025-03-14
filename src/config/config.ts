export const config = {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    api: {
        baseUrl: process.env.API_BASE_URL || 'http://localhost:8000/api'
    },
    mysql: {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || 'password',
        database: process.env.MYSQL_DATABASE || 'testdb'
    },
    mongodb: {
        url: process.env.MONGODB_URL || 'mongodb://localhost:27017',
        database: process.env.MONGODB_DATABASE || 'testdb'
    },
    gmail: {
        clientId: process.env.GMAIL_CLIENT_ID || '',
        clientSecret: process.env.GMAIL_CLIENT_SECRET || '',
        redirectUri: process.env.GMAIL_REDIRECT_URI || '',
        refreshToken: process.env.GMAIL_REFRESH_TOKEN || ''
    }
};
