# Campus Hub - Full-Stack Web Platform

Campus Hub is a unified portal for university notices and events. The project is organized as a monorepo consisting of a React-based frontend web dashboard, a secure Node.js/Express REST API backend service, and a PostgreSQL database.

---

## Architecture Overview

1. **Frontend Dashboard** (Root Directory):
   - A React web application built with **Vite** and styled using **Vanilla CSS**.
   - Features responsive layouts, bookmarks and RSVP handlers, light/dark modes with persistence, dynamic routing, and shimmer state loaders.
2. **Backend API Service** (`./backend`):
   - An Express REST API supporting CRUD models for Users, Notices, and Events.
   - Built with strict Sequelize model validations (email formats, unique checks, chronological date checks).
   - Fully secured with cryptographically signed JSON Web Tokens (JWT) and Role-Based Access Control (RBAC).
   - Supports limit/offset query pagination and database filters.
3. **Database Layer**:
   - Integrates with **PostgreSQL** in containerized/production environments.
   - Automatically falls back to a zero-config local **SQLite** database (`campus.db`) for lightweight local development.

---

## Run with Docker Compose (Recommended)

The easiest way to spin up the entire application stacks (Database, API, and Frontend) concurrently is using Docker Compose.

### Prerequisites
Make sure you have **Docker** and **Docker Compose** installed on your system.

### Steps to Run:

1. **Start the Multi-Container Service**:
   From the project root directory, execute:
   ```bash
   docker-compose up --build
   ```
   *This command builds the frontend Nginx container, the backend Node.js API container, boots the PostgreSQL container, synchronizes database schemas, and binds ports.*

2. **Access Endpoints**:
   - **Web Dashboard (React + Nginx)**: [http://localhost:8080/](http://localhost:8080/)
   - **REST API Backend (Express)**: [http://localhost:3000/](http://localhost:3000/)
   - **PostgreSQL Database**: `localhost:5432` (User/Password: `postgres` / `postgres`, DB: `campus`)

3. **Shutdown Services**:
   Press `Ctrl+C` to stop, then clear containers and volumes:
   ```bash
   docker-compose down -v
   ```

---

## Local Development (Without Docker)

If you prefer to run services individually without containers:

### 1. Run the Backend API Service
Navigate to the `backend` folder, install dependencies, and start the development server:
```bash
cd backend
npm install
npm run dev
```
*Note: Since no PostgreSQL environment variables are defined, the API will print a configuration message and automatically fall back to local SQLite (`campus.db`).*

### 2. Run the Frontend React Dashboard
From the root directory, install dependencies and start the Vite dev server:
```bash
npm install
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

---

## Testing API Endpoints
We have created an automated validation script testing signup, duplicate validations, date boundaries, JWT authorization restrictions, and pagination limits.

To run tests:
```bash
cd backend
# Ensure backend server is running in another shell
node ../.gemini/antigravity/brain/424c4410-17ec-450e-b839-bb0b9f4c8032/scratch/test_api.js
```
All detailed response configurations are documented in the [Backend API Guide](file:///c:/Users/param/Downloads/CAMPUS/backend/README.md).
