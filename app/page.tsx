"use client";
import BackgroundGlow from "@/components/BackgroundGlow";
import BackgroundText from "@/components/BackgroundText";
import ParticleBackground from "@/components/ParticleBackground";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function Home() {
  const [content, setContent] = useState("");
  const [days, setDays] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  function computeTTLSeconds() {
    const d = Number(days) || 0;
    const h = Number(hours) || 0;
    const m = Number(minutes) || 0;
    const seconds = d * 86400 + h * 3600 + m * 60;
    return seconds > 0 ? seconds : undefined;
  }

  function resetForm() {
    setContent("");
    setDays("");
    setHours("");
    setMinutes("");
    setMaxViews("");
  }

  async function submit() {
    setError("");
    setCopied(false);

    const payload: any = { content };
    const ttl_seconds = computeTTLSeconds();
    if (ttl_seconds !== undefined) payload.ttl_seconds = ttl_seconds;
    if (maxViews) payload.max_views = Number(maxViews);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error?.formErrors?.content?.[0] || data.error || "Unknown error"
        );
        setUrl("");
        return;
      }

      setUrl(data.url);
      resetForm(); // 🔥 critical fix
    } catch (err: any) {
      setError(err.message || "Network error");
      setUrl("");
    }
  }

  async function copyLink() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      <ParticleBackground />
      <BackgroundGlow />
      <BackgroundText />

      <div className="relative z-10 backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl shadow-2xl w-full max-w-5xl">
        <h1 className="text-2xl font-semibold mb-4 text-center tracking-wide">
          Pastebin Lite
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4 min-h-[320px]">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste content"
            className="w-full h-full min-h-[320px] p-4 rounded-lg bg-black/40 border border-white/10 
              focus:outline-none focus:ring-2 focus:ring-white/20 transition"
          />

          <div className="flex flex-col gap-3">
            <input
              value={days}
              onChange={(e) => setDays(e.target.value)}
              type="number"
              min="0"
              placeholder="Days"
              className="p-2 rounded-lg bg-black/40 border border-white/10"
            />
            <input
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              type="number"
              min="0"
              placeholder="Hours"
              className="p-2 rounded-lg bg-black/40 border border-white/10"
            />
            <input
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              type="number"
              min="0"
              placeholder="Minutes"
              className="p-2 rounded-lg bg-black/40 border border-white/10"
            />
            <input
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              type="number"
              min="1"
              placeholder="Max views"
              className="p-2 rounded-lg bg-black/40 border border-white/10"
            />

            <button
              onClick={submit}
              className="mt-auto cursor-pointer py-2 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 active:scale-95 transition"
            >
              Create Paste
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 mt-2 text-center">{error}</p>}

        {url && (
          <div className="relative mt-4 rounded-lg border border-white/10 bg-black/40 p-3">
            {/* Copy button */}
            <button
              onClick={copyLink}
              className="absolute cursor-default top-2 right-2 flex h-8 w-8 items-center justify-center
                 rounded-md border border-white/20 bg-white/10
                 hover:bg-white/20 active:scale-95 transition"
              aria-label="Copy link"
            >
              {copied ? (
                <Check size={16} className="text-green-400" />
              ) : (
                <Copy size={16} className="cursor-pointer" />
              )}
            </button>

            {/* URL */}
            <a
              href={url}
              className="block pr-10 text-sm text-blue-400 break-all hover:underline"
            >
              {url}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
