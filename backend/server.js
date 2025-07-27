const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
console.log('🔍 Environment variables loaded:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***hidden***' : 'NOT SET');
console.log('DB_NAME:', process.env.DB_NAME);

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fruitables_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

// Database initialization
const initializeDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        
        // Create users table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create user_addresses table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS user_addresses (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                address_type VARCHAR(50) DEFAULT 'home',
                address_line1 VARCHAR(255) NOT NULL,
                address_line2 VARCHAR(255),
                city VARCHAR(100) NOT NULL,
                state VARCHAR(100),
                country VARCHAR(100) NOT NULL,
                zip_code VARCHAR(20) NOT NULL,
                is_default BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Create orders table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                order_number VARCHAR(50) UNIQUE NOT NULL,
                total_amount DECIMAL(10,2) NOT NULL,
                shipping_amount DECIMAL(10,2) DEFAULT 3.00,
                payment_method VARCHAR(50) NOT NULL,
                order_status VARCHAR(50) DEFAULT 'pending',
                shipping_address_id INT,
                billing_address_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (shipping_address_id) REFERENCES user_addresses(id),
                FOREIGN KEY (billing_address_id) REFERENCES user_addresses(id)
            )
        `);

        // Create order_items table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT PRIMARY KEY AUTO_INCREMENT,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                product_name VARCHAR(255) NOT NULL,
                product_price DECIMAL(10,2) NOT NULL,
                quantity INT NOT NULL,
                total_price DECIMAL(10,2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            )
        `);

        connection.release();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
};

// Initialize database on startup (commented out for development without MySQL)
// initializeDatabase();

// Authentication Routes

