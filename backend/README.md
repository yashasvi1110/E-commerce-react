# Fruitables Backend API

A complete backend API for the Fruitables e-commerce application built with Express.js, MySQL, and JWT authentication.

## Features

- 🔐 **User Authentication**: JWT-based login/signup system
- 👤 **User Management**: Profile management and address storage
- 🛒 **Order Management**: Complete order processing system
- 🏠 **Address Management**: Multiple saved addresses per user
- 🔒 **Security**: Password hashing, JWT tokens, input validation

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=fruitables_db
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   ```

4. **Create MySQL database**
   ```sql
   CREATE DATABASE fruitables_db;
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/auth/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### User Management

#### GET `/api/user/profile`
Get user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Address Management

#### GET `/api/user/addresses`
Get all user addresses (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "addressType": "home",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001",
    "isDefault": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST `/api/user/addresses`
Add new address (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "addressType": "home",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "zipCode": "10001",
  "isDefault": true
}
```

#### PUT `/api/user/addresses/:id`
Update existing address (requires authentication).

#### DELETE `/api/user/addresses/:id`
Delete address (requires authentication).

### Order Management

#### POST `/api/orders`
Create new order (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Fresh Apples",
      "price": 2.99,
      "quantity": 2
    }
  ],
  "firstName": "John",
  "lastName": "Doe",
  "company": "Company Name",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "zip": "10001",
  "mobile": "+1234567890",
  "email": "john@example.com",
  "notes": "Delivery instructions",
  "paymentMethod": "Cash on Delivery",
  "selectedAddressId": 1
}
```

**Response:**
```json
{
  "message": "Order created successfully",
  "orderId": 1,
  "orderNumber": "ORD-1704067200000-ABC123DEF",
  "total": 8.98
}
```

#### GET `/api/orders`
Get user orders (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### User Addresses Table
```sql
CREATE TABLE user_addresses (
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
);
```

### Orders Table
```sql
CREATE TABLE orders (
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
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Cross-origin resource sharing setup

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Running in Development Mode
```bash
npm run dev
```

This will start the server with nodemon for automatic restarts on file changes.

### Environment Variables
Make sure to set up your `.env` file with the correct database credentials and JWT secret.

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a strong JWT secret
3. Set up proper database credentials
4. Use a process manager like PM2
5. Set up reverse proxy (nginx)
6. Enable HTTPS

## License

MIT License - see LICENSE file for details. 