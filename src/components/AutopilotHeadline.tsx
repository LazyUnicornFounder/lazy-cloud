const PRODUCT_WORDS: Record<string, { word: string; emoji: string; tagline: string }> = {
  "lazy-run": { word: "everything", emoji: "🦄", tagline: "Launch autonomous everything." },
  "lazy-admin": { word: "dashboards", emoji: "⚙️", tagline: "Launch autonomous ops control." },
  "lazy-design": { word: "design", emoji: "🎨", tagline: "Launch autonomous UI upgrades." },
  "lazy-blogger": { word: "blogs", emoji: "✍️", tagline: "Launch autonomous blog posts." },
  "lazy-seo": { word: "SEO", emoji: "🔍", tagline: "Launch autonomous SEO content." },
  "lazy-geo": { word: "GEO", emoji: "🌐", tagline: "Launch autonomous AI citations." },
  "lazy-crawl": { word: "crawling", emoji: "🕷️", tagline: "Launch autonomous web research." },
  "lazy-contentful": { word: "CMS sync", emoji: "🔄", tagline: "Launch autonomous CMS sync." },
  "lazy-voice": { word: "podcasts", emoji: "🎙️", tagline: "Launch autonomous podcasts." },
  "lazy-stream": { word: "streams", emoji: "🎬", tagline: "Launch autonomous stream content." },
  "lazy-perplexity": { word: "research", emoji: "🔮", tagline: "Launch autonomous deep research." },
  "lazy-store": { word: "stores", emoji: "🛒", tagline: "Launch autonomous storefronts." },
  "lazy-pay": { word: "payments", emoji: "💳", tagline: "Launch autonomous payments." },
  "lazy-sms": { word: "SMS", emoji: "📱", tagline: "Launch autonomous text campaigns." },
  "lazy-github": { word: "commits", emoji: "👨‍💻", tagline: "Launch autonomous changelogs." },
  "lazy-gitlab": { word: "merges", emoji: "🔀", tagline: "Launch autonomous GitLab docs." },
  "lazy-supabase": { word: "databases", emoji: "🗄️", tagline: "Launch autonomous database reports." },
  "lazy-linear": { word: "sprints", emoji: "✅", tagline: "Launch autonomous issue content." },
  "lazy-mail": { word: "emails", emoji: "📧", tagline: "Launch autonomous email flows." },
  "lazy-alert": { word: "alerts", emoji: "🔔", tagline: "Launch autonomous Slack alerts." },
  "lazy-telegram": { word: "Telegram", emoji: "✈️", tagline: "Launch autonomous Telegram updates." },
  "lazy-security": { word: "security", emoji: "🛡️", tagline: "Launch autonomous pentesting." },
  "lazy-auth": { word: "auth", emoji: "🔐", tagline: "Launch autonomous login flows." },
  "lazy-granola": { word: "meetings", emoji: "📝", tagline: "Launch autonomous meeting content." },
  "lazy-drop": { word: "dropshipping", emoji: "📦", tagline: "Launch autonomous dropshipping." },
  "lazy-print": { word: "merch", emoji: "🖨️", tagline: "Launch autonomous print-on-demand." },
  "lazy-youtube": { word: "YouTube", emoji: "📺", tagline: "Launch autonomous video content." },
};

interface AutopilotHeadlineProps {
  product: string;
}

export default function AutopilotHeadline({ product }: AutopilotHeadlineProps) {
  const entry = PRODUCT_WORDS[product];
  if (!entry) return null;

  return (
    <div className="mb-4">
      <p
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(0.8rem, 2vw, 1.3rem)",
          color: "#f0ead6",
          opacity: 0.5,
        }}
      >
        Lovable<span className="ml-1 mr-1">❤️</span>
        <span style={{ color: "#c8a961" }}>
          {entry.word} {entry.emoji}
        </span>
        <span className="ml-1">on autopilot 🤖</span>
      </p>
      <p
        className="mt-2"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
          color: "#f0ead6",
          opacity: 0.35,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {entry.tagline}
      </p>
    </div>
  );
}
