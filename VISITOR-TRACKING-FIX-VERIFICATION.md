# Visitor Tracking Verification

Use this after deploying the hardened backend:

1. Start the backend with a real `backend/.env`.
2. Confirm `GET /api/health` returns `{"status":"ok"}`.
3. Open the public site and generate a normal page view.
4. Confirm `POST /api/visits/track` succeeds.
5. Sign in through the authenticated CRM.
6. Confirm `GET /api/analytics/summary` works only when authenticated.

Security notes:
- The public site can submit visit events, but analytics reads require auth.
- Stored visit IPs are hashed on the backend.
- Rate limits apply to login, API, and visit tracking.
