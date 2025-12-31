Pastebin-Lite 📝

A minimal Pastebin-like application built with Next.js App Router and Vercel KV.
Users can create text pastes and share a unique link to view them.
Designed to pass automated tests with deterministic behavior and strict API contracts.

Live URL:
👉 https://pastebin-lite-tau.vercel.app/

Features

Create a text paste

Access paste via a shareable URL

Optional expiration (TTL)

Optional maximum view count

Atomic view count increment (race-condition safe)

Deterministic TTL handling (test-friendly)

Health check endpoint for infrastructure validation

Tech Stack

Next.js (App Router)

TypeScript

Vercel KV (Redis)

Zod for request validation

nanoid for unique IDs

Data Model (KV)

Each paste is stored as a JSON object:

{
  content: string,
  createdAt: number,        // epoch ms
  expiresAt: number | null, // epoch ms
  maxViews: number | null,
  views: number
}

Important invariants

null is used intentionally (never undefined)

views is always a number

TTL is enforced both by KV expiration and runtime checks

API Endpoints
Create a paste

POST /api/pastes

Request body

{
  "content": "hello world",
  "ttl_seconds": 300,
  "max_views": 5
}


Response

{
  "id": "abc123",
  "url": "/p/abc123"
}

Get a paste (JSON)

GET /api/pastes/:id

Behavior

Atomically increments view count

Returns 404 if expired or view-limit exceeded

Never mutates state if paste is invalid

View paste (HTML)

GET /p/:id

Server-rendered page

Enforces TTL and max-view rules

Increments view count atomically

Shows clean error state if invalid

Health check

GET /api/healthz

Used to verify KV connectivity and persistence correctness.

Returns:

{ "ok": true }

Environment Variables

Create a .env.local file:

KV_REST_API_READ_ONLY_TOKEN=
KV_REST_API_TOKEN=
KV_REST_API_URL=
KV_URL=
REDIS_URL=
NEXT_PUBLIC_BASE_URL=

Notes

NEXT_PUBLIC_BASE_URL must match your deployment URL

KV variables are provided automatically on Vercel when KV is linked

Local Development
npm install
npm run dev


App runs at:

http://localhost:3000

Design Decisions (Intentional)

Atomic operations only for view count (no race conditions)

Deterministic TTL when TEST_MODE is enabled

Strict API contract (null vs undefined is enforced)

Server Components for HTML routes

Fail fast on invalid or expired pastes

What This Is NOT

❌ No authentication

❌ No syntax highlighting

❌ No paste editing

❌ No UI bloat

This is a test-driven backend-first assignment, not a startup.

License

MIT