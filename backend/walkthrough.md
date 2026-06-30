# Walkthrough - Campus Hub Frontend & Backend Platform

We have successfully built and verified both the **React Frontend Dashboard** and the **Node.js/Express REST API Backend** for the Campus Hub platform.

---

## 1. Frontend Dashboard (React + Vite)
The student-facing web dashboard is fully operational with modern layout, responsive design, and local storage state persistence.

### Live API Integration:
- **REST Connection**: Configured [DashboardContext.jsx](file:///c:/Users/param/Downloads/CAMPUS/src/context/DashboardContext.jsx#L65-L101) to fetch live data from `GET http://localhost:3000/notices` and `GET http://localhost:3000/events` instead of relying on mock javascript files.
- **Envelope Parsing**: Decodes list results directly from the backend's limit/offset pagination wrappers (`results` array mapping).
- **Data Object Resiliency**: Added robust fallbacks for all components ([DetailPage.jsx](file:///c:/Users/param/Downloads/CAMPUS/src/pages/DetailPage.jsx#L133), [NoticeCard.jsx](file:///c:/Users/param/Downloads/CAMPUS/src/components/NoticeCard.jsx#L46), [EventCard.jsx](file:///c:/Users/param/Downloads/CAMPUS/src/components/EventCard.jsx#L55)) to check for nested attributes (e.g. `postedBy` user objects, string splits, start date sub-strings, and empty tags) returning clean defaults rather than crashing the React DOM.
- **Simulation Control Compliance**: Maintained mock network delay (1.2s shimmer loading screens) and simulated network failure states in the debug panel so developers can continue validation in testing modes.

### Features Built:
- **Responsive Layout**: Designed [Sidebar.jsx](file:///c:/Users/param/Downloads/CAMPUS/src/components/Sidebar.jsx) which transitions from a static left sidebar on desktop viewports to a sticky bottom navigation bar on mobile viewports.
- **Client Routing**: Configured [App.jsx](file:///c:/Users/param/Downloads/CAMPUS/src/App.jsx) with client routing parameters supporting `/`, `/notices`, `/notices/:id`, `/events`, `/events/:id`, and `/saved`.
- **Search & Filters**: Integrated simultaneous keyword search and category filters on both the notices and events pages.
- **Feeds Pagination**: Implemented client-side pagination displaying 4 items per page on both feeds, with state resets to page `1` when filters update.
- **Bookmarks & RSVPs**: Context syncs bookmark saves and RSVP event counters to `localStorage`.
- **Light/Dark Mode Toggles**: Persistent theme transitions with optimized mobile spacing.

---

## 2. Backend REST API (Node.js + Express)
The backend service powers the campus platform. It connects to PostgreSQL by default but falls back to SQLite automatically if PostgreSQL credentials are not provided.

### Models Configured:
- **User**: UUID identifier, name, email (unique, format-checked), role (`student` or `admin`), and creation timestamps.
- **Notice**: UUID, title, content text, category, postedBy (foreign key referencing User), and creation date.
- **Event**: UUID, title, description, category, venue, startTime, endTime, organizer, and creation date.

### Endpoints Implemented:
- `POST /users` / `GET /users` (requires valid JWT token; returns paginated data)
- `POST /users/login` (email lookup authentication; returns JWT token)
- `POST /notices` / `GET /notices` (POST requires admin JWT token; GET returns paginated data)
- `POST /events` / `GET /events` (POST requires admin JWT token; GET returns paginated data)

### JWT Authentication, Roles & Pagination:
1. **JWT Authentication**: Implemented JWT authorization middleware [auth.js](file:///c:/Users/param/Downloads/CAMPUS/backend/middleware/auth.js). Secure endpoints require passing `Authorization: Bearer <token>` in request headers.
2. **Role Authorization (RBAC)**: Protects event and notice creations. If a student attempts to POST to `/events` or `/notices`, the system intercepts the request and rejects it with `403 Forbidden` and an explicit error message.
3. **Limit / Offset Pagination**: All GET endpoints support `limit` and `offset` query parameters, wrapping rows in a JSON envelope (`count`, `limit`, `offset`, and `results`) for seamless client-side consumption.
4. **Client Rate Limiting**: Added `express-rate-limit` middleware inside [rateLimiter.js](file:///c:/Users/param/Downloads/CAMPUS/backend/middleware/rateLimiter.js):
   - *Auth Limiter*: Restricts logins/signups to `5` requests per `15 minutes` per IP.
   - *Write Limiter*: Restricts notice/event creations to `15` requests per `1 minute` per IP.
   - *Testing Bypass*: Rate limits are automatically deactivated during unit tests (`NODE_ENV=test`) to ensure testing pipelines execute without throttling blocks.

---

## 3. Dockerization & Compose Setup

We have dockerized the entire project stack, enabling developers to spin up the database, API server, and Nginx-served static files concurrently with one command.

### Components Created:
- **Backend API Dockerfile** ([backend/Dockerfile](file:///c:/Users/param/Downloads/CAMPUS/backend/Dockerfile)): Utilizes a lightweight `node:20-alpine` image to package dependencies, set environment variables, and run the Express REST API.
- **Frontend Nginx Dockerfile** ([Dockerfile](file:///c:/Users/param/Downloads/CAMPUS/Dockerfile)): Employs a multi-stage Docker build:
  - *Stage 1 (Builder)*: Installs frontend dependencies and compiles the Vite React production bundle into static assets.
  - *Stage 2 (Server)*: Provisions an `nginx:1.25-alpine` web server, copies client assets, and binds client routes.
- **Nginx Fallback Config** ([nginx.conf](file:///c:/Users/param/Downloads/CAMPUS/nginx.conf)): Handles client-side HTML5 route fallbacks (redirecting wildcard routes to `index.html`).
- **Orchestration** ([docker-compose.yml](file:///c:/Users/param/Downloads/CAMPUS/docker-compose.yml)):
  - Defines the `db` service (official `postgres:15-alpine` image).
  - Defines the `api` service (builds from `backend/` and connects to `db`).
  - Defines the `frontend` service (builds from root and exposes port `8080`).
- **Database Startup Resiliency**: Modified [app.js](file:///c:/Users/param/Downloads/CAMPUS/backend/app.js#L41-L67) to implement a recursive connection retry mechanism (`syncWithRetries`) that prevents container crashes when the Express server starts before PostgreSQL has completed booting.

---

## 4. Unit Testing

We have built a comprehensive unit test suite inside [api.test.js](file:///c:/Users/param/Downloads/CAMPUS/backend/tests/api.test.js) utilizing Node.js's native test runner (`node:test`) and the `supertest` HTTP assertion library.

### Testing Setup:
- **Isolated Memory Database**: Configured [database.js](file:///c:/Users/param/Downloads/CAMPUS/backend/config/database.js#L5-L12) to automatically spin up a memory-only SQLite instance (`:memory:`) when `NODE_ENV=test` is active. This avoids file trash or schema pollution on developers' machines during test runs.
- **Dynamic Dialect Queries**: Adjusted routes keyword queries dynamically (utilizing `Op.like` for SQLite tests and `Op.iLike` for PostgreSQL production instances) to keep searches cross-compatible.

### Run Unit Tests:
Navigate to the `backend` folder and run:
```bash
npm test
```

### Test Suite Execution Output:
```
> campus-api@1.0.0 test
> cross-env NODE_ENV=test node --test tests/api.test.js

▶ Campus Hub API Unit Tests
  ▶ User Registration & Authentication (POST /users)
    ✔ Should reject registration if required fields are missing (25.5006ms)
    ✔ Should reject registration with invalid email format (7.5208ms)
    ✔ Should successfully register a new student user and return a JWT token (8.5321ms)
    ✔ Should reject duplicate email registrations (5.7617ms)
    ✔ Should successfully register an admin user (4.5481ms)
  ✔ User Registration & Authentication (POST /users) (52.5177ms)
  ▶ User Login (POST /users/login)
    ✔ Should fail login for unregistered email (6.7573ms)
    ✔ Should login registered user and return JWT (4.4328ms)
  ✔ User Login (POST /users/login) (11.45ms)
  ▶ Event Creation Constraints (POST /events)
    ✔ Should reject event creation if no authorization token is supplied (4.1852ms)
    ✔ Should reject event creation if user is a student (4.0949ms)
    ✔ Should reject event creation with invalid chronological date order (4.0062ms)
    ✔ Should successfully create event when requests are valid and user is admin (5.5159ms)
  ✔ Event Creation Constraints (POST /events) (18.0907ms)
  ▶ Notice Creation Constraints (POST /notices)
    ✔ Should reject notice if postedBy UUID does not exist (4.2037ms)
    ✔ Should reject notice if user role is student (3.4453ms)
    ✔ Should successfully create notice when poster exists and user is admin (8.3638ms)
  ✔ Notice Creation Constraints (POST /notices) (16.2501ms)
  ▶ Get Lists with Pagination & Filters (GET /notices & GET /events)
    ✔ Should return paginated notice list (9.5989ms)
    ✔ Should filter notices by category (4.5809ms)
    ✔ Should search events by keyword (6.4301ms)
  ✔ Get Lists with Pagination & Filters (GET /notices & GET /events) (20.7975ms)
  ...
```
