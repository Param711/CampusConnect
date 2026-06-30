# Campus Hub REST API Backend

This is the REST API backend service powering the Campus Hub platform. It is built using **Node.js**, **Express**, and **Sequelize ORM**. It serves the endpoints for managing users, notices, and events, complete with strict model validations, JWT authentication, role-based access controls, limit/offset pagination, client rate limiting, and helpful JSON error responses.

## Database Configurations (PostgreSQL / SQLite Fallback)

To make it easy for developers to run and test this API locally without configuration overhead, the backend supports **dual database dialects**:

1. **PostgreSQL (Production/Staging)**: If PostgreSQL environment variables (such as `PGHOST` or `DATABASE_URL`) are defined, the system connects directly to PostgreSQL.
2. **SQLite (Zero-Config Development Fallback)**: If PostgreSQL configuration variables are missing, the server falls back to an SQLite database instance, creating a local file `campus.db` in the backend directory.

---

## Getting Started

### 1. Installation
Install the necessary package dependencies:
```bash
cd backend
npm install
```

### 2. Configure Environment (Optional for Postgres)
To run the server with a PostgreSQL database, define the connection variables:
```bash
# Windows PowerShell example
$env:PGHOST="localhost"
$env:PGPORT="5432"
$env:PGUSER="postgres"
$env:PGPASSWORD="yourpassword"
$env:PGDATABASE="campus"
$env:DB_SSL="false"
```

### 3. Run Server
Start the development server with hot-reloading:
```bash
npm run dev
```
Or start in production mode:
```bash
npm start
```
The server will synchronize all schema tables and listen on port `3000` (or `PORT` env variable) at `http://localhost:3000/`.

---

## Authentication & Authorization Rules

The backend utilizes **JSON Web Tokens (JWT)** to secure endpoints and enforces **Role-Based Access Control (RBAC)** to restrict sensitive creation actions to administrative users.

### Security Layout by Endpoint:

| Endpoint | Method | Authentication | Role Authorization | Rate Limiting |
| :--- | :--- | :--- | :--- | :--- |
| `POST /users` | Public | None | Anyone | 5 requests / 15 mins |
| `POST /users/login` | Public | None | Anyone | 5 requests / 15 mins |
| `GET /users` | Protected | JWT Bearer Token | `student` or `admin` | None |
| `POST /notices` | Protected | JWT Bearer Token | `admin` only | 15 requests / min |
| `GET /notices` | Public | None | Anyone | None |
| `POST /events` | Protected | JWT Bearer Token | `admin` only | 15 requests / min |
| `GET /events` | Public | None | Anyone | None |

### Authorization Header Format:
Protected endpoints require passing the JWT token in the HTTP headers:
```http
Authorization: Bearer <your_jwt_token_here>
```

---

## Rate Limiting Rules
To defend write endpoints from brute-force authentication attacks and resource exhaustion floods, the server applies strict rate limiting policies per IP:

1. **Authentication Rate Limiting** (`authLimiter`):
   - **Applied to**: `POST /users` and `POST /users/login`.
   - **Limit**: Maximum `5` requests per `15 minutes`.
   - **Error Payload (429 Too Many Requests)**:
     ```json
     { "error": "Too many signup or login attempts from this IP. Please try again after 15 minutes." }
     ```
2. **Resource Creation Rate Limiting** (`writeLimiter`):
   - **Applied to**: `POST /notices` and `POST /events`.
   - **Limit**: Maximum `15` requests per `1 minute`.
   - **Error Payload (429 Too Many Requests)**:
     ```json
     { "error": "Too many resource creation requests. Please try again after 1 minute." }
     ```
*Note: Rate limiters are automatically bypassed in testing environments (`NODE_ENV=test`) to prevent unit testing pipelines from throttling.*

---

## Paginated Response Format
All GET list endpoints (`GET /users`, `GET /notices`, and `GET /events`) support **Limit/Offset Pagination** parameters:
* **Query Parameters**:
  * `limit` (optional): Maximum number of records to return. Default is `10`. Maximum allowed is `100`.
  * `offset` (optional): Number of records to skip. Default is `0`.

All paginated endpoints wrap list outputs in a standard JSON pagination envelope:
```json
{
  "count": 25,     // Total matching records in the database
  "limit": 10,     // Current query limit
  "offset": 0,     // Current query offset
  "results": [...] // Array containing the sliced query records
}
```

---

## API Documentation

### Global Errors Format
When a request fails, the API responds with a helpful JSON body containing a descriptive error field:
```json
{
  "error": "Detailed description of what went wrong"
}
```

---

### 1. Users & Authentication Endpoints

#### `POST /users` - Create a new user
Registers a new student or administrator profile and logs them in immediately by returning a signed JWT token.
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane.doe@campus.edu",
    "role": "student"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "7a944ba7-bb19-4cb5-8d5f-9e7b233a0491",
      "name": "Jane Doe",
      "email": "jane.doe@campus.edu",
      "role": "student",
      "createdAt": "2026-06-29T21:05:00.000Z"
    }
  }
  ```

#### `POST /users/login` - Authenticate user
Logs in an existing user via their unique email and returns a signed JWT token valid for 24 hours.
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "email": "jane.doe@campus.edu"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "7a944ba7-bb19-4cb5-8d5f-9e7b233a0491",
      "name": "Jane Doe",
      "email": "jane.doe@campus.edu",
      "role": "student"
    }
  }
  ```

