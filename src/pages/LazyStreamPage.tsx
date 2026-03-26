import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";

const SETUP_PROMPT = `[Lazy Stream Prompt — v0.0.4 — LazyUnicorn.ai]

Add a complete autonomous Twitch content engine called Lazy Stream to this project. It monitors your Twitch channel, processes VODs, writes stream recaps, extracts clips, publishes SEO articles, tracks analytics, and improves its own content quality — all automatically with no manual input required after setup.

---

## 1. Database

Create these Supabase tables with RLS enabled:

**stream_settings**
id (uuid, primary key, default gen_random_uuid()),
twitch_username (text),
twitch_user_id (text),
site_url (text),
business_name (text),
content_niche (text),
is_running (boolean, default true),
setup_complete (boolean, default false),
prompt_version (text, nullable),
recap_template_guidance (text),
created_at (timestamptz, default now())

Note: Store Twitch credentials as Supabase secrets — TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET. Never store in the database table.

**stream_sessions**
id (uuid, primary key, default gen_random_uuid()),
twitch_stream_id (text, unique),
title (text),
game_name (text),
started_at (timestamptz),
ended_at (timestamptz),
duration_minutes (integer),
peak_viewers (integer),
average_viewers (integer),
status (text, default 'live'),
created_at (timestamptz, default now())

**stream_content**
id (uuid, primary key, default gen_random_uuid()),
session_id (uuid),
content_type (text),
title (text),
slug (text, unique),
excerpt (text),
body (text),
target_keyword (text),
published_at (timestamptz, default now()),
status (text, default 'published'),
views (integer, default 0),
created_at (timestamptz, default now())

**stream_clips**
id (uuid, primary key, default gen_random_uuid()),
session_id (uuid),
twitch_clip_id (text, unique),
title (text),
clip_url (text),
thumbnail_url (text),
view_count (integer),
duration_seconds (numeric),
published_at (timestamptz, default now()),
created_at (timestamptz, default now())

**stream_transcripts**
id (uuid, primary key, default gen_random_uuid()),
session_id (uuid, unique),
transcript_text (text),
word_count (integer),
processed_at (timestamptz, default now())

**stream_optimisation_log**
id (uuid, primary key, default gen_random_uuid()),
content_type (text),
old_template (text),
new_template (text),
trigger_reason (text),
optimised_at (timestamptz, default now())

**stream_errors**
id (uuid, primary key, default gen_random_uuid()),
function_name (text),
error_message (text),
created_at (timestamptz, default now())`;

