# Pastebin-Lite 📝

A minimal Pastebin-like application built with **Next.js App Router** and **Vercel KV**.  
Users can create text pastes and share a unique link to view them.

This project is intentionally **backend-focused** and **test-driven**, designed to pass automated evaluation with strict API contracts and deterministic behavior.

**Live URL:**  
👉 https://pastebin-lite-tau.vercel.app/

---

## Features

- Create a text paste
- Shareable URL for viewing pastes
- Optional expiration (TTL)
- Optional maximum view count
- Atomic view-count increment (race-condition safe)
- Deterministic TTL handling (test-friendly)
- Health check endpoint for persistence validation

---

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Vercel KV (Redis)**
- **Zod** for request validation
- **nanoid** for unique ID generation

---

## Data Model (KV)

Each paste is stored as a JSON object in KV:

```ts
{
  content: string,
  createdAt: number,        // epoch milliseconds
  expiresAt: number | null, // epoch milliseconds
  maxViews: number | null,
  views: number
}
```

### Data Guarantees

- `null` is used intentionally (never `undefined`)
- `views` is always a number
- TTL is enforced both via **KV expiration** and **runtime checks**
- View count updates are atomic

---

## API Endpoints

### Create a Paste

**POST** `/api/pastes`

#### Request Body
```json
{
  "content": "hello world",
  "ttl_seconds": 300,
  "max_views": 5
}
```

#### Response
```json
{
  "id": "abc123",
  "url": "/p/abc123"
}
```

---

### Get Paste (JSON)

**GET** `/api/pastes/:id`

#### Behavior

- Atomically increments view count
- Returns `404` if:
  - Paste does not exist
  - Paste is expired
  - Max view count is exceeded
- No state mutation occurs if the paste is invalid

---

### View Paste (HTML)

**GET** `/p/:id`

- Server-rendered page
- Enforces TTL and max-view rules
- Atomically increments view count
- Displays a clean error state for invalid or expired pastes

---

### Health Check

**GET** `/api/healthz`

Used to verify KV connectivity and persistence correctness.

#### Response
```json
{
  "ok": true
}
```

---

## Environment Variables

Create a `.env.local` file with the following variables:

```env
KV_REST_API_READ_ONLY_TOKEN=
KV_REST_API_TOKEN=
KV_REST_API_URL=
KV_URL=
REDIS_URL=
NEXT_PUBLIC_BASE_URL=
```

### Notes

- `NEXT_PUBLIC_BASE_URL` must match the deployed base URL
- KV-related variables are automatically injected by Vercel when KV is linked

---

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The app will be available at:

```
http://localhost:3000
```

---

## Design Decisions (Intentional)

- Atomic Redis operations to prevent race conditions
- Deterministic TTL behavior when `TEST_MODE` is enabled
- Strict API contracts (no `undefined`, only explicit `null`)
- Server Components used for HTML routes
- Fail-fast behavior for expired or invalid pastes

---

## Out of Scope

- ❌ Authentication
- ❌ Syntax highlighting
- ❌ Paste editing
- ❌ UI-heavy features

This is a **minimal, backend-first assignment**, not a full Pastebin clone.

---

## License

MIT
