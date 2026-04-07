# CRM Setup Guide

This repo no longer supports public-site CRM access from `index.html`.

Secure setup:
1. Copy `backend/.env.example` to `backend/.env`.
2. Set strong values for `JWT_SECRET`, `VISIT_IP_HASH_SALT`, and `ADMIN_PASSWORD`.
3. Set `ADMIN_USERNAME` to the login you want to use.
4. Run `cd backend && npm install`.
5. Run `npm run init-db`.
6. Run `npm start`.

Notes:
- `npm run init-db` only creates a bootstrap admin if `ADMIN_PASSWORD` is strong.
- Analytics endpoints now require authentication.
- Never put admin credentials in frontend files or public docs.