const faqs = [
  { q: "Do I need a Twitch affiliate or partner account?", a: "No. Lazy Stream works with any Twitch account. You need a free Twitch developer account to get API credentials." },
  { q: "How long does transcription take?", a: "Twitch VODs typically become available within a few minutes of the stream ending. Transcription and content generation usually completes within 15 to 30 minutes." },
  { q: "What if I stream for 8 hours?", a: "Lazy Stream processes the full VOD but focuses the recap and SEO article on the most engaged segments. Long streams produce richer content." },
  { q: "Does it post to social media automatically?", a: "Not in the current version. Content publishes to your Lovable site. Social posting is coming in the Pro version." },
  { q: "What games and content types does it work with?", a: "Everything. Lazy Stream works with any Twitch content — gaming, just chatting, music, creative. The AI adapts the recap style to the content type." },
  { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing data and settings are preserved." },
];

/* ── Palette ── */
const C = {
  bg: "#1a0533",
  pink: "#ff2d9b",
  cyan: "#00f5ff",
  lime: "#39ff14",
  yellow: "#ffed00",
  white: "#ffffff",
};

/* ── Chat messages ── */
const chatMsgs = [
  "PogChamp", "LUL", "KEKW", "GG", "let's go", "clip it", "POG",
  "hype", "W", "based", "no way", "actual clip", "this is insane",
  "🔥🔥🔥", "GOAT", "sheeeesh", "MASSIVE", "LETS GOOO",
];

/* ── Floating emojis ── */
const floatingEmoji = ["📺", "🎮", "✨", "🔴", "💜", "⚡", "🎯", "👾"];

/* ── Floating Particles ── */
function Particles() {
  const particles = useRef(
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      color: [C.pink, C.cyan, C.lime][i % 3],
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
    }))
  ).current;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: 0.15,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `drift ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Scanline overlay ── */
function Scanlines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2]"
      style={{
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)",
      }}
    />
  );
}

/* ── Floating Emoji ── */
function FloatingEmojis() {
  const [emojis, setEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const counterRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = counterRef.current++;
      const emoji = floatingEmoji[id % floatingEmoji.length];
      const x = 10 + Math.random() * 80;
      setEmojis((prev) => [...prev.slice(-12), { id, emoji, x }]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      <AnimatePresence>
        {emojis.map((e) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0.8, y: "100%", x: `${e.x}vw` }}
            animate={{ opacity: 0, y: "-20%", x: `${e.x + (Math.random() - 0.5) * 10}vw` }}
            exit={{ opacity: 0 }}
            transition={{ duration: 6, ease: "easeOut" }}
            className="absolute text-3xl"
            style={{ left: 0, bottom: 0 }}
          >
            {e.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ── Chat Panel ── */
function ChatPanel() {
  const [messages, setMessages] = useState<{ id: number; user: string; msg: string; color: string }[]>([]);
  const counterRef = useRef(0);

  useEffect(() => {
    const colors = [C.pink, C.cyan, C.lime, C.yellow, "#ff6b6b", "#a29bfe", "#fd79a8"];
    const users = ["xQcFan", "poggers99", "clipQueen", "neonVibes", "ttvJoey", "lurk_lord", "hypeBot", "streamSniper"];
    const interval = setInterval(() => {
      const id = counterRef.current++;
      setMessages((prev) => [
        ...prev.slice(-8),
        {
          id,
          user: users[id % users.length],
          msg: chatMsgs[Math.floor(Math.random() * chatMsgs.length)],
          color: colors[id % colors.length],
        },
      ]);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute right-0 top-0 bottom-0 w-[35%] flex flex-col justify-end p-2 overflow-hidden" style={{ backgroundColor: "rgba(0,0,0,0.5)", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="space-y-1">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[8px] md:text-[10px] leading-tight"
          >
            <span style={{ color: m.color }} className="font-bold">{m.user}: </span>
            <span style={{ color: "rgba(255,255,255,0.8)" }}>{m.msg}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Viewer Count ── */
function ViewerCount() {
  const [count, setCount] = useState(847);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
        <span className="text-[8px] md:text-[10px] font-bold" style={{ color: C.white }}>👁 {count.toLocaleString()}</span>
      </div>
    </div>
  );
}

/* ── Live Badge ── */
function LiveBadge() {
  return (
    <div className="absolute top-2 right-[37%] md:right-[37%] flex items-center gap-1 z-10 px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(255,0,0,0.8)", animation: "pulse-live 2s ease-in-out infinite" }}>
      <div className="w-1.5 h-1.5 rounded-full bg-white" style={{ animation: "pulse-dot 1.5s ease-in-out infinite" }} />
      <span className="text-[8px] md:text-[10px] font-bold text-white tracking-wider">LIVE</span>
    </div>
  );
}

/* ── Streamer Silhouette ── */
function StreamerScene() {
  return (
    <div className="absolute inset-0 w-[65%]" style={{ background: "linear-gradient(135deg, #2d1b69, #1a0533)" }}>
      {/* Desk */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ backgroundColor: "#2a1a4e" }} />
      {/* Monitor glow */}
      <div className="absolute bottom-[30%] left-[15%] w-[35%] h-[35%] rounded" style={{ backgroundColor: "#3d2a6e", boxShadow: `0 0 30px ${C.cyan}33` }} />
      {/* Streamer silhouette */}
      <svg viewBox="0 0 100 100" className="absolute bottom-[15%] left-[20%] w-[30%] h-[55%]" fill="#1a0a30">
        {/* Head */}
        <circle cx="50" cy="25" r="12" />
        {/* Body */}
        <path d="M35 35 Q50 32 65 35 L68 70 L32 70 Z" />
        {/* Headset */}
        <path d="M36 20 Q36 8 50 8 Q64 8 64 20" fill="none" stroke={C.pink} strokeWidth="2.5" />
        <circle cx="36" cy="22" r="4" fill={C.pink} />
        <circle cx="64" cy="22" r="4" fill={C.pink} />
        {/* Mic */}
        <line x1="36" y1="26" x2="42" y2="32" stroke={C.cyan} strokeWidth="1.5" />
      </svg>
      {/* Keyboard glow */}
      <div className="absolute bottom-[32%] left-[35%] w-[20%] h-[4%] rounded-sm" style={{ backgroundColor: C.lime, opacity: 0.15, boxShadow: `0 0 10px ${C.lime}` }} />
    </div>
  );
}

/* ── Retro CRT TV ── */
function RetroTV() {
  return (
    <div className="relative mx-auto" style={{ maxWidth: 580 }}>
      {/* Antenna */}
      <div className="flex justify-center -mb-1 relative z-10">
        <div className="relative">
          <svg width="120" height="60" viewBox="0 0 120 60">
            <line x1="60" y1="60" x2="30" y2="5" stroke="#555" strokeWidth="3" />
            <line x1="60" y1="60" x2="90" y2="5" stroke="#555" strokeWidth="3" />
            <circle cx="30" cy="5" r="3" fill="#888" />
            <circle cx="90" cy="5" r="3" fill="#888" />
          </svg>
          {/* Unicorn charm */}
          <span className="absolute -top-1 -right-2 text-lg" style={{ animation: "swing 3s ease-in-out infinite" }}>🦄</span>
        </div>
      </div>

      {/* TV body */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #3a3a3a, #222, #1a1a1a)",
          padding: "20px 24px 50px 24px",
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 30px ${C.pink}15, inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}
      >
        {/* Screen */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: "4 / 3",
            borderRadius: 12,
            backgroundColor: "#0a0a1a",
            border: "4px solid #111",
            boxShadow: `inset 0 0 40px rgba(0,0,0,0.8), 0 0 8px ${C.cyan}22`,
          }}
        >
          <StreamerScene />
          <ChatPanel />
          <ViewerCount />
          <LiveBadge />
          {/* CRT scanlines on screen */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 3px)" }} />
          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)" }} />
          {/* Screen glare */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.04) 0%, transparent 50%)" }} />
        </div>

        {/* Controls below screen */}
        <div className="flex items-center justify-between mt-5 px-2">
          {/* Brand */}
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: C.pink, fontFamily: "'Bebas Neue', sans-serif", fontSize: 14 }}>
            LAZY STREAM
          </span>
          {/* Dials */}
          <div className="flex items-center gap-3">
            {[C.pink, C.cyan].map((color, i) => (
              <div key={i} className="w-6 h-6 rounded-full" style={{ background: `radial-gradient(circle at 35% 35%, ${color}44, #222)`, border: `2px solid ${color}44`, boxShadow: `0 0 6px ${color}33` }} />
            ))}
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: C.lime, boxShadow: `0 0 8px ${C.lime}88`, animation: "pulse-dot 2s ease-in-out infinite" }} />
          </div>
        </div>
      </div>

      {/* TV legs */}
      <div className="flex justify-center gap-[65%] -mt-1">
        <div style={{ width: 5, height: 30, background: "#333", borderRadius: "0 0 3px 3px", transform: "rotate(-8deg)", transformOrigin: "top center" }} />
        <div style={{ width: 5, height: 30, background: "#333", borderRadius: "0 0 3px 3px", transform: "rotate(8deg)", transformOrigin: "top center" }} />
      </div>
    </div>
  );
}

