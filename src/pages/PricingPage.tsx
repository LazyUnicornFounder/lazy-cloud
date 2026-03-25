import { motion } from "framer-motion";
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

const products: Product[] = [
  {
    name: "Lazy Run",
    tagline: "Autonomous operations layer",
    link: "/lazy-run",
    free: ["Setup prompt included", "All engines in one prompt", "Unified admin dashboard", "Master orchestrator", "Weekly AI performance report"],
    pro: { price: "$99", features: ["Hosted version — zero config", "Auto-scaling engine execution", "Priority AI model access", "Dedicated support", "Custom engine configuration"], comingSoon: true },
  },
  {
    name: "Lazy Blogger",
    tagline: "Autonomous blog engine",
    link: "/lazy-blogger",
    free: ["Setup prompt included", "Self-hosted in your Lovable project", "Unlimited AI-generated posts", "Custom tone, topics & frequency", "Auto-publish on schedule"],
    pro: { price: "$19", features: ["Hosted version — no setup needed", "Multi-site publishing", "Social media cross-posting", "Advanced analytics dashboard", "Priority AI model access"], comingSoon: true },
  },
  {
    name: "Lazy SEO",
    tagline: "Autonomous SEO engine",
    link: "/lazy-seo",
    free: ["Setup prompt included", "Keyword discovery & tracking", "SEO-optimised article generation", "Google Search Console integration", "Auto-publish to your blog"],
    pro: { price: "$19", features: ["Hosted version", "Backlink monitoring", "Competitor keyword tracking", "Content gap analysis", "Weekly SEO reports"], comingSoon: true },
  },
  {
    name: "Lazy GEO",
    tagline: "Autonomous GEO engine",
    link: "/lazy-geo",
    free: ["Setup prompt included", "AI citation tracking", "Citation-ready content generation", "Multi-engine monitoring", "Brand mention detection"],
    pro: { price: "$19", features: ["Hosted version", "Real-time citation alerts", "Competitor citation tracking", "Citation influence scoring", "Monthly GEO reports"], comingSoon: true },
  },
  {
    name: "Lazy Voice",
    tagline: "Autonomous audio engine",
    link: "/lazy-voice",
    free: ["Setup prompt included", "Blog-to-podcast conversion", "AI voice narration", "RSS feed generation", "Auto-publish episodes"],
    pro: { price: "$19", features: ["Hosted version", "Custom voice cloning", "Multi-language narration", "Spotify & Apple distribution", "Listener analytics"], comingSoon: true },
  },
  {
    name: "Lazy Store",
    tagline: "Autonomous Shopify store engine",
    link: "/lazy-store",
    free: ["Setup prompt included", "Shopify integration", "Product discovery & listing", "Price monitoring", "Conversion optimisation"],
    pro: { price: "$29", features: ["Hosted version", "Multi-store management", "Advanced pricing algorithms", "Automated ad campaigns", "Revenue analytics"], comingSoon: true },
  },
  {
    name: "Lazy Pay",
    tagline: "Autonomous payments engine",
    link: "/lazy-pay",
    free: ["Setup prompt included", "Polar integration", "Checkout flow generation", "Subscription management", "Payment webhooks"],
    pro: { price: "$19", features: ["Hosted version", "Multi-gateway support", "Revenue dashboards", "Churn prediction", "Automated dunning"], comingSoon: true },
  },
  {
    name: "Lazy GitHub",
    tagline: "Autonomous GitHub content engine",
    link: "/lazy-github",
    free: ["Setup prompt included", "Commit-to-changelog generation", "Release notes automation", "Developer blog publishing", "GitHub webhook integration"],
    pro: { price: "$19", features: ["Hosted version", "Multi-repo support", "Advanced changelog formatting", "API documentation generation", "Custom templates"], comingSoon: true },
  },
  {
    name: "Lazy GitLab",
    tagline: "Autonomous GitLab content engine",
    link: "/lazy-gitlab",
    free: ["Setup prompt included", "Changelog generation", "Release notes automation", "Developer blog publishing", "GitLab webhook integration"],
    pro: { price: "$19", features: ["Hosted version", "Multi-repo support", "Advanced changelog formatting", "Custom templates"], comingSoon: true },
  },
  {
    name: "Lazy SMS",
    tagline: "Autonomous SMS engine",
    link: "/lazy-sms",
    free: ["Setup prompt included", "Twilio integration", "Automated SMS campaigns", "Contact management", "Conversion tracking"],
    pro: { price: "$19", features: ["Hosted version", "Advanced segmentation", "A/B testing", "Multi-channel messaging", "Compliance automation"], comingSoon: true },
  },
  {
    name: "Lazy Stream",
    tagline: "Autonomous Twitch content engine",
    link: "/lazy-stream",
    free: ["Setup prompt included", "VOD transcription", "Stream recap generation", "Clip extraction", "SEO article writing"],
    pro: { price: "$19", features: ["Hosted version", "Automatic clip editing", "YouTube cross-posting", "Advanced stream analytics", "Self-improving content"], comingSoon: true },
  },
  {
    name: "Lazy Linear",
    tagline: "Autonomous Linear content engine",
    link: "/lazy-linear",
    free: ["Setup prompt included", "Changelog generation from cycles", "Public roadmap publishing", "Product blog posts", "Works with any Linear plan"],
    pro: { price: "$19", features: ["Hosted version", "Multi-team support", "Advanced content formatting", "Custom publishing rules"], comingSoon: true },
  },
  {
    name: "Lazy Contentful",
    tagline: "Autonomous Contentful bridge",
    link: "/lazy-contentful",
    free: ["Setup prompt included", "Two-way content sync", "Webhook real-time updates", "Content type mapping", "Works with free Contentful tier"],
    pro: { price: "$29", features: ["Hosted version", "Multi-space support", "Advanced content type mapping", "Scheduled sync windows"], comingSoon: true },
  },
  {
    name: "Lazy Crawl",
    tagline: "Autonomous web intelligence engine",
    link: "/lazy-crawl",
    free: ["Setup prompt included", "Competitor website monitoring", "Trend extraction & keyword discovery", "Lead discovery from directories", "Bring your own Firecrawl API key"],
    pro: { price: "$19", features: ["Hosted version", "Firecrawl API costs included", "Daily competitor reports", "Advanced change detection", "Priority processing"], comingSoon: true },
  },
  {
    name: "Lazy Perplexity",
    tagline: "Autonomous research & citation engine",
    link: "/lazy-perplexity",
    free: ["Setup prompt included", "Real-time niche research", "Citation-rich content generation", "Brand visibility testing", "Bring your own Perplexity API key"],
    pro: { price: "$29", features: ["Hosted version", "Daily citation monitoring", "Competitive citation tracking", "Advanced research scheduling"], comingSoon: true },
  },
  {
    name: "Lazy Supabase",
    tagline: "Autonomous database monitoring engine",
    link: "/lazy-supabase",
    free: ["Setup prompt included", "User milestone detection", "Edge function error monitoring", "Row milestone tracking", "Weekly growth reports"],
    pro: { price: "$19", features: ["Hosted version", "Multi-project monitoring", "Advanced growth analytics", "Custom milestone thresholds"], comingSoon: true },
  },
  {
    name: "Lazy Alert",
    tagline: "Real-time Slack alerts for every engine",
    link: "/lazy-alert",
    free: ["Setup prompt included", "Real-time event alerts to Slack", "Daily morning briefing", "Slash commands for engine control", "Bring your own Slack workspace"],
    pro: { price: "$9", features: ["Hosted version", "Custom Slack bot with branded avatar", "Advanced filtering", "Multiple channel routing by event type"], comingSoon: true },
  },
  {
    name: "Lazy Telegram",
    tagline: "Autonomous Telegram alerts",
    link: "/lazy-telegram",
    free: ["Setup prompt included", "Real-time event alerts", "Daily morning briefing", "Bot commands for engine control", "Telegram bots are free"],
    pro: { price: "$9", features: ["Hosted version", "Group chat support", "Multiple recipient routing", "Custom bot branding"], comingSoon: true },
  },
  {
    name: "Lazy Security",
    tagline: "Autonomous security monitoring engine",
    link: "/lazy-security",
    free: ["Setup prompt included", "Automated Aikido pentesting", "Continuous vulnerability monitoring", "Security score tracking", "Audit-ready report generation"],
    pro: { price: "$19", features: ["Hosted version", "Automated report delivery before meetings", "Multi-project security dashboard", "Slack and Telegram alerts included"], comingSoon: true },
  },
  {
    name: "Lazy Admin",
    tagline: "Unified dashboard for every engine",
    link: "/lazy-admin",
    free: ["Setup prompt included", "Auto-detects installed engines", "Master status indicator", "Unified activity feed", "Per-engine deep dives"],
    pro: { price: "$9", features: ["Hosted version", "Multi-project support", "Team access with roles", "Weekly email digest", "Mobile app"], comingSoon: true },
  },
];

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Pricing — Lazy Unicorn Autonomous Engines"
        description="Every engine is free to install. Copy the prompt, paste it into your Lovable project, and start growing autonomously."
        url="/pricing"
        keywords="Lazy Unicorn pricing, autonomous engines pricing, Lovable tools pricing, free AI tools"
      />
      <Navbar />

      <main className="pt-32 pb-20">
        {/* Hero */}
        <section className="px-6 md:px-12 max-w-4xl mx-auto text-center mb-20">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.p variants={fadeUp} transition={{ duration: 0.6 }} style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2rem", color: "#f0ead6", opacity: 0.4 }}>
              Pricing
            </motion.p>
            <motion.h1 variants={fadeUp} transition={{ duration: 0.8 }} className="mt-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 3.2rem)", color: "#f0ead6", lineHeight: 1.1 }}>
              Every engine is free to install.
            </motion.h1>
            <motion.p variants={fadeUp} transition={{ duration: 0.6 }} className="mt-4 font-body text-sm text-foreground/50 max-w-xl mx-auto leading-relaxed">
              Copy the prompt. Paste it into your Lovable project. The engine installs itself. You bring your own API keys — we never touch your data. Pro tiers are coming soon for teams who want a hosted, zero-config experience.
            </motion.p>
          </motion.div>
        </section>

        {/* Product pricing cards */}
        <section className="px-6 md:px-12 max-w-5xl mx-auto">
          <div className="space-y-16">
            {products.map((product, idx) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.04 }}
              >
                {/* Product header */}
                <div className="mb-6">
                  <Link to={product.link} className="group inline-block">
                    <h2 className="font-display text-xl font-bold text-foreground group-hover:text-foreground/80 transition-colors">
                      {product.name}
                    </h2>
                  </Link>
                  <p className="font-body text-xs text-foreground/30 uppercase tracking-wider mt-1">{product.tagline}</p>
                </div>

                {/* Two-column pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
                  {/* Free */}
                  <div className="bg-card p-8 flex flex-col">
                    <div className="mb-6">
                      <h3 className="font-display text-base font-bold text-foreground">Free</h3>
                      <p className="font-display text-3xl font-bold text-foreground mt-1">$0</p>
                    </div>
                    <ul className="space-y-2.5 flex-1">
                      {product.free.map((f, i) => (
                        <li key={i} className="font-body text-sm text-foreground/40 flex items-start gap-2">
                          <Check size={14} className="text-foreground/25 mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={product.link}
                      className="mt-6 w-full inline-flex items-center justify-center font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold bg-foreground text-background hover:opacity-90 transition-opacity"
                    >
                      Get the Prompt
                    </Link>
                  </div>

                  {/* Pro */}
                  <div className="bg-card p-8 flex flex-col relative">
                    {product.pro.comingSoon && (
                      <span className="absolute top-4 right-4 font-body text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 border border-yellow-600/30 text-yellow-600/60">
                        Coming Soon
                      </span>
                    )}
                    <div className="mb-6">
                      <h3 className="font-display text-base font-bold text-foreground">Pro</h3>
                      <p className="font-display text-3xl font-bold text-foreground mt-1">
                        {product.pro.price}<span className="text-sm font-normal text-foreground/30">/mo</span>
                      </p>
                    </div>
                    <ul className="space-y-2.5 flex-1">
                      {product.pro.features.map((f, i) => (
                        <li key={i} className="font-body text-sm text-foreground/40 flex items-start gap-2">
                          <Check size={14} className="text-foreground/25 mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      disabled
                      className="mt-6 w-full font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/25 cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bottom */}
        <section className="mt-24 px-6 md:px-12 max-w-3xl mx-auto text-center">
          <p className="font-body text-sm text-foreground/40 leading-relaxed">
            All engines are self-hosted in your own Lovable project. You own the code, the data, and the content. Pro tiers will offer a fully managed hosted experience — no API keys, no setup, just results.
          </p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.65rem", color: "#f0ead6", opacity: 0.2, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "3rem" }}>
            Made for Lovable
          </p>
        </section>
      </main>
    </div>
  );
};

export default PricingPage;
