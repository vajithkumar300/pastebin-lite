import kv from "@/lib/kv";
import { getNowMs } from "@/lib/now";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const key = `paste:${id}`;

  const paste = await kv.hgetall<any>(key);

  if (!paste || Object.keys(paste).length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = getNowMs(req);

  // TTL check
  if (paste.expires_at) {
    const expiresAtMs = Date.parse(paste.expires_at);
    if (now >= expiresAtMs) {
      await kv.del(key);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  // Atomic view increment
  const views = await kv.hincrby(key, "views", 1);

  // View limit check
  if (paste.max_views !== null && views > paste.max_views) {
    await kv.del(key);
    return NextResponse.json({ error: "View limit exceeded" }, { status: 404 });
  }

  return NextResponse.json({
    content: paste.content,
    remaining_views:
      paste.max_views === null
        ? null
        : Math.max(0, paste.max_views - views),
    expires_at: paste.expires_at ?? null,
  });
}
