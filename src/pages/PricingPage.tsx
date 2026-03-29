import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

interface Product {
  name: string;
  tagline: string;
  link: string;
  free: string[];
  pro: { price: string; features: string[]; comingSoon?: boolean };
}

interface Category {
  key: string;
  label: string;
  products: Product[];
}

const categories: Category[] = [
  {
    key: "unicorn",
    label: "Unicorn",
    products: [
      {
        name: "Lazy Run", tagline: "Autonomous operations layer", link: "/lazy-run",
        free: ["Setup prompt included", "All 25 engines in one prompt", "Unified admin dashboard", "Master orchestrator", "Weekly AI performance report"],
        pro: { price: "$99", features: ["Hosted version — zero config", "Auto-scaling engine execution", "Priority AI model access", "Dedicated support", "Custom engine configuration"], comingSoon: true },
      },
    ],
  },
  {
    key: "content",
    label: "Content",
    products: [
      { name: "Lazy Blogger", tagline: "Autonomous blog engine", link: "/lazy-blogger", free: ["Setup prompt included", "Unlimited AI-generated posts", "Custom tone, topics & frequency", "Auto-publish on schedule"], pro: { price: "$19", features: ["Hosted version — no setup needed", "Multi-site publishing", "Social media cross-posting", "Advanced analytics dashboard"], comingSoon: true } },
      { name: "Lazy SEO", tagline: "Autonomous SEO engine", link: "/lazy-seo", free: ["Setup prompt included", "Keyword discovery & tracking", "SEO-optimised article generation", "Auto-publish to your blog"], pro: { price: "$19", features: ["Hosted version", "Backlink monitoring", "Competitor keyword tracking", "Weekly SEO reports"], comingSoon: true } },
      { name: "Lazy GEO", tagline: "Autonomous GEO engine", link: "/lazy-geo", free: ["Setup prompt included", "AI citation tracking", "Citation-ready content generation", "Brand mention detection"], pro: { price: "$19", features: ["Hosted version", "Real-time citation alerts", "Competitor citation tracking", "Monthly GEO reports"], comingSoon: true } },
      { name: "Lazy Crawl", tagline: "Autonomous web intelligence", link: "/lazy-crawl", free: ["Setup prompt included", "Competitor website monitoring", "Trend & keyword extraction", "Lead discovery from directories"], pro: { price: "$19", features: ["Hosted version", "Firecrawl API costs included", "Daily competitor reports", "Advanced change detection"], comingSoon: true } },
      { name: "Lazy Perplexity", tagline: "Autonomous research engine", link: "/lazy-perplexity", free: ["Setup prompt included", "Real-time niche research", "Citation-rich content generation", "Brand visibility testing"], pro: { price: "$29", features: ["Hosted version", "Daily citation monitoring", "Competitive citation tracking", "Advanced scheduling"], comingSoon: true } },
      { name: "Lazy Contentful", tagline: "Autonomous Contentful bridge", link: "/lazy-contentful", free: ["Setup prompt included", "Two-way content sync", "Webhook real-time updates", "Content type mapping"], pro: { price: "$29", features: ["Hosted version", "Multi-space support", "Advanced content type mapping", "Scheduled sync windows"], comingSoon: true } },
    ],
  },
  {
    key: "commerce",
    label: "Commerce",
    products: [
      { name: "Lazy Store", tagline: "Autonomous Shopify engine", link: "/lazy-store", free: ["Setup prompt included", "Shopify integration", "Product discovery & listing", "Conversion optimisation"], pro: { price: "$29", features: ["Hosted version", "Multi-store management", "Advanced pricing algorithms", "Revenue analytics"], comingSoon: true } },
      { name: "Lazy Drop", tagline: "Autonomous dropshipping", link: "/lazy-drop", free: ["Setup prompt included", "AutoDS integration", "Product discovery & import", "Automatic fulfilment"], pro: { price: "$29", features: ["Hosted version", "Multi-store management", "Advanced product analytics", "Priority AI model access"], comingSoon: true } },
      { name: "Lazy Print", tagline: "Autonomous print-on-demand", link: "/lazy-print", free: ["Setup prompt included", "Printful integration", "AI-written descriptions", "Order fulfilment"], pro: { price: "$29", features: ["Hosted version", "Multi-store management", "Bulk design upload", "Advanced analytics"], comingSoon: true } },
      { name: "Lazy Pay", tagline: "Autonomous payments engine", link: "/lazy-pay", free: ["Setup prompt included", "Polar integration", "Checkout & subscriptions", "Payment webhooks"], pro: { price: "$19", features: ["Hosted version", "Multi-gateway support", "Revenue dashboards", "Automated dunning"], comingSoon: true } },
      { name: "Lazy SMS", tagline: "Autonomous SMS engine", link: "/lazy-sms", free: ["Setup prompt included", "Twilio integration", "Automated SMS campaigns", "Conversion tracking"], pro: { price: "$19", features: ["Hosted version", "Advanced segmentation", "A/B testing", "Compliance automation"], comingSoon: true } },
      { name: "Lazy Mail", tagline: "Autonomous email engine", link: "/lazy-mail", free: ["Setup prompt included", "Subscriber capture", "AI-written welcome sequences", "Self-improving subject lines"], pro: { price: "$19", features: ["Hosted version — zero config", "Multi-list segmentation", "A/B testing", "Advanced analytics"], comingSoon: true } },
    ],
  },
  {
    key: "media",
    label: "Media",
    products: [
      { name: "Lazy Voice", tagline: "Autonomous audio engine", link: "/lazy-voice", free: ["Setup prompt included", "Blog-to-podcast conversion", "AI voice narration", "RSS feed generation"], pro: { price: "$19", features: ["Hosted version", "Custom voice cloning", "Multi-language narration", "Listener analytics"], comingSoon: true } },
      { name: "Lazy Stream", tagline: "Autonomous Twitch engine", link: "/lazy-stream", free: ["Setup prompt included", "VOD transcription", "Stream recap generation", "SEO article writing"], pro: { price: "$19", features: ["Hosted version", "Automatic clip editing", "YouTube cross-posting", "Advanced analytics"], comingSoon: true } },
      { name: "Lazy YouTube", tagline: "Autonomous YouTube engine", link: "/lazy-youtube", free: ["Setup prompt included", "Video-to-transcript publishing", "SEO + GEO article generation", "Auto chapter markers"], pro: { price: "$19", features: ["Hosted version", "Comment intelligence extraction", "Multi-channel support", "Advanced analytics"], comingSoon: true } },
    ],
  },
  {
    key: "dev",
    label: "Dev",
    products: [
      { name: "Lazy GitHub", tagline: "Autonomous GitHub engine", link: "/lazy-github", free: ["Setup prompt included", "Commit-to-changelog generation", "Release notes automation", "Developer blog publishing"], pro: { price: "$19", features: ["Hosted version", "Multi-repo support", "Advanced formatting", "API docs generation"], comingSoon: true } },
      { name: "Lazy GitLab", tagline: "Autonomous GitLab engine", link: "/lazy-gitlab", free: ["Setup prompt included", "Changelog generation", "Release notes automation", "Developer blog publishing"], pro: { price: "$19", features: ["Hosted version", "Multi-repo support", "Advanced formatting", "Custom templates"], comingSoon: true } },
      { name: "Lazy Linear", tagline: "Autonomous Linear engine", link: "/lazy-linear", free: ["Setup prompt included", "Changelog from cycles", "Public roadmap publishing", "Product blog posts"], pro: { price: "$19", features: ["Hosted version", "Multi-team support", "Advanced formatting", "Custom publishing rules"], comingSoon: true } },
      { name: "Lazy Design", tagline: "Autonomous design engine", link: "/lazy-design", free: ["Setup prompt included", "Page auditing", "21st.dev component suggestions", "AI fallback prompts"], pro: { price: "$19", features: ["Hosted version — zero config", "Automated weekly upgrades", "Advanced brand matching", "Multi-project support"], comingSoon: true } },
      { name: "Lazy Auth", tagline: "Autonomous auth engine", link: "/lazy-auth", free: ["Setup prompt included", "Google Sign-In", "Email/password & magic link", "Protected routes & roles"], pro: { price: "$19", features: ["Hosted version — zero config", "Multi-tenant support", "Advanced session analytics", "Custom OAuth providers"], comingSoon: true } },
      { name: "Lazy Granola", tagline: "Autonomous meeting engine", link: "/lazy-granola", free: ["Setup prompt included", "Granola meeting sync", "Auto blog posts from meetings", "Customer intelligence extraction"], pro: { price: "$19", features: ["Hosted version — zero config", "Multi-workspace support", "Advanced classification", "Custom output templates"], comingSoon: true } },
    ],
  },
  {
    key: "ops",
    label: "Ops",
    products: [
      { name: "Lazy Admin", tagline: "Unified dashboard for every engine", link: "/lazy-admin", free: ["Setup prompt included", "Auto-detects installed engines", "Master status indicator", "Unified activity feed", "Per-engine deep dives"], pro: { price: "$9", features: ["Hosted version", "Multi-project support", "Team access with roles", "Weekly email digest", "Mobile app"], comingSoon: true } },
      { name: "Lazy Alert", tagline: "Real-time Slack alerts", link: "/lazy-alert", free: ["Setup prompt included", "Real-time event alerts", "Daily morning briefing", "Slash commands"], pro: { price: "$9", features: ["Hosted version", "Custom branded bot", "Advanced filtering", "Multi-channel routing"], comingSoon: true } },
      { name: "Lazy Telegram", tagline: "Autonomous Telegram alerts", link: "/lazy-telegram", free: ["Setup prompt included", "Real-time event alerts", "Daily morning briefing", "Bot commands"], pro: { price: "$9", features: ["Hosted version", "Group chat support", "Multiple recipient routing", "Custom bot branding"], comingSoon: true } },
      { name: "Lazy Supabase", tagline: "Autonomous database monitoring", link: "/lazy-supabase", free: ["Setup prompt included", "User milestone detection", "Edge function monitoring", "Weekly growth reports"], pro: { price: "$19", features: ["Hosted version", "Multi-project monitoring", "Advanced analytics", "Custom thresholds"], comingSoon: true } },
      { name: "Lazy Security", tagline: "Autonomous security engine", link: "/lazy-security", free: ["Setup prompt included", "Automated Aikido pentesting", "Vulnerability monitoring", "Audit-ready reports"], pro: { price: "$19", features: ["Hosted version", "Automated report delivery", "Multi-project dashboard", "Alert integrations"], comingSoon: true } },
    ],
  },
  {
    key: "agents",
    label: "Agents",
    products: [
      { name: "Lazy Watch", tagline: "Autonomous error monitoring", link: "/lazy-watch", free: ["Setup prompt included", "Hourly error table scanning", "Root cause diagnosis via AI", "Auto GitHub issue creation"], pro: { price: "$19", features: ["Hosted version", "Custom alert thresholds", "Multi-project monitoring", "Slack/Telegram alerts"], comingSoon: true } },
      { name: "Lazy Fix", tagline: "Autonomous prompt improvement", link: "/lazy-fix", free: ["Setup prompt included", "Weekly performance analysis", "Targeted prompt edits", "Auto GitHub PR creation"], pro: { price: "$19", features: ["Hosted version", "Daily improvement cycles", "A/B testing prompts", "Performance dashboards"], comingSoon: true } },
      { name: "Lazy Build", tagline: "Autonomous engine writer", link: "/lazy-build", free: ["Setup prompt included", "One-paragraph brief to engine", "Database schema generation", "Edge function scaffolding"], pro: { price: "$29", features: ["Hosted version", "Multi-engine generation", "Custom templates", "Priority AI model access"], comingSoon: true } },
      { name: "Lazy Intel", tagline: "Autonomous content strategist", link: "/lazy-intel", free: ["Setup prompt included", "Weekly strategy briefs", "SEO keyword generation", "GEO query generation"], pro: { price: "$19", features: ["Hosted version", "Daily intelligence cycles", "Competitor analysis", "Custom data sources"], comingSoon: true } },
      { name: "Lazy Repurpose", tagline: "Autonomous content repurposing", link: "/lazy-repurpose", free: ["Setup prompt included", "Weekly content repurposing", "Twitter threads", "LinkedIn posts", "Newsletter sections", "Video scripts"], pro: { price: "$19", features: ["Hosted version", "Direct Twitter posting", "Direct LinkedIn posting", "Advanced scheduling"], comingSoon: true } },
      { name: "Lazy Trend", tagline: "Autonomous trend detection", link: "/lazy-trend", free: ["Setup prompt included", "6-hourly trend scanning", "Perplexity + Firecrawl sources", "Auto SEO/GEO queueing", "Slack alerts"], pro: { price: "$19", features: ["Hosted version", "Custom trend sources", "Advanced signal scoring", "Multi-niche monitoring"], comingSoon: true } },
      { name: "Lazy Churn", tagline: "Autonomous churn prevention", link: "/lazy-churn", free: ["Setup prompt included", "Daily Stripe subscriber monitoring", "AI risk scoring", "Personalised SMS + email", "Recovery tracking"], pro: { price: "$29", features: ["Hosted version", "Advanced analytics", "Multi-product monitoring", "Custom intervention rules"], comingSoon: true } },
    ],
  },
];

