import { useState } from "react";
import { X, ChevronRight, ChevronLeft, CheckCircle2, Copy, ExternalLink, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

/* ── Step definition ── */
export interface SetupStep {
  title: string;
  description: string;
  type: "info" | "secret" | "action" | "verify";
  /** For "secret" steps — which secret to configure */
  secretName?: string;
  /** For "secret" steps — where to get it */
  secretGuide?: string;
  /** External link for docs / service */
  link?: string;
  /** For "action" — code snippet or prompt to paste */
  snippet?: string;
}

export interface AgentSetupConfig {
  key: string;
  label: string;
  description: string;
  category: string;
  steps: SetupStep[];
  promptSlug?: string;
}

/* ── Agent setup definitions ── */
export const AGENT_SETUP_CONFIGS: Record<string, AgentSetupConfig> = {
  blogger: {
    key: "blogger",
    label: "Lazy Blogger",
    description: "Autonomous blog content generation and publishing",
    category: "Content",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Blogger generates and publishes blog posts automatically. It uses AI to write long-form content, manages a publishing schedule, and maintains a blog feed on your site." },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Blogger prompt from the prompts page and paste it into your Lovable project chat. This installs the required tables, edge functions, and UI.", link: "/admin/prompts", snippet: "Go to Admin → Prompts → Find 'Lazy Blogger' → Copy prompt → Paste into your Lovable chat" },
      { title: "Configure settings", type: "info", description: "Once installed, go to Admin → Blogger to set your publishing frequency, posts per day, and toggle the agent on/off. The agent will start publishing automatically." },
      { title: "Verify", type: "verify", description: "Check Admin → Blogger to confirm the agent is running. You should see posts appearing within the configured frequency window." },
    ],
  },
  seo: {
    key: "seo",
    label: "Lazy SEO",
    description: "Autonomous SEO content targeting specific keywords",
    category: "Content",
    steps: [
      { title: "How it works", type: "info", description: "Lazy SEO analyses your target keywords and competitors, then generates optimised blog posts designed to rank. It monitors keyword positions and continuously publishes content to improve rankings." },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy SEO prompt and paste it into your Lovable project.", link: "/admin/prompts", snippet: "Admin → Prompts → 'Lazy SEO' → Copy → Paste into Lovable chat" },
      { title: "Complete setup", type: "info", description: "After installation, visit the Lazy SEO setup page to configure your site URL, business description, target keywords, and competitors. The agent analyses this to generate relevant content." },
      { title: "Verify", type: "verify", description: "Check Admin → SEO. You should see the agent running and posts being generated for your target keywords." },
    ],
  },
  geo: {
    key: "geo",
    label: "Lazy GEO",
    description: "Generative Engine Optimization for AI search citations",
    category: "Content",
    steps: [
      { title: "How it works", type: "info", description: "Lazy GEO optimises your content to be cited by AI search engines like ChatGPT, Perplexity, and Gemini. It discovers relevant queries, tests if your brand is cited, and generates content to improve citation rates." },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy GEO prompt and paste it into your Lovable project.", link: "/admin/prompts", snippet: "Admin → Prompts → 'Lazy GEO' → Copy → Paste into Lovable chat" },
      { title: "Complete setup", type: "info", description: "Configure your brand name, site URL, business description, target audience, niche topics, and competitors in the GEO setup page." },
      { title: "Verify", type: "verify", description: "Check Admin → GEO. The agent will start discovering queries and generating citation-optimised content." },
    ],
  },
  crawl: {
    key: "crawl",
    label: "Lazy Crawl",
    description: "Autonomous web crawling with Firecrawl integration",
    category: "Content",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Crawl uses Firecrawl to crawl competitor sites, extract content patterns, and feed intelligence to your other content agents. It discovers what topics and formats work in your niche." },
      { title: "Get a Firecrawl API key", type: "secret", description: "Sign up at firecrawl.dev and get your API key from the dashboard.", secretName: "FIRECRAWL_API_KEY", secretGuide: "Go to firecrawl.dev → Sign up → Dashboard → API Keys → Copy key", link: "https://firecrawl.dev" },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Crawl prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Crawl' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "The crawl agent will begin indexing competitor content and feeding insights to your content pipeline." },
    ],
  },
  perplexity: {
    key: "perplexity",
    label: "Lazy Perplexity",
    description: "AI-powered research and content enrichment",
    category: "Content",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Perplexity uses the Perplexity API to research topics in real-time, enriching your generated content with current facts, statistics, and citations." },
      { title: "Get a Perplexity API key", type: "secret", description: "Sign up at perplexity.ai and get your API key.", secretName: "PERPLEXITY_API_KEY", secretGuide: "Go to perplexity.ai → Settings → API → Generate API key", link: "https://perplexity.ai" },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Perplexity prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Perplexity' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "Your content agents will now use Perplexity for real-time research when generating posts." },
    ],
  },
  contentful: {
    key: "contentful",
    label: "Lazy Contentful",
    description: "Headless CMS integration for structured content",
    category: "Content",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Contentful connects to the Contentful CMS to sync and manage structured content. Ideal for teams that already use Contentful or need multi-channel content distribution." },
      { title: "Get Contentful credentials", type: "secret", description: "You'll need your Contentful Space ID and Content Management API token.", secretName: "CONTENTFUL_ACCESS_TOKEN", secretGuide: "Contentful → Settings → API keys → Content Management tokens", link: "https://app.contentful.com" },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Contentful prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Contentful' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "Check that content syncs between your Contentful space and your Lovable site." },
    ],
  },
  store: {
    key: "store",
    label: "Lazy Store",
    description: "Autonomous Shopify store with product discovery and pricing",
    category: "Commerce",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Store installs a full autonomous Shopify storefront. It handles product discovery, listing creation, pricing optimisation, promotions, and conversion tracking — all autonomously." },
      { title: "Get Shopify credentials", type: "secret", description: "Create a Shopify custom app and get the Admin API access token.", secretName: "SHOPIFY_ACCESS_TOKEN", secretGuide: "Shopify Admin → Settings → Apps → Develop apps → Create app → Install → Admin API access token", link: "https://admin.shopify.com" },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Store prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Store' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "Visit your store page and check that products are syncing from Shopify." },
    ],
  },
  pay: {
    key: "pay",
    label: "Lazy Pay",
    description: "Autonomous payments with Stripe integration",
    category: "Commerce",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Pay connects Stripe for checkout, subscription management, and revenue tracking. It handles webhooks, checkout sessions, and customer management autonomously." },
      { title: "Get Stripe API key", type: "secret", description: "Get your Stripe secret key from the Stripe dashboard.", secretName: "STRIPE_SECRET_KEY", secretGuide: "Stripe Dashboard → Developers → API keys → Secret key (use test key first)", link: "https://dashboard.stripe.com/apikeys" },
      { title: "Get Stripe webhook secret", type: "secret", description: "Create a webhook endpoint in Stripe and copy the signing secret.", secretName: "STRIPE_WEBHOOK_SECRET", secretGuide: "Stripe → Developers → Webhooks → Add endpoint → Use your edge function URL → Copy signing secret" },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Pay prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Pay' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "Create a test checkout and confirm the payment flow works end-to-end." },
    ],
  },
  sms: {
    key: "sms",
    label: "Lazy SMS",
    description: "Autonomous Twilio SMS for notifications and drip campaigns",
    category: "Commerce",
    steps: [
      { title: "How it works", type: "info", description: "Lazy SMS sends automated order confirmations, drip sequences, and abandoned cart recovery messages via Twilio. It self-improves by monitoring response rates and rewriting underperforming templates." },
      { title: "Get Twilio credentials", type: "secret", description: "Sign up at Twilio and get your Account SID, Auth Token, and a phone number.", secretName: "TWILIO_AUTH_TOKEN", secretGuide: "Twilio Console → Account → Account SID & Auth Token → Also buy a phone number", link: "https://console.twilio.com" },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy SMS prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy SMS' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "Send a test SMS from the admin interface to confirm Twilio is configured correctly." },
    ],
  },
  mail: {
    key: "mail",
    label: "Lazy Mail",
    description: "Autonomous email campaigns with Resend",
    category: "Commerce",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Mail handles transactional emails, newsletters, and drip campaigns via Resend. It generates email content, manages subscribers, and optimises send times." },
      { title: "Get Resend API key", type: "secret", description: "Sign up at resend.com and get your API key.", secretName: "RESEND_API_KEY", secretGuide: "Resend → API Keys → Create API Key → Copy", link: "https://resend.com" },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Mail prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Mail' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "Send a test email from the admin to confirm delivery." },
    ],
  },
  voice: {
    key: "voice",
    label: "Lazy Voice",
    description: "Autonomous podcast generation from blog content",
    category: "Media",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Voice converts your blog posts into podcast episodes using ElevenLabs text-to-speech. It generates audio, manages an RSS feed, and publishes to podcast platforms." },
      { title: "Connect ElevenLabs", type: "info", description: "ElevenLabs is already connected via a connector. If not set up yet, configure it in your project connectors." },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Voice prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Voice' → Copy → Paste into Lovable chat" },
      { title: "Complete setup", type: "info", description: "Visit the Voice setup page to configure your podcast title, description, author name, and preferred voice. The agent will start converting published blog posts to audio." },
      { title: "Verify", type: "verify", description: "Check Admin → Voice. You should see episodes being generated and an RSS feed available." },
    ],
  },
  stream: {
    key: "stream",
    label: "Lazy Stream",
    description: "Autonomous Twitch stream monitoring and content creation",
    category: "Media",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Stream monitors your Twitch streams, captures highlights, generates recaps, and publishes stream content to your blog. It tracks viewer stats and optimises content based on engagement." },
      { title: "Get Twitch credentials", type: "secret", description: "Create a Twitch application and get your Client ID and Client Secret.", secretName: "TWITCH_CLIENT_ID", secretGuide: "Twitch Developer Console → Applications → Register → Client ID & Secret", link: "https://dev.twitch.tv/console/apps" },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Stream prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Stream' → Copy → Paste into Lovable chat" },
      { title: "Complete setup", type: "info", description: "Enter your Twitch username, site URL, and content niche in the Stream setup page." },
      { title: "Verify", type: "verify", description: "Check Admin → Stream. The agent monitors your Twitch channel and creates content from your streams." },
    ],
  },
  youtube: {
    key: "youtube",
    label: "Lazy YouTube",
    description: "Autonomous YouTube content extraction and repurposing",
    category: "Media",
    steps: [
      { title: "How it works", type: "info", description: "Lazy YouTube monitors your YouTube channel, extracts transcripts from videos, and repurposes them into blog posts, social content, and SEO articles using Supadata." },
      { title: "Get YouTube / Supadata API key", type: "secret", description: "Get your Supadata API key for YouTube transcript extraction.", secretName: "SUPADATA_API_KEY", secretGuide: "Sign up at supadata.ai → Dashboard → API Key → Copy", link: "https://supadata.ai" },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy YouTube prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy YouTube' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "The agent will begin monitoring your YouTube channel and generating content from video transcripts." },
    ],
  },
  github: {
    key: "github",
    label: "Lazy GitHub",
    description: "Autonomous GitHub integration for prompt syncing and code ops",
    category: "Dev",
    steps: [
      { title: "How it works", type: "info", description: "Lazy GitHub syncs your prompts to a public GitHub repository, manages prompt versioning, and enables collaborative prompt development through Git workflows." },
      { title: "Create a GitHub token", type: "secret", description: "Generate a fine-grained personal access token with repo read/write permissions.", secretName: "GITHUB_TOKEN", secretGuide: "GitHub → Settings → Developer settings → Personal access tokens → Fine-grained → Create token with repo permissions", link: "https://github.com/settings/tokens" },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy GitHub prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy GitHub' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "Go to Admin → Prompts and use the 'Push All' button to sync prompts to your GitHub repo." },
    ],
  },
  gitlab: {
    key: "gitlab",
    label: "Lazy GitLab",
    description: "Autonomous GitLab integration for CI/CD and code management",
    category: "Dev",
    steps: [
      { title: "How it works", type: "info", description: "Lazy GitLab connects your project to GitLab for code syncing, CI/CD pipeline management, and automated deployments." },
      { title: "Get GitLab token", type: "secret", description: "Generate a GitLab personal access token with api scope.", secretName: "GITLAB_TOKEN", secretGuide: "GitLab → Preferences → Access Tokens → Create with 'api' scope", link: "https://gitlab.com/-/user_settings/personal_access_tokens" },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy GitLab prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy GitLab' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "Confirm your project syncs to GitLab and pipelines trigger correctly." },
    ],
  },
  linear: {
    key: "linear",
    label: "Lazy Linear",
    description: "Autonomous issue tracking and project management with Linear",
    category: "Dev",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Linear creates issues from meeting notes, error logs, and feature requests. It syncs with Linear for autonomous project management." },
      { title: "Connect Linear", type: "info", description: "Linear is already available as a connector. Check your project connectors to confirm the Linear connection is active." },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Linear prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Linear' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "The agent will begin creating Linear issues from actionable items discovered by other agents." },
    ],
  },
  design: {
    key: "design",
    label: "Lazy Design",
    description: "Autonomous design system management and component generation",
    category: "Dev",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Design manages your design system, generates component variants, and ensures visual consistency across your site. It creates design tokens, colour palettes, and typography scales." },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Design prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Design' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "Your design system will be configured with consistent tokens, components, and visual guidelines." },
    ],
  },
  auth: {
    key: "auth",
    label: "Lazy Auth",
    description: "Autonomous authentication setup with social login and RLS",
    category: "Dev",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Auth configures authentication for your Lovable project including email/password, social logins (Google, Apple), role-based access control, and Row Level Security policies." },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Auth prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Auth' → Copy → Paste into Lovable chat" },
      { title: "Configure providers", type: "info", description: "After installation, configure your authentication providers (Google OAuth, Apple Sign In) through the Cloud authentication settings." },
      { title: "Verify", type: "verify", description: "Test the login and signup flows to confirm authentication works end-to-end." },
    ],
  },
  granola: {
    key: "granola",
    label: "Lazy Granola",
    description: "Autonomous meeting intelligence from Granola notes",
    category: "Dev",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Granola syncs your Granola meeting notes, extracts intelligence (action items, decisions, customer signals), publishes blog posts from meetings, sends Slack summaries, and creates Linear issues." },
      { title: "Get Granola API key", type: "secret", description: "Get your Granola API key from your Granola account settings.", secretName: "GRANOLA_API_KEY", secretGuide: "Granola app → Settings → Integrations → API key", link: "https://granola.ai" },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Granola prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Granola' → Copy → Paste into Lovable chat" },
      { title: "Complete setup", type: "info", description: "Configure your brand name, site URL, meeting types to process, and output preferences in the Granola setup page." },
      { title: "Verify", type: "verify", description: "Check Admin → Granola. The agent will start syncing and processing your meeting notes." },
    ],
  },
  repurpose: {
    key: "repurpose",
    label: "Lazy Repurpose",
    description: "Autonomous content repurposing across formats",
    category: "Agents",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Repurpose takes your existing content (blog posts, podcasts, streams) and transforms it into social media posts, email newsletters, thread carousels, and short-form content — autonomously." },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Repurpose prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Repurpose' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "The agent will begin monitoring new content from other agents and creating repurposed versions." },
    ],
  },
  trend: {
    key: "trend",
    label: "Lazy Trend",
    description: "Autonomous trend monitoring and content ideation",
    category: "Agents",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Trend monitors industry trends, competitor activity, and emerging topics in your niche. It feeds content ideas to your Blogger, SEO, and GEO agents to stay ahead of the curve." },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Trend prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Trend' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "The agent will start tracking trends and feeding insights to your content pipeline." },
    ],
  },
  churn: {
    key: "churn",
    label: "Lazy Churn",
    description: "Autonomous churn prediction and retention campaigns",
    category: "Agents",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Churn monitors user activity, identifies at-risk customers, and triggers retention campaigns via email and SMS. It learns from engagement patterns to predict and prevent churn." },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Churn prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Churn' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "The agent will begin monitoring user behaviour and triggering retention workflows." },
    ],
  },
  alert: {
    key: "alert",
    label: "Lazy Alert",
    description: "Autonomous error monitoring and notification system",
    category: "Ops",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Alert monitors all your other agents for errors and failures. It sends notifications via Telegram, email, or Slack when things go wrong, and can auto-create GitHub issues for recurring errors." },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Alert prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Alert' → Copy → Paste into Lovable chat" },
      { title: "Configure notifications", type: "info", description: "Set up your preferred notification channels (Telegram bot token, Slack webhook, or email). The agent monitors all _errors tables across your installed agents." },
      { title: "Verify", type: "verify", description: "The agent will start monitoring error tables and sending alerts when issues are detected." },
    ],
  },
  telegram: {
    key: "telegram",
    label: "Lazy Telegram",
    description: "Autonomous Telegram bot for notifications and commands",
    category: "Ops",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Telegram creates a Telegram bot that sends you business updates, error alerts, and publishing notifications. You can also send commands to control your agents via Telegram." },
      { title: "Create a Telegram bot", type: "secret", description: "Create a bot via @BotFather on Telegram and get the bot token.", secretName: "TELEGRAM_BOT_TOKEN", secretGuide: "Telegram → @BotFather → /newbot → Follow prompts → Copy the token", link: "https://t.me/BotFather" },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Telegram prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Telegram' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "Send a message to your bot and confirm it responds. Check that notifications arrive for agent events." },
    ],
  },
  supabase: {
    key: "supabase",
    label: "Lazy Supabase",
    description: "Autonomous database management and maintenance",
    category: "Ops",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Supabase manages your database health — monitoring table sizes, connection counts, and RLS policy coverage. It alerts you to missing policies, orphaned data, and performance issues." },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Supabase prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Supabase' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "The agent will audit your database tables and report any issues in the admin dashboard." },
    ],
  },
  security: {
    key: "security",
    label: "Lazy Security",
    description: "Autonomous security scanning and vulnerability management",
    category: "Ops",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Security runs automated security scans, checks for dependency vulnerabilities, monitors RLS policies, and generates security reports. It uses Aikido for runtime protection." },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Security prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Security' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "Run a security scan from the admin and review the generated report." },
    ],
  },
  drop: {
    key: "drop",
    label: "Lazy Drop",
    description: "Autonomous dropshipping with AutoDS integration",
    category: "Commerce",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Drop connects to AutoDS for automated dropshipping — product sourcing, listing creation, order fulfilment, and pricing management." },
      { title: "Get AutoDS API key", type: "secret", description: "Sign up at AutoDS and get your API key.", secretName: "AUTODS_API_KEY", secretGuide: "AutoDS → Settings → API → Generate key", link: "https://autods.com" },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Drop prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Drop' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "Products from AutoDS should begin syncing to your store." },
    ],
  },
  print: {
    key: "print",
    label: "Lazy Print",
    description: "Autonomous print-on-demand with Printful",
    category: "Commerce",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Print connects to Printful for autonomous print-on-demand — product creation, mockup generation, order routing, and fulfilment tracking." },
      { title: "Get Printful API key", type: "secret", description: "Get your Printful API token from your account.", secretName: "PRINTFUL_API_KEY", secretGuide: "Printful → Settings → API → Generate access token", link: "https://www.printful.com/dashboard/developer/api" },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Print prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Print' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "Products should sync from Printful and be available in your store." },
    ],
  },
  watch: {
    key: "watch",
    label: "Lazy Watch",
    description: "Autonomous error monitoring across all agents",
    category: "Agents",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Watch monitors every agent's _errors table, detects recurring failures, and creates GitHub issues automatically. It silently skips agents that aren't installed." },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Watch prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Watch' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "Check the watch dashboard to see monitored agents and any detected errors." },
    ],
  },
  fix: {
    key: "fix",
    label: "Lazy Fix",
    description: "Autonomous bug detection and self-healing",
    category: "Agents",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Fix detects errors from Lazy Watch, analyses them, and attempts to self-heal by adjusting configurations or retrying failed operations." },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Fix prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Fix' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "The agent will begin monitoring for fixable errors and applying corrections autonomously." },
    ],
  },
  build: {
    key: "build",
    label: "Lazy Build",
    description: "Autonomous feature building from specifications",
    category: "Agents",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Build takes feature specifications from Linear issues or meeting notes and generates implementation plans, component scaffolds, and database schemas." },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Build prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Build' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "Create a feature request and confirm the agent generates an implementation plan." },
    ],
  },
  intel: {
    key: "intel",
    label: "Lazy Intel",
    description: "Autonomous competitive intelligence gathering",
    category: "Agents",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Intel monitors competitors, tracks market changes, and feeds strategic intelligence to your content and product agents. It uses web crawling and AI analysis to stay ahead." },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Intel prompt and paste it into your Lovable project.", snippet: "Admin → Prompts → 'Lazy Intel' → Copy → Paste into Lovable chat" },
      { title: "Verify", type: "verify", description: "The agent will start gathering competitive intelligence and surfacing it in the admin feed." },
    ],
  },
  waitlist: {
    key: "waitlist",
    label: "Lazy Waitlist",
    description: "Autonomous pre-launch waitlist with viral referrals",
    category: "Unicorn",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Waitlist automates pre-launch email capture with viral referral mechanics, position tracking, and automated email sequences (welcome, follow-up, launch). It includes a public signup page, live counter, countdown, and Slack notifications." },
      { title: "Configure secrets", type: "secret", description: "Set up the required API keys for email delivery and notifications.", secretName: "RESEND_API_KEY", snippet: "You need a Resend API key for transactional emails. Optionally add a SLACK_WEBHOOK_URL for signup notifications." },
      { title: "Run setup wizard", type: "action", description: "Go to Admin → Waitlist to configure your waitlist name, description, email templates, referral settings, and page customisation.", link: "/admin/waitlist", snippet: "Admin → Waitlist → Complete setup wizard → Toggle agent on" },
      { title: "Verify", type: "verify", description: "Visit /waitlist to confirm the public signup page is live. Test a signup and check that the welcome email is sent and the subscriber appears in Admin → Waitlist." },
    ],
  },
  run: {
    key: "run",
    label: "Lazy Run",
    description: "Unified agent orchestration dashboard",
    category: "Unicorn",
    steps: [
      { title: "How it works", type: "info", description: "Lazy Run is the unified orchestration dashboard that monitors and controls all active agents. It provides real-time status, error tracking, bulk start/pause, and publish-all capabilities from a single view." },
      { title: "Paste the prompt", type: "action", description: "Copy the Lazy Run prompt and paste it into your Lovable project to install the dashboard.", snippet: "Admin → Prompts → 'Lazy Run' → Copy → Paste into Lovable chat" },
      { title: "Configure agents", type: "info", description: "Once installed, Lazy Run auto-detects which agents are active by checking their settings tables. Start, pause, or publish agents directly from the dashboard." },
      { title: "Verify", type: "verify", description: "Navigate to /lazy-run and confirm all installed agents appear with correct status indicators." },
    ],
  },
};

