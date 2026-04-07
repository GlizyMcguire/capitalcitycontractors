# Capital City Contractors

Public source for the live site at `https://capitalcitycontractors.ca`.

## Scope

- Static site pages and assets used by GitHub Pages
- Supporting backend source under `backend/` for the separate CRM and analytics service

## Security

- Secrets are not stored in this repository
- Public debug, setup, and internal-only tooling has been removed from the repository tree
- GitHub Pages deploys from `.github/workflows/deploy-pages.yml`

## Local preview

Serve the repository with a simple static server and open `index.html`.