const PricingPage = () => {
  const [activeTab, setActiveTab] = useState("unicorn");
  const activeCategory = categories.find(c => c.key === activeTab)!;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Pricing — Lazy Unicorn Autonomous Agents"
        description="Every agent is free to install. Copy the prompt, paste it into your Lovable project, and start growing autonomously."
        url="/pricing"
        keywords="Lazy Unicorn pricing, autonomous agents pricing, Lovable tools pricing, free AI tools"
      />
      <Navbar />

      <main className="pt-32 pb-20">
        {/* Hero */}
        <section className="px-6 md:px-12 max-w-4xl mx-auto text-center mb-16">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.p variants={fadeUp} transition={{ duration: 0.6 }} style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2rem", color: "#f0ead6", opacity: 0.5 }}>
              Pricing
            </motion.p>
            <motion.h1 variants={fadeUp} transition={{ duration: 0.8 }} className="mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 3.2rem)", color: "#f0ead6", lineHeight: 1.1 }}>
              Every agent is free to install.
            </motion.h1>
            <motion.p variants={fadeUp} transition={{ duration: 0.6 }} className="mt-4 font-body text-sm text-foreground/50 max-w-xl mx-auto leading-relaxed">
              Copy the prompt. Paste it into your Lovable project. The agent installs itself. Pro tiers are coming soon for teams who want a hosted, zero-config experience.
            </motion.p>
          </motion.div>
        </section>

        {/* Category tabs */}
        <section className="px-6 md:px-12 max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                className={`font-body text-sm px-4 py-2 rounded-lg transition-all ${
                  activeTab === cat.key
                    ? "bg-foreground text-background font-semibold"
                    : "bg-card border border-border text-foreground/60 hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {cat.label}
                <span className="ml-1.5 text-xs opacity-60">({cat.products.length})</span>
              </button>
            ))}
          </div>

          {/* Product cards grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {activeCategory.products.map((product) => (
                <div key={product.name} className="border border-border rounded-xl bg-card overflow-hidden flex flex-col">
                  {/* Card header */}
                  <div className="px-6 pt-6 pb-4 border-b border-border">
                    <Link to={product.link} className="group">
                      <h2 className="font-display text-lg font-bold text-foreground group-hover:text-foreground/80 transition-colors">
                        {product.name}
                      </h2>
                    </Link>
                    <p className="font-body text-xs text-foreground/50 uppercase tracking-wider mt-0.5">{product.tagline}</p>
                  </div>

                  {/* Two tiers side by side */}
                  <div className="grid grid-cols-2 divide-x divide-border flex-1">
                    {/* Free */}
                    <div className="p-5 flex flex-col">
                      <p className="font-display text-xl font-bold text-foreground">$0</p>
                      <p className="font-body text-[11px] text-foreground/40 uppercase tracking-wider mb-3">Free</p>
                      <ul className="space-y-1.5 flex-1">
                        {product.free.map((f, i) => (
                          <li key={i} className="font-body text-xs text-foreground/60 flex items-start gap-1.5">
                            <Check size={11} className="text-foreground/40 mt-0.5 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link
                        to={product.link}
                        className="mt-4 w-full inline-flex items-center justify-center font-body text-[11px] tracking-[0.12em] uppercase px-4 py-2 font-semibold bg-foreground text-background hover:opacity-90 transition-opacity rounded"
                      >
                        Get Prompt
                      </Link>
                    </div>

                    {/* Pro */}
                    <div className="p-5 flex flex-col relative">
                      {product.pro.comingSoon && (
                        <span className="absolute top-2 right-2 font-body text-[9px] tracking-[0.12em] uppercase px-1.5 py-0.5 border border-yellow-600/30 text-yellow-600/50 rounded">
                          Soon
                        </span>
                      )}
                      <p className="font-display text-xl font-bold text-foreground">
                        {product.pro.price}<span className="text-xs font-normal text-foreground/50">/mo</span>
                      </p>
                      <p className="font-body text-[11px] text-foreground/40 uppercase tracking-wider mb-3">Pro</p>
                      <ul className="space-y-1.5 flex-1">
                        {product.pro.features.map((f, i) => (
                          <li key={i} className="font-body text-xs text-foreground/60 flex items-start gap-1.5">
                            <Check size={11} className="text-foreground/40 mt-0.5 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <button
                        disabled
                        className="mt-4 w-full font-body text-[11px] tracking-[0.12em] uppercase px-4 py-2 font-semibold border border-border text-foreground/40 cursor-not-allowed rounded"
                      >
                        Coming Soon
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Bottom */}
        <section className="mt-20 px-6 md:px-12 max-w-3xl mx-auto text-center">
          <p className="font-body text-sm text-foreground/50 leading-relaxed">
            All engines are self-hosted in your own Lovable project. You own the code, the data, and the content. Pro tiers will offer a fully managed hosted experience — no API keys, no setup, just results.
          </p>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", color: "#f0ead6", opacity: 0.4, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "3rem" }}>
            Made for Lovable
          </p>
        </section>
      </main>
    </div>
  );
};

export default PricingPage;
