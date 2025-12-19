# Laboratory Work №3

This repository is the result of completing the third laboratory work for the course **"Server-Side Software Technologies"**

The purpose of this work was to implement a REST API with CRUD operations for managing users, categories, and records using **Nest.js**. The API includes proper error handling, data validation, and relationships between entities.

---

## Tech Stack

- **Nest.js**
- **Node.js**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **Docker**
- **Docker Compose**
- **GitHub Actions**
- **Render.com**

---

## Variant (33 mod 3 = 0)

**Варіант 0**: Реалізація системи обліку доходів та витрат (гаманець)

### Особливості реалізації:
- Користувачі мають баланс (поле `balance` в моделі `User`)
- Можливість поповнення балансу через ендпоінт `/income`
- При створенні витрати (`Record`) автоматично віднімається сума з балансу користувача
- Заборона створення витрати, якщо баланс стає від'ємним
- Використання транзакцій Prisma для забезпечення атомарності операцій

---

## Completed Tasks

- Implemented **Users** module with full CRUD operations using Prisma ORM
- Implemented **Categories** module with create, read, and delete operations
- Implemented **Records** module with CRUD operations and filtering capabilities
- Implemented **Income** module for balance top-up functionality
- Added relationships between records, users, and categories using Prisma
- Implemented proper error handling with HTTP status codes and global exception filter
- Added data validation using DTOs (Data Transfer Objects) with class-validator
- Configured PostgreSQL database with Prisma migrations
- Implemented balance management system (wallet functionality)
- Added validation to prevent negative balance

---

## API Endpoints

### Health Check

| Method | Path          | Description | Example Response |
|--------|----------------|--------------|------------------|
| GET    | `/healthcheck` | Checks the service health. Returns status `200 OK` and JSON with the current timestamp and `"ok"` status | `{"status": "ok", "date": "2025-10-14T09:36:44.231Z"}` |

### Users

| Method | Path          | Description | Request Body | Example Response |
|--------|---------------|-------------|--------------|-------------------|
| POST   | `/user`       | Creates a new user | `{"username": "johndoe"}` | `{"id": "uuid", "username": "johndoe", "balance": "0", "created_at": "2025-12-19T..."}` |
| GET    | `/users`      | Retrieves all users | - | `[{"id": "uuid", "username": "johndoe", "balance": "100.50", "created_at": "2025-12-19T..."}, ...]` |
| GET    | `/user/:id`   | Retrieves a user by ID | - | `{"id": "uuid", "username": "johndoe", "balance": "100.50", "created_at": "2025-12-19T..."}` |
| DELETE | `/user/:id`   | Deletes a user by ID | - | `{"message": "User deleted successfully"}` |

### Categories

| Method | Path            | Description | Request Body | Example Response |
|--------|-----------------|-------------|--------------|-------------------|
| POST   | `/category`     | Creates a new category | `{"name": "Food"}` | `{"id": "uuid", "name": "Food"}` |
| GET    | `/category`     | Retrieves all categories | - | `[{"id": "uuid", "name": "Food"}, ...]` |
| DELETE | `/category/:id` | Deletes a category by ID | - | `{"message": "Category deleted successfully"}` |

### Records (Expenses)

| Method | Path                    | Description | Request Body | Query Parameters | Example Response |
|--------|-------------------------|-------------|--------------|------------------|-------------------|
| POST   | `/record`               | Creates a new expense record. Automatically deducts amount from user balance | `{"user_id": "uuid", "category_id": "uuid", "sum": 100.50}` | - | `{"id": "uuid", "user_id": "uuid", "category_id": "uuid", "sum": "100.50", "created_at": "2025-12-19T..."}` |
| GET    | `/record`               | Retrieves records with optional filtering | - | `?user_id=uuid&category_id=uuid` (at least one required) | `[{"id": "uuid", "user_id": "uuid", "category_id": "uuid", "sum": "100.50", "created_at": "2025-12-19T..."}, ...]` |
| GET    | `/record/:id`           | Retrieves a record by ID | - | - | `{"id": "uuid", "user_id": "uuid", "category_id": "uuid", "sum": "100.50", "created_at": "2025-12-19T..."}` |
| DELETE | `/record/:id`           | Deletes a record by ID | - | - | `{"message": "Record deleted successfully"}` |

### Income (Balance Top-up)

| Method | Path                    | Description | Request Body | Example Response |
|--------|-------------------------|-------------|--------------|------------------|
| POST   | `/income`               | Adds income to user balance | `{"user_id": "uuid", "amount": 500.00}` | `{"id": "uuid", "username": "johndoe", "balance": "500.00", "created_at": "2025-12-19T..."}` |

---

## Local Setup Instructions

To run this project locally, make sure you have **Git**, **Node.js**, **npm**, **Docker**, and **Docker Compose** installed.

### 1. Clone the repository
```bash
git clone https://github.com/saveniukk/backend.git
```

### 2. Navigate to the project directory
```bash
cd backend
```

### 3. Install dependencies
```bash
npm install
```

### 4. Create an environment variables file
Create a `.env` file in the project root with the following content:

```bash
# Application Port
PORT=3000

# PostgreSQL Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=backend_db
POSTGRES_PORT=5432
POSTGRES_HOST=db

# Database URL for Prisma
# For local development (when running migrations from host machine)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/backend_db?schema=public"
```

### 5. Start PostgreSQL database
```bash
docker compose up -d db
```

Wait for the database to be ready (healthcheck will verify this).

### 6. Run Prisma migrations
```bash
npx prisma migrate deploy
```

Or if you want to create a new migration:
```bash
npx prisma migrate dev
```

### 7. Generate Prisma Client
```bash
npx prisma generate
```

### 8. Run the application

**Option A: Using Docker Compose (recommended)**
```bash
docker compose up --build
```

**Option B: Using npm (for development)**
```bash
npm run start:dev
```

After execution, your app will be available at [http://localhost:3000](http://localhost:3000)

### 9. Verify it's working
Open [http://localhost:3000/healthcheck](http://localhost:3000/healthcheck) in your browser or API client.  
You should see a JSON response like this:

```json
{
  "status": "ok",
  "date": "2025-12-19T14:46:13.231Z"
}
```

### 10. Stop the containers
To stop the application, press `Ctrl + C` in the terminal where Docker Compose is running, or execute:

```bash
docker compose down
```

To stop only the database:
```bash
docker compose stop db
```

---

## Deployment

The project is automatically deployed to **Render.com** whenever a new commit is pushed to the `main` branch

**Deployed project link:**  
[https://backend-0pnu.onrender.com/healthcheck](https://backend-0pnu.onrender.com/healthcheck)

---

## Error Handling

API використовує глобальний exception filter, який повертає стандартизовані помилки у форматі:

```json
{
  "timestamp": "2025-12-19T14:46:13.231Z",
  "path": "/record",
  "statusCode": 400,
  "message": ["Insufficient balance. Current balance: 30.00, Required: 50.25"],
  "error": "Bad Request"
}
```

### Типи помилок:

- **400 Bad Request** - помилки валідації або недостатній баланс
- **404 Not Found** - ресурс не знайдено
- **500 Internal Server Error** - внутрішні помилки сервера

---
