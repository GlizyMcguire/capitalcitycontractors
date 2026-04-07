# Backend Setup

Use this backend only with environment-managed secrets.

Setup:
1. `cd backend`
2. `copy .env.example .env`
3. Set strong values for:
   - `JWT_SECRET`
   - `VISIT_IP_HASH_SALT`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
4. `npm install`
5. `npm run init-db`
6. `npm start`

Expected init output:
- `Initializing CRM database...`
- `Database tables ready.`
- `Bootstrap admin user created for "<your-admin-username>".`

If `ADMIN_PASSWORD` is weak or missing, no bootstrap admin is created.
