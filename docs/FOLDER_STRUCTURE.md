# Backend Folder Structure

```text
backend/
|-- docs/
|-- node_modules/
|-- src/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   |-- app.js
|   `-- token.js
|-- .env.example
|-- package.json
|-- package-lock.json
|-- server.js
`-- vercel.json
```

## Root Files

### `server.js`

Process entrypoint. It loads environment variables, validates required configuration, connects to MongoDB in development, and exports a Vercel serverless handler in production.

### `package.json`

Defines scripts and dependencies:

- `npm run dev`: starts `nodemon server.js`.
- `npm start`: starts `node server.js`.

### `.env.example`

Tracks required configuration names without committing secrets.

### `vercel.json`

Deployment configuration for Vercel.

## `src/app.js`

Express application composition:

- Body parsing with `10kb` limits.
- Cookie parsing.
- Compression.
- CORS allowlist.
- Security headers.
- Swagger docs.
- API route mounting.
- 404 and centralized error handling.

## `src/config`

### `db.js`

Connects Mongoose to `MONGO_URI`. It throws early if the URI is missing.

### `swagger.js`

Defines OpenAPI metadata, servers, shared schemas, and route annotation discovery.

## `src/controllers`

Controllers own request validation and domain orchestration.

### `authController.js`

Handles registration, login, logout, and current-user response sanitization.

### `progressController.js`

Handles problem attempts, solve/unsolve actions, topic open events, subtopic toggles, and snapshot hydration.

## `src/middleware`

### `authMiddleware.js`

Verifies cookie JWTs and attaches the current user to `req.user`.

### `errorMiddleware.js`

Normalizes 404 and thrown errors into JSON responses.

## `src/models`

### `User.js`

Defines the main user schema, embedded progress sub-schemas, password hashing, password matching, and progress helper methods.

## `src/routes`

Routes map HTTP paths to controllers.

### `authRoutes.js`

Defines auth endpoints and route-level Swagger annotations.

### `healthRoutes.js`

Defines `GET /api/health`.

### `progressRoutes.js`

Applies `protect` to all progress routes, then maps progress actions.

## `src/utils`

Reserved for shared backend utilities. The current token helper should be moved here or its import path should be updated for consistency.

