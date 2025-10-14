# Laboratory Work №1: Project Template Setup

This repository is the result of completing the first laboratory work for the course **"Server-Side Software Technologies"**

The purpose of this work was to set up a standard backend development environment, create a basic REST API using **Nest.js**, containerize it with **Docker**, and configure automatic deployment on the **Render.com** platform

---

## Tech Stack

- **Nest.js**
- **Node.js**
- **Docker**
- **Docker Compose**
- **GitHub Actions**
- **Render.com**

---

## Completed Tasks

- Created a basic project using the **Nest.js** framework
- Implemented a `GET /healthcheck` endpoint to check service availability 
- Configured a `Dockerfile` for application containerization  
- Added a `docker-compose.yml` configuration for simplified local startup  
- Set up a **CI/CD** pipeline using **GitHub Actions** for automated testing and Docker image building
- Successfully deployed the project to **Render.com** with automatic updates on every push to the `main` branch

---

## API Endpoints

| Method | Path          | Description | Example Response |
|--------|----------------|--------------|------------------|
| GET    | `/healthcheck` | Checks the service health. Returns status `200 OK` and JSON with the current timestamp and `"ok"` status | `{"status": "ok", "date": "2025-10-14T09:36:44.231Z"}` |

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
[]()

---
