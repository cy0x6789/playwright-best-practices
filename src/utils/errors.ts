export const API_ERRORS = {
    TIMEOUT: 'API request timed out',
    UNAUTHORIZED: 'Unauthorized access - invalid or missing token',
    NOT_FOUND: 'Resource not found',
    VALIDATION_FAILED: 'Request validation failed',
    SERVER_ERROR: 'Internal server error occurred'
};

export const DATABASE_ERRORS = {
    CONNECTION_FAILED: 'Failed to establish database connection',
    QUERY_FAILED: 'Database query execution failed',
    INVALID_QUERY: 'Invalid query parameters or syntax',
    TRANSACTION_FAILED: 'Database transaction failed',
    DUPLICATE_ENTRY: 'Duplicate entry found'
};

export const FILE_OPERATION_ERRORS = {
    READ_ERROR: 'Failed to read file',
    WRITE_ERROR: 'Failed to write file',
    INVALID_FORMAT: 'Invalid file format',
    FILE_NOT_FOUND: 'File not found',
    PERMISSION_DENIED: 'Permission denied for file operation'
};

export const TEST_ERRORS = {
    ELEMENT_NOT_FOUND: 'Element not found on page',
    TIMEOUT_ERROR: 'Operation timed out',
    ASSERTION_FAILED: 'Test assertion failed',
    SETUP_FAILED: 'Test setup failed',
    CLEANUP_FAILED: 'Test cleanup failed'
};

export const EMAIL_ERRORS = {
    NOT_RECEIVED: 'Expected email was not received',
    INVALID_CONTENT: 'Email content validation failed',
    CONNECTION_ERROR: 'Failed to connect to email service',
    AUTHENTICATION_ERROR: 'Email service authentication failed'
};

export class TestError extends Error {
    constructor(message: string, public code?: string) {
        super(message);
        this.name = 'TestError';
    }
}

export class APIError extends Error {
    constructor(message: string, public statusCode?: number) {
        super(message);
        this.name = 'APIError';
    }
}

export class DatabaseError extends Error {
    constructor(message: string, public queryInfo?: string) {
        super(message);
        this.name = 'DatabaseError';
    }
}
