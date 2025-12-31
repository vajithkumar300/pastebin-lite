import kv from "@/lib/kv";
import { getNowMs } from "@/lib/now";
import { notFound } from "next/navigation";

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
    const {id} = await params;
  const key = `paste:${id}`;
  const paste = await kv.hgetall<any>(key);

  if (!paste) notFound();

  const now = getNowMs();

  // TTL check
  if (paste.expires_at) {
    const expiresAtMs = Date.parse(paste.expires_at);
    if (now >= expiresAtMs) {
      await kv.del(key);
      notFound();
    }
  }

  // Atomic view increment
  const views = await kv.hincrby(key, "views", 1);

  // View limit check
  if (paste.max_views !== null && views > paste.max_views) {
    await kv.del(key);
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <pre
        className="max-w-3xl w-full whitespace-pre-wrap break-words
                   bg-white/5 border border-white/10
                   rounded-xl p-6 text-sm leading-relaxed"
      >
        {paste.content}
      </pre>
    </main>
  );
}
