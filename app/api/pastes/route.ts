import { nanoid } from "nanoid";
import { z } from "zod";
import kv from "@/lib/kv";
import { NextResponse } from "next/server";

const schema = z.object({
  content: z.string().min(1, "content is required"),
  ttl_seconds: z.number().int().min(1).optional(),
  max_views: z.number().int().min(1).optional(),
});

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { content, ttl_seconds, max_views } = parsed.data;
  const id = nanoid();
  const now = Date.now();

  const expires_at = ttl_seconds ? new Date(now + ttl_seconds * 1000).toISOString() : null;

  const paste = {
    content,
    created_at: new Date(now).toISOString(),
    expires_at,
    max_views: max_views ?? null,
    views: 0,
  };

  await kv.hset(`paste:${id}`, paste);

  // Ensure URL is always valid
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.get("host")}`;

  return NextResponse.json(
    {
      id,
      url: `${baseUrl}/p/${id}`,
    },
    { status: 201 }
  );
}
