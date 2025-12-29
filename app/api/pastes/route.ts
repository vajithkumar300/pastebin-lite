import { nanoid } from "nanoid";
import { z } from "zod";
import kv from "@/lib/kv";

const schema = z.object({
  content: z.string().min(1),
  ttl_seconds: z.number().int().min(1).optional(),
  max_views: z.number().int().min(1).optional()
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input" },
      { status: 400 }
    );
  }

  const { content, ttl_seconds, max_views } = parsed.data;
  const id = nanoid(10);
  const now = Date.now();

  const expires_at = ttl_seconds
    ? now + ttl_seconds * 1000
    : null;

  await kv.hset(`paste:${id}`, {
    content,
    created_at: now,
    expires_at,
    max_views: max_views ?? null,
    views: 0
  });

  return Response.json({
    id,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`
  });
}