// Register new user
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        // Validate input
        if (!firstName || !lastName || !email || !phone || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Mock signup for development (no database required)
        // In production, you would use the database connection below
        const mockUser = {
            id: Math.floor(Math.random() * 1000) + 1,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            created_at: new Date().toISOString()
        };

        // Generate JWT token
        const token = jwt.sign(
            { userId: mockUser.id, email: mockUser.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: mockUser
        });

        /* Uncomment this section when database is set up
        const connection = await pool.getConnection();

        // Check if user already exists
        const [existingUsers] = await connection.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            connection.release();
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert new user
        const [result] = await connection.execute(
            'INSERT INTO users (first_name, last_name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, email, phone, passwordHash]
        );

        const userId = result.insertId;

        // Get user data (without password)
        const [users] = await connection.execute(
            'SELECT id, first_name, last_name, email, phone, created_at FROM users WHERE id = ?',
            [userId]
        );

        connection.release();

        // Generate JWT token
        const token = jwt.sign(
            { userId: users[0].id, email: users[0].email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: users[0]
        });
        */

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Mock login for development (no database required)
        // In production, you would use the database connection below
        if (email === 'test@example.com' && password === 'password123') {
            const mockUser = {
                id: 1,
                first_name: 'Test',
                last_name: 'User',
                email: email,
                phone: '+1234567890',
                created_at: new Date().toISOString()
            };

            // Generate JWT token
            const token = jwt.sign(
                { userId: mockUser.id, email: mockUser.email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: mockUser
            });
        } else {
            return res.status(401).json({ message: 'Invalid email or password. Use test@example.com / password123' });
        }

        /* Uncomment this section when database is set up
        const connection = await pool.getConnection();

        // Find user by email
        const [users] = await connection.execute(
            'SELECT id, first_name, last_name, email, phone, password_hash, created_at FROM users WHERE email = ?',
            [email]
        );

        connection.release();

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Remove password from response
        delete user.password_hash;

        res.json({
            message: 'Login successful',
            token,
            user
        });
        */

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User Management Routes

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const [users] = await connection.execute(
            'SELECT id, first_name, last_name, email, phone, created_at FROM users WHERE id = ?',
            [req.user.userId]
        );

        connection.release();

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(users[0]);

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get user addresses
app.get('/api/user/addresses', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const [addresses] = await connection.execute(
            'SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
            [req.user.userId]
        );

        connection.release();

        res.json(addresses);

    } catch (error) {
        console.error('Get addresses error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add new address
app.post('/api/user/addresses', authenticateToken, async (req, res) => {
    try {
        const {
            addressType,
            addressLine1,
            addressLine2,
            city,
            state,
            country,
            zipCode,
            isDefault
        } = req.body;

        // Validate required fields
        if (!addressLine1 || !city || !country || !zipCode) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        const connection = await pool.getConnection();

        // If this is set as default, unset other defaults
        if (isDefault) {
            await connection.execute(
                'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
                [req.user.userId]
            );
        }

        // Insert new address
        const [result] = await connection.execute(
            `INSERT INTO user_addresses 
            (user_id, address_type, address_line1, address_line2, city, state, country, zip_code, is_default) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [req.user.userId, addressType, addressLine1, addressLine2, city, state, country, zipCode, isDefault]
        );

        const addressId = result.insertId;

        // Get the created address
        const [addresses] = await connection.execute(
            'SELECT * FROM user_addresses WHERE id = ?',
            [addressId]
        );

        connection.release();

        res.status(201).json(addresses[0]);

    } catch (error) {
        console.error('Add address error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update address
app.put('/api/user/addresses/:id', authenticateToken, async (req, res) => {
    try {
        const addressId = req.params.id;
        const {
            addressType,
            addressLine1,
            addressLine2,
            city,
            state,
            country,
            zipCode,
            isDefault
        } = req.body;

        const connection = await pool.getConnection();

        // Verify address belongs to user
        const [existingAddresses] = await connection.execute(
            'SELECT id FROM user_addresses WHERE id = ? AND user_id = ?',
            [addressId, req.user.userId]
        );

        if (existingAddresses.length === 0) {
            connection.release();
            return res.status(404).json({ message: 'Address not found' });
        }

        // If this is set as default, unset other defaults
        if (isDefault) {
            await connection.execute(
                'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ? AND id != ?',
                [req.user.userId, addressId]
            );
        }

        // Update address
        await connection.execute(
            `UPDATE user_addresses SET 
            address_type = ?, address_line1 = ?, address_line2 = ?, city = ?, 
            state = ?, country = ?, zip_code = ?, is_default = ? 
            WHERE id = ? AND user_id = ?`,
            [addressType, addressLine1, addressLine2, city, state, country, zipCode, isDefault, addressId, req.user.userId]
        );

        // Get updated address
        const [addresses] = await connection.execute(
            'SELECT * FROM user_addresses WHERE id = ?',
            [addressId]
        );

        connection.release();

        res.json(addresses[0]);

    } catch (error) {
        console.error('Update address error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete address
app.delete('/api/user/addresses/:id', authenticateToken, async (req, res) => {
    try {
        const addressId = req.params.id;

        const connection = await pool.getConnection();

        // Verify address belongs to user and delete
        const [result] = await connection.execute(
            'DELETE FROM user_addresses WHERE id = ? AND user_id = ?',
            [addressId, req.user.userId]
        );

        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.json({ message: 'Address deleted successfully' });

    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Order Routes

// Create new order
app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const {
            items,
            firstName,
            lastName,
            company,
            address,
            city,
            country,
            zip,
            mobile,
            email,
            notes,
            paymentMethod,
            upi,
            selectedAddressId
        } = req.body;

        // Validate required fields
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        const connection = await pool.getConnection();

        // Calculate total
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingAmount = 3.00;
        const finalTotal = totalAmount + shippingAmount;

        // Generate order number
        const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        // Create order
        const [orderResult] = await connection.execute(
            `INSERT INTO orders 
            (user_id, order_number, total_amount, shipping_amount, payment_method, shipping_address_id, billing_address_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [req.user.userId, orderNumber, finalTotal, shippingAmount, paymentMethod, selectedAddressId, selectedAddressId]
        );

        const orderId = orderResult.insertId;

        // Insert order items
        for (const item of items) {
            await connection.execute(
                `INSERT INTO order_items 
                (order_id, product_id, product_name, product_price, quantity, total_price) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [orderId, item.id, item.name, item.price, item.quantity, item.price * item.quantity]
            );
        }

        connection.release();

        res.status(201).json({
            message: 'Order created successfully',
            orderId,
            orderNumber,
            total: finalTotal
        });

    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get user orders
app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const [orders] = await connection.execute(
            `SELECT o.*, 
                    GROUP_CONCAT(oi.product_name SEPARATOR ', ') as items
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             WHERE o.user_id = ?
             GROUP BY o.id
             ORDER BY o.created_at DESC`,
            [req.user.userId]
        );

        connection.release();

        res.json(orders);

    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 