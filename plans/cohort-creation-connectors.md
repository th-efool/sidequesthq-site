# Creation connector deployment and verification

The new creation connector runtime is separate from `src/server/corsair.ts`. Legacy credentials, routes and imports are unchanged. New account credentials are encrypted in `creation_connectors.corsair_*`, scoped to a stable opaque identifier derived from the authenticated database user. Every application operation also loads the owned, unexpired creation draft. Neither material IDs nor browser tenant IDs are accepted as credential scope.

Apply `prisma/creation-connectors.sql` once using the existing PostgreSQL deployment process. This additive SQL creates only the isolated schema and five SDK tables; it copies no legacy rows. The application database role needs access to this schema. No Prisma model change is needed because the installed Corsair SDK owns these tables through Kysely. Keep SDK changes and these table contracts reviewed together.

Required server configuration:

- `CREATION_CONNECTOR_ORIGIN`: canonical application origin. HTTPS required except localhost in development.
- `CREATION_CORSAIR_KEK`: a nonzero 64-character hexadecimal encryption key. Generate securely and retain across deployments; changing it makes existing credentials unreadable.
- `CREATION_CORSAIR_API_KEY`: dedicated self-hosted Hub project key (`ck_dev_` or `ck_prod_`), separate from the legacy project's key.
- `CREATION_CORSAIR_SIGNING_SECRET`: matching dedicated Hub signing secret.
- `DIRECT_URL` preferred, otherwise `DATABASE_URL`: a direct/session PostgreSQL connection that supports startup `search_path`. Neon pooled endpoints reject this option. The isolated schema is also qualified in Kysely queries; public is not included in this client's search path.

Set the production Hub project's delivery URL to `<origin>/api/cohort-creation/connector-delivery`. The SDK ignores the per-session delivery URL override in production, so the project setting is required. Development sessions pass that exact delivery URL explicitly. Automatic SDK tunnels and workflow execution are disabled. The SDK's own OAuth callback stays at Hub; the application endpoint receives signed token delivery, not raw OAuth codes.

The exact delivery endpoint supports SDK-verified signed POST and signed browser GET (`d` token) for development. It uses the delivery-only SDK helper, not the broad management handler. No tenant listing, key access, workflow/call management route is mounted. Unsigned/forged requests fail before database credential writes. Application status/connect/disconnect endpoints are authenticated, draft-owned, provider-allowlisted and mutation-origin-checked. Responses expose connection state and a validated Hub URL, never tokens or tenant identifiers.

Run the opt-in database check with:

```powershell
node --conditions=react-server --import tsx --env-file-if-exists=.env scripts/creation-connectors-smoke.ts
```

It uses `CREATION_SMOKE_DATABASE_URL`, then `DIRECT_URL`, then `DATABASE_URL`; creates and removes only a randomly named isolated schema; provisions the installed SDK against fixture credentials; verifies encryption, owner separation and scoped disconnect. It makes no Hub/provider request and does not apply public migrations. The routine Vitest tests likewise use no paid model or live OAuth calls. A successful fixture smoke does not verify actual GitHub/Notion OAuth or deployment configuration.
