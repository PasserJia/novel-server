# Novel Server

NestJS API service for the multi-user online novel reading web app.

Default API prefix: `/api`. The root path `/` serves the built-in single-page web client.

## Scope

The service exposes the full product API surface:

- **auth**: register, login, reset password, logout, heartbeat (session keep-alive), current user
- **admin**: list users, enable / disable users, reset a user's password to the initial password, delete a user
- **sources / novels**: source list, search, novel detail, chapter list, chapter content (fetched from `quanben.io` and cached)
- **bookshelf**: list, add from search, manual add, edit, cover upload, delete
- **reading progress**: read / save per-novel progress
- **preferences**: read / save bookshelf, bottom-nav and reader theme preferences

## Storage

Storage is selected at runtime via `STORE_DRIVER`:

- unset → `InMemoryStore` (development / demo fallback)
- `mysql` → `MysqlStore` (creates missing tables and a default admin on startup)

**Production (Tencent Cloud) runs with `STORE_DRIVER=mysql`.** See `.env.example` for the required `DB_*` variables. Deployment details (nginx, systemd, SSL, cloud paths) are documented in `项目介绍.md`.

## Run

```bash
npm install
npm run build
npm start
```

Development:

```bash
npm run start:dev
```

Type check only:

```bash
npm run typecheck
```

Seeded admin account (created on first startup when no admin exists):

```text
username: admin
password: Admin12345
```

Admin-reset users receive the initial password `guest2026`.
