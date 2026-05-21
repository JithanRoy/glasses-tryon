# Backend Wiring — Tasks Remaining

_Scope: backend + DB connection only. Snapshot date: 2026-05-21._

## ✅ Already done

- NestJS app scaffolded ([apps/backend/src/app.module.ts](apps/backend/src/app.module.ts))
- `@nestjs/config` wired globally
- `SupabaseService` created with `@supabase/supabase-js` client ([apps/backend/src/supabase/supabase.service.ts](apps/backend/src/supabase/supabase.service.ts))
- `SupabaseModule` registered as `@Global()` ([apps/backend/src/supabase/supabase.module.ts](apps/backend/src/supabase/supabase.module.ts))
- `ShopsService` — `findAll`, `findOneBySlug`, `create` ([apps/backend/src/shops/shops.service.ts](apps/backend/src/shops/shops.service.ts))
- `ProductsService` — `findAllByShop`, `findOne`, `create` ([apps/backend/src/products/products.service.ts](apps/backend/src/products/products.service.ts))
- SQL schema with `shops`, `glasses`, indexes, RLS policies ([supabase/schema.sql](supabase/schema.sql))
- Swagger docs setup
- `.env.example` with required vars

## 🔲 Tasks Left

### 1. Supabase project setup
- [ ] Create a Supabase project at https://supabase.com
- [ ] Copy real `SUPABASE_URL` and `SUPABASE_KEY` (anon key) into [apps/backend/.env](apps/backend/.env)
- [ ] Run [supabase/schema.sql](supabase/schema.sql) in Supabase SQL Editor to create tables + RLS

### 2. Stray scaffold cleanup
- [ ] Remove or wire up the untracked `apps/backend/src/cats/` directory (leftover NestJS scaffold — not in `app.module.ts`)

### 3. Missing DTOs / validation
- [ ] Add `class-validator` + `class-transformer` for request validation
- [ ] Create DTOs for `Shop` create and `Glasses` create payloads (services currently accept `Partial<Shop>` / `Partial<Glasses>` with no validation)
- [ ] Enable global `ValidationPipe` in `main.ts`

### 4. Write-path authorization
- [ ] RLS currently only allows public SELECT. Decide: use Supabase service role key for backend writes (server-only), or add INSERT policies + Supabase Auth
- [ ] If service role: add a second client in `SupabaseService` using `SUPABASE_SERVICE_ROLE_KEY` for write operations

### 5. Storage for glasses images
- [ ] Create a Supabase Storage bucket (e.g. `glasses-images`)
- [ ] Add an upload endpoint or document client-side direct upload flow
- [ ] Document `image_url` / `model_url` conventions

### 6. Missing endpoints (MVP)
- [ ] `GET /shops/:slug/products` — convenience endpoint joining the QR-driven flow
- [ ] `PATCH /products/:id` and `DELETE /products/:id` — shop product management
- [ ] `PATCH /shops/:id` — shop config updates

### 7. CORS + frontend connection
- [ ] Enable CORS in `main.ts` for the Next.js frontend origin
- [ ] Add frontend API base URL env var on the Next.js side

### 8. Error handling
- [ ] Centralized exception filter that maps Supabase errors (`PostgrestError`) to proper HTTP responses
- [ ] Currently `throw result.error` leaks raw Postgres error shape

### 9. Tests
- [ ] Integration tests for `ShopsService` and `ProductsService` (currently only `app.controller.spec.ts` exists)

---

# Process: Connecting the Backend to Supabase

You're using **`@supabase/supabase-js`** (recommended — already installed and wired; gives you DB + Storage + Auth in one client; matches the RLS-based schema).

## Step 1 — Create a Supabase project
1. Go to https://supabase.com → **New project**
2. Pick region close to your users, set a DB password (save it)
3. Wait ~2 min for provisioning

## Step 2 — Grab credentials
In the Supabase dashboard → **Project Settings → API**:
- **Project URL** → goes to `SUPABASE_URL`
- **anon public key** → goes to `SUPABASE_KEY` (safe for client-readable ops; combined with RLS)
- **service_role key** → keep secret, server-only (needed later for write bypass of RLS)

## Step 3 — Configure `.env`
Edit [apps/backend/.env](apps/backend/.env):
```
SUPABASE_URL=https://<your-ref>.supabase.co
SUPABASE_KEY=eyJhbGciOi...        # anon key
# SUPABASE_SERVICE_ROLE_KEY=...   # add when you implement write auth
PORT=3001
```
⚠️ Never commit `.env`. Confirm it's in `.gitignore`.

## Step 4 — Apply the schema
1. Open Supabase dashboard → **SQL Editor → New query**
2. Paste contents of [supabase/schema.sql](supabase/schema.sql)
3. **Run** — creates `shops`, `glasses`, indexes, and RLS policies
4. Verify under **Table Editor** that both tables exist

## Step 5 — Seed test data (optional)
In SQL Editor:
```sql
INSERT INTO shops (name, slug) VALUES ('Demo Optics', 'demo-optics');
INSERT INTO glasses (shop_id, name, brand, image_url, price)
SELECT id, 'Aviator Classic', 'RayBan', 'https://placehold.co/300', 99.99
FROM shops WHERE slug = 'demo-optics';
```

## Step 6 — Run the backend
```bash
cd apps/backend
npm run start:dev
```
You should see Nest start on port 3001 with no "Supabase credentials are not provided" error.

## Step 7 — Smoke test
```bash
curl http://localhost:3001/shops
curl http://localhost:3001/shops/demo-optics
curl http://localhost:3001/products/shop/<shop-uuid>
```
(Confirm exact route paths in [apps/backend/src/shops/shops.controller.ts](apps/backend/src/shops/shops.controller.ts) and [apps/backend/src/products/products.controller.ts](apps/backend/src/products/products.controller.ts).)

## Step 8 — Swagger
Open http://localhost:3001/api (or whatever path is configured in `main.ts`) to explore endpoints interactively.

---

## When to revisit the client choice
Stay on `@supabase/supabase-js` until you hit one of:
- Complex multi-table joins/transactions → consider adding **Prisma** alongside (it can connect to the same Supabase Postgres via the connection string)
- Strict compile-time schema typing across the app → generate types via `supabase gen types typescript`
