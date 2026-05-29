# Digital Logics Studio Backend Documentation

This directory documents the backend service for Digital Logics Studio, a Node.js, Express, MongoDB, and Mongoose API that powers authentication, session restoration, and learning progress persistence for the Boolforge frontend.

The backend is intentionally small, but it follows production service boundaries: app composition lives in `src/app.js`, process startup lives in `server.js`, persistence is isolated behind Mongoose models, and route handlers are split by domain.

## Documentation Map

| Document | Purpose |
| --- | --- |
| `SETUP_GUIDE.md` | Local development prerequisites, environment variables, install, and run workflow. |
| `DEPLOYMENT_GUIDE.md` | Vercel/serverless deployment notes, environment configuration, CORS, and release checks. |
| `ARCHITECTURE.md` | Runtime architecture, request lifecycle, module responsibilities, and engineering decisions. |
| `API_DOCUMENTATION.md` | REST endpoints, request/response examples, status codes, and cookie behavior. |
| `DATABASE_SCHEMA.md` | Current MongoDB/Mongoose schema, embedded progress documents, indexes, and data practices. |
| `AUTH_FLOW.md` | Registration, login, logout, session verification, JWT cookies, and frontend integration. |
| `RBAC_FLOW.md` | Current authorization model and production-ready RBAC extension plan. |
| `FOLDER_STRUCTURE.md` | Directory-by-directory explanation of the backend codebase. |
| `CONTRIBUTING.md` | Contribution workflow, coding standards, testing expectations, and PR checklist. |
| `SECURITY.md` | Supported reporting process, secret handling, API hardening, and vulnerability response. |
| `CODE_OF_CONDUCT.md` | Community conduct expectations for maintainers and contributors. |
| `CHANGELOG.md` | Human-readable backend release history. |

## Service Summary

- Runtime: Node.js with CommonJS modules.
- Framework: Express 4.
- Database: MongoDB through Mongoose.
- Authentication: JWT signed with `JWT_SECRET`, stored in an httpOnly cookie named `token`.
- Password storage: bcrypt hashes via Mongoose pre-save hook.
- API documentation: Swagger UI at `/api/docs` and OpenAPI JSON at `/api/docs.json`.
- Deployment target: Vercel serverless function export in production, normal `app.listen` in local development.

## Current Public API Surface

- `GET /`
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/progress`
- `GET /api/progress/snapshot`
- `POST /api/progress/problems/:problemId/attempt`
- `POST /api/progress/problems/:problemId/complete`
- `POST /api/progress/problems/:problemId/uncomplete`
- `POST /api/progress/topics/:topicId/open`
- `POST /api/progress/topics/:topicId/subtopics/:subtopicId`

## Important Implementation Note

The token helper is expected by `src/controllers/authController.js` at `../utils/token`. In the current tree, the token helper file is present as `src/token.js`. Before a production release, align the helper location or import path so authentication startup cannot fail due to module resolution.

