import kv from "@/lib/kv";
import { nowMs } from "@/lib/time";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: any
) {
  const { id } = await context.params;

  const key = `paste:${id}`;
  const data = await kv.hgetall<any>(key);

  if (!data) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const now = nowMs(req);

  if (data.expires_at && now >= data.expires_at) {
    await kv.del(key);
    return Response.json({ error: "Expired" }, { status: 404 });
  }

  if (data.max_views !== null && data.views >= data.max_views) {
    await kv.del(key);
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
  }

  const views = await kv.hincrby(key, "views", 1);

  if (data.max_views !== null && views > data.max_views) {
    await kv.del(key);
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
  }

  return Response.json({
    content: data.content,
    remaining_views:
      data.max_views === null ? null : data.max_views - views,
    expires_at: data.expires_at
      ? new Date(data.expires_at).toISOString()
      : null
  });
}
