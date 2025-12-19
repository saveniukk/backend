# Wallet Management System API

A RESTful API for managing personal finances, built with NestJS. This application provides a comprehensive wallet system that allows users to track their income, expenses, and manage financial records with categories.

## Overview

This is a backend API system for expense and income tracking (wallet management). Users can register, authenticate, manage their balance, create expense records organized by categories, and track their financial transactions. The system ensures data integrity through database transactions and provides secure authentication using JWT tokens.

## Features

- **User Authentication**: Secure registration and login with JWT token-based authentication
- **Balance Management**: Users have a balance that can be topped up through income transactions
- **Expense Tracking**: Create expense records with automatic balance deduction
- **Category Organization**: Organize expenses by custom categories
- **Transaction Safety**: Database transactions ensure atomicity of balance operations
- **Balance Protection**: Prevents negative balances through validation
- **Data Validation**: Comprehensive input validation using DTOs and class-validator
- **Error Handling**: Standardized error responses with appropriate HTTP status codes

## Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Prisma ORM** - Modern database toolkit
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication

## Architecture

The application follows a modular architecture with separate modules for:

- **Auth Module**: Handles user registration, login, and JWT token management
- **Users Module**: User management and profile operations
- **Categories Module**: Expense category management
- **Records Module**: Expense record creation and retrieval
- **Income Module**: Balance top-up functionality

## API Endpoints

### Authentication

| Method | Path | Description | Authentication |
|--------|------|-------------|----------------|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Authenticate and receive JWT token | Public |

### Health Check

| Method | Path | Description |
|--------|------|-------------|
| GET | `/healthcheck` | Service health status |

### Users

| Method | Path | Description | Authentication |
|--------|------|-------------|----------------|
| POST | `/user` | Create a new user (legacy endpoint) | Public |
| GET | `/users` | Retrieve all users | Required |
| GET | `/user/me` | Get current authenticated user | Required |
| GET | `/user/:id` | Get user by ID | Required |
| DELETE | `/user/:id` | Delete user (own account only) | Required |

### Categories

| Method | Path | Description | Authentication |
|--------|------|-------------|----------------|
| POST | `/category` | Create a new category | Required |
| GET | `/category` | Retrieve all categories | Required |
| DELETE | `/category/:id` | Delete a category | Required |

### Records (Expenses)

| Method | Path | Description | Authentication |
|--------|------|-------------|----------------|
| POST | `/record` | Create an expense record (auto-deducts from balance) | Required |
| GET | `/record` | Get records (filters by authenticated user or query params) | Required |
| GET | `/record/:id` | Get record by ID | Required |
| DELETE | `/record/:id` | Delete a record | Required |

### Income (Balance Top-up)

| Method | Path | Description | Authentication |
|--------|------|-------------|----------------|
| POST | `/income` | Add income to user balance | Required |

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Tokens are obtained through `/auth/register` or `/auth/login` endpoints and are valid for 24 hours.

## Data Models

### User
- `id` (UUID): Unique identifier
- `username` (String): Unique username
- `email` (String): Unique email address
- `password` (String): Hashed password
- `balance` (Decimal): Current balance
- `created_at` (DateTime): Account creation timestamp

### Category
- `id` (UUID): Unique identifier
- `name` (String): Category name

### Record
- `id` (UUID): Unique identifier
- `user_id` (UUID): Reference to user
- `category_id` (UUID): Reference to category
- `sum` (Decimal): Expense amount
- `created_at` (DateTime): Record creation timestamp

## Key Features Implementation

### Balance Management
- Users start with a balance of 0
- Income transactions increase the balance
- Expense records automatically deduct from balance
- System prevents negative balances

### Transaction Safety
- Expense creation uses database transactions to ensure atomicity
- Balance updates and record creation happen in a single transaction
- Prevents race conditions and data inconsistencies

### Security
- Passwords are hashed using bcrypt with salt rounds of 10
- JWT tokens contain user information (id, email, username)
- Protected endpoints require valid JWT tokens
- Users can only delete their own accounts

### Error Handling
The API returns standardized error responses:

```json
{
  "timestamp": "2025-12-19T14:46:13.231Z",
  "path": "/record",
  "statusCode": 400,
  "message": ["Insufficient balance. Current balance: 30.00, Required: 50.25"],
  "error": "Bad Request"
}
```

### Error Types
- **400 Bad Request**: Validation errors or insufficient balance
- **401 Unauthorized**: Invalid or missing authentication token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate resource (e.g., existing email/username)
- **500 Internal Server Error**: Server-side errors

## Request/Response Examples

### Register User
**Request:**
```json
POST /auth/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "id": "uuid",
  "username": "johndoe",
  "email": "john@example.com",
  "balance": "0",
  "created_at": "2025-12-19T14:46:13.231Z",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Create Expense Record
**Request:**
```json
POST /record
Authorization: Bearer <token>
{
  "category_id": "category-uuid",
  "sum": 150.50
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "user-uuid",
  "category_id": "category-uuid",
  "sum": "150.50",
  "created_at": "2025-12-19T14:46:13.231Z"
}
```

## Database Schema

The application uses PostgreSQL with the following relationships:

- **User** has many **Records**
- **Category** has many **Records**
- **Record** belongs to one **User** and one **Category**

Foreign key constraints ensure referential integrity, and cascade deletion is configured for related records.

## Validation Rules

### User Registration
- Username: 3-50 characters, unique
- Email: Valid email format, unique
- Password: Minimum 6 characters

### Expense Records
- Category ID: Valid UUID, must exist
- Sum: Positive number
- Balance: Must be sufficient (checked before creation)

### Income
- Amount: Positive number

## Project Structure

```
src/
├── auth/              # Authentication module
│   ├── dto/          # Data transfer objects
│   ├── decorators/   # Custom decorators (CurrentUser)
│   ├── guards/       # JWT authentication guard
│   └── strategies/   # JWT strategy
├── users/            # User management module
├── categories/       # Category management module
├── records/          # Expense records module
├── income/           # Income/balance module
├── prisma/           # Prisma service
└── common/           # Shared utilities and filters
```