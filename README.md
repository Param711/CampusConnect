# Campus Hub - Full-Stack Web Platform (Submission)

Welcome to **Campus Hub**, a university portal for student notices and events. This repository is a full-stack submission for the **Developers' Society Sophomore Selections**. 

It contains a fully integrated **React Frontend Dashboard (Task 1)**, a secure **Node.js/Express REST API Backend (Task 3)**, and a **PostgreSQL Database** running live on cloud infrastructure.

- **Live Production URL**: [https://campus-connect-smoky-sigma.vercel.app/](https://campus-connect-smoky-sigma.vercel.app/)
- **Live REST API Endpoint**: `https://campus-connect-smoky-sigma.vercel.app/api`

---

## 🚀 Attempted Tasks & Checklist

### Task 1: Web Development — Campus Dashboard
- [x] **Notice Feed**: Lists notices with title, category, and posted date.
- [x] **Event Feed**: Lists events with title, venue, and date.
- [x] **Detail View**: Dedicated screens to view full notice/event content.
- [x] **Search & Filters**: Simultaneously search keywords and filter categories on both feeds.
- [x] **Responsive Layout**: Designed sidebar which collapses into a sticky bottom-nav on mobile.
- [x] **State Handlers**: Graceful shimmer loading skeletons and retry boundaries on error states.
- [x] **Bonus — Joint Filters**: Search query and category pills work concurrently.
- [x] **Bonus — URL Routing**: Dynamic client-side paths (`/notices/:id` & `/events/:id`) using React Router.
- [x] **Bonus — Persistent Dark Mode**: Smooth HSL dark mode with instant toggles, saved across user sessions.
- [x] **Bonus — Feed Pagination**: Clean client-side limit/offset pagination with filter state resets.
- [x] **Bonus — Cloud Deployment**: Deployed on Vercel with automatic CI/CD integrations.
- [x] **Extra Feature — Bookmarks & RSVPs**: Save notices and RSVP to events, syncing to `localStorage`.

### Task 3: Backend Development — REST API
- [x] **DB Entities**: Structured Sequelize models for `User`, `Notice`, and `Event` with relationships.
- [x] **REST Endpoints**: CRUD operations for users, notices, and events.
- [x] **Validation Rules**: Format-checks email input, enforces email uniqueness, and validates chronological start/end dates.
- [x] **Verbose Error Payloads**: Informative success/error bodies indicating missing parameters.
- [x] **Bonus — Query Filtering**: Filters `GET /events` and `GET /notices` by categories, date ranges, or search keywords.
- [x] **Bonus — JWT & RBAC**: Registers/authenticates users, issuing JWT tokens. Creation routes restricted to `admin` role.
- [x] **Bonus — Limit/Offset Pagination**: Returns count-metadata envelopes on listings.
- [x] **Bonus — Dockerization**: Orchestrates PostgreSQL db, Express API, and React frontend services.
- [x] **Bonus — Unit Tests**: Wrote 17 automated tests covering endpoint payloads and security constraints.
- [x] **Bonus — Rate Limiting**: Added `express-rate-limit` protecting logins (5 reqs/15m) and creation write endpoints (15 reqs/1m).

### Integration Challenges (Bonus Credit)
- [x] **Live Fetching**: React frontend fetches and displays live data from the backend instead of static mock files.
- [x] **CORS Resolution**: Configured Express CORS middleware to support client requests.
- [x] **Full-Stack Deployment**: Live Vercel SPA frontend connecting to Vercel Serverless API functions, communicating with a managed cloud **Supabase** PostgreSQL database.

---

## 🛠️ Local Development & Setup

### Option A: Run via Docker Compose (Recommended)
This spins up the Database, Backend, and Frontend Nginx server concurrently.
```bash
# Build and run containers
docker-compose up --build
```
- **Web Dashboard**: [http://localhost:8080](http://localhost:8080)
- **REST API**: [http://localhost:3000](http://localhost:3000)

---

### Option B: Run Locally (Without Docker)
1. **Database Setup**: Get a PostgreSQL connection URI (or skip, and the backend will automatically fall back to a local SQLite file `campus.db`).
2. **Backend Configuration**:
   - Navigate to `backend` and copy/create `.env` using our template:
     ```bash
     cd backend
     npm install
     ```
   - Update `backend/.env` with your variables (e.g., `DATABASE_URL`, `JWT_SECRET`, `DB_SSL=true`).
   - Run the development server:
     ```bash
     npm run dev
     ```
3. **Frontend Dashboard**:
   - From the root folder:
     ```bash
     npm install
     ```
   - Run the development server:
     ```bash
     npm run dev
     ```
   - Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Running Unit Tests
We have built a comprehensive unit test suite utilizing Node.js's native test runner (`node:test`) and `supertest`. 

To run tests locally under an isolated memory database:
```bash
cd backend
npm test
```

---

## 💡 Quick API Reference (Creating Notices & Events)

To publish notices or events to your live dashboard, you need to authenticate as an `admin`. Follow this flow using any API testing tool (like Postman or curl):

### 1. Register an Admin User
Send a `POST` request to `https://<your-app-domain>.vercel.app/api/users` with the payload:
```json
{
  "name": "Dean Admin",
  "email": "dean@campus.edu",
  "role": "admin"
}
```
*Response returns your user `id` (UUID) and a security `token`.*

### 2. Create a Notice (Academic / Placement / Sports, etc.)
Send a `POST` to `/api/notices` with the header `Authorization: Bearer <your-admin-token>` and payload:
```json
{
  "title": "Semester Exams Postponed",
  "content": "The midterm examinations have been rescheduled to next Monday due to bad weather.",
  "category": "Academic",
  "postedBy": "<your-admin-uuid>"
}
```

### 3. Create an Event (Workshop / Cultural / Sports, etc.)
Send a `POST` to `/api/events` with the header `Authorization: Bearer <your-admin-token>` and payload:
```json
{
  "title": "Hackathon 2026",
  "description": "24-hour campus coding challenge with cash prizes.",
  "category": "Workshop",
  "venue": "Campus Seminar Hall A",
  "startTime": "2026-07-15T09:00:00Z",
  "endTime": "2026-07-16T09:00:00Z",
  "organizer": "Developers' Society"
}
```

---

## 🧠 Challenges Faced & Solutions

### 1. Database Startup Race Conditions in Docker
* **Challenge**: During Docker Compose startup, the Node API service would boot faster than the PostgreSQL database container could finish initializing, causing connection drops and backend container crashes.
* **Solution**: Implemented a recursive connection retry helper (`syncWithRetries`) in [app.js](file:///c:/Users/param/Downloads/CAMPUS/backend/app.js#L41-L67). It attempts to connect 5 times with a 3-second delay, ensuring connection resiliency.

### 2. SQL Query Dialect Incompatibility
* **Challenge**: SQLite does not support case-insensitive searches (`ILIKE`) out of the box, throwing SQL syntax errors during unit tests (which run in-memory SQLite) compared to production PostgreSQL (which requires `ILIKE`).
* **Solution**: Implemented a runtime check on the active dialect (`sequelize.options.dialect`) inside notices and events routers. It dynamically selects `Op.like` for SQLite tests and `Op.iLike` for production PostgreSQL.

### 3. Vercel Serverless Function Driver Bundling
* **Challenge**: Vercel compiles Node.js endpoints as serverless functions. Because Sequelize loads database drivers dynamically at runtime (e.g. `require('pg')`), Vercel's static bundler missed the dependency, leading to `Error: Please install pg package manually` at runtime.
* **Solution**: Added explicit static imports of `pg` and `pg-hstore` inside the serverless entrypoint [api/index.js](file:///c:/Users/param/Downloads/CAMPUS/api/index.js). This forces Vercel to package the database drivers in the deployment bundle.

### 4. Flex Layout Card Squishing
* **Challenge**: On ultra-wide monitors, the main dashboard column squished into a narrow column while leaving the right side black, caused by Flexbox shrink calculations on elements with `width: 100%` and `margin-left` offsets.
* **Solution**: Removed `display: flex` from `.app-container` and set the desktop main content width to `width: calc(100% - 260px)` in [index.css](file:///c:/Users/param/Downloads/CAMPUS/src/index.css#L101-L109), allowing the browser to natively expand and center elements.
