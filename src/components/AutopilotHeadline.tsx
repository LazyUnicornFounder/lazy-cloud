const PRODUCT_WORDS: Record<string, { word: string; emoji: string; tagline: string }> = {
  "lazy-run": { word: "everything", emoji: "🦄", tagline: "Autonomous everything" },
  "lazy-admin": { word: "dashboards", emoji: "⚙️", tagline: "Autonomous ops control" },
  "lazy-design": { word: "design", emoji: "🎨", tagline: "Autonomous UI upgrades" },
  "lazy-blogger": { word: "blogs", emoji: "✍️", tagline: "Autonomous blog posts" },
  "lazy-seo": { word: "SEO", emoji: "🔍", tagline: "Autonomous SEO content" },
  "lazy-geo": { word: "GEO", emoji: "🌐", tagline: "Autonomous AI citations" },
  "lazy-crawl": { word: "crawling", emoji: "🕷️", tagline: "Autonomous web research" },
  "lazy-contentful": { word: "CMS sync", emoji: "🔄", tagline: "Autonomous CMS sync" },
  "lazy-voice": { word: "podcasts", emoji: "🎙️", tagline: "Autonomous podcasts" },
  "lazy-stream": { word: "streams", emoji: "🎬", tagline: "Autonomous stream content" },
  "lazy-perplexity": { word: "research", emoji: "🔮", tagline: "Autonomous deep research" },
  "lazy-store": { word: "stores", emoji: "🛒", tagline: "Autonomous storefronts" },
  "lazy-pay": { word: "payments", emoji: "💳", tagline: "Autonomous payments" },
  "lazy-sms": { word: "SMS", emoji: "📱", tagline: "Autonomous text campaigns" },
  "lazy-github": { word: "commits", emoji: "👨‍💻", tagline: "Autonomous changelogs" },
  "lazy-gitlab": { word: "merges", emoji: "🔀", tagline: "Autonomous GitLab docs" },
  "lazy-supabase": { word: "databases", emoji: "🗄️", tagline: "Autonomous database reports" },
  "lazy-linear": { word: "sprints", emoji: "✅", tagline: "Autonomous issue content" },
  "lazy-mail": { word: "emails", emoji: "📧", tagline: "Autonomous email flows" },
  "lazy-alert": { word: "alerts", emoji: "🔔", tagline: "Autonomous Slack alerts" },
  "lazy-telegram": { word: "Telegram", emoji: "✈️", tagline: "Autonomous Telegram updates" },
  "lazy-security": { word: "security", emoji: "🛡️", tagline: "Autonomous pentesting" },
  "lazy-auth": { word: "auth", emoji: "🔐", tagline: "Autonomous login flows" },
  "lazy-granola": { word: "meetings", emoji: "📝", tagline: "Autonomous meeting content" },
  "lazy-drop": { word: "dropshipping", emoji: "📦", tagline: "Autonomous dropshipping" },
  "lazy-print": { word: "merch", emoji: "🖨️", tagline: "Autonomous print-on-demand" },
  "lazy-youtube": { word: "YouTube", emoji: "📺", tagline: "Autonomous video content" },
  "lazy-watch": { word: "monitoring", emoji: "👁️", tagline: "Autonomous error monitoring" },
  "lazy-fix": { word: "prompts", emoji: "🔧", tagline: "Autonomous prompt improvement" },
  "lazy-build": { word: "agent", emoji: "🏗️", tagline: "Autonomous agent writing" },
  "lazy-intel": { word: "strategy", emoji: "📊", tagline: "Autonomous content strategy" },
  "lazy-repurpose": { word: "repurposing", emoji: "🔄", tagline: "Autonomous content repurposing" },
  "lazy-trend": { word: "trends", emoji: "🔥", tagline: "Autonomous trend detection" },
  "lazy-churn": { word: "retention", emoji: "💰", tagline: "Autonomous churn prevention" },
  "lazy-waitlist": { word: "waitlists", emoji: "📋", tagline: "Autonomous pre-launch capture" },
  "lazy-launch": { word: "websites", emoji: "🚀", tagline: "Launch your Lovable website" },
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
