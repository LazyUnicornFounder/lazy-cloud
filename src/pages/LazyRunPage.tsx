import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  FileText, Search, Globe, ShoppingCart, Mic, CreditCard,
  MessageSquare, Video, Code, ChevronDown, Zap, Activity,
  Clock, ArrowRight, Radar, Compass, Layers, BarChart3,
  Database, Bell, Send, Shield, LayoutDashboard, Calendar,
  Package, Printer, Mail, MonitorPlay, Youtube, GitBranch,
  Paintbrush, Lock, Eye, Wrench, Hammer, Brain, RefreshCw,
  TrendingUp, UserCheck
} from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { useCurrentPrompt } from "@/hooks/usePrompt";

const LAZY_RUN_PROMPT = `[Lazy Run Prompt — v0.0.5 — LazyUnicorn.ai]

Add a complete unified autonomous operations runtime called Lazy Run to this project. Lazy Run installs and manages all Lazy agents from a single setup prompt, a single dashboard, and a unified scheduling and monitoring system. Install only the agents the user activates during setup.

---

## IMPORTANT: Function naming

All edge functions must use these exact names. Lazy Run calls them by these names.

| Agent | Functions |
|--------|-----------|
| Blogger | blog-publish |
| SEO | seo-discover, seo-publish |
| GEO | geo-discover, geo-publish, geo-test |
| Store | store-discover, store-listings, store-prices, store-promote, store-optimise, store-content |
| Voice | voice-narrate, voice-rss |
| Pay | pay-checkout, pay-webhook, pay-optimise, pay-recover, pay-portal |
| SMS | sms-send, sms-receive, sms-status, sms-sequences-run, sms-optimise |
| Stream | stream-monitor, stream-process, stream-write-content, stream-optimise |
| Code | github-webhook, code-sync-roadmap, code-write-content, code-optimise |
| GitLab | gitlab-webhook, gitlab-sync-roadmap, gitlab-write-content, gitlab-optimise |
| Linear | linear-sync-all, linear-write-content, linear-velocity-report, linear-optimise |
| Crawl | crawl-run, crawl-extract, crawl-publish |
| Perplexity | perplexity-research, perplexity-feed-agents, perplexity-test-citations, perplexity-improve-content |
| Alert | alert-send, alert-monitor, alert-briefing, alert-command |
| Telegram | telegram-send, telegram-monitor, telegram-briefing, telegram-command |
| Contentful | contentful-pull, contentful-webhook, contentful-push |
| Supabase | supabase-monitor, supabase-publish-milestone, supabase-weekly-report |
| Security | security-scan, security-poll, security-alert, security-generate-report, security-monitor |
| Auth | auth-setup, auth-sync-providers, auth-monitor |
| Granola | granola-sync, granola-process, granola-write-post, granola-write-update, granola-extract-intel, granola-slack-summary, granola-weekly-digest |
| Drop | drop-discover, drop-import, drop-prices, drop-stock, drop-fulfil, drop-optimise |
| Print | print-discover, print-design, print-sync, print-fulfil, print-optimise |
| YouTube | youtube-discover, youtube-transcribe, youtube-write-content, youtube-optimise |
| Mail | mail-subscribe, mail-welcome, mail-broadcast, mail-optimise |
| Design | design-audit, design-upgrade, design-optimise |
| Watch | watch-scan, watch-report |
| Fix | fix-analyse, fix-pr |
| Build | build-brief, build-generate |
| Intel | intel-analyse, intel-feed |
| Repurpose | repurpose-scan, repurpose-generate |
| Trend | trend-scan, trend-queue |
| Churn | churn-scan, churn-engage |
| Run | run-orchestrator, run-weekly-report, run-health-check |

---

## IMPORTANT: API key storage

ALL API keys must be stored as Supabase secrets. Never in database tables.
Reference in edge functions via Deno.env.get().

Required secrets by agent:
- Blogger/SEO/GEO/Store: none (uses built-in Lovable AI)
- Drop: AUTODS_API_KEY
- Print: PRINTFUL_API_KEY
- Voice: ELEVENLABS_API_KEY
- Pay: STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET
- SMS: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN
- Stream: TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET
- Code: GITHUB_TOKEN, GITHUB_WEBHOOK_SECRET
- GitLab: GITLAB_TOKEN, GITLAB_WEBHOOK_SECRET
- Linear: LINEAR_API_KEY
- Crawl: FIRECRAWL_API_KEY
- Perplexity: PERPLEXITY_API_KEY
- Alert: SLACK_SIGNING_SECRET
- Telegram: TELEGRAM_BOT_TOKEN
- Contentful: CONTENTFUL_DELIVERY_TOKEN, CONTENTFUL_MANAGEMENT_TOKEN, CONTENTFUL_WEBHOOK_SECRET
- Supabase monitoring: SUPABASE_SERVICE_ROLE_KEY
- Security: AIKIDO_API_KEY
- Auth: none (uses Lovable Cloud auth)
- Granola: none (uses Granola MCP server)
- YouTube: SUPADATA_API_KEY
- Mail: RESEND_API_KEY
- Design: none (uses 21st.dev and built-in AI)
- Watch: GITHUB_TOKEN (shared with Code)
- Fix: GITHUB_TOKEN (shared with Code)
- Build: none (uses built-in Lovable AI)
- Intel: none (uses built-in Lovable AI)
- Repurpose: none (uses built-in Lovable AI)
- Trend: none (uses built-in Lovable AI)
- Churn: RESEND_API_KEY (shared with Mail)

---

## 1. Database

Create these Supabase tables with RLS enabled:

**run_settings**
id (uuid, primary key, default gen_random_uuid()),
site_url (text),
brand_name (text),
business_description (text),
target_audience (text),
support_email (text),
active_agent (text),
master_running (boolean, default true),
setup_complete (boolean, default false),
prompt_version (text, nullable),
created_at (timestamptz, default now())

**run_activity**
id (uuid, primary key, default gen_random_uuid()),
agent (text),
action (text),
result (text),
details (text),
created_at (timestamptz, default now())

**run_performance**
id (uuid, primary key, default gen_random_uuid()),
agent (text),
metric_name (text),
metric_value (numeric),
recorded_at (timestamptz, default now())

**run_errors**
id (uuid, primary key, default gen_random_uuid()),
agent (text),
function_name (text),
error_message (text),
created_at (timestamptz, default now())

Also create all database tables for each activated agent using these exact table names. Every agent settings table must include a prompt_version (text, nullable) field in addition to the standard fields. Set the prompt_version value when seeding each agent settings table in step 4 of the setup submit using the current version strings from SPEC.md.

Blogger: blog_settings, blog_posts, blog_errors
SEO: seo_settings, seo_posts, seo_keywords (add source field: text), seo_errors
GEO: geo_settings, geo_posts, geo_queries (add source field: text), geo_citations, geo_errors
Store: store_settings, store_products, store_promotions, store_content, store_errors
Drop: drop_settings, drop_products, drop_orders, drop_suppliers, drop_optimisation_log, drop_errors
Print: print_settings, print_products, print_designs, print_orders, print_optimisation_log, print_errors
Voice: voice_settings, voice_episodes, voice_errors
Pay: pay_settings, pay_products, pay_customers, pay_transactions, pay_subscriptions, pay_abandoned, pay_optimisation_log, pay_errors
SMS: sms_settings, sms_contacts, sms_messages, sms_sequences, sms_optouts, sms_optimisation_log, sms_errors
Stream: stream_settings, stream_sessions, stream_content, stream_clips, stream_transcripts, stream_optimisation_log, stream_errors
Code: code_settings, code_commits, code_releases, code_content, code_roadmap, code_optimisation_log, code_errors
GitLab: gitlab_settings, gitlab_commits, gitlab_merge_requests, gitlab_releases, gitlab_content, gitlab_roadmap, gitlab_optimisation_log, gitlab_errors
Linear: linear_settings, linear_issues, linear_cycles, linear_projects, linear_content, linear_optimisation_log, linear_errors
Crawl: crawl_settings, crawl_targets, crawl_results, crawl_intel, crawl_leads, crawl_errors
Perplexity: perplexity_settings, perplexity_research, perplexity_citations, perplexity_content, perplexity_errors
Alert: alert_settings, alert_log, alert_errors
Telegram: telegram_settings, telegram_log, telegram_errors
Contentful: contentful_settings, contentful_entries, contentful_sync_log, contentful_errors
Supabase monitoring: supabase_settings, supabase_snapshots, supabase_milestones, supabase_content, supabase_errors
Security: security_settings, security_scans, security_vulnerabilities, security_reports, security_errors
Auth: auth_settings, auth_providers, auth_sessions_log, auth_errors
YouTube: youtube_settings, youtube_channels, youtube_videos, youtube_content, youtube_errors
Mail: mail_settings, mail_subscribers, mail_campaigns, mail_errors
Design: design_settings, design_audits, design_upgrades, design_errors
Watch: watch_settings, watch_scans, watch_issues, watch_errors
Fix: fix_settings, fix_analyses, fix_prs, fix_errors
Build: build_settings, build_briefs, build_outputs, build_errors
Intel: intel_settings, intel_analyses, intel_recommendations, intel_errors
Repurpose: repurpose_settings, repurpose_sources, repurpose_outputs, repurpose_errors
Trend: trend_settings, trend_signals, trend_queue, trend_errors
Churn: churn_settings, churn_signals, churn_actions, churn_errors
Granola: granola_settings, granola_meetings, granola_outputs, granola_intelligence, granola_errors

Create only the tables for agents the user activates.

---

## 2. Setup page

Create a multi-step setup page at /lazy-run-setup.

**Step 1 — Welcome**
Show: "Welcome to Lazy Run. In the next 5 minutes you will set up the autonomous operations layer for your Lovable site. After setup your site will publish content, rank on Google, appear in AI answers, take payments, text customers, and more — automatically, forever."
Next button.

**Step 2 — Choose agents**
Show agent cards grouped by category. Each card shows agent name, one-line description, and an on/off toggle. Default content agents on (Blogger, SEO, GEO). All others default off.

Group: Content Agents
- Lazy Blogger: Publishes SEO and GEO blog posts automatically every 15 minutes
- Lazy SEO: Discovers keywords and publishes ranking articles
- Lazy GEO: Publishes content cited by ChatGPT and Perplexity
- Lazy Crawl: Monitors competitors and feeds real intelligence into your content agents
- Lazy Perplexity: Researches your niche with live web data and tests brand citation rates
- Lazy Contentful: Two-way content sync between your Lovable site and Contentful

Group: Commerce Agents
- Lazy Store: Discovers products, writes listings, optimises conversion
- Lazy Drop: Automates product sourcing, listing, and fulfilment via AutoDS
- Lazy Print: Automates merch creation and sales via Printful
- Lazy Pay: Installs Stripe with self-improving conversion optimisation
- Lazy SMS: Sends automated texts via Twilio that improve themselves
- Lazy Mail: Subscriber capture, welcome sequences, and AI newsletters via Resend

Group: Media Agents
- Lazy Voice: Narrates every post in your voice via ElevenLabs
- Lazy Stream: Turns every Twitch stream into blog posts and SEO content
- Lazy YouTube: Transcribes and repurposes YouTube videos into written content

Group: Developer Agents
- Lazy GitHub: Turns every GitHub commit into a changelog and developer post
- Lazy GitLab: Turns every GitLab commit into a changelog and developer post
- Lazy Linear: Turns Linear issues and cycles into changelogs and product updates
- Lazy Design: Upgrades your site with 21st.dev components matched to your brand
- Lazy Auth: Installs Google OAuth, email login, protected routes, and user management automatically
- Lazy Granola: Turns meeting notes into blog posts, product updates, and intelligence

Group: Ops Agents
- Lazy Admin: Unified dashboard for all agents
- Lazy Alert: Real-time Slack alerts for every agent event
- Lazy Telegram: Real-time Telegram alerts and bot commands for every agent
- Lazy Supabase: Monitors database milestones and publishes product update posts
- Lazy Security: Runs automated Aikido pentests, tracks vulnerabilities, and generates audit-ready reports
- Lazy Watch: Monitors errors across all agents and opens GitHub issues automatically
- Lazy Fix: Reads performance data and opens PRs with prompt improvements
- Lazy Build: Writes complete new agent prompts from a brief
- Lazy Intel: Reads all your data and fills your SEO and GEO queues automatically
- Lazy Repurpose: Turns top posts into Twitter threads, LinkedIn posts, newsletters, and video scripts
- Lazy Trend: Scans for trending topics every 6 hours and queues urgent content
- Lazy Churn: Monitors subscribers daily and sends re-engagement before cancellation

Below the cards show which API keys each selected agent requires.
Next button.

**Step 3 — Core settings**
Fields:
- Site URL
- Brand name
- Business description
- Target audience
- Support email

Include Suggest buttons that auto-fill related fields using the built-in Lovable AI.
Next button.

**Step 4 — API keys**
Show only the fields required by agents selected in step 2. Group by service:

Content agents: show note "Lazy Blogger, SEO, GEO, and Store use Lovable's built-in AI — no API key required."

Firecrawl section (if Lazy Crawl active): Firecrawl API key — stored as FIRECRAWL_API_KEY secret.

Perplexity section (if Lazy Perplexity active): Perplexity API key — stored as PERPLEXITY_API_KEY secret.

ElevenLabs section (if Lazy Voice active): API key stored as ELEVENLABS_API_KEY, Voice ID (default EXAVITQu4vr4xnSDxMaL).

Stripe section (if Lazy Pay active): Publishable Key as STRIPE_PUBLISHABLE_KEY, Secret Key as STRIPE_SECRET_KEY, Webhook Secret as STRIPE_WEBHOOK_SECRET.

Twilio section (if Lazy SMS active): Account SID as TWILIO_ACCOUNT_SID, Auth Token as TWILIO_AUTH_TOKEN, Phone Number.

AutoDS section (if Lazy Drop active): API key stored as AUTODS_API_KEY.

Printful section (if Lazy Print active): API key stored as PRINTFUL_API_KEY.

Twitch section (if Lazy Stream active): Client ID as TWITCH_CLIENT_ID, Client Secret as TWITCH_CLIENT_SECRET, Username.

GitHub section (if Lazy GitHub or Lazy Watch or Lazy Fix active): Personal Access Token as GITHUB_TOKEN, Webhook Secret as GITHUB_WEBHOOK_SECRET, Username, Repository.

GitLab section (if Lazy GitLab active): Personal Access Token as GITLAB_TOKEN, Webhook Secret as GITLAB_WEBHOOK_SECRET, Username, Project path.

Linear section (if Lazy Linear active): API Key as LINEAR_API_KEY, Team ID.

Slack section (if Lazy Alert active): Slack Webhook URL, Signing Secret as SLACK_SIGNING_SECRET.

Telegram section (if Lazy Telegram active): Bot Token as TELEGRAM_BOT_TOKEN, Chat ID.

Contentful section (if Lazy Contentful active): Space ID, Delivery Token as CONTENTFUL_DELIVERY_TOKEN, Management Token as CONTENTFUL_MANAGEMENT_TOKEN, Webhook Secret as CONTENTFUL_WEBHOOK_SECRET.

Supabase monitoring section (if Lazy Supabase active): Project URL, Service Role Key as SUPABASE_SERVICE_ROLE_KEY.

Aikido section (if Lazy Security active):
- Aikido API key (password) — get at aikido.dev. Stored as AIKIDO_API_KEY secret.
- Aikido Project ID (text) — find in your Aikido project settings.
- Pentest frequency (select: Weekly / Monthly / Quarterly / Manual only)

YouTube section (if Lazy YouTube active): Supadata API key stored as SUPADATA_API_KEY.

Resend section (if Lazy Mail or Lazy Churn active): Resend API key stored as RESEND_API_KEY.

Next button.

**Step 5 — Schedule**
Show a visual publishing schedule for active content agents. Selects for posts per day. Auto-stagger cron times so agents do not compete. Show a preview of the full weekly schedule as a timeline.
Launch button.

**On submit:**
1. Store all API keys as Supabase secrets
2. Save run_settings with active_agent as comma-separated list
3. Set setup_complete to true and prompt_version to 'v0.0.5'
4. Seed all agent-specific settings tables with provided values
5. Create all required database tables for active agents
6. For content agents immediately trigger: blog-publish, seo-discover, geo-discover
7. For Crawl if active immediately trigger crawl-run
8. For Perplexity if active immediately trigger perplexity-research
9. For Contentful if active immediately trigger contentful-pull
10. For Supabase if active immediately trigger supabase-monitor
11. For Security if active immediately trigger security-scan
12. For Drop if active immediately trigger drop-discover
13. For Print if active immediately trigger print-discover
14. For Watch if active immediately trigger watch-scan
15. For Intel if active immediately trigger intel-analyse
16. For Trend if active immediately trigger trend-scan
17. For Churn if active immediately trigger churn-scan
18. Show loading: "Launching your autonomous operations layer..."
19. Redirect to /admin with message: "Lazy Run is active. Your autonomous operations layer is running."

---

## 3. Master orchestrator edge functions

**run-orchestrator**
Cron: every 30 minutes — */30 * * * *

1. Read run_settings. If master_running is false or setup_complete is false exit.
2. Read active_agent as comma-separated list.
3. For each active agent check if it is time to run based on configured schedule.
4. Stagger execution with a 2-minute delay between each agent call.
5. Call the corresponding function for each agent due to run:

Content agents:
- Blogger: blog-publish
- SEO: seo-publish (seo-discover runs on its own Monday cron)
- GEO: geo-publish (geo-discover runs on its own cron)
- Crawl: crawl-run every 30 min, crawl-publish daily 6am
- Perplexity: perplexity-research daily 5am, perplexity-test-citations Sunday 10am, perplexity-improve-content Wednesday 9am

Commerce agents:
- Store: store-discover daily, store-optimise Sunday, store-content Tue/Fri, store-listings and store-prices daily
- Drop: drop-discover daily, drop-import daily, drop-prices every 6 hours, drop-stock every 4 hours, drop-fulfil every hour, drop-optimise Sunday
- Print: print-discover daily, print-sync every 6 hours, print-fulfil every hour, print-optimise Sunday
- Pay: pay-optimise Sunday, pay-recover daily
- SMS: sms-sequences-run every hour
- Mail: mail-broadcast weekly Monday, mail-optimise Sunday

Media agents:
- Voice: voice-narrate every 30 min
- Stream: stream-monitor every 5 min
- YouTube: youtube-discover daily, youtube-transcribe every 6 hours, youtube-write-content daily, youtube-optimise Sunday

Developer agents:
- Code: code-sync-roadmap every hour
- GitLab: gitlab-sync-roadmap every hour
- Linear: linear-sync-all every hour, linear-velocity-report Monday
- Design: design-audit weekly Monday, design-upgrade daily
- Granola: granola-sync every hour, granola-process every 30 min

Ops agents:
- Alert: alert-monitor every 5 min, alert-briefing daily 8am
- Telegram: telegram-monitor every 5 min, telegram-briefing daily 8am
- Contentful: contentful-pull every hour, contentful-push every 30 min
- Supabase: supabase-monitor every hour, supabase-weekly-report Monday
- Security: security-scan every hour (checks if pentest is due), security-poll every 10 min (checks scan status), security-monitor daily 3am
- Auth: auth-sync-providers daily 6am, auth-monitor every hour
- Watch: watch-scan every hour
- Fix: fix-analyse weekly Sunday, fix-pr weekly Sunday
- Build: build-brief on-demand only (triggered via admin)
- Intel: intel-analyse daily 4am, intel-feed daily 5am
- Repurpose: repurpose-scan daily 6am, repurpose-generate daily 7am
- Trend: trend-scan every 6 hours, trend-queue every 6 hours
- Churn: churn-scan daily 9am, churn-engage daily 10am

6. Log each execution to run_activity: agent, action, result, details.
7. Log failures to run_errors.

**run-weekly-report**
Cron: every Monday at 7am UTC — 0 7 * * 1

1. Read run_settings. If master_running is false exit.
2. Collect last 7 days metrics from every active agent:
- Blogger: blog_posts count
- SEO: seo_posts count, seo_keywords count, keyword sources breakdown
- GEO: geo_posts count, citation rate, query sources breakdown
- Store: store_products count, active promotions
- Drop: drop_products imported, drop_orders fulfilled, drop_suppliers active
- Print: print_products listed, print_orders fulfilled, print_designs created
- Pay: pay_transactions succeeded count, MRR from pay_subscriptions
- SMS: sms_messages sent count, response rate from sms_sequences
- Voice: voice_episodes count
- Stream: stream_sessions processed, stream_content count
- Code: code_commits processed, code_content count
- GitLab: gitlab_commits processed, gitlab_content count
- Linear: linear_issues completed, linear_content count
- Crawl: crawl_targets active, crawl_intel count, crawl_leads count
- Perplexity: perplexity_research count, brand citation rate from perplexity_citations
- Alert: alert_log count, success rate
- Telegram: telegram_log count
- Contentful: contentful_entries synced, contentful_sync_log push count
- Supabase: supabase_milestones reached, supabase_content count
- Security: current security score from latest security_scans, open critical count, open high count from security_vulnerabilities, last pentest date
- Auth: auth_sessions_log count, active providers from auth_providers, auth_errors count
- YouTube: youtube_videos transcribed, youtube_content count
- Mail: mail_subscribers count, mail_campaigns sent
- Design: design_audits run, design_upgrades applied
- Watch: watch_issues opened, watch_scans run
- Fix: fix_prs opened, fix_analyses run
- Build: build_outputs generated
- Intel: intel_recommendations generated, intel_analyses run
- Repurpose: repurpose_outputs generated
- Trend: trend_signals detected, trend_queue items queued
- Churn: churn_signals detected, churn_actions sent

3. Call the built-in Lovable AI:
"Write a weekly performance report for [brand_name]. Metrics from the last 7 days: [metrics list]. Write a friendly report under 300 words. Cover what the agents accomplished, the best performing agent, any areas for improvement, projection for next week. Write in second person. Return only the report text."
4. If Lazy Alert is installed send to Slack via alert-send.
5. If Lazy Telegram is installed send via telegram-send.
6. Send email to support_email with subject: "Your Lazy Run weekly report — [current date]".
7. Insert into run_activity with agent run, action weekly-report, result success.
Log errors to run_errors.

**run-health-check**
Cron: every hour — 0 * * * *

1. Read run_settings.
2. For each active agent query its errors table for errors in the last hour.
3. If any agent has more than 3 errors in the last hour: insert warning into run_activity with result error. If Lazy Alert is installed call alert-send with the warning. If Lazy Telegram is installed call telegram-send.
4. For Security agent: also check security_vulnerabilities for any new critical severity vulnerabilities found in the last hour. If found and Lazy Alert or Lazy Telegram is installed send an immediate alert regardless of error threshold.
5. Insert performance snapshot into run_performance for each agent.
Log errors to run_errors.

---

## 4. Install all agent edge functions

Install all edge functions for each active agent using these exact function names:
blog-publish, seo-discover, seo-publish, geo-discover, geo-publish, geo-test, store-discover, store-listings, store-prices, store-promote, store-optimise, store-content, voice-narrate, voice-rss, pay-checkout, pay-webhook, pay-optimise, pay-recover, pay-portal, sms-send, sms-receive, sms-status, sms-sequences-run, sms-optimise, stream-monitor, stream-process, stream-write-content, stream-optimise, github-webhook, code-sync-roadmap, code-write-content, code-optimise, gitlab-webhook, gitlab-sync-roadmap, gitlab-write-content, gitlab-optimise, linear-sync-all, linear-write-content, linear-velocity-report, linear-optimise, crawl-run, crawl-extract, crawl-publish, perplexity-research, perplexity-feed-agents, perplexity-test-citations, perplexity-improve-content, alert-send, alert-monitor, alert-briefing, alert-command, telegram-send, telegram-monitor, telegram-briefing, telegram-command, contentful-pull, contentful-webhook, contentful-push, supabase-monitor, supabase-publish-milestone, supabase-weekly-report, security-scan, security-poll, security-alert, security-generate-report, security-monitor.

Also install: drop-discover, drop-import, drop-prices, drop-stock, drop-fulfil, drop-optimise, print-discover, print-design, print-sync, print-fulfil, print-optimise, auth-setup, auth-sync-providers, auth-monitor, granola-sync, granola-process, granola-write-post, granola-write-update, granola-extract-intel, granola-slack-summary, granola-weekly-digest, youtube-discover, youtube-transcribe, youtube-write-content, youtube-optimise, mail-subscribe, mail-welcome, mail-broadcast, mail-optimise, design-audit, design-upgrade, design-optimise, watch-scan, watch-report, fix-analyse, fix-pr, build-brief, build-generate, intel-analyse, intel-feed, repurpose-scan, repurpose-generate, trend-scan, trend-queue, churn-scan, churn-engage.

Only install functions for active agents.

---

## 5. Admin dashboard

Do not build a standalone /lazy-run-dashboard page. The unified admin dashboard lives at /admin and is built separately using the LazyUnicorn Admin Dashboard prompt.

Lazy Run's contribution to the admin is its data — run_activity, run_performance, run_errors, and run_settings are all read by the admin dashboard to power the overview page, activity feed, performance charts, and master controls.

On setup completion redirect to /admin with message: "Lazy Run is active. Your autonomous operations layer is running."

If /admin does not yet exist when Lazy Run is installed, create a temporary page at /admin that shows: the run_settings brand name, the master_running toggle connected to run_settings, a list of active agents from active_agent in run_settings each with their is_running status, the last 20 rows from run_activity, and a message: "Install the LazyUnicorn Admin Dashboard for the full control panel."

---

## 6. Public pages

Do not add any Lazy Run pages to public navigation.
Content published by individual agents appears through their own public routes.

---

## 7. Navigation

Add a single Admin link to site navigation pointing to /admin.
This replaces any existing admin links.
Do not expose any setup routes in public navigation.

## Backlink Badge
Add a small "Powered by Lazy Unicorn" backlink badge in the footer of every public-facing page. Use this exact HTML:
<a href="https://www.lazyunicorn.ai" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#0a0a08;color:#f0ead6;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border:1px solid rgba(240,234,214,0.2)">🦄 Powered by Lazy Unicorn</a>
Style it to sit at the bottom of the page footer, centered, with subtle opacity (60%) that increases to 100% on hover.`;

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const agents = [
  // Content
  { name: "Lazy Blogger", desc: "Autonomous blog posts", icon: FileText, href: "/lazy-blogger" },
  { name: "Lazy SEO", desc: "Autonomous SEO content", icon: Search, href: "/lazy-seo" },
  { name: "Lazy GEO", desc: "Autonomous AI citations", icon: Globe, href: "/lazy-geo" },
  { name: "Lazy Crawl", desc: "Autonomous web research", icon: Radar, href: "/lazy-crawl" },
  { name: "Lazy Perplexity", desc: "Autonomous deep research", icon: Compass, href: "/lazy-perplexity" },
  { name: "Lazy Contentful", desc: "Autonomous CMS sync", icon: Layers, href: "/lazy-contentful" },
  // Commerce
  { name: "Lazy Store", desc: "Autonomous storefronts", icon: ShoppingCart, href: "/lazy-store" },
  { name: "Lazy Drop", desc: "Autonomous dropshipping", icon: Package, href: "/lazy-drop" },
  { name: "Lazy Print", desc: "Autonomous merch", icon: Printer, href: "/lazy-print" },
  { name: "Lazy Pay", desc: "Autonomous payments", icon: CreditCard, href: "/lazy-pay" },
  { name: "Lazy SMS", desc: "Autonomous text campaigns", icon: MessageSquare, href: "/lazy-sms" },
  { name: "Lazy Mail", desc: "Autonomous email flows", icon: Mail, href: "/lazy-mail" },
  // Media
  { name: "Lazy Voice", desc: "Autonomous podcasts", icon: Mic, href: "/lazy-voice" },
  { name: "Lazy Stream", desc: "Autonomous stream content", icon: MonitorPlay, href: "/lazy-stream" },
  { name: "Lazy YouTube", desc: "Autonomous video content", icon: Youtube, href: "/lazy-youtube" },
  // Dev
  { name: "Lazy GitHub", desc: "Autonomous changelogs", icon: Code, href: "/lazy-github" },
  { name: "Lazy GitLab", desc: "Autonomous GitLab docs", icon: GitBranch, href: "/lazy-gitlab" },
  { name: "Lazy Linear", desc: "Autonomous issue content", icon: BarChart3, href: "/lazy-linear" },
  { name: "Lazy Design", desc: "Autonomous UI upgrades", icon: Paintbrush, href: "/lazy-design" },
  { name: "Lazy Auth", desc: "Autonomous login flows", icon: Lock, href: "/lazy-auth" },
  { name: "Lazy Granola", desc: "Autonomous meeting content", icon: Calendar, href: "/lazy-granola" },
  // Ops
  { name: "Lazy Admin", desc: "Unified ops dashboard", icon: LayoutDashboard, href: "/lazy-admin" },
  { name: "Lazy Alert", desc: "Autonomous Slack alerts", icon: Bell, href: "/lazy-alert" },
  { name: "Lazy Telegram", desc: "Autonomous Telegram updates", icon: Send, href: "/lazy-telegram" },
  { name: "Lazy Supabase", desc: "Autonomous database reports", icon: Database, href: "/lazy-supabase" },
  { name: "Lazy Security", desc: "Autonomous pentesting", icon: Shield, href: "/lazy-security" },
  { name: "Lazy Watch", desc: "Autonomous error monitoring", icon: Eye, href: "/lazy-watch" },
  { name: "Lazy Fix", desc: "Autonomous prompt improvement", icon: Wrench, href: "/lazy-fix" },
  { name: "Lazy Build", desc: "Writes new agent prompts", icon: Hammer, href: "/lazy-build" },
  { name: "Lazy Intel", desc: "Autonomous content strategy", icon: Brain, href: "/lazy-intel" },
  { name: "Lazy Repurpose", desc: "Autonomous content recycling", icon: RefreshCw, href: "/lazy-repurpose" },
  { name: "Lazy Trend", desc: "Autonomous trend detection", icon: TrendingUp, href: "/lazy-trend" },
  { name: "Lazy Churn", desc: "Autonomous churn prevention", icon: UserCheck, href: "/lazy-churn" },
];

