# Backend Architecture

## Purpose

The backend provides the persistent service layer for Digital Logics Studio:

- Account registration and login.
- httpOnly cookie-based JWT sessions.
- Current-user lookup for session restoration.
- User-specific problem and topic progress.
- Daily activity rollups and recent activity events.
- Swagger/OpenAPI documentation.

## Runtime Composition

```text
server.js
  loads environment
  validates required secrets
  connects to MongoDB locally
  exports Vercel handler in production

src/app.js
  creates Express app
  configures body parsing, cookies, compression, CORS, headers
  mounts Swagger
  mounts domain routes
  mounts 404 and error middleware
```

This split keeps process concerns out of the app definition. It also makes the Express app reusable for tests and serverless handlers.

## Request Lifecycle

1. Request reaches Express.
2. JSON and URL-encoded body parsers apply a `10kb` limit.
3. `cookie-parser` exposes `req.cookies`.
4. Compression is enabled.
5. Security headers set crawler and referrer behavior.
6. CORS validates the request origin against static and environment-provided origins.
7. Route handler validates input and calls the domain controller.
8. Protected routes call `protect`, verify the cookie JWT, and attach `req.user`.
9. Controller mutates Mongoose documents and returns JSON.
10. `notFound` and `errorHandler` normalize error responses.

## Domain Boundaries

| Layer | Location | Responsibility |
| --- | --- | --- |
| Config | `src/config` | Database connection and Swagger definition. |
| Routes | `src/routes` | HTTP paths, middleware ordering, Swagger annotations. |
| Controllers | `src/controllers` | Request validation, domain orchestration, response shape. |
| Middleware | `src/middleware` | Auth guard and centralized error handling. |
| Models | `src/models` | Mongoose schemas, validation, document helpers, password hashing. |
| Token helper | `src/token.js` currently | JWT generation and cookie options. |

## Authentication Architecture

The API uses state-light sessions:

- Login/register returns sanitized user data and sets a signed JWT cookie.
- The cookie is `httpOnly`, preventing JavaScript reads.
- Protected requests send the cookie automatically when the frontend uses `withCredentials: true`.
- The backend verifies `JWT_SECRET`, finds the user by `decoded.userId`, excludes the password, and attaches the user document to `req.user`.

## Progress Architecture

Progress is currently user-embedded:

- `solvedProblems` keeps backward-compatible numeric problem IDs.
- `problemProgress` stores attempts, status, timestamps, title, tags, and topic association.
- `topicProgress` stores topic completion percentage and completed subtopics.
- `activityLog` stores daily counters keyed by `YYYY-MM-DD`.
- `recentEvents` stores the newest activity feed entries with a cap of 30.

This design is efficient for the current product size because profile hydration needs one user document. For larger scale, move progress and events into separate collections with compound indexes.

## Engineering Decisions

- **httpOnly cookies over localStorage tokens:** reduces token exposure from XSS.
- **CORS allowlist:** avoids reflecting arbitrary origins while supporting known preview and production domains.
- **Mongoose document helpers:** keeps progress initialization close to schema definitions.
- **Embedded activity rollups:** simplifies dashboard reads.
- **Swagger annotations near routes:** keeps API docs close to HTTP behavior.
- **Serverless-aware preflight handling:** keeps cross-origin browser requests from timing out before DB connection.

## Known Technical Debt

- Token helper import path should be normalized before production hardening.
- Add request rate limiting for auth endpoints.
- Add automated tests for auth, progress idempotency, and CORS behavior.
- Add role field and authorization middleware before admin features ship.
- Add structured logs and request IDs for incident response.

