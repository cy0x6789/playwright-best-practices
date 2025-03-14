// API Timeouts
export const API_TIMEOUTS = {
    DEFAULT: 5000,
    LONG: 30000,
    SHORT: 2000
};

// Database Connection Timeouts
export const DB_TIMEOUTS = {
    CONNECTION: 10000,
    QUERY: 5000
};

// Test Timeouts
export const TEST_TIMEOUTS = {
    DEFAULT: 30000,
    PAGE_LOAD: 10000,
    API_RESPONSE: 5000,
    EMAIL_CHECK: 30000
};

// File Paths
export const FILE_PATHS = {
    DOWNLOADS: './downloads',
    REPORTS: './test-results/reports',
    LOGS: './logs',
    SCREENSHOTS: './test-results/screenshots'
};

// Test Data
export const TEST_DATA = {
    RETRY_COUNT: 2,
    BATCH_SIZE: 100,
    MAX_PARALLEL_TESTS: 3
};

// Environment URLs
export const ENVIRONMENTS = {
    DEV: {
        UI: 'http://dev.example.com',
        API: 'http://dev-api.example.com'
    },
    QA: {
        UI: 'http://qa.example.com',
        API: 'http://qa-api.example.com'
    },
    STAGING: {
        UI: 'http://staging.example.com',
        API: 'http://staging-api.example.com'
    },
    PROD: {
        UI: 'http://example.com',
        API: 'http://api.example.com'
    }
};

// Test Tags
export const TEST_TAGS = {
    SMOKE: 'smoke',
    REGRESSION: 'regression',
    E2E: 'e2e',
    API: 'api',
    PERFORMANCE: 'performance'
};
