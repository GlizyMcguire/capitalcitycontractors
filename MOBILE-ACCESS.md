# Mobile CRM Access

The public website no longer contains a browser password shortcut for CRM access.

For mobile access, use one of these:
- A private authenticated CRM page behind the backend login flow
- The desktop app for admin work from a trusted computer
- A future mobile-specific admin app that does not expose secrets in frontend code

If you need mobile CRM access later, build it around backend authentication and short-lived tokens. Do not reintroduce hidden keyboard shortcuts or frontend passwords.
