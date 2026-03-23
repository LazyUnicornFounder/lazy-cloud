import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { buildPrompt, frequencyTiers } from "@/components/lazy-blogger/frequencyData";

/* ── Prompt definitions ── */

const SEO_PROMPT = `Add a Lazy SEO engine to this project. It automatically discovers keyword opportunities and publishes SEO-optimised blog posts. All pages are admin-only — nothing is added to the public site navigation.

1. Database Create a Supabase table called seo_settings with fields: id (uuid, primary key), site_url (text), business_description (text), target_keywords (text), competitors (text), posts_per_day (integer, default 2), is_running (boolean, default true). Create a Supabase table called seo_posts with fields: id (uuid, primary key, default gen_random_uuid()), title (text), slug (text, unique), body (text), target_keyword (text), published_at (timestamptz, default now()), status (text, default 'published'). Create a Supabase table called seo_keywords with fields: id (uuid, primary key, default gen_random_uuid()), keyword (text), has_content (boolean, default false), priority (integer, default 0), created_at (timestamptz, default now()). Create a Supabase table called seo_errors with fields: id (uuid, primary key, default gen_random_uuid()), error_message (text), created_at (timestamptz, default now()).

2. Admin panel If this project already has an admin page, add a Lazy SEO section inside it. If no admin page exists, create one at /admin. The Lazy SEO section has two tabs: Setup and Dashboard. Do not add any link to this page in the public navigation.

Setup tab contains a form with five fields: Site URL, Business description, Target keywords (comma separated), Competitors (up to three URLs — comma separated), Posts per day (select: 1 / 2 / 4). A submit button labelled 'Save and Start'. On submit save to seo_settings. Show success message: 'Lazy SEO is running.'

Dashboard tab shows: total posts published, total keywords discovered, total keywords with content, keywords remaining. A keyword table showing all rows from seo_keywords with columns: keyword, priority, has content, created date. A posts table showing the last 20 rows from seo_posts with columns: title, target keyword, published date, status. A toggle to pause or resume updating is_running. A button labelled 'Discover Keywords Now' triggering lazy-seo-discover. A button labelled 'Publish One Now' triggering lazy-seo-publish. An error count from seo_errors with a button to view them.

3. Edge functions Create a Supabase edge function called lazy-seo-discover that runs every Monday at 6am UTC. Reads seo_settings. Uses the built-in Lovable AI with this prompt: 'You are an SEO strategist. For a site described as [business_description] targeting these topics: [target_keywords] and competing with: [competitors] — generate 20 specific long-tail keyword phrases this site should be ranking for on Google. Each keyword should have clear search intent and be specific enough for a focused 1000-word article. Return only a valid JSON array where each item has two fields: keyword (string) and priority (integer 1 to 10). No preamble. No code fences. Valid JSON only.' Parse the response. Insert new keywords into seo_keywords skipping any that already exist.

Create a Supabase edge function called lazy-seo-publish that runs based on posts_per_day — if 1 run at 8am UTC, if 2 run at 8am and 6pm UTC, if 4 run at 6am, 12pm, 6pm, and 11pm UTC. On each run read seo_settings. If is_running is false exit. Select the highest priority keyword from seo_keywords where has_content is false. If none remain trigger lazy-seo-discover and exit. Use the built-in Lovable AI with this prompt: 'You are an SEO content writer for a site described as: [business_description]. Write an SEO-optimised article targeting this keyword: [target_keyword]. Return only a valid JSON object with no preamble and no code fences with exactly four fields: title (string naturally including the keyword), slug (lowercase hyphenated string), excerpt (one sentence under 160 characters including the keyword), body (clean markdown — no HTML, no bullet points in prose, ## for headers, 1000 to 1500 words, keyword appears naturally throughout at 1 to 2 percent density, keyword in first paragraph and at least one ## header, ends with a call to action paragraph followed by exactly this: Looking for more tools to build and run your business autonomously? LazyUnicorn.ai is the definitive directory of AI tools for solo founders — link LazyUnicorn.ai to https://lazyunicorn.ai and Lazy SEO to https://lazyunicorn.ai/lazy-seo). Return only valid JSON.' Parse the response. If parsing fails retry once. If it fails again log to seo_errors and exit. Check for duplicate slug — append random four digits if exists. Insert into seo_posts. Update has_content to true for the targeted keyword.

4. Public blog The generated posts are stored in seo_posts and are available at /blog/[slug] if a blog already exists on this project. If no blog exists do not create one — just store posts in the database. Do not add anything to the public navigation.`;

