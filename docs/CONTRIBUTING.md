# Contributing to the Backend

Thanks for improving Digital Logics Studio. Backend contributions should protect user data, preserve API compatibility, and keep the service deployable on serverless infrastructure.

## Development Workflow

1. Create or select an issue for non-trivial work.
2. Branch from the latest default branch.
3. Install dependencies with `npm install`.
4. Configure `.env` from `.env.example`.
5. Run `npm run dev`.
6. Make a focused change with tests or a clear manual verification note.
7. Open a pull request with impact, risk, and verification details.

## Code Standards

- Keep routes thin. Put request logic in controllers.
- Validate inputs before mutating database state.
- Never return password hashes or raw JWT payloads.
- Keep error responses consistent: `{ success: false, message }`.
- Prefer idempotent progress operations where retrying is possible.
- Keep environment-specific behavior explicit in `server.js` or config modules.
- Do not add broad CORS origins without a security reason.

## API Compatibility

Changes are breaking when they:

- Rename or remove response fields used by the frontend.
- Change status codes for existing client flows.
- Change auth cookie behavior.
- Change progress snapshot shape.
- Require new environment variables without updating docs and `.env.example`.

Breaking changes require a migration plan and frontend coordination.

## Database Changes

For schema updates:

- Document old and new shapes in `DATABASE_SCHEMA.md`.
- Include migration steps for existing users.
- Preserve backward compatibility during at least one release when feasible.
- Add indexes intentionally and explain query patterns.

## Security Checklist

Before submitting:

- No secrets committed.
- No logs of passwords, tokens, cookies, or full connection strings.
- Auth endpoints do not reveal whether an email exists beyond intentional messages.
- Protected routes verify ownership through trusted server-side user state.
- New dependencies are necessary and maintained.

## Pull Request Template

Use this structure in PR descriptions:

```md
## Summary
- What changed?

## Why
- What problem does this solve?

## Verification
- Commands run
- Manual API/browser checks

## Risk
- Auth, database, deployment, or compatibility risks

## Docs
- Updated docs and `.env.example` if needed
```

## Review Expectations

Reviewers should check:

- Behavior and security first.
- Error handling and edge cases.
- API contract compatibility.
- Database consistency.
- Documentation updates for operational changes.

