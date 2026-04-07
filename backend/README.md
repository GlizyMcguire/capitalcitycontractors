# Capital City Contractors CRM Backend

This service provides the authenticated CRM API and visitor analytics backend.

## Setup

1. `copy .env.example .env`
2. Set strong values for `JWT_SECRET`, `VISIT_IP_HASH_SALT`, and `ADMIN_PASSWORD`
3. Set `ADMIN_USERNAME`
4. `npm install`
5. `npm run init-db`
6. `npm start`

## Security model

- No default admin password is seeded.
- Auth uses JWT with issuer and audience checks.
- Analytics reads require authentication.
- Visit IPs are hashed before storage.
- Rate limits protect login, API, and visit tracking routes.

## Authentication

`POST /api/auth/login`

Example body:

```json
{
  "username": "replace-with-your-admin-username",
  "password": "replace-with-your-admin-password"
}
```
