# Novel Server

NestJS API service for the multi-user online novel reading web app.

Default API prefix: `/api`. The root path `/` serves the built-in single-page web client.

## Scope

The service exposes the full product API surface:

- **auth**: register, login, reset password, logout, heartbeat (session keep-alive), avatar upload, current user
- **admin**: list users, enable / disable users, reset a user's password to the initial password, delete a user
- **sources / novels**: authenticated source list, search, novel detail, chapter list, chapter content (fetched from `quanben.io` and cached)
- **bookshelf**: list, add from search, manual add, edit, cover upload, long-press actions in the web client, delete
- **reading progress**: read / save per-novel progress
- **preferences**: read / save bookshelf, bottom-nav and reader theme preferences
- **web**: built-in SPA with dark glass login/menu/bookstore/admin views and immersive reader mode

## Storage

Storage is selected at runtime via `STORE_DRIVER`:

- unset → `InMemoryStore` (development / demo fallback)
- `mysql` → `MysqlStore` (creates missing tables and a default admin on startup)

**Production (Tencent Cloud) runs with `STORE_DRIVER=mysql`.** See `.env.example` for the required `DB_*` variables. Deployment details (nginx, systemd, SSL, cloud paths) are documented in `项目介绍.md`.

## Production status

The local code was deployed to Tencent Cloud on 2026-07-01 15:14 CST.

- Cloud app directory: `/home/ubuntu/novel_server`
- Local directory: code editing and packaging only; do not start the service locally
- systemd service: `novel-server.service`
- Active nginx entry:
  - `https://ai.passerjia.com:8848/`
- Disabled legacy entry:
  - old `novel.passerjia.com` config moved to `/etc/nginx/conf.d/novel_server.conf.disabled-202607011410`
- Runtime data preserved during deployment: `.env`, `node_modules`, `uploads`
- Pre-deploy backup: `/home/ubuntu/novel_server/.deploy_backups/novel_server_before_20260701151341.tar.gz`

## Local checks

This local checkout is not the runtime environment. Do not run `npm start`, `npm run start:dev`, or any other command that starts the HTTP service locally.

```bash
npm run typecheck
npm run build
```

## Production operations

Use the Tencent Cloud project directory for runtime checks and restarts:

```bash
npm --prefix /home/ubuntu/novel_server run typecheck
npm --prefix /home/ubuntu/novel_server run build
sudo systemctl restart novel-server
```

Seeded admin account (created on first startup when no admin exists):

```text
username: admin
password: Admin12345
```

Admin-reset users receive the initial password `guest2026`.
