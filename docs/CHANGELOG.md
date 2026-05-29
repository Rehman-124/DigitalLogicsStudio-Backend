# Backend Changelog

This project follows a human-readable changelog format. Version numbers should align with `package.json` releases when formal releases are cut.

## Unreleased

### Added

- Professional backend documentation set under `docs/`.
- API, architecture, setup, deployment, database, auth, RBAC, folder structure, contributing, security, and conduct documentation.

### Documented

- Current Express/Mongoose architecture.
- Cookie-based JWT authentication lifecycle.
- User-embedded progress model.
- Vercel serverless deployment behavior.
- Known token helper path inconsistency to resolve before production hardening.

## 1.0.0

### Added

- Express API application.
- MongoDB connection through Mongoose.
- User registration, login, logout, and current-session endpoints.
- bcrypt password hashing.
- JWT session cookie support.
- User progress endpoints for problems, topics, activity, and snapshots.
- Swagger UI and OpenAPI JSON endpoints.
- CORS allowlist and production cross-origin cookie support.

