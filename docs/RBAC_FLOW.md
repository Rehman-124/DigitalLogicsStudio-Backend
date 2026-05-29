# Backend RBAC Flow

## Current Authorization Model

The backend currently has one authorization level:

- Public routes: health, root ping, register, login, logout.
- Authenticated routes: current user and all progress routes.

There is no persisted `role` field in the current `User` schema. Any admin, moderator, teacher, or content-management capability must add explicit RBAC support before release.

## Current Guard

Protected routes use:

```js
router.use(protect);
```

`protect` verifies the cookie JWT, loads the user, and attaches it to `req.user`. If the token is invalid or the user no longer exists, the request fails with `401`.

## Recommended Production RBAC Model

Add a role field:

```js
role: {
  type: String,
  enum: ["student", "instructor", "admin"],
  default: "student"
}
```

Suggested permissions:

| Permission | Student | Instructor | Admin |
| --- | --- | --- | --- |
| Read own profile | Yes | Yes | Yes |
| Update own progress | Yes | Yes | Yes |
| Read own progress | Yes | Yes | Yes |
| Create learning content | No | Yes | Yes |
| Update published content | No | Limited | Yes |
| View user analytics | No | Limited/cohort | Yes |
| Manage users | No | No | Yes |

## Middleware Pattern

```js
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action."
      });
    }
    next();
  };
}
```

Usage:

```js
router.post("/admin/content", protect, requireRole("admin"), createContent);
```

## Authorization Rules

- Authentication answers "who is this user?"
- Authorization answers "what may this user do?"
- User-controlled request fields must never decide role or ownership.
- Ownership checks should compare `req.user._id` with trusted database records.
- Admin routes should be isolated under a clear route prefix such as `/api/admin`.

## Audit and Compliance Notes

Before admin features launch:

- Add role changes to an audit log.
- Require strong passwords or SSO for elevated roles.
- Use least privilege for database users.
- Add integration tests for every protected route and forbidden role case.

