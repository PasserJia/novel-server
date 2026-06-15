# Novel Server

NestJS API service for the multi-user online novel reading mini program.

## Current Scope

This is a runnable V1 backend scaffold using in-memory storage. It exposes the core API shape from the product and architecture documents:

- auth: register, login, reset password, logout, current user
- users/admin: list users, enable users, disable users
- sources and novel search
- bookshelf CRUD
- reading progress
- preferences

The next production step is replacing `src/store/in-memory.store.ts` with a database-backed repository layer.

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

Default API prefix: `/api`

Seeded admin account:

```text
username: admin
password: Admin12345
```
# novel-server
