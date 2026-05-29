# Backend Security Policy

## Supported Scope

Security issues in scope:

- Authentication or authorization bypass.
- Exposure of JWTs, cookies, passwords, or MongoDB credentials.
- Cross-origin cookie misconfiguration.
- Insecure password handling.
- Injection or unsafe query construction.
- Sensitive data returned in API responses.
- Dependency vulnerabilities that affect runtime behavior.

## Reporting a Vulnerability

Please do not open a public issue for sensitive security reports. Contact the maintainers privately through the repository security advisory workflow or the project owner contact listed in the organization profile.

Include:

- Affected endpoint or file.
- Reproduction steps.
- Impact assessment.
- Suggested fix, if known.
- Whether the vulnerability is actively exploitable.

## Expected Response

- Acknowledgement: within 3 business days.
- Initial triage: within 7 business days.
- Fix target: based on severity and exploitability.
- Disclosure: coordinated after patch and deployment.

## Secret Management

- `.env` files must never be committed.
- `JWT_SECRET` must be unique per environment.
- MongoDB credentials must use least privilege.
- Rotate secrets after accidental exposure.
- Do not paste production secrets into logs, screenshots, tickets, or PR comments.

## Authentication Hardening

Current protections:

- Passwords hashed with bcrypt.
- JWT stored in an httpOnly cookie.
- Production cookies use `secure` and `sameSite: "none"` for cross-origin HTTPS.
- Protected routes verify the user still exists.

Recommended additions before broad public launch:

- Rate limiting for register/login.
- Password reset flow with short-lived single-use tokens.
- Email verification.
- CSRF protection strategy for cookie-authenticated state-changing requests.
- Session revocation or token versioning.

## API Hardening

- Keep JSON body limits low unless a route requires larger payloads.
- Validate all route params and body fields.
- Avoid reflecting raw errors in production.
- Keep Swagger public only if the API surface is intentionally discoverable.
- Add structured logs without sensitive values.

## Dependency Security

Run dependency audits before releases:

```bash
npm audit
```

Do not blindly upgrade major versions in a security PR unless required. Keep security fixes focused and easy to review.

