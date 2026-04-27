# Arcus Backend

NestJS backend initialized with a Supabase Postgres connection through Drizzle ORM.

## Environment setup

Create `.env` in the backend root and paste in your Supabase database connection string:

```bash
cp .env.example .env
```

Supported variables:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-ref.supabase.co:5432/postgres
```

For current Supabase backend ORM access, copy the connection string from the Supabase `Connect` panel:

- use the direct connection string when your environment supports IPv6
- use the session pooler for long-lived IPv4-only servers
- avoid the transaction pooler for long-lived app servers unless you specifically need it

## Run the backend

```bash
npm install
npm run start:dev
```

## Available routes

- `GET /` returns backend status plus Supabase configuration state.
- `GET /supabase/status` returns only the Supabase database connection state.

## Using the Supabase database connection

Inject `SupabaseService` into any provider, then call `getDb()`:

```ts
constructor(private readonly supabaseService: SupabaseService) {}

const db = this.supabaseService.getDb();
```
