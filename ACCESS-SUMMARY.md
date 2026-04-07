# CRM Access Summary

The old browser password shortcut was removed from the public site.

Use one of these access paths instead:
- Backend-authenticated CRM
- Desktop app
- Local private admin tooling

Required credentials now live in `backend/.env`:
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `JWT_SECRET`
- `VISIT_IP_HASH_SALT`

Rules:
- Do not store passwords in `index.html` or any frontend file.
- Do not commit real secrets to git.
- Rotate any credential that was ever committed before this cleanup.
