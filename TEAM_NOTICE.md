**Heads up team — `main` updated**

I just merged `bugfix/diran/cleanup-merge-artifacts` directly into `main` (commit `713557b`). It's a large change (~100 files) that touches multiple modules:

- **Auth** (@Amer) — schema, routes
- **Clearance** (@Naimah) — controllers, lib
- **Payment** (@Asraf) — multer upload, payment routes
- **Notifications** (@Ed) — email service, templates
- **Admin/Reports/Requirements** (@Affhan) — controllers, migrations, seed
- **Student frontend** (@Norman) — dashboard, clearance, payment, notifications
- **Admin frontend** (@Shaheel) — officer dashboards, manage fines, reports

Please `git pull origin main` and review your module. Flag any regressions and we'll patch forward.

Sorry for skipping the PR — happy to do retro reviews per module if anyone wants.
