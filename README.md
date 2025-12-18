# Laboratory Work №2: REST API Implementation

This repository is the result of completing the second laboratory work for the course **"Server-Side Software Technologies"**

The purpose of this work was to implement a REST API with CRUD operations for managing users, categories, and records using **Nest.js**. The API includes proper error handling, data validation, and relationships between entities.

---

## Tech Stack

- **Nest.js**
- **Node.js**
- **TypeScript**
- **Docker**
- **Docker Compose**
- **GitHub Actions**
- **Render.com**

---

## Completed Tasks

- Implemented **Users** module with full CRUD operations
- Implemented **Categories** module with create, read, and delete operations
- Implemented **Records** module with CRUD operations and filtering capabilities
- Added relationships between records, users, and categories
- Implemented proper error handling with HTTP status codes
- Added data validation using DTOs (Data Transfer Objects)
- Used in-memory storage with Map data structures
- Configured module dependencies and dependency injection

---

## API Endpoints

### Health Check

| Method | Path          | Description | Example Response |
|--------|----------------|--------------|------------------|
| GET    | `/healthcheck` | Checks the service health. Returns status `200 OK` and JSON with the current timestamp and `"ok"` status | `{"status": "ok", "date": "2025-10-14T09:36:44.231Z"}` |

### Users

| Method | Path          | Description | Request Body | Example Response |
|--------|---------------|-------------|--------------|-------------------|
| POST   | `/user`       | Creates a new user | `{"name": "John Doe"}` | `{"id": "uuid", "name": "John Doe"}` |
| GET    | `/users`      | Retrieves all users | - | `[{"id": "uuid", "name": "John Doe"}, ...]` |
| GET    | `/user/:id`   | Retrieves a user by ID | - | `{"id": "uuid", "name": "John Doe"}` |
| DELETE | `/user/:id`   | Deletes a user by ID | - | `{"message": "User deleted successfully"}` |

### Categories

| Method | Path            | Description | Request Body | Example Response |
|--------|-----------------|-------------|--------------|-------------------|
| POST   | `/category`     | Creates a new category | `{"name": "Food"}` | `{"id": "uuid", "name": "Food"}` |
| GET    | `/category`     | Retrieves all categories | - | `[{"id": "uuid", "name": "Food"}, ...]` |
| DELETE | `/category/:id` | Deletes a category by ID | - | `{"message": "Category deleted successfully"}` |

### Records

| Method | Path                    | Description | Request Body | Query Parameters | Example Response |
|--------|-------------------------|-------------|--------------|------------------|-------------------|
| POST   | `/record`               | Creates a new record | `{"user_id": "uuid", "category_id": "uuid", "amount": 100.50}` | - | `{"id": "uuid", "userId": "uuid", "categoryId": "uuid", "amount": 100.50, "timestamp": "2025-01-14T10:00:00.000Z"}` |
| GET    | `/record`               | Retrieves records with optional filtering | - | `?user_id=uuid&category_id=uuid` (at least one required) | `[{"id": "uuid", "userId": "uuid", "categoryId": "uuid", "amount": 100.50, "timestamp": "2025-01-14T10:00:00.000Z"}, ...]` |
| GET    | `/record/:id`           | Retrieves a record by ID | - | - | `{"id": "uuid", "userId": "uuid", "categoryId": "uuid", "amount": 100.50, "timestamp": "2025-01-14T10:00:00.000Z"}` |
| DELETE | `/record/:id`           | Deletes a record by ID | - | - | `{"message": "Record deleted successfully"}` |

---

## Local Setup Instructions

To run this project locally, make sure you have **Git**, **Docker**, and **Docker Compose** installed

### 1. Clone the repository
```bash
git clone https://github.com/saveniukk/backend.git
```

### 2. Navigate to the project directory
```bash
cd backend
```

### 3. Create an environment variables file
Create a `.env` file in the project root.  
For this lab, it’s enough to specify the port the app will run on

```bash
# .env
PORT=3000
```

By default, the app will start on port **3000** if no port is specified

### 4. Run the project using Docker Compose
This command will automatically build the Docker image (if it doesn’t exist yet) and start the container

```bash
docker compose up --build
```

After execution, your app will be available in a browser or API client (like **Insomnia** or **Postman**)

### 5. Verify it’s working
Open [http://localhost:3000/healthcheck](http://localhost:3000/healthcheck) in your browser.  
You should see a JSON response like this:

```json
{
  "status": "ok",
  "date": "2025-10-14T09:36:44.231Z"
}
```

### 6. Stop the container
To stop the application, press `Ctrl + C` in the terminal where Docker Compose is running, or execute:

```bash
docker compose down
```

---

## Deployment

The project is automatically deployed to **Render.com** whenever a new commit is pushed to the `main` branch

**Deployed project link:**  
[https://backend-0pnu.onrender.com/healthcheck](https://backend-0pnu.onrender.com/healthcheck)

---
