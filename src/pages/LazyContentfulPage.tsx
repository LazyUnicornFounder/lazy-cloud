import { useCallback } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { motion } from "framer-motion";
import { Brain, Check, Copy, Download, Image, Layers, Search, Upload, Webhook, Zap } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import { toast } from "sonner";
import { useState } from "react";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const SETUP_PROMPT = `[Lazy Contentful Prompt — v0.0.5 — LazyUnicorn.ai]

Add a complete autonomous Contentful integration called Lazy Contentful to this project. It acts as a two-way bridge — pulling content from Contentful into your Lovable site automatically, and pushing AI-generated blog posts, SEO articles, and GEO content from your Lazy agents back into Contentful for distribution across all your connected channels.

---

MARKETING PAGE PROMPT — paste into LazyUnicorn project:

Add a new page at /lazy-contentful. It is a marketing and landing page for a product called Lazy Contentful — a two-way autonomous content bridge between your Lovable project and Contentful that syncs content in both directions automatically.

Hero section
Headline: 'Contentful is your CMS. Lazy Contentful fills it automatically.' Subheading: 'Lazy Contentful pulls content from Contentful into your Lovable site and pushes AI-generated blog posts, SEO articles, and GEO content back into Contentful — keeping every channel in sync without any manual publishing.' Primary button: Copy the Lovable Prompt. Secondary button: See How It Works. Badge: Powered by Contentful.

How it works section
Four steps: 1. Copy the setup prompt. 2. Paste into your Lovable project. 3. Add your Contentful API keys. 4. Content flows in both directions automatically — Contentful to Lovable and Lazy agents to Contentful.

What it does section
Eight cards: 1. Contentful to Lovable — pulls published entries from Contentful and displays them on your Lovable site automatically. 2. Lazy Blogger to Contentful — every post Lazy Blogger publishes is also pushed to Contentful automatically. 3. Lazy SEO to Contentful — SEO articles published by Lazy SEO sync to Contentful for distribution. 4. Lazy GEO to Contentful — GEO content syncs to Contentful so it reaches every connected channel. 5. Webhook sync — listens for Contentful publish events and updates your Lovable site in real time. 6. Content type mapping — maps Contentful content types to your Lovable pages automatically. 7. Asset handling — Contentful images and media are pulled and displayed in Lovable without manual work. 8. Self-healing sync — detects and repairs sync failures automatically.

Pricing section
Free — self-hosted, bring your own Contentful space. Pro at $29/month — coming soon, multi-space support, advanced content type mapping, scheduled sync.

Bottom CTA
Headline: Your Contentful CMS. Filling itself. Primary button: Copy the Lovable Prompt.

Navigation: Add Lazy Contentful to the LazyUnicorn navigation.

---

SETUP PROMPT — paste into user's Lovable project:

Add a complete autonomous Contentful integration called Lazy Contentful to this project. It creates a two-way content sync between Contentful and this Lovable project — pulling Contentful entries into Lovable pages and pushing AI-generated content from Lazy agents back into Contentful automatically.

1. Database
Create these Supabase tables with RLS enabled:

contentful_settings: id (uuid, primary key, default gen_random_uuid()), space_id (text), environment_id (text, default 'master'), content_type_blog (text, default 'blogPost'), content_type_seo (text, default 'seoArticle'), content_type_geo (text, default 'geoContent'), sync_from_contentful (boolean, default true), sync_to_contentful (boolean, default true), site_url (text), brand_name (text), is_running (boolean, default true), setup_complete (boolean, default false),
prompt_version (text, nullable), last_synced (timestamptz), created_at (timestamptz, default now()).
Note: Store CONTENTFUL_DELIVERY_TOKEN, CONTENTFUL_MANAGEMENT_TOKEN, and CONTENTFUL_WEBHOOK_SECRET as Supabase secrets. Never in the database.

contentful_entries: id (uuid, primary key, default gen_random_uuid()), contentful_id (text, unique), content_type (text), title (text), slug (text), excerpt (text), body_markdown (text), published_at (timestamptz), author (text), tags (text), featured_image_url (text), synced_at (timestamptz, default now()), status (text, default 'published')).

contentful_sync_log: id (uuid, primary key, default gen_random_uuid()), direction (text — one of contentful-to-lovable, lovable-to-contentful), content_type (text), entry_id (text), entry_title (text), status (text — one of success, failed), error_message (text), synced_at (timestamptz, default now()).

contentful_errors: id (uuid, primary key, default gen_random_uuid()), function_name (text), error_message (text), created_at (timestamptz, default now()).

2. Setup page
Create a page at /lazy-contentful-setup with a form:
- Contentful Space ID (text) — find in Contentful settings under API keys.
- Contentful Environment ID (text, default: master)
- Contentful Delivery Token (password) — the Content Delivery API token. Stored as CONTENTFUL_DELIVERY_TOKEN secret.
- Contentful Management Token (password) — the Content Management API token for writing back to Contentful. Stored as CONTENTFUL_MANAGEMENT_TOKEN secret.
- Contentful Webhook Secret (password) — any random string. Stored as CONTENTFUL_WEBHOOK_SECRET secret.
- Blog post content type ID (text, default: blogPost) — the content type ID in Contentful for blog posts.
- SEO article content type ID (text, default: seoArticle)
- GEO content type ID (text, default: geoContent)
- Brand name
- Site URL
- Sync from Contentful to Lovable (toggle, default on)
- Sync from Lovable to Contentful (toggle, default on)

Submit button: Activate Lazy Contentful

On submit:
1. Store all tokens as Supabase secrets
2. Save all other values to contentful_settings
3. Set setup_complete to true and prompt_version to 'v0.0.1'
4. Show instructions: Go to your Contentful space, Settings → Webhooks → Add webhook. Set URL to [site_url]/api/contentful-webhook. Add a secret header: X-Contentful-Secret with your webhook secret. Select triggers: Entry Published, Entry Unpublished.
5. Immediately call contentful-pull to do first sync.
6. Redirect to /admin with message: Lazy Contentful is active. Pulling your Contentful content now.

3. Pull edge function (Contentful to Lovable)
Create a Supabase edge function called contentful-pull. Cron: every hour — 0 * * * *

1. Read contentful_settings. If is_running is false or sync_from_contentful is false exit.
2. Call the Contentful Delivery API at https://cdn.contentful.com/spaces/[space_id]/environments/[environment_id]/entries using CONTENTFUL_DELIVERY_TOKEN. Fetch entries for all configured content types with updated_at greater than last_synced.
3. For each entry: extract sys.id, fields.title, fields.slug, fields.excerpt, fields.body (convert from Contentful rich text to markdown using the @contentful/rich-text-plain-text-renderer pattern), sys.publishedAt, fields.author, fields.tags, fields.featuredImage URL.
4. Upsert into contentful_entries by contentful_id.
5. Insert into contentful_sync_log with direction contentful-to-lovable and status success.
6. Update last_synced in contentful_settings to now.
Log errors to contentful_errors with function_name contentful-pull.

4. Webhook edge function
Create a Supabase edge function called contentful-webhook handling POST requests at /api/contentful-webhook.

1. Verify the X-Contentful-Secret header against CONTENTFUL_WEBHOOK_SECRET secret. Reject mismatches with 401.
2. Parse the webhook payload to get the entry sys.id and event type.
3. If event is Entry Published: call contentful-pull to sync this specific entry immediately.
4. If event is Entry Unpublished: update the matching contentful_entries row to status unpublished.
Log errors to contentful_errors with function_name contentful-webhook.

5. Push edge function (Lovable to Contentful)
Create a Supabase edge function called contentful-push. Cron: every 30 minutes — */30 * * * *

1. Read contentful_settings. If is_running is false or sync_to_contentful is false exit.
2. Check blog_posts for posts published in the last 30 minutes that do not have a matching contentful_entries row (check by slug). For each new post:
   Call the Contentful Management API at https://api.contentful.com/spaces/[space_id]/environments/[environment_id]/entries using CONTENTFUL_MANAGEMENT_TOKEN.
   Create a new entry with content type set to the configured content_type_blog. Map fields: title to post title, slug to post slug, excerpt to post excerpt, body to post body (as markdown), publishedAt to post published_at.
   Publish the entry by calling PUT on /published.
   Insert into contentful_sync_log with direction lovable-to-contentful and status success.
3. Repeat for seo_posts (using content_type_seo) and geo_posts (using content_type_geo) if those tables exist.
Log errors to contentful_errors with function_name contentful-push.

6. Public pages
/contentful — show all contentful_entries where status is published ordered by published_at descending. Each shows title, excerpt, author, tags, featured image. Each links to /contentful/[slug].
/contentful/[slug] — fetch the matching entry. Show title, author, published date, featured image, and body rendered from markdown to HTML.
At bottom add: 🦄 Powered by Lazy Contentful — autonomous Contentful sync for Lovable sites. Built by LazyUnicorn.ai — link to https://lazyunicorn.ai.

7. Admin

Do not build a standalone dashboard page for this agent. The dashboard lives at /admin/contentful as part of the unified LazyUnicorn admin panel, which is built separately using the LazyUnicorn Admin Dashboard prompt.

If /admin does not yet exist on this project add a simple placeholder at /admin with the text: "Install the LazyUnicorn Admin Dashboard to manage all agents in one place." and a link to /lazy-contentful-setup.

8. Navigation
Add a Content link to the main navigation pointing to /contentful. Add an Admin link to the main site navigation pointing to /admin.
Do not add the setup page to public navigation.

## Backlink Badge
Add a small "Powered by Lazy Unicorn" backlink badge in the footer of every public-facing page. Use this exact HTML:
<a href="https://www.lazyunicorn.ai" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#0a0a08;color:#f0ead6;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border:1px solid rgba(240,234,214,0.2)">🦄 Powered by Lazy Unicorn</a>
Style it to sit at the bottom of the page footer, centered, with subtle opacity (60%) that increases to 100% on hover.`;