const faqs = [
  { q: "Do I need all thirty-five agents?", a: "No. The setup screen lets you choose which agents to activate. You can start with two or three and add more later without reinstalling." },
  { q: "Does it replace the individual Lazy prompts?", a: "Yes. If you install Lazy Run you do not need to paste the individual prompts. Lazy Run includes all of them." },
  { q: "What API keys do I need?", a: "Only the ones for the agents you activate. Content agents like Lazy Blogger, Lazy SEO, and Lazy GEO use Lovable's built-in AI — no API key required. Lazy Pay needs Stripe. Lazy SMS needs Twilio. Lazy Voice needs ElevenLabs. Lazy Stream needs Twitch. Lazy Mail needs Resend. Lazy Design needs nothing — it uses 21st.dev and built-in AI." },
  { q: "Can I still use individual agents if I have them installed?", a: "Yes. Lazy Run is additive. If you already have Lazy Blogger installed it will detect it and manage it alongside the others." },
  { q: "How is Lazy Run different from just pasting all the individual prompts?", a: "Lazy Run adds the coordination layer — unified scheduling, cross-agent activity feed, master controls, performance reporting, and smart resource management. The individual prompts do not talk to each other. Lazy Run makes them work as one system." },
  { q: "How do I know when there's an update?", a: "Check the changelog at /changelog. Every agent update is versioned and documented with upgrade instructions." },
  { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing data and settings are preserved." },
];

const dashboardFeatures = [
  { icon: Zap, title: "Master toggle", desc: "One switch pauses or resumes every agent simultaneously." },
  { icon: Activity, title: "Unified feed", desc: "Every action from every agent in a single chronological activity stream." },
  { icon: Clock, title: "Smart scheduling", desc: "Agents are staggered automatically so they never compete for resources or API limits." },
];

function CopyPromptButton({ label = "COPY THE LOVABLE PROMPT", text }: { label?: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Prompt copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 bg-primary text-primary-foreground hover:bg-foreground/90 transition-colors"
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

export default function LazyRunPage() {
  const { prompt: dbPrompt } = useCurrentPrompt("lazy-run");
  const promptText = dbPrompt?.prompt_text || LAZY_RUN_PROMPT;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Run — The Autonomous Runtime for Lovable"
        description="One prompt installs the complete autonomous operations layer into your Lovable project. Thirty-five agents. One dashboard. Everything runs itself."
        url="/lazy-run"
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 md:pt-44 pb-20 md:pb-28 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block font-display text-[14px] font-bold tracking-[0.2em] uppercase px-3 py-1 border border-foreground/20 text-foreground/50">
                INCLUDES ALL 35 AGENTS
              </span>
            </div>
          </motion.div>
              <span className="font-display text-[11px] tracking-[0.2em] uppercase font-bold text-foreground/40 mb-4 block">BETA</span>
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            <span>All 35 agents. One prompt.</span>
          </motion.h1>
          <div className="flex items-center gap-3 mt-4 mb-4">
            <span className="font-display text-[11px] tracking-[0.15em] uppercase font-bold px-3 py-1 border border-[#c8a961]/30 text-[#c8a961]">Lazy Unicorn</span>
          </div>
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}
            className="font-body text-base md:text-lg text-foreground/50 max-w-2xl leading-relaxed mb-10"
          >
            Lazy Run is the one prompt that installs everything. Paste it into your Lovable project, and walk away. Your blog writes itself. Your SEO compounds. ChatGPT and Perplexity start citing you. Your store runs its own promotions. Your checkout rewrites copy that is not converting. Your customers get texted back automatically. Every post gets narrated. Every stream becomes an article. Every commit becomes a changelog. Your site gets pentested on a schedule. Everything reports to one dashboard. Nothing requires you after setup.
          </motion.p>
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <CopyPromptButton text={promptText} />
            <button
              onClick={() => document.getElementById("what-it-installs")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 border border-border text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              SEE WHAT IT INSTALLS <ChevronDown size={14} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-8">
            Lovable builds your site.
            <br />
            Then what?
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-body text-base md:text-lg text-foreground/50 leading-relaxed">
            Lovable is the best way to build a product. It is not the operations layer. It does not publish your blog. It does not target your SEO keywords. It does not send SMS confirmations. It does not narrate your posts. It does not optimise your payments. It does not process your GitHub commits. Those things require a second layer — the autonomous operations layer that runs your site after Lovable has built it. Lazy Run is that layer.
          </motion.p>
        </div>
      </section>

      {/* What It Installs */}
      <section id="what-it-installs" className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight text-center mb-14">
            Every agent. One prompt.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((e, i) => (
              <motion.a
                key={e.name}
                href={e.href}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="border border-border p-6 bg-card hover:border-foreground/20 transition-colors group"
              >
                <e.icon size={20} className="text-foreground/50 mb-3 group-hover:text-foreground/50 transition-colors" />
                <h3 className="font-display text-sm font-bold mb-1">{e.name}</h3>
                <p className="font-body text-sm text-foreground/50 leading-relaxed">{e.desc}</p>
              </motion.a>
            ))}
          </div>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-body text-sm text-foreground/50 text-center mt-10 max-w-lg mx-auto">
            All thirty-five agents install in one prompt. All run automatically. All managed from one dashboard.
          </motion.p>
        </div>
      </section>

      {/* Dashboard */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight text-center mb-14">
            One dashboard. Everything running.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboardFeatures.map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-border p-6 bg-card"
              >
                <f.icon size={20} className="text-foreground/50 mb-3" />
                <h3 className="font-display text-sm font-bold mb-2">{f.title}</h3>
                <p className="font-body text-sm text-foreground/50 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compound Effect */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-8">
            Thirty-five agents compounding simultaneously.
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-body text-base md:text-lg text-foreground/50 leading-relaxed">
            Each agent compounds on its own. Lazy Blogger builds domain authority. Lazy SEO captures keyword traffic. Lazy GEO earns AI citations. Lazy Store grows revenue. Together they compound on each other. The blog posts support the SEO. The SEO drives traffic to the store. The store triggers the SMS sequences. The SMS drives repeat purchases. The payments data improves the copy. Lazy Watch monitors errors. Lazy Fix improves prompts. Lazy Intel fills your content queues. Lazy Trend detects opportunities. Lazy Churn saves subscribers. Lazy Run coordinates the whole system so every agent feeds every other one. One prompt. Thirty-five compounding loops. Running forever.
          </motion.p>
        </div>
      </section>

      <LazyPricingSection
        lazyFeatures={["Lazy Run setup prompt", "Self-hosted in your existing Lovable project", "Installs all thirty-five agents", "Bring your own API keys for each service"]}
        proFeatures={["Hosted version", "All API costs included", "Priority processing", "Weekly performance email", "Dedicated support"]}
        proPrice="$99"
        ctaButton={<CopyPromptButton text={promptText} label="Get the Prompt" />}
      />

      <LazyFaqSection faqs={faqs} />

      {/* Bottom CTA */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-6">
            Lovable builds your site.
            <br />
            Lazy Run runs it.
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-body text-base md:text-lg text-foreground/50 max-w-2xl mx-auto leading-relaxed mb-10">
            One prompt installs the complete autonomous operations layer — publishing, SEO, GEO, payments, SMS, audio, e-commerce, streams, and code — all managed from one dashboard, all running without you.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <CopyPromptButton text={promptText} />
          </motion.div>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="font-body text-sm text-foreground/50 mt-6 max-w-md mx-auto">
            Open your Lovable project, paste it into the chat, choose your agents, add your API keys. Your site starts running itself today.
          </motion.p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border text-center">
        <p className="font-display text-[14px] tracking-[0.15em] uppercase text-foreground/50">
          Lazy Unicorn — Autonomous agents for Lovable
        </p>
      </footer>
    </div>
  );
}