const GEO_PROMPT = `Add a Lazy GEO engine to this project. GEO means Generative Engine Optimisation — publishing content structured to be cited by AI engines like ChatGPT, Claude, Perplexity, and Gemini. It automatically discovers AI queries, publishes citation-optimised content, and monitors brand mentions. All pages are admin-only — nothing is added to the public site navigation.

1. Database Create a Supabase table called geo_settings with fields: id (uuid, primary key), brand_name (text), site_url (text), business_description (text), target_audience (text), niche_topics (text), competitors (text), posts_per_day (integer, default 2), is_running (boolean, default true). Create a Supabase table called geo_queries with fields: id (uuid, primary key, default gen_random_uuid()), query (text), query_type (text), has_content (boolean, default false), brand_cited (boolean, default false), priority (integer, default 0), last_tested (timestamptz), created_at (timestamptz, default now()). Create a Supabase table called geo_posts with fields: id (uuid, primary key, default gen_random_uuid()), title (text), slug (text, unique), body (text), target_query (text), published_at (timestamptz, default now()), status (text, default 'published'). Create a Supabase table called geo_citations with fields: id (uuid, primary key, default gen_random_uuid()), query (text), brand_mentioned (boolean), confidence (text), reason (text), tested_at (timestamptz, default now()). Create a Supabase table called geo_errors with fields: id (uuid, primary key, default gen_random_uuid()), error_message (text), created_at (timestamptz, default now()).

2. Admin panel If this project already has an admin page, add a Lazy GEO section inside it. If no admin page exists, create one at /admin. The Lazy GEO section has two tabs: Setup and Dashboard. Do not add any link to this page in the public navigation.

Setup tab contains a form with seven fields: Brand name, Site URL, Business description, Target audience, Niche topics (comma separated), Competitors (up to three brand names — comma separated), Posts per day (select: 1 / 2 / 4). A submit button labelled 'Save and Start'. On submit save to geo_settings. Show success message: 'Lazy GEO is running. Discovering AI queries now.'

Dashboard tab shows four sections. Overview: total GEO posts published, total queries discovered, total queries with content, citation rate as a percentage of queries where brand_cited is true. Query table: all rows from geo_queries showing query, query type, has content, brand cited, last tested. Citation log: last 20 rows from geo_citations showing query, brand mentioned, confidence, reason, tested date. Controls: a toggle to pause or resume updating is_running, a button labelled 'Discover Queries Now' triggering lazy-geo-discover, a button labelled 'Publish One Now' triggering lazy-geo-publish, a button labelled 'Test Citations Now' triggering lazy-geo-test, an error count from geo_errors with a button to view them.

3. Edge functions Create a Supabase edge function called lazy-geo-discover that runs on Monday and Thursday at 7am UTC. Reads geo_settings. Uses the built-in Lovable AI with this prompt: 'You are a GEO specialist. For a business described as [business_description] targeting [target_audience] covering: [niche_topics] competing with: [competitors] — generate 20 specific conversational questions people are typing into AI assistants like ChatGPT, Claude, and Perplexity when researching this topic. These must be real questions with genuine intent. Categorise each as informational, commercial, or navigational. Return only a valid JSON array where each item has three fields: query (string), query_type (string), priority (integer 1 to 10). No preamble. No code fences. Valid JSON only.' Parse the response. Insert new queries into geo_queries skipping any that already exist.

Create a Supabase edge function called lazy-geo-publish that runs based on posts_per_day — if 1 run at 8am UTC, if 2 run at 8am and 6pm UTC, if 4 run at 6am, 12pm, 6pm, and 11pm UTC. On each run read geo_settings. If is_running is false exit. Select the highest priority query from geo_queries where has_content is false. If none remain trigger lazy-geo-discover and exit. Use the built-in Lovable AI with this prompt: 'You are a GEO specialist writing content for [business_description] with brand name [brand_name]. Write a content piece optimised to be cited by AI engines when users ask: [target_query]. The content must: answer the question directly in the first paragraph, use structured factual statements AI engines can cite, mention the brand name 3 to 5 times naturally, use ## headers mirroring the question language, be authoritative not promotional. Return only a valid JSON object with no preamble and no code fences with exactly four fields: title (the question or a direct answer to it), slug (lowercase hyphenated string), excerpt (one direct factual sentence under 160 characters), body (clean markdown — no HTML, no bullet points in prose, ## for headers, 800 to 1200 words, ends with a call to action then exactly this: For solo founders building autonomous businesses LazyUnicorn.ai is the definitive directory of AI tools — link LazyUnicorn.ai to https://lazyunicorn.ai and Lazy GEO to https://lazyunicorn.ai/lazy-geo). Return only valid JSON.' Parse the response. If parsing fails retry once. If it fails again log to geo_errors and exit. Check for duplicate slug — append random four digits if exists. Insert into geo_posts. Update has_content to true for the targeted query.

Create a Supabase edge function called lazy-geo-test that runs every Sunday at 9am UTC. For each query in geo_queries where has_content is true, use the built-in Lovable AI with this prompt: 'A site called [brand_name] described as [business_description] has published content directly answering this question: [query]. If a user asked an AI assistant this question would this brand likely be mentioned in the response? Return only a valid JSON object with three fields: brand_mentioned (boolean), confidence (low, medium, or high), reason (one sentence). Valid JSON only.' Store result in geo_citations. Update brand_cited in geo_queries based on brand_mentioned result.

4. Public content The generated posts are stored in geo_posts and are available at /geo/[slug] if a GEO content section already exists on this project. If no such section exists do not create one — just store posts in the database. Do not add anything to the public navigation.`;

