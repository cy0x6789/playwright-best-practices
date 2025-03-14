# Playwright Testing Guide

A comprehensive guide and reference implementation for test automation using Playwright with TypeScript, demonstrating best practices, patterns and standards for automated testing.

## Features

- **Page Object Model**: Modular and maintainable test structure
- **API Testing**: Enhanced API client with fluent interface
- **Database Integration**: 
  - PostgreSQL for user data and transactional operations
  - MongoDB for analytics and document storage
- **Email Verification**: Gmail API integration
- **Data Generation**: Faker.js integration for test data
- **File Operations**: Support for PDF, Excel, and CSV handling
- **Multi-browser Testing**: Chrome, Firefox, and WebKit support
- **Reporting**: HTML and JUnit reports

## Best Practices

### 1. Page Object Model
- Keep selectors and page interactions in separate page object classes
- Use meaningful names for methods and elements
- Implement chainable methods for better readability

### 2. API Testing
- Use the built-in APIClient for consistent request handling
- Implement proper error handling and logging
- Validate response schemas using Zod

### 3. Test Organization
- Group related tests using `test.describe`
- Use data-driven testing for multiple scenarios
- Keep test cases focused and independent

### 4. Database Testing
- Use the provided database connectors
- Clean up test data after each test
- Implement proper transaction handling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:8000/api
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=password
PGDATABASE=testdb
MONGODB_URL=mongodb://localhost:27017
MONGODB_DATABASE=testdb
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REDIRECT_URI=your_redirect_uri
GMAIL_REFRESH_TOKEN=your_refresh_token
```

## Usage Examples

### 1. API Testing with Enhanced Client

```typescript
test('create user via API', async ({ apiClient }) => {
    const response = await apiClient
        .setUri('/users')
        .setHeader('X-Custom-Header', 'value')
        .setBearerToken('your-token')
        .post<User>({
            username: DataGenerator.generateUsername(),
            email: DataGenerator.generateEmail()
        });

    expect(response.id).toBeTruthy();
});
```

### 2. Database Operations

```typescript
// PostgreSQL Operations
test('verify user in PostgreSQL', async ({ sqlConnector }) => {
    const user = await sqlConnector.executeQuery(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    expect(user).toBeTruthy();
});

// MongoDB Operations
test('verify order in MongoDB', async ({ mongoConnector }) => {
    const order = await mongoConnector.executeQuery(
        'orders',
        'find',
        { userId: 'user-123' }
    );
    expect(order[0].status).toBe('completed');
});
```

### 3. File Operations

```typescript
// PDF Operations
test('verify PDF content', async () => {
    const pdfContent = await PDFUtils.extractText('path/to/file.pdf');
    expect(pdfContent).toContain('Expected Text');
});

// Excel Operations
test('process Excel data', async () => {
    const data = await FileUtils.readExcel('path/to/file.xlsx');
    expect(data[0].column1).toBe('Expected Value');
});
```

## Running Tests

### Local Environment

Use the provided shell script for different environments:

```bash
# Run all tests in QA environment
./scripts/local.sh --env qa

# Run specific test file in development
./scripts/local.sh --env dev --spec tests/api.test.ts

# Run tagged tests
./scripts/local.sh --tags smoke,regression
```

### CI/CD Pipeline

Tests are automatically run in GitHub Actions:
- On pull requests to main branch
- Nightly runs for regression tests
- Scheduled runs for performance tests

## Project Structure

```
src/
├── config/         # Configuration files
├── fixtures/       # Test fixtures
├── pages/          # Page Object Models
├── tests/          # Test files
│   ├── api/        # API tests
│   ├── data-driven/# Data-driven tests
│   └── utils/      # Utility tests
└── utils/          # Utility functions
    ├── apiClient.ts
    ├── sqlConnector.ts
    ├── mongoConnector.ts
    ├── fileUtils.ts
    ├── dateTime.ts
    └── pdfUtils.ts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## TypeScript Standards

See [TypeScript Standards](docs/typescript-standards.md) for coding conventions and best practices.

## Environment Configuration

Different environment configurations are supported:
- Development (dev)
- Quality Assurance (qa)
- Staging (staging)
- Production (prod)

Configure environment-specific variables in corresponding `.env` files:
- `.env.dev`
- `.env.qa`
- `.env.staging`
- `.env.prod`