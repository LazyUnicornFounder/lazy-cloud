import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="font-display text-xl font-bold tracking-tight mb-6">Settings</h1>

      {/* Site Settings */}
      <div className="mb-8">
        <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/30 mb-3">Site Settings</p>
        <div className="border border-[#f0ead6]/8 p-5 space-y-4">
          <p className="font-body text-xs text-[#f0ead6]/40">
            Site-wide defaults are configured per engine. Visit each engine's settings panel to update.
          </p>
        </div>
      </div>

      {/* API Keys Info */}
      <div className="mb-8">
        <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/30 mb-3">API Keys</p>
        <div className="border border-[#f0ead6]/8 divide-y divide-[#f0ead6]/5">
          {[
            { name: "Lovable AI", hint: "Built-in. No key required.", status: "active" },
            { name: "ElevenLabs", hint: "Configure in Lazy Voice settings.", status: "per-engine" },
            { name: "Twilio", hint: "Configure in Lazy SMS settings.", status: "per-engine" },
            { name: "Stripe", hint: "Configure in Lazy Pay settings.", status: "per-engine" },
            { name: "Twitch", hint: "Configure in Lazy Stream settings.", status: "per-engine" },
            { name: "GitHub", hint: "Configure in Lazy GitHub settings.", status: "per-engine" },
            { name: "GitLab", hint: "Configure in Lazy GitLab settings.", status: "per-engine" },
            { name: "Linear", hint: "Configure in Lazy Linear settings.", status: "per-engine" },
            { name: "Firecrawl", hint: "Configure in Lazy Crawl settings.", status: "per-engine" },
            { name: "Perplexity", hint: "Configure in Lazy Perplexity settings.", status: "per-engine" },
            { name: "Slack", hint: "Configure in Lazy Alert settings.", status: "per-engine" },
            { name: "Telegram", hint: "Configure in Lazy Telegram settings.", status: "per-engine" },
            { name: "Contentful", hint: "Configure in Lazy Contentful settings.", status: "per-engine" },
            { name: "Aikido", hint: "Configure in Lazy Security settings.", status: "per-engine" },
          ].map((key) => (
            <div key={key.name} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="font-body text-xs text-[#f0ead6]/70">{key.name}</p>
                <p className="font-body text-[10px] text-[#f0ead6]/20 mt-0.5">{key.hint}</p>
              </div>
              <span className={`font-body text-[10px] tracking-wider uppercase ${key.status === "active" ? "text-emerald-500" : "text-[#f0ead6]/20"}`}>
                {key.status === "active" ? "Active" : "Per Engine"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Overview */}
      <div>
        <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/30 mb-3">Publishing Schedule</p>
        <div className="border border-[#f0ead6]/8 p-5">
          <div className="space-y-3">
            {[
              { engine: "Lazy Blogger", schedule: "Every 15 minutes", color: "bg-emerald-500" },
              { engine: "Lazy SEO", schedule: "On-demand via Blogger", color: "bg-blue-500" },
              { engine: "Lazy GEO", schedule: "On-demand via Blogger", color: "bg-purple-500" },
              { engine: "Lazy Crawl", schedule: "Every 30 minutes", color: "bg-orange-500" },
              { engine: "Lazy Perplexity", schedule: "Daily 5am research", color: "bg-cyan-500" },
              { engine: "Lazy Store", schedule: "Daily discovery & listings", color: "bg-amber-500" },
              { engine: "Lazy Voice", schedule: "Every 30 minutes", color: "bg-[#c8a961]" },
              { engine: "Lazy Pay", schedule: "Daily recovery, weekly optimise", color: "bg-pink-500" },
              { engine: "Lazy SMS", schedule: "Hourly sequences", color: "bg-teal-500" },
              { engine: "Lazy Stream", schedule: "Every 5 minutes (monitor)", color: "bg-red-500" },
              { engine: "Lazy GitHub", schedule: "Hourly sync", color: "bg-gray-500" },
              { engine: "Lazy GitLab", schedule: "Hourly sync", color: "bg-indigo-500" },
              { engine: "Lazy Linear", schedule: "Hourly sync", color: "bg-violet-500" },
              { engine: "Lazy Alert", schedule: "Every 5 minutes + daily briefing", color: "bg-yellow-500" },
              { engine: "Lazy Telegram", schedule: "Every 5 minutes + daily briefing", color: "bg-sky-500" },
              { engine: "Lazy Contentful", schedule: "Hourly pull, 30-min push", color: "bg-lime-500" },
              { engine: "Lazy Supabase", schedule: "Hourly monitor", color: "bg-emerald-400" },
              { engine: "Lazy Security", schedule: "Hourly scan check", color: "bg-rose-500" },
            ].map((item) => (
              <div key={item.engine} className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${item.color} flex-shrink-0`} />
                <span className="font-body text-xs text-[#f0ead6]/60 w-32">{item.engine}</span>
                <span className="font-body text-xs text-[#f0ead6]/25">{item.schedule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