#### `GET /users` - List all users (Paginated)
Retrieves a paginated list of all registered users (requires a valid JWT token).
* **Headers**: `Authorization: Bearer <token>`
* **Query Parameters** (Optional): `limit`, `offset`
* **Response (200 OK)**:
  ```json
  {
    "count": 1,
    "limit": 10,
    "offset": 0,
    "results": [
      {
        "id": "7a944ba7-bb19-4cb5-8d5f-9e7b233a0491",
        "name": "Jane Doe",
        "email": "jane.doe@campus.edu",
        "role": "student",
        "createdAt": "2026-06-29T21:05:00.000Z"
      }
    ]
  }
  ```

---

### 2. Notices Endpoints

#### `POST /notices` - Create a new notice (Admin Only)
Publishes a new notice bulletin (requires a valid JWT token belonging to an **admin** user).
* **Headers**: 
  * `Content-Type: application/json`
  * `Authorization: Bearer <admin_token>`
* **Request Body**:
  ```json
  {
    "title": "Mid-Term Exams Update",
    "content": "Detailed guidelines regarding exam dates and slots.",
    "category": "Academic",
    "postedBy": "7a944ba7-bb19-4cb5-8d5f-9e7b233a0491"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "id": "e2e9bb05-09bd-4919-86e5-3deab8e4e941",
    "title": "Mid-Term Exams Update",
    "content": "Detailed guidelines...",
    "category": "Academic",
    "postedBy": "7a944ba7-bb19-4cb5-8d5f-9e7b233a0491",
    "createdAt": "2026-06-29T21:10:00.000Z",
    "author": {
      "id": "7a944ba7-bb19-4cb5-8d5f-9e7b233a0491",
      "name": "Jane Doe",
      "email": "jane.doe@campus.edu",
      "role": "admin"
    }
  }
  ```

#### `GET /notices` - List all notices (Public & Paginated)
Retrieves a paginated list of notices (newest first) preloaded with nested author details.
* **Query Parameters** (Optional):
  * `limit`, `offset`
  * `category`: Filter notices by category name (e.g. `Academic`).
  * `postedBy`: Filter notices posted by a specific user UUID.
  * `keyword`: Case-insensitive search on title or content text (e.g. `Exam`).
* **Response (200 OK)**:
  ```json
  {
    "count": 1,
    "limit": 10,
    "offset": 0,
    "results": [
      {
        "id": "e2e9bb05-09bd-4919-86e5-3deab8e4e941",
        "title": "Mid-Term Exams Update",
        "content": "Detailed guidelines...",
        "category": "Academic",
        "postedBy": "7a944ba7-bb19-4cb5-8d5f-9e7b233a0491",
        "createdAt": "2026-06-29T21:10:00.000Z",
        "author": {
          "id": "7a944ba7-bb19-4cb5-8d5f-9e7b233a0491",
          "name": "Jane Doe",
          "email": "jane.doe@campus.edu",
          "role": "admin"
        }
      }
    ]
  }
  ```

---

### 3. Events Endpoints

#### `POST /events` - Create a new event (Admin Only)
Schedules a new campus workshop, game, or seminar (requires a valid JWT token belonging to an **admin** user).
* **Headers**: 
  * `Content-Type: application/json`
  * `Authorization: Bearer <admin_token>`
* **Request Body**:
  ```json
  {
    "title": "HackFest 2026",
    "description": "48-Hour Campus Hackathon",
    "category": "Workshop",
    "venue": "Innovation Lab",
    "startTime": "2026-07-03T18:00:00.000Z",
    "endTime": "2026-07-05T18:00:00.000Z",
    "organizer": "Computer Science Department"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "id": "c138d6df-4475-47e2-aa66-41e98bb4f29a",
    "title": "HackFest 2026",
    "description": "48-Hour Campus Hackathon",
    "category": "Workshop",
    "venue": "Innovation Lab",
    "startTime": "2026-07-03T18:00:00.000Z",
    "endTime": "2026-07-05T18:00:00.000Z",
    "organizer": "Computer Science Department",
    "createdAt": "2026-06-29T21:15:00.000Z"
  }
  ```

#### `GET /events` - List all events (Public & Paginated)
Retrieves a paginated list of scheduled events ordered chronologically by starting time.
* **Query Parameters** (Optional):
  * `limit`, `offset`
  * `category`: Filter events by category name (e.g. `Placement`).
  * `from`: Filter events starting on or after a specified ISO-8601 date string (e.g. `2026-07-01`).
  * `to`: Filter events starting on or before a specified ISO-8601 date string (e.g. `2026-07-15`).
  * `keyword`: Case-insensitive search on title, description, or venue (e.g. `ACM`).
* **Response (200 OK)**:
  ```json
  {
    "count": 1,
    "limit": 10,
    "offset": 0,
    "results": [
      {
        "id": "c138d6df-4475-47e2-aa66-41e98bb4f29a",
        "title": "HackFest 2026",
        "description": "48-Hour Campus Hackathon",
        "category": "Workshop",
        "venue": "Innovation Lab",
        "startTime": "2026-07-03T18:00:00.000Z",
        "endTime": "2026-07-05T18:00:00.000Z",
        "organizer": "Computer Science Department",
        "createdAt": "2026-06-29T21:15:00.000Z"
      }
    ]
  }
  ```
