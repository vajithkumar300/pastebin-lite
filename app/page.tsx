"use client";
import BackgroundGlow from "@/components/BackgroundGlow";
import BackgroundText from "@/components/BackgroundText";
import ParticleBackground from "@/components/ParticleBackground";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [days, setDays] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [url, setUrl] = useState("");

  function computeTTLSeconds() {
    const d = Number(days) || 0;
    const h = Number(hours) || 0;
    const m = Number(minutes) || 0;
    const seconds = d * 24 * 60 * 60 + h * 60 * 60 + m * 60;
    return seconds > 0 ? seconds : undefined;
  }

  async function submit() {
    const payload: any = { content };
    const ttl_seconds = computeTTLSeconds();
    if (ttl_seconds) payload.ttl_seconds = ttl_seconds;
    if (maxViews) payload.max_views = Number(maxViews);

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setUrl(data.url);
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

          {/* TEXTAREA */}
          <textarea
            className="w-full h-full min-h-[320px] p-4 rounded-lg bg-black/40 border border-white/10 
              focus:outline-none focus:ring-2 focus:ring-white/20 transition
              scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-thumb]:bg-gray-600
              [&::-webkit-scrollbar-thumb]:rounded-full
              hover:[&::-webkit-scrollbar-thumb]:bg-gray-300"
            placeholder="Paste content"
            onChange={(e) => setContent(e.target.value)}
          />

          {/* CONTROLS */}
          <div className="flex flex-col gap-3">
            <input
              type="number"
              min="0"
              className="p-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none"
              placeholder="Days"
              onChange={(e) => setDays(e.target.value)}
            />
            <input
              type="number"
              min="0"
              className="p-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none"
              placeholder="Hours"
              onChange={(e) => setHours(e.target.value)}
            />
            <input
              type="number"
              min="0"
              className="p-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none"
              placeholder="Minutes"
              onChange={(e) => setMinutes(e.target.value)}
            />
            <input
              type="number"
              min="1"
              className="p-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none"
              placeholder="Max views"
              onChange={(e) => setMaxViews(e.target.value)}
            />
            <button
              onClick={submit}
              className="mt-auto py-2 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 active:scale-95 transition-all"
            >
              Create Paste
            </button>
          </div>
        </div>

        {url && (
          <a
            href={url}
            className="block mt-4 text-center text-sm text-blue-400 hover:underline break-all transition"
          >
            {url}
          </a>
        )}
      </div>
    </div>
  );
}
