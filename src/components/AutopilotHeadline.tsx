const PRODUCT_WORDS: Record<string, { word: string; emoji: string }> = {
  "lazy-run": { word: "everything", emoji: "🦄" },
  "lazy-admin": { word: "dashboards", emoji: "⚙️" },
  "lazy-design": { word: "design", emoji: "🎨" },
  "lazy-blogger": { word: "blogs", emoji: "✍️" },
  "lazy-seo": { word: "SEO", emoji: "🔍" },
  "lazy-geo": { word: "GEO", emoji: "🌐" },
  "lazy-crawl": { word: "crawling", emoji: "🕷️" },
  "lazy-contentful": { word: "CMS sync", emoji: "🔄" },
  "lazy-voice": { word: "podcasts", emoji: "🎙️" },
  "lazy-stream": { word: "streams", emoji: "🎬" },
  "lazy-perplexity": { word: "research", emoji: "🔮" },
  "lazy-store": { word: "stores", emoji: "🛒" },
  "lazy-pay": { word: "payments", emoji: "💳" },
  "lazy-sms": { word: "SMS", emoji: "📱" },
  "lazy-github": { word: "commits", emoji: "👨‍💻" },
  "lazy-gitlab": { word: "merges", emoji: "🔀" },
  "lazy-supabase": { word: "databases", emoji: "🗄️" },
  "lazy-linear": { word: "sprints", emoji: "✅" },
  "lazy-mail": { word: "emails", emoji: "📧" },
  "lazy-alert": { word: "alerts", emoji: "🔔" },
  "lazy-telegram": { word: "Telegram", emoji: "✈️" },
  "lazy-security": { word: "security", emoji: "🛡️" },
  "lazy-auth": { word: "auth", emoji: "🔐" },
  "lazy-shop": { word: "stores", emoji: "🛒" },
};

interface AutopilotHeadlineProps {
  product: string;
}

export default function AutopilotHeadline({ product }: AutopilotHeadlineProps) {
  const entry = PRODUCT_WORDS[product];
  if (!entry) return null;

  return (
    <p
      className="mb-4"
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
  );
}