/* ── Wizard Component ── */
interface Props {
  agentKey: string;
  onClose: () => void;
}

export default function AgentSetupWizard({ agentKey, onClose }: Props) {
  const config = AGENT_SETUP_CONFIGS[agentKey];
  const [currentStep, setCurrentStep] = useState(0);

  if (!config) return null;

  const step = config.steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === config.steps.length - 1;

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const stepIcon = (type: SetupStep["type"]) => {
    switch (type) {
      case "info": return "📖";
      case "secret": return "🔑";
      case "action": return "⚡";
      case "verify": return "✅";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-[#0a0a08] border border-[#f0ead6]/15 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0ead6]/10">
          <div>
            <h2 className="font-display text-base font-bold tracking-tight text-[#f0ead6]">
              Configure {config.label}
            </h2>
            <p className="font-body text-[12px] text-[#f0ead6]/50 mt-0.5">{config.description}</p>
          </div>
          <button onClick={onClose} className="text-[#f0ead6]/40 hover:text-[#f0ead6]/80 transition-colors p-1">
            <X size={16} />
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 px-6 py-3 border-b border-[#f0ead6]/5">
          {config.steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-none text-[11px] font-body transition-colors ${
                i === currentStep
                  ? "bg-[#c8a961]/15 text-[#c8a961] border border-[#c8a961]/30"
                  : i < currentStep
                  ? "text-emerald-400/70 border border-emerald-500/20"
                  : "text-[#f0ead6]/35 border border-[#f0ead6]/8"
              }`}
            >
              {i < currentStep ? <CheckCircle2 size={10} /> : <span>{stepIcon(s.type)}</span>}
              <span className="hidden sm:inline truncate max-w-[60px]">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Step content */}
        <div className="px-6 py-6 min-h-[200px]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{stepIcon(step.type)}</span>
            <h3 className="font-display text-sm font-bold tracking-tight text-[#f0ead6]">
              Step {currentStep + 1}: {step.title}
            </h3>
          </div>

          <p className="font-body text-sm text-[#f0ead6]/70 leading-relaxed mb-4">
            {step.description}
          </p>

          {/* Secret step — show guide */}
          {step.type === "secret" && step.secretName && (
            <div className="border border-[#c8a961]/20 bg-[#c8a961]/5 p-4 space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="text-[#c8a961] mt-0.5 shrink-0" />
                <div>
                  <p className="font-body text-xs text-[#c8a961] font-medium">Secret required: {step.secretName}</p>
                  {step.secretGuide && (
                    <p className="font-body text-xs text-[#f0ead6]/50 mt-1">{step.secretGuide}</p>
                  )}
                </div>
              </div>
              {step.link && (
                <a href={step.link} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-body text-xs text-[#c8a961]/80 hover:text-[#c8a961] transition-colors">
                  <ExternalLink size={11} /> Open service dashboard
                </a>
              )}
            </div>
          )}

          {/* Action step — show snippet */}
          {step.type === "action" && step.snippet && (
            <div className="border border-[#f0ead6]/10 bg-[#f0ead6]/3 p-4">
              <div className="flex items-start justify-between gap-3">
                <code className="font-mono text-xs text-[#f0ead6]/80 leading-relaxed break-all">{step.snippet}</code>
                <button onClick={() => copySnippet(step.snippet!)} className="shrink-0 text-[#f0ead6]/40 hover:text-[#f0ead6]/80 transition-colors">
                  <Copy size={13} />
                </button>
              </div>
              {step.link && (
                <a href={step.link} className="inline-flex items-center gap-1.5 font-body text-xs text-[#c8a961]/80 hover:text-[#c8a961] transition-colors mt-3">
                  <ExternalLink size={11} /> Go to prompts page
                </a>
              )}
            </div>
          )}

          {/* Verify step */}
          {step.type === "verify" && (
            <div className="border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <p className="font-body text-xs text-emerald-400 font-medium">Verification checklist</p>
              </div>
              <p className="font-body text-xs text-[#f0ead6]/50 mt-2">{step.description}</p>
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#f0ead6]/10">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={isFirst}
            className="inline-flex items-center gap-1.5 font-body text-xs text-[#f0ead6]/60 hover:text-[#f0ead6]/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={12} /> Back
          </button>

          <p className="font-body text-[11px] text-[#f0ead6]/35">
            {currentStep + 1} of {config.steps.length}
          </p>

          {isLast ? (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-4 py-2 font-body text-xs font-medium bg-[#c8a961] text-[#0a0a08] hover:bg-[#c8a961]/90 transition-colors"
            >
              Done <CheckCircle2 size={12} />
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(Math.min(config.steps.length - 1, currentStep + 1))}
              className="inline-flex items-center gap-1.5 px-4 py-2 font-body text-xs font-medium border border-[#f0ead6]/20 text-[#f0ead6]/90 hover:bg-[#f0ead6]/5 transition-colors"
            >
              Next <ChevronRight size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