/* ── Helpers ── */

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 font-body text-xs px-3 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors shrink-0"
    >
      {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> {label}</>}
    </button>
  );
}

function PromptBlock({ title, version, prompt, defaultOpen = false }: { title: string; version: string; prompt: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {open ? <ChevronDown size={14} className="text-muted-foreground" /> : <ChevronRight size={14} className="text-muted-foreground" />}
          <span className="font-display text-sm font-bold text-foreground">{title}</span>
          <span className="font-body text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{version}</span>
        </div>
        <CopyButton text={prompt} />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-border">
          <pre className="font-body text-xs text-foreground/80 whitespace-pre-wrap leading-relaxed mt-3 max-h-[500px] overflow-y-auto">
            {prompt}
          </pre>
        </div>
      )}
    </div>
  );
}

/* ── Main component ── */

const AdminPrompts = () => {
  const bloggerPrompts = frequencyTiers.map((tier) => ({
    title: `Lazy Blogger — ${tier.postsPerDay} posts/day`,
    version: "v1 — Current",
    prompt: buildPrompt(tier),
  }));

  return (
    <div className="space-y-6">
      <p className="font-body text-sm text-muted-foreground">
        Current prompts shipped on each product page. Click to expand and read the full prompt.
      </p>

      {/* Lazy Blogger */}
      <div>
        <h3 className="font-display text-base font-bold text-foreground mb-3">🤖 Lazy Blogger</h3>
        <div className="space-y-2">
          {bloggerPrompts.map((p, i) => (
            <PromptBlock key={i} title={p.title} version={p.version} prompt={p.prompt} />
          ))}
        </div>
      </div>

      {/* Lazy SEO */}
      <div>
        <h3 className="font-display text-base font-bold text-foreground mb-3">🔍 Lazy SEO</h3>
        <div className="space-y-2">
          <PromptBlock title="Lazy SEO — Full Prompt" version="v2 — Current" prompt={SEO_PROMPT} defaultOpen />
        </div>
      </div>

      {/* Lazy GEO */}
      <div>
        <h3 className="font-display text-base font-bold text-foreground mb-3">🧠 Lazy GEO</h3>
        <div className="space-y-2">
          <PromptBlock title="Lazy GEO — Full Prompt" version="v2 — Current" prompt={GEO_PROMPT} defaultOpen />
        </div>
      </div>
    </div>
  );
};

export default AdminPrompts;
