import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mock user database
const users = new Map();

// Registration endpoint
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    
    if (!email.includes('@')) {
        return res.status(400).json({
            message: 'Invalid email format'
        });
    }

    const userId = `user-${Date.now()}`;
    users.set(userId, {
        id: userId,
        username,
        email,
        password,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    return res.status(201).json({
        id: userId,
        message: 'User registered successfully'
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = Array.from(users.values()).find(u => u.email === email);
    
    if (!user || user.password !== password) {
        return res.status(401).json({
            message: 'Invalid credentials'
        });
    }

    return res.status(200).json({
        token: `mock-token-${Date.now()}`,
        account: {
            id: user.id,
            username: user.username,
            email: user.email,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    });
});

// Email notification endpoint
app.post('/notifications/email', (req, res) => {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
        return res.status(400).json({
            message: 'Invalid email format'
        });
    }

    return res.status(200).json({
        message: 'Email notification sent'
    });
});

// Start server
const PORT = 8000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mock API server running on port ${PORT}`);
});