/* ── CopyPromptButton ── */
function CopyPromptButton({ className = "", variant = "pink" }: { className?: string; variant?: "pink" | "gold" }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(SETUP_PROMPT);
    setCopied(true);
    trackEvent("copy_prompt", { product: "lazy-stream" });
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2000);
  }, [trackEvent]);

  const bg = variant === "gold"
    ? `linear-gradient(135deg, ${C.yellow}, #ffaa00)`
    : `linear-gradient(135deg, ${C.pink}, ${C.cyan})`;

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 px-8 py-3 font-bold text-sm tracking-wide transition-transform hover:scale-105 active:scale-95 ${className}`}
      style={{ background: bg, color: "#1a0533", borderRadius: 8, fontFamily: "'Inter', sans-serif" }}
    >
      {copied ? <><Check size={16} /> Copied ✓</> : <><Copy size={16} /> Add to my Lovable project</>}
    </button>
  );
}

/* ── Channel Card ── */
function ChannelCard({ channel, emoji, title, body, color, rotation }: { channel: string; emoji: string; title: string; body: string; color: string; rotation: number }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="p-6 md:p-8 relative"
      style={{
        border: `2px solid ${color}`,
        borderRadius: 12,
        backgroundColor: "rgba(26,5,51,0.8)",
        transform: `rotate(${rotation}deg)`,
        boxShadow: `0 0 20px ${color}22`,
      }}
    >
      <span className="absolute top-3 right-4 font-bold text-xs tracking-wider" style={{ color, fontFamily: "'Bebas Neue', sans-serif", fontSize: 18 }}>CH {channel}</span>
      <p className="text-2xl mb-2">{emoji}</p>
      <h3 className="text-lg font-bold mb-2" style={{ color: C.white, fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: "0.05em" }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Inter', sans-serif" }}>{body}</p>
    </motion.div>
  );
}

/* ── Output Preview Card ── */
function OutputCard({ title, preview, badge, color, badgeIcon }: { title: string; preview: string; badge: string; color: string; badgeIcon: string }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex-1 min-w-[260px] rounded-xl overflow-hidden"
      style={{ border: `2px solid ${color}`, backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      {/* Phone-like header */}
      <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
        <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color }}>{badge}</span>
        <span>{badgeIcon}</span>
      </div>
      <div className="p-5">
        <h4 className="font-bold text-sm mb-2" style={{ color: C.white, fontFamily: "'Inter', sans-serif" }}>{title}</h4>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{preview}</p>
        <p className="text-[10px] mt-3" style={{ color: "rgba(255,255,255,0.25)" }}>Published 12 min ago</p>
      </div>
    </motion.div>
  );
}

/* ── Neon border cycling card ── */
function TwitchConnectionCard() {
  return (
    <div className="max-w-md mx-auto mt-10 p-5 rounded-xl" style={{ backgroundColor: "rgba(0,0,0,0.4)", border: "2px solid", borderImage: "linear-gradient(var(--border-angle), #ff2d9b, #00f5ff, #39ff14, #ff2d9b) 1", animation: "border-rotate 4s linear infinite" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded flex items-center justify-center" style={{ backgroundColor: "#9146ff" }}>
          <span className="text-white font-bold text-xs font-mono">Twitch</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color: C.white }}>Connected</span>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.lime, boxShadow: `0 0 6px ${C.lime}`, animation: "pulse-dot 2s ease-in-out infinite" }} />
          </div>
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>Last checked: 2 minutes ago</p>
        </div>
      </div>
      <div className="space-y-2 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
        <div className="flex justify-between"><span>Next check</span><span style={{ color: C.cyan }}>3 minutes</span></div>
        <div className="flex justify-between"><span>Stream status</span><span style={{ color: "rgba(255,255,255,0.3)" }}>Offline — last stream 4h ago</span></div>
      </div>
    </div>
  );
}

/* ── Big Number ── */
function BigNumber({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-center p-6"
    >
      <p className="font-bold" style={{ fontSize: "clamp(60px, 12vw, 120px)", color: "#1a0533", fontFamily: "'Bebas Neue', sans-serif", lineHeight: 1 }}>{value}</p>
      <p className="text-sm font-bold mt-2 uppercase tracking-wider" style={{ color: "rgba(26,5,51,0.7)", fontFamily: "'Inter', sans-serif" }}>{label}</p>
    </motion.div>
  );
}

/* ═══════════════════════════════ PAGE ═══════════════════════════════ */

const LazyStreamPage = () => {
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: C.bg, color: C.white, fontFamily: "'Inter', sans-serif" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap');

        @keyframes drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(20px, -30px); }
        }
        @keyframes swing {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes pulse-live {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @property --border-angle {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }
        @keyframes border-rotate {
          to { --border-angle: 360deg; }
        }
      `}</style>

      <SEO
        title="Lazy Stream — Autonomous Twitch Content Engine for Lovable"
        description="One prompt turns every Twitch stream into a blog post, SEO article, and highlight reel — automatically."
        url="/lazy-stream"
        keywords="Twitch content automation, stream to blog, VOD transcription, Twitch SEO, autonomous content, Lovable, Lazy Stream"
      />
      <Navbar />
      <Particles />
      <Scanlines />

      {/* ═══ HERO ═══ */}
      <section className="relative px-6 md:px-12 pt-32 pb-20 md:pb-28 overflow-hidden" style={{ background: `linear-gradient(180deg, #0a0a08 0%, ${C.bg} 100%)` }}>
        <FloatingEmojis />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Intro label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6 justify-center md:justify-start"
          >
            <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>Introducing</p>
            <span className="text-[10px] tracking-[0.15em] uppercase font-extrabold px-3 py-1" style={{ backgroundColor: C.pink, color: "#fff", fontFamily: "'Playfair Display', serif" }}>BETA</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-bold mb-6 text-center md:text-left"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 1.05,
              color: "#f0ead6",
              letterSpacing: "-0.01em",
            }}
          >
            Launch your Autonomous<br />
            Twitch Business on <span style={{ color: C.pink }}>Lovable</span>
          </motion.h1>

          {/* Body text directly under headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-lg max-w-2xl leading-relaxed mb-12 text-center md:text-left"
            style={{ color: "#f0ead6", opacity: 0.45 }}
          >
            Lazy Stream detects when your Twitch stream ends and automatically publishes a recap article, an SEO post, and a highlights page — before you have even eaten dinner.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center md:items-start gap-4 mb-16"
          >
            <CopyPromptButton />
            <button
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold transition-colors"
              style={{ border: "1px solid rgba(240,234,214,0.15)", color: "#f0ead6", opacity: 0.5 }}
            >
              See How It Works
            </button>
          </motion.div>

          {/* TV */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <RetroTV />
          </motion.div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="relative py-24 md:py-32 px-6" style={{ background: `linear-gradient(180deg, ${C.bg}, ${C.bg} 80%, rgba(57,255,20,0.08) 100%)` }}>
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center font-bold mb-16"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: C.white }}
          >
            Stream. Sleep. Wake up to articles.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ChannelCard channel="03" emoji="🎮" title="You go live" body="Stream whatever you stream. Lazy Stream watches your Twitch status silently in the background. You do not need to do anything differently." color={C.pink} rotation={-2} />
            <ChannelCard channel="07" emoji="📡" title="Stream ends. Engines fire." body="The moment your stream goes offline Lazy Stream fetches your top clips, generates a transcript summary, and starts writing. Within 30 minutes three pieces of content are queued." color={C.cyan} rotation={0} />
            <ChannelCard channel="11" emoji="📰" title="Content goes live" body="A stream recap, an SEO article targeting your game or topic, and a highlights page all publish to your site automatically. Your viewers find them on Google. New viewers discover you." color={C.lime} rotation={2} />
          </div>
        </div>
      </section>

      {/* ═══ WHAT GETS PUBLISHED ═══ */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden" style={{ background: `linear-gradient(135deg, #0a0015 0%, ${C.pink}22 100%)` }}>
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center font-bold mb-4"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              background: `linear-gradient(135deg, ${C.pink}, ${C.yellow})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            One stream. Three pieces of content. Zero effort.
          </motion.h2>

          <div className="flex flex-col md:flex-row gap-5 mt-14">
            <OutputCard
              title="I spent 4 hours in the Dark Zone and here is what happened"
              preview="The raid started badly. Two squad wipes in the first hour. But by hour three we had figured out the extraction route and..."
              badge="Stream Recap"
              badgeIcon="📝"
              color={C.pink}
            />
            <OutputCard
              title="Best strategies for Dark Zone survival in 2026 — a streamer's guide"
              preview="Whether you are solo or in a squad, the Dark Zone rewards preparation. Here are the strategies that actually work in the current meta..."
              badge="SEO Article"
              badgeIcon="🔍"
              color={C.cyan}
            />
            <OutputCard
              title="Stream Highlights — June 14"
              preview="Top clips from today's stream including the clutch extraction, the 1v4 squad wipe, and the moment chat lost its mind..."
              badge="Highlights"
              badgeIcon="🎬"
              color={C.lime}
            />
          </div>

          <p className="text-center mt-10 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            3 content pieces per stream · Published in under 30 minutes · 100% automated
          </p>
        </div>
      </section>

      {/* ═══ THE NUMBERS ═══ */}
      <section className="py-20 px-6" style={{ background: `linear-gradient(135deg, ${C.cyan}, ${C.lime})` }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <BigNumber value="0" label="Minutes you spend writing recaps" delay={0} />
          <BigNumber value="3" label="Content pieces per stream" delay={0.1} />
          <BigNumber value="30" label="Minutes from stream end to published" delay={0.2} />
          <BigNumber value="∞" label="Streams that can be processed" delay={0.3} />
        </div>
      </section>

      {/* ═══ TWITCH CONNECTION ═══ */}
      <section className="py-24 md:py-32 px-6 relative" style={{ background: C.bg, backgroundImage: `radial-gradient(${C.pink}08 1px, transparent 1px)`, backgroundSize: "20px 20px" }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-bold mb-6"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: C.white }}
          >
            Works with your existing Twitch account.
          </motion.h2>
          <p className="text-sm leading-relaxed max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
            Lazy Stream connects to Twitch using your Client ID and Client Secret. It monitors your stream status every 5 minutes. When you go offline it fires automatically. No manual trigger. No app to open. No webhook to configure.
          </p>
          <TwitchConnectionCard />
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="py-24 md:py-32 px-6" style={{ background: `linear-gradient(180deg, #12022a, ${C.bg})` }}>
        <div className="max-w-lg mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-bold mb-10"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: C.white }}
          >
            Start turning streams into content.
          </motion.h2>

          <div className="p-8 rounded-xl text-left" style={{ border: `2px solid ${C.pink}`, backgroundColor: "rgba(255,45,155,0.05)" }}>
            <p className="font-bold text-2xl mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", color: C.white }}>Free</p>
            <p className="text-xs uppercase tracking-wider mb-6" style={{ color: C.pink }}>Included with any Lazy Stack install</p>
            <ul className="space-y-3 mb-8">
              {[
                "Stream detection & monitoring",
                "Automatic recap writing",
                "SEO article generation",
                "Highlights page creation",
                "Self-improving content templates",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                  <span style={{ color: C.lime }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <CopyPromptButton className="w-full justify-center" variant="gold" />
            <p className="text-[11px] text-center mt-4" style={{ color: "rgba(255,255,255,0.3)" }}>
              Paste into your existing Lovable project. Works alongside any other Lazy engine.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-20 px-6" style={{ backgroundColor: C.bg }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center font-bold mb-12" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: C.white }}>
            Frequently asked
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group rounded-lg p-5" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <summary className="cursor-pointer font-bold text-sm list-none flex items-center justify-between" style={{ color: C.white }}>
                  {faq.q}
                  <span className="text-lg" style={{ color: C.pink }}>+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="py-24 md:py-32 px-6" style={{ background: `linear-gradient(135deg, ${C.pink}, #6c2bd9)` }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-7xl md:text-8xl mb-6">📺</p>
          <h2 className="font-bold mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: C.white, lineHeight: 1.1 }}>
            Your streams deserve an audience beyond Twitch.
          </h2>
          <p className="text-base leading-relaxed max-w-xl mx-auto mb-10" style={{ color: "rgba(255,255,255,0.8)" }}>
            Every stream you do is an SEO opportunity, a blog post, and a highlights reel sitting unwritten. Lazy Stream writes them for you.
          </p>
          <CopyPromptButton variant="gold" />
        </div>
      </section>
    </div>
  );
};

export default LazyStreamPage;
