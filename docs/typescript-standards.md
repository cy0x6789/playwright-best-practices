# TypeScript Code Standards

## 1. Naming Conventions

### Variables and Functions
- Use camelCase for variable and function names
- Use descriptive names that indicate purpose
```typescript
// Good
const userEmail = 'example@email.com';
function calculateTotalPrice() { }

// Bad
const e = 'example@email.com';
function calc() { }
```

### Classes and Interfaces
- Use PascalCase for class and interface names
- Prefix interfaces with 'I' when they represent a contract
```typescript
// Good
class UserService { }
interface IUserData { }

// Bad
class userService { }
interface userData { }
```

### Constants
- Use UPPER_SNAKE_CASE for constants
```typescript
// Good
const MAX_RETRY_COUNT = 3;

// Bad
const maxRetryCount = 3;
```

## 2. Code Organization

### File Structure
- One class per file
- Related functionality should be grouped in modules
- Use barrels (index.ts) to simplify imports
```typescript
// /models/index.ts
export * from './user.model';
export * from './order.model';
```

### Imports
- Use alias paths instead of relative paths
```typescript
// Good
import { UserService } from '@services/user.service';

// Bad
import { UserService } from '../../../services/user.service';
```

## 3. Type Safety

### Type Annotations
- Explicitly define return types for functions
- Use type inference for variables when type is obvious
```typescript
// Good
function getUserById(id: string): Promise<User> { }
const users: User[] = [];

// Bad
function getUserById(id) { }
const users = [];
```

### Null Checks
- Use optional chaining and nullish coalescing
```typescript
// Good
const userName = user?.name ?? 'Unknown';

// Bad
const userName = user && user.name ? user.name : 'Unknown';
```

## 4. Testing

### Test Organization
- Group related tests using describe blocks
- Use clear test descriptions
```typescript
describe('UserService', () => {
    describe('createUser', () => {
        it('should create a new user with valid data', () => { });
        it('should throw error with invalid data', () => { });
    });
});
```

### Test Data
- Use factories/generators for test data
- Avoid hard-coded test data
```typescript
// Good
const user = DataGenerator.createUser();

// Bad
const user = { name: 'John', email: 'john@example.com' };
```

## 5. Error Handling

### Custom Errors
- Create specific error types for different scenarios
- Include relevant error details
```typescript
class ValidationError extends Error {
    constructor(message: string, public field: string) {
        super(message);
        this.name = 'ValidationError';
    }
}
```

### Async/Await
- Always use try/catch with async/await
- Handle errors appropriately
```typescript
try {
    await api.createUser(userData);
} catch (error) {
    if (error instanceof ValidationError) {
        // Handle validation error
    }
    throw error;
}
```

## 6. Documentation

### Comments
- Use JSDoc for public APIs
- Write self-documenting code
```typescript
/**
 * Creates a new user in the system
 * @param userData The user data to create
 * @returns The created user
 * @throws {ValidationError} If user data is invalid
 */
async function createUser(userData: IUserData): Promise<User> { }
```

### TODO Comments
- Include ticket/issue reference
- Explain why it's needed
```typescript
// TODO(#123): Implement rate limiting for API requests
```

## 7. Performance

### Async Operations
- Use Promise.all for parallel operations
- Avoid unnecessary async operations
```typescript
// Good
const [users, orders] = await Promise.all([
    getUsers(),
    getOrders()
]);

// Bad
const users = await getUsers();
const orders = await getOrders();
```

### Memory Management
- Clean up subscriptions and event listeners
- Use appropriate data structures
```typescript
class Component {
    private subscription: Subscription;

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }
}
```