const steps = ["Copy the setup prompt from this page.", "Paste it into your existing Lovable project.", "Add your Contentful API keys.", "Content flows in both directions automatically."];

function CopyPromptButton({ className = "", onCopy, text }: { className?: string; onCopy: () => void; text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    onCopy();
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [onCopy, text]);

  return (
    <button onClick={handleCopy} className={`inline-flex items-center gap-2 bg-foreground text-background font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity ${className}`}>
      {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

function ServiceBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 font-body text-[14px] tracking-[0.12em] uppercase text-foreground/70 border border-border px-3 py-1">
      Powered by Contentful
    </span>
  );
}

const LazyContentfulPage = () => {
  const trackEvent = useTrackEvent();
  const { prompt: dbPrompt } = useCurrentPrompt("lazy-contentful");
  const promptText = dbPrompt?.prompt_text || SETUP_PROMPT;

  const handlePromptCopy = useCallback(() => {
    trackEvent("lazy_contentful_prompt_copy");
  }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Lazy Contentful — Autonomous Contentful Bridge for Lovable" description="Contentful is your CMS. Lazy Contentful fills it automatically with two-way content sync." url="/lazy-contentful" />
      <Navbar />
      <main className="relative z-10 pb-32">
        {/* Hero */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Introducing</p>
                <span className="bg-foreground text-background text-[14px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
              </div>
              <AutopilotHeadline product="lazy-contentful" />

              <div className="flex items-center gap-4 flex-wrap">
                <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                  Lazy Contentful
                </h1>
                <ServiceBadge />
              </div>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/70 max-w-xl leading-relaxed">
                Lazy Contentful pulls content from Contentful into your Lovable site and pushes AI-generated blog posts, SEO articles, and GEO content back into Contentful — keeping every channel in sync without any manual publishing.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton text={promptText} onCopy={handlePromptCopy} />
                <button
                  onClick={(e) => { e.preventDefault(); document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors"
                >
                  See How It Works
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="max-w-2xl mx-auto px-6 mb-20 pt-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">Two-way sync. Zero manual publishing.</motion.h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-foreground text-background font-display text-sm font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                <p className="font-body text-sm text-foreground/60 leading-relaxed pt-1">{step}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What it does */}
        <section className="max-w-4xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">What it does</motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-border">
            {[
              { icon: Download, title: "Contentful to Lovable", desc: "Pulls published entries from Contentful and displays them on your site automatically." },
              { icon: Upload, title: "Blogger to Contentful", desc: "Every post Lazy Blogger publishes is also pushed to Contentful automatically." },
              { icon: Search, title: "SEO to Contentful", desc: "SEO articles published by Lazy SEO sync to Contentful for distribution." },
              { icon: Brain, title: "GEO to Contentful", desc: "GEO content syncs to Contentful so it reaches every connected channel." },
              { icon: Webhook, title: "Webhook Sync", desc: "Listens for Contentful publish events and updates your Lovable site in real time." },
              { icon: Layers, title: "Content Type Mapping", desc: "Maps Contentful content types to your Lovable pages automatically." },
              { icon: Image, title: "Asset Handling", desc: "Contentful images and media are pulled and displayed without manual work." },
              { icon: Zap, title: "Self-Healing Sync", desc: "Detects and repairs sync failures automatically." },
            ].map((item, i) => (
              <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.06 }} className="border-b sm:odd:border-r last:border-b-0 border-border bg-card p-6">
                <item.icon size={18} className="text-foreground/65 mb-3" />
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <LazyPricingSection lazyFeatures={["Lazy Contentful setup prompt", "Self-hosted in your Lovable project", "Two-way content sync", "Works with free Contentful tier"]} proFeatures={["Hosted version", "Multi-space support", "Advanced content type mapping", "Scheduled sync windows"]} ctaButton={<CopyPromptButton text={promptText} onCopy={handlePromptCopy} className="w-full justify-center" />} />

        <LazyFaqSection faqs={[
          { q: "Do I need a paid Contentful plan?", a: "The free tier works for basic sync. Heavy usage may require a paid Contentful plan." },
          { q: "Will it overwrite my existing Contentful content?", a: "No. It only creates new entries or pulls existing ones. It never modifies content you have already written." },
          { q: "Can I control which content types sync?", a: "Yes. The setup page lets you configure which Contentful content type IDs to use for each category." },
          { q: "What happens if a sync fails?", a: "Failed syncs are logged and retried automatically. The dashboard shows all sync failures clearly." },
          { q: "Does it support Contentful rich text?", a: "Yes. Rich text is converted to markdown when pulled into Lovable, and markdown is converted to Contentful format when pushed." },
          { q: "How do I know when there's an update?", a: "Check the changelog at /changelog. Every agent update is versioned and documented with upgrade instructions." },
          { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing data and settings are preserved." },
        ]} />

        {/* Bottom CTA */}
        <section className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card px-8 py-14 text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">Your Contentful CMS. Filling itself.</h2>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">Content flows in both directions — Contentful to Lovable, Lazy agents to Contentful — all on autopilot.</p>
            <CopyPromptButton text={promptText} onCopy={handlePromptCopy} />
            <p className="font-body text-sm text-foreground/60 mt-4">Open your Lovable project, paste it into the chat, add your API key. Done.</p>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazyContentfulPage;
