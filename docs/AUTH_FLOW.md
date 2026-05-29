# Backend Authentication Flow

The backend uses cookie-based JWT sessions. The browser stores the token as an httpOnly cookie, while the frontend only stores sanitized user state in React context.

## Registration Flow

1. Frontend submits `name`, `email`, and `password` to `POST /api/auth/register`.
2. Controller validates required fields, name length, email format, and password length.
3. Email is trimmed and lowercased.
4. Backend checks for an existing user with the same email.
5. Mongoose creates the user.
6. `pre("save")` hashes the password with bcrypt.
7. Backend signs a JWT containing `{ userId }`.
8. Backend sets the `token` cookie.
9. Backend returns sanitized user data.

## Login Flow

1. Frontend submits `email` and `password` to `POST /api/auth/login`.
2. Backend lowercases the email and fetches the user with `select("+password")`.
3. `matchPassword` compares the submitted password with the bcrypt hash.
4. Backend signs a JWT and sets the auth cookie.
5. Backend returns sanitized user data.

## Session Restore Flow

1. Frontend calls `GET /api/auth/me` on app boot.
2. Browser sends the `token` cookie if CORS and cookie settings allow credentials.
3. `protect` verifies the JWT with `JWT_SECRET`.
4. Backend loads the user by `decoded.userId` and excludes `password`.
5. Backend attaches the user document to `req.user`.
6. Controller returns sanitized user data.

## Logout Flow

1. Frontend calls `POST /api/auth/logout`.
2. Backend clears the `token` cookie using matching cookie options.
3. Frontend clears in-memory auth state.

## Cookie Settings

Development:

```js
{
  httpOnly: true,
  secure: false,
  sameSite: "lax"
}
```

Production:

```js
{
  httpOnly: true,
  secure: true,
  sameSite: "none"
}
```

Production uses `sameSite: "none"` because the frontend and backend may be deployed on different domains.

## Security Properties

- JavaScript cannot read the token because the cookie is httpOnly.
- HTTPS is required for production cookie delivery.
- The backend never returns password hashes.
- Invalid, missing, expired, or orphaned tokens return `401`.

## Operational Requirements

- `JWT_SECRET` must be long, random, and unique per environment.
- Rotating `JWT_SECRET` invalidates all active sessions.
- Frontend requests must use `withCredentials: true`.
- Backend CORS must allow the exact frontend origin.

## Known Improvement Areas

- Add login rate limiting.
- Add account lockout or progressive delay after repeated failures.
- Add email verification before enabling sensitive actions.
- Add password reset with signed short-lived tokens.
- Add CSRF protection if adding state-changing cookie-authenticated browser forms outside the current JSON API pattern.

