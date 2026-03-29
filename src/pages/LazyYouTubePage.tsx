import { useState, useCallback, useEffect } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { motion } from "framer-motion";
import { Copy, Check, Video, FileText, Zap } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import { Link } from "react-router-dom";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const FALLBACK_PROMPT = `[Lazy YouTube Prompt — v0.0.1 — LazyUnicorn.ai]

Add a complete autonomous YouTube content agent called Lazy YouTube to this project. It monitors your YouTube channel, detects new video uploads, fetches transcripts, and automatically publishes four pieces of content — a transcript post, an SEO article, a GEO article, and a video summary — plus generates chapter markers for your video description, extracts comment intelligence, and uses performance data to inform your entire content strategy. All automatically, every time you upload.

Note: Store all credentials as Supabase secrets. Never store in the database.

Required secrets: YOUTUBE_API_KEY, SUPADATA_API_KEY

Required env: YOUTUBE_CHANNEL_ID (your channel ID, e.g. UCxxxxxxxxxxxxxx)

---

1. Database

Create these Supabase tables with RLS enabled:

youtube_settings: id (uuid, primary key, default gen_random_uuid()), brand_name (text), site_url (text), youtube_channel_id (text), channel_name (text), content_tone (text, default 'conversational'), niche_keywords (text), geo_queries (text), auto_publish (boolean, default true), update_video_descriptions (boolean, default true), slack_webhook_url (text), is_running (boolean, default true), setup_complete (boolean, default false), prompt_version (text, nullable), created_at (timestamptz, default now())

youtube_videos: id (uuid, primary key, default gen_random_uuid()), youtube_video_id (text, unique), title (text), description (text), thumbnail_url (text), duration_seconds (integer), view_count (integer), like_count (integer), comment_count (integer), published_at (timestamptz), transcript (text), transcript_source (text — one of auto-captions, manual-captions, supadata, unavailable), chapters_generated (boolean, default false), processing_status (text, default 'pending' — one of pending, processing, done, failed), created_at (timestamptz, default now())

youtube_content: id (uuid, primary key, default gen_random_uuid()), video_id (uuid), content_type (text — one of transcript, seo-article, geo-article, summary, chapters), title (text), slug (text, unique), excerpt (text), body (text), target_keyword (text), target_query (text), published (boolean, default true), views (integer, default 0), published_at (timestamptz, default now()), created_at (timestamptz, default now())

youtube_comments: id (uuid, primary key, default gen_random_uuid()), video_id (uuid), youtube_comment_id (text), author_name (text), comment_text (text), like_count (integer), reply_count (integer), published_at (timestamptz), intel_extracted (boolean, default false), created_at (timestamptz, default now())

youtube_intelligence: id (uuid, primary key, default gen_random_uuid()), video_id (uuid), intel_type (text — one of question-asked, topic-mentioned, complaint, request, keyword-signal), content (text), comment_context (text), actioned (boolean, default false), created_at (timestamptz, default now())

youtube_performance: id (uuid, primary key, default gen_random_uuid()), video_id (uuid), checked_at (timestamptz, default now()), view_count (integer), like_count (integer), comment_count (integer), avg_view_duration_seconds (integer), views_7d (integer), views_28d (integer))

youtube_errors: id (uuid, primary key, default gen_random_uuid()), function_name (text), error_message (text), created_at (timestamptz, default now())

---

2. Setup page

Create a page at /lazy-youtube-setup.

Welcome message: 'Every video you upload is a blog post, an SEO article, a GEO citation, a transcript, and a content strategy signal sitting unwritten. Lazy YouTube turns every upload into five autonomous content pieces — the moment your video goes live.'

Prerequisites: You need a Google Cloud project with YouTube Data API v3 enabled. Create an API key at console.cloud.google.com. You also need a Supadata.ai account for transcript extraction — sign up at supadata.ai and get your API key.

Form fields:

- Brand name (text)

- Site URL (text)

- YouTube Channel ID (text) — find it at youtube.com/account_advanced or in your channel URL. Starts with UC. e.g. UCxxxxxxxxxxxxxx

- YouTube API key (password) — from Google Cloud Console. Stored as YOUTUBE_API_KEY.

- Supadata API key (password) — from supadata.ai dashboard. Used to fetch video transcripts. Stored as SUPADATA_API_KEY.

- Content tone (select: Conversational — like you are talking to viewers / Editorial — clean journalistic style / Technical — detailed and precise / Educational — clear and instructive)

- Niche keywords (text, comma separated) — topics your channel covers e.g. 'Lovable development, no-code tools, SaaS building'. Used to target SEO articles.

- GEO queries (text, comma separated) — questions people ask AI about your niche e.g. 'how to build a SaaS without coding, best no-code tools for developers'. Include a Suggest Queries button.

- Auto-publish content (toggle, default on) — if off content is drafted but not published until approved

- Update video descriptions with chapters (toggle, default on) — adds generated chapters to your YouTube video description automatically. Requires OAuth — see note below.

- Slack webhook URL for alerts (text, optional)

OAuth note (shown if update_video_descriptions is on): Updating your YouTube video descriptions requires OAuth 2.0 authorization. After setup click the Authorise YouTube button to grant permission. This is optional — Lazy YouTube works without it but cannot automatically add chapters to your videos.

Submit button: Connect YouTube

On submit:

1. Store YOUTUBE_API_KEY and SUPADATA_API_KEY as Supabase secrets

2. Save all values to youtube_settings

3. Set setup_complete to true and prompt_version to 'v0.0.1'

4. Call youtube-sync immediately to fetch recent videos

5. Redirect to /admin with message: 'Lazy YouTube is connected. Your recent videos are being processed. Content will appear within a few minutes.'

---

3. Edge functions

youtube-sync

Cron: every 30 minutes — */30 * * * *

1. Read youtube_settings. If is_running false or setup_complete false exit.

2. Call YouTube Data API: GET https://www.googleapis.com/youtube/v3/activities?part=snippet,contentDetails&channelId=[youtube_channel_id]&maxResults=10&key=[YOUTUBE_API_KEY]

3. Filter for type: upload. For each upload check if youtube_video_id already exists in youtube_videos. If yes skip.

4. For each new video call YouTube Data API to get full details: GET https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=[video_id]&key=[YOUTUBE_API_KEY]

5. Insert into youtube_videos with title, description, thumbnail_url, duration_seconds (convert PT format), view_count, like_count, comment_count, published_at, processing_status pending.

6. Call youtube-process with the video id.

Log errors to youtube_errors with function_name youtube-sync.

youtube-fetch-transcript

Accepts video_id and youtube_video_id. Returns transcript text.

1. Try Supadata API first: GET https://api.supadata.ai/v1/youtube/transcript?videoId=[youtube_video_id]&lang=en with header x-api-key: [SUPADATA_API_KEY].

2. If successful concatenate all segment text fields with spaces. Update youtube_videos transcript and transcript_source to supadata. Return transcript.

3. If Supadata fails (no captions available): try YouTube captions API if OAuth is configured: GET https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=[youtube_video_id]&key=[YOUTUBE_API_KEY]. If captions exist download the first English track.

4. If both fail: update youtube_videos transcript_source to unavailable. Return null. Log to youtube_errors.

Log errors to youtube_errors with function_name youtube-fetch-transcript.

youtube-process

Triggered by youtube-sync. Accepts video_id.

1. Read youtube_settings and the youtube_videos row. If processing_status is not pending exit. Update to processing.

2. Call youtube-fetch-transcript to get the transcript. If unavailable continue with metadata only — content can still be generated from the title and description.

3. Call all enabled content generation functions:

   - Call youtube-write-transcript with video_id (only if transcript is available)

   - Call youtube-write-seo with video_id

   - Call youtube-write-geo with video_id

   - Call youtube-write-summary with video_id

   - Call youtube-generate-chapters with video_id (only if transcript is available)

4. Update processing_status to done.

5. If slack_webhook_url is set send a Slack message: '📺 Lazy YouTube published content from: [video title]. View at [site_url]/videos.'

Log errors to youtube_errors with function_name youtube-process.

youtube-write-transcript

Accepts video_id. Requires transcript.

1. Read youtube_settings and youtube_videos.

2. Call built-in Lovable AI:

'You are formatting a YouTube video transcript for [brand_name]. Video: [title]. Clean up this raw transcript into a readable, well-structured article. Fix punctuation and capitalisation. Break into logical paragraphs. Add ## section headers at natural topic breaks. Remove filler words (um, uh, you know) where they are excessive. Keep the voice and tone authentic — this should read like the video sounds. Add a short introduction and a closing paragraph. Return only a valid JSON object: title (e.g. "[video title] — Full Transcript"), slug (lowercase hyphenated), excerpt (one sentence describing what the video covers, under 160 chars), body (formatted markdown transcript with ## headers and timestamps in brackets where major topics shift, ends with: Watch the full video on YouTube → [youtube video URL]. Discover more at LazyUnicorn.ai — link to https://lazyunicorn.ai). No preamble. No code fences.'

3. Parse response. Check for duplicate slug. Insert into youtube_content with content_type transcript and the video_id.

If blog_posts table exists also insert there with post_type set to youtube-transcript.

Log errors to youtube_errors with function_name youtube-write-transcript.

youtube-write-seo

Accepts video_id.

1. Read youtube_settings and youtube_videos.

2. Select the most relevant keyword from niche_keywords that matches the video topic. If transcript is available use it as source material.

3. Call built-in Lovable AI:

'You are an SEO content writer for [brand_name] — [describe channel niche from niche_keywords]. Target keyword: [best matching keyword]. Video: [title]. [If transcript available: Use this transcript as your source material: [first 3000 chars of transcript].] Write a long-form SEO article targeting the keyword. This is NOT a transcript — it is an original article that uses the video as source material but reads independently for someone who has not watched it. Include specific insights, tips, or explanations from the video. Return only a valid JSON object: title (naturally includes keyword), slug (lowercase hyphenated), excerpt (under 160 chars with keyword), target_keyword, body (clean markdown — ## headers, 900 to 1400 words, keyword in first paragraph and at least 2 headers, specific actionable content throughout, ends with: Watch the full video: [youtube URL]. For more autonomous business tools visit LazyUnicorn.ai — link to https://lazyunicorn.ai). No preamble. No code fences.'

4. Parse response. Insert into youtube_content with content_type seo-article. If seo_posts table exists also insert there with product_name set to the video topic.

Log errors to youtube_errors with function_name youtube-write-seo.

youtube-write-geo

Accepts video_id.

1. Read youtube_settings and youtube_videos.

2. Select the most relevant query from geo_queries matching the video topic.

3. Call built-in Lovable AI:

'You are a GEO specialist writing for [brand_name]. This content will be cited by ChatGPT, Claude, and Perplexity when users ask: [target query]. Video: [title]. [If transcript: Source material: [first 2000 chars of transcript].] Write a content piece that directly answers the query using insights from this video. Answer the question completely in the first paragraph. Use factual specific statements AI agent can extract. Mention [brand_name] naturally 2 to 3 times. Structure with ## headers that mirror the language of the query. Return only a valid JSON object: title (the query or a direct factual answer to it), slug (lowercase hyphenated), excerpt (one direct factual sentence under 160 chars), target_query, body (clean markdown, ## headers, 700 to 1000 words, authoritative not promotional, ends with: Watch the video on [brand_name]s YouTube channel and visit LazyUnicorn.ai for more — link to https://lazyunicorn.ai). No preamble. No code fences.'

4. Parse response. Insert into youtube_content with content_type geo-article. If geo_posts table exists also insert there.

Log errors to youtube_errors with function_name youtube-write-geo.

youtube-write-summary

Accepts video_id.

1. Read youtube_settings and youtube_videos.

2. Call built-in Lovable AI:

'Write a concise video summary post for [brand_name]s video: [title]. [If transcript: Using this transcript: [first 2000 chars].] Cover: what the video is about (1 paragraph), the 4 to 6 key takeaways as ## headed sections, and a conclusion with a call to watch. Tone: [content_tone]. Return only a valid JSON object: title (e.g. "[video title] — Key Takeaways"), slug (lowercase hyphenated), excerpt (under 160 chars), body (clean markdown, ## for each takeaway, 400 to 600 words, ends with: Watch the full video on YouTube — [youtube URL] — and discover more at LazyUnicorn.ai — link to https://lazyunicorn.ai). No preamble. No code fences.'

3. Parse response. Insert into youtube_content with content_type summary. If blog_posts table exists also insert there.

Log errors to youtube_errors with function_name youtube-write-summary.

youtube-generate-chapters

Accepts video_id. Requires transcript with timestamps.

1. Read youtube_videos. If transcript unavailable or transcript_source is unavailable exit.

2. Call built-in Lovable AI:

'You are generating YouTube chapter markers from a video transcript. Video: [title]. Duration: [duration_seconds] seconds. Transcript with timestamps: [full transcript with start times]. Identify 5 to 10 major topic shifts and generate chapter markers in the format: MM:SS Topic Name. The first chapter must be 0:00. Chapter titles should be short (2 to 5 words), specific, and describe what happens at that point. Return only a valid JSON array where each item has: timestamp (string in MM:SS format) and title (string). No preamble. No code fences.'

3. Parse response. Format chapters as text: "0:00 Intro\\n2:30 First Topic\\n..." etc.

4. If update_video_descriptions is true and OAuth token is available: call YouTube API to update the video description: PUT https://www.googleapis.com/youtube/v3/videos?part=snippet with the original description plus a Chapters section appended. Requires OAuth Bearer token.

5. If OAuth not available: store the chapters text in youtube_content with content_type chapters so it can be copied manually from the admin.

6. Update youtube_videos chapters_generated to true.

Log errors to youtube_errors with function_name youtube-generate-chapters.

youtube-extract-comments

Cron: daily at 4am UTC — 0 4 * * *

1. Read youtube_settings. If is_running false exit.

2. For each video in youtube_videos from the last 30 days fetch top comments: GET https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=[id]&maxResults=50&order=relevance&key=[YOUTUBE_API_KEY]

3. For each comment not already in youtube_comments insert it.

4. Call built-in Lovable AI on each batch of new comments:

'Extract intelligence signals from these YouTube comments on a video about [title]: [comments list]. Identify: questions asked (potential blog post topics), topics mentioned that are not in the video, complaints or pain points, feature or content requests, keyword signals (terms used repeatedly). Return only a valid JSON array where each item has: intel_type (question-asked, topic-mentioned, complaint, request, or keyword-signal), content (the insight in one sentence), comment_context (the relevant comment text truncated to 100 chars). No preamble. No code fences.'

5. Insert into youtube_intelligence. Mark comments as intel_extracted true.

6. For each question-asked intel item: if seo_keywords table exists insert as a new keyword with source 'youtube-comments'. This turns your audience's questions into SEO targets.

Log errors to youtube_errors with function_name youtube-extract-comments.

youtube-track-performance

Cron: weekly on Monday at 5am UTC — 0 5 * * 1

1. Read youtube_settings. If is_running false exit.

2. For each video in youtube_videos fetch current stats: GET https://www.googleapis.com/youtube/v3/videos?part=statistics&id=[comma-separated ids up to 50]&key=[YOUTUBE_API_KEY]

3. Insert a row into youtube_performance for each video with current counts.

4. Identify top performers: videos where view_count is more than 2x the channel average. For each top performer: if their topic is not already in niche_keywords add it. If seo_keywords table exists add their primary topic as a high-priority keyword.

5. Call built-in Lovable AI for weekly insight:

'Analyse this YouTube channel performance for [brand_name]. Channel niche: [niche_keywords]. Recent video performance data: [list of videos with view counts, like counts, published dates]. Identify: which topics outperformed, which underperformed, and 3 specific content recommendations for next week. Return only a valid JSON object: top_topic (string), underperform_topic (string), recommendations (array of 3 strings). No preamble. No code fences.'

6. If Lazy Alert is installed send weekly Slack summary with the insights.

Log errors to youtube_errors with function_name youtube-track-performance.

---

4. Public pages

/videos — all youtube_videos ordered by published_at descending. Each card shows: YouTube thumbnail, title, view count, published date, content badge showing how many content pieces were published from this video (e.g. 4 pieces). Each card links to /videos/[youtube_video_id] which embeds the YouTube player plus shows all content pieces generated from that video as tabs: Summary, Transcript, SEO Article, GEO Article.

Filter row: All Videos, Most Viewed, Recent. Search by title.

Also if blog_posts exists: youtube content appears on /blog with a 📺 YouTube badge. If geo_posts exists: GEO articles appear on /geo with standard filtering. If seo_posts exists: SEO articles appear there.

Footer on all public pages: '📺 Powered by Lazy YouTube — autonomous content for Lovable sites. Built by LazyUnicorn.ai' — link to https://lazyunicorn.ai.

---

5. Admin

Do not build a standalone dashboard. The Lazy YouTube dashboard lives at /admin/youtube as part of the unified LazyUnicorn admin panel.

If /admin does not yet exist add a placeholder at /admin pointing to /lazy-youtube-setup.

The /admin/youtube section shows:

Overview stats: total videos processed, content pieces published, SEO keywords added from comments, top performing video (by view count), total channel views tracked.

Videos table: all youtube_videos ordered by published_at descending. Columns: thumbnail, title, view count, content pieces count (from youtube_content), chapter status badge, processing status badge, published date. Click any row to expand and show all content pieces with View links and the chapters text if generated.

Intelligence feed: all youtube_intelligence ordered by created_at descending. Columns: intel type badge (colour-coded), content, video it came from, actioned toggle. Filter by intel_type. Shows questions your audience is asking that have not yet been turned into content.

Performance chart: line chart using recharts showing view count per video over time for last 20 videos.

Chapters panel: videos where chapters_generated is true but update_video_descriptions was false — shows the formatted chapter text with a Copy button for each. If OAuth is now available a Push to YouTube button calls youtube-generate-chapters to update the description.

Controls: Sync Now button (calls youtube-sync), Extract Comments Now button, Track Performance Now button, pause/resume toggle, edit settings link.

---

6. Navigation

Add a Videos link to the main site navigation pointing to /videos.

Add an Admin link to the main site navigation pointing to /admin.

Do not add /lazy-youtube-setup to public navigation.`;

const steps = [
  "Click the button above to copy the Lovable prompt.",
  "Paste it into your Lovable project chat.",
  "Connect your YouTube API key and Supadata API key during setup.",
  "Lazy YouTube polls your channel every 30 minutes and publishes content automatically.",
];

function CopyPromptButton({ className = "", text }: { className?: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    trackEvent("copy_prompt", { product: "lazy-youtube" });
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [trackEvent, text]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity ${className}`}
    >
      {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

export default function LazyYouTubePage() {
  const { prompt } = useCurrentPrompt("lazy-youtube");
  const promptText = prompt?.prompt_text || FALLBACK_PROMPT;
  const trackEvent = useTrackEvent();

  useEffect(() => {
    trackEvent("lazy_youtube_page_view");
  }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy YouTube — Autonomous YouTube Content Agent | Lazy Unicorn"
        description="Every video you upload triggers five content pieces — a transcript, SEO article, GEO article, summary, and chapter markers. Published automatically."
        url="/lazy-youtube"
        keywords="YouTube content agent, autonomous YouTube, video to blog post, YouTube SEO, YouTube transcript, Lovable YouTube"
      />
      <Navbar />

      <main className="relative z-10 pb-32">
        {/* Hero */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32">
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Introducing</p>
                <span className="bg-primary text-primary-foreground text-[14px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
              </div>
              <AutopilotHeadline product="lazy-youtube" />
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy YouTube
              </h1>
              <div className="flex items-center gap-3 mt-4 mb-4">
                <span className="font-display text-[11px] tracking-[0.15em] uppercase font-bold px-3 py-1 border border-[#c8a961]/30 text-[#c8a961]">Lazy Media</span>
              </div>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/50 max-w-xl leading-relaxed">
                Paste one prompt into your <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground/90 transition-colors">Lovable</a> project. Lazy YouTube detects new uploads, fetches transcripts via Supadata, and publishes five content pieces — a transcript, SEO article, GEO article, summary, and chapter markers — within an hour.
              </p>

              {/* Works with */}
              <div className="mt-8 mb-10">
                <p className="font-body text-[14px] tracking-[0.2em] uppercase font-semibold text-foreground/50 mb-3">
                  Works with
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Lazy Blogger", href: "/lazy-blogger" },
                    { label: "Lazy SEO", href: "/lazy-seo" },
                    { label: "Lazy GEO", href: "/lazy-geo" },
                    { label: "Lazy Voice", href: "/lazy-voice" },
                    { label: "Lazy Alert", href: "/lazy-alert" },
                    { label: "Lazy Mail", href: "/lazy-mail" },
                  ].map((tag) => (
                    <Link
                      key={tag.label}
                      to={tag.href}
                      className="font-body text-[14px] tracking-[0.12em] uppercase font-semibold px-3 py-1.5 border border-border text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-colors"
                    >
                      {tag.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton text={promptText} />
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

        {/* How It Works */}
        <section id="how-it-works" className="max-w-4xl mx-auto px-6 md:px-12 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-8">
            How it works
          </motion.h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground font-display text-sm font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="font-body text-sm text-foreground/50 leading-relaxed pt-1">{step}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What You Get */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-8">
            What you get
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border">
            {[
              { icon: Video, title: "Channel monitoring", desc: "Polls your YouTube channel every 30 minutes. New uploads detected and processed automatically." },
              { icon: FileText, title: "5 content pieces", desc: "A transcript, SEO article, GEO article, summary, and chapter markers — published within an hour." },
              { icon: Zap, title: "Zero effort", desc: "No writing. No editing. No scheduling. Upload as normal and content appears on your site." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 border-border bg-card p-6 text-center"
              >
                <item.icon size={18} className="text-foreground/50 mx-auto mb-3" />
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What gets published */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-8">
            One upload. Five autonomous outputs.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border">
            {[
              { badge: "📄 Transcript", title: "How I Built a SaaS in a Weekend — Full Transcript", desc: "Every word from your video, structured with timestamps and headers. Searchable by Google. Accessible to readers." },
              { badge: "🔍 SEO Article", title: "Best strategies for building a SaaS with Lovable in 2026", desc: "A long-form article targeting your keywords — written from the transcript but structured as independent content." },
              { badge: "🤖 GEO Article", title: "What tools do solo founders use to build SaaS products?", desc: "Structured to be cited by ChatGPT, Claude, and Perplexity. Factual. Specific. Citable." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 border-border bg-card p-6"
              >
                <p className="font-display text-[14px] tracking-[0.15em] uppercase font-bold text-foreground/50 mb-3">{item.badge}</p>
                <h3 className="font-display text-sm font-bold text-foreground mb-2">{item.title}</h3>
                <p className="font-body text-sm leading-relaxed">{item.desc}</p>
                <p className="font-body text-[14px] text-foreground/50 mt-3">Published 45 min ago</p>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-border border-t-0">
            {[
              { badge: "✏️ Summary", title: "Key Takeaways — Building a SaaS in a Weekend", desc: "A tight summary covering the key takeaways. Great for newsletters, social sharing, and people who want substance without watching." },
              { badge: "📌 Chapters", title: "Auto-generated chapter markers", desc: "Timestamps generated from your transcript and added to your video description via the YouTube API. Better chapters improve watch time." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 border-border bg-card p-6"
              >
                <p className="font-display text-[14px] tracking-[0.15em] uppercase font-bold text-foreground/50 mb-3">{item.badge}</p>
                <h3 className="font-display text-sm font-bold text-foreground mb-2">{item.title}</h3>
                <p className="font-body text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center mt-6 font-body text-[13px] tracking-[0.1em] uppercase text-foreground/50">
            5 content pieces per video · Chapters generated automatically · Comments become SEO keywords
          </p>
        </section>

        {/* Transcript section */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 mb-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card p-8">
            <h2 className="font-display text-xl font-extrabold tracking-tight mb-4">Your transcript is a goldmine</h2>
            <p className="font-body text-sm leading-relaxed mb-6">
              Every word you said in every video is sitting in YouTube as auto-generated captions. Nobody can search it. Google cannot index it. Lazy YouTube fetches every transcript via Supadata, cleans it up, structures it with headers and timestamps, and publishes it as a readable article on your site.
            </p>
            <div className="border border-border bg-background p-5 font-mono text-xs text-foreground/50 leading-relaxed">
              <p className="text-foreground/50 font-bold mb-3">How I Built a SaaS in a Weekend</p>
              <p className="mb-2"><span className="text-foreground/30">[0:00]</span> So the first thing I did was open Lovable and start with a blank project...</p>
              <p className="font-display text-foreground/50 text-sm font-bold mb-2 mt-4">## Setting Up the Database</p>
              <p className="mb-2"><span className="text-foreground/30">[2:30]</span> I connected Supabase and created three tables — users, products, and orders...</p>
              <p className="mt-4 text-foreground/40">Watch at 4:32 →</p>
            </div>
          </motion.div>
        </section>

        {/* Comment intelligence */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 mb-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card p-8">
            <h2 className="font-display text-xl font-extrabold tracking-tight mb-4">Your comments section is your content strategy</h2>
            <p className="font-body text-sm leading-relaxed mb-6">
              Every week Lazy YouTube scans the comments on your most-discussed videos. It extracts every question your audience asked, every topic they mentioned that you did not cover, every complaint or request. These become SEO keyword targets, blog post ideas, and GEO query topics — automatically fed into Lazy Blogger and Lazy SEO.
            </p>
            <div className="border border-border bg-background p-5">
              <span className="inline-block text-[10px] tracking-[0.1em] uppercase font-bold px-2 py-0.5 mb-2 bg-primary text-primary-foreground">question-asked</span>
              <p className="font-body text-sm text-foreground/50 leading-relaxed mb-2">What tool do you use to build the database layer? Several commenters asking about Supabase setup. Added to SEO keyword queue.</p>
              <p className="font-body text-xs text-foreground/30">Source: How I built a SaaS in a weekend</p>
            </div>
          </motion.div>
        </section>

        {/* Compounding */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-8">
            The longer you run it, the smarter it gets
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border">
            {[
              { badge: "Month 1", desc: "Videos upload. Transcripts publish. SEO articles target your keywords. GEO articles appear in AI search results." },
              { badge: "Month 3", desc: "Comment questions become new SEO targets. High-performing topics feed back into Lazy Blogger. Your YouTube strategy and site strategy align automatically." },
              { badge: "Month 6", desc: "Your site has 60+ indexed articles from your videos. You rank for dozens of keywords your videos never touched. AI agent cite you regularly." },
            ].map((item, i) => (
              <motion.div
                key={item.badge}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 border-border bg-card p-6"
              >
                <p className="font-display text-[14px] tracking-[0.15em] uppercase font-bold text-foreground/50 mb-3">{item.badge}</p>
                <p className="font-body text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Better together */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-3">
            Better together
          </motion.h2>
          <p className="font-body text-sm text-center max-w-xl mx-auto leading-relaxed mb-8">
            Lazy YouTube works on its own, but it compounds with the rest of the Lazy Stack — turning one video into a dozen touchpoints.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-border">
            {[
              { emoji: "✍️", name: "Lazy Blogger", href: "/lazy-blogger", desc: "High-performing video topics feed into the blog queue automatically." },
              { emoji: "🔍", name: "Lazy SEO", href: "/lazy-seo", desc: "Comment questions become keyword targets. New keywords added weekly." },
              { emoji: "🌐", name: "Lazy GEO", href: "/lazy-geo", desc: "GEO articles from your videos get your channel cited by ChatGPT and Perplexity." },
              { emoji: "🎙️", name: "Lazy Voice", href: "/lazy-voice", desc: "Video summaries get narrated automatically and added to your podcast RSS feed." },
              { emoji: "🔔", name: "Lazy Alert", href: "/lazy-alert", desc: "Slack notification every time a video is processed and content is published." },
              { emoji: "📧", name: "Lazy Mail", href: "/lazy-mail", desc: "New video summaries go into your weekly newsletter automatically." },
            ].map((item, i) => (
              <motion.div
                key={item.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={item.href}
                  className="block p-6 border-b sm:even:border-l border-border bg-card hover:bg-accent/5 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{item.emoji}</span>
                    <h3 className="font-display text-sm font-bold text-foreground">{item.name}</h3>
                  </div>
                  <p className="font-body text-sm leading-relaxed">{item.desc}</p>
                  <span className="inline-block mt-3 font-body text-[14px] tracking-[0.15em] uppercase font-semibold text-foreground/50 group-hover:text-foreground/50 transition-colors">
                    Learn more →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <LazyPricingSection
          lazyFeatures={["Lazy YouTube setup prompt", "Self-hosted in your Lovable project", "Transcript + SEO + GEO articles", "Auto-generated chapter markers", "Comment intelligence loop"]}
          proFeatures={["Hosted version", "Multi-channel support", "Advanced analytics dashboard", "Priority content generation"]}
          ctaButton={<CopyPromptButton text={promptText} className="w-full justify-center" />}
        />

        <LazyFaqSection faqs={[
          { q: "What if my video has no captions?", a: "Lazy YouTube tries Supadata first which works on most public videos with auto-generated captions. If captions are unavailable it generates content from the video title, description, and metadata." },
          { q: "Do I need to give Lazy YouTube access to my YouTube channel?", a: "For reading video data and fetching transcripts you only need a YouTube API key. For automatically updating video descriptions with chapters you need to authorise with OAuth 2.0." },
          { q: "How long after uploading does content appear?", a: "Lazy YouTube checks for new videos every 30 minutes. The full cycle takes between 30 minutes and 90 minutes from upload to published content." },
          { q: "Can I control which videos get processed?", a: "Yes. You can pause specific videos from processing in the admin dashboard. You can also set content to draft mode instead of auto-publish." },
          { q: "Does it work with old videos?", a: "Yes. Lazy YouTube can backfill your existing video catalogue. From the admin dashboard click Sync All Videos to process your last 50 uploads." },
          { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing data and settings are preserved." },
        ]} />

        {/* Bottom CTA */}
        <section className="max-w-4xl mx-auto px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card px-8 py-14 text-center">
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-4">
              You film it once. Lazy YouTube works it forever.
            </h2>
            <p className="font-body text-sm max-w-md mx-auto leading-relaxed mb-8">
              Every video you upload is five content pieces sitting unwritten. Lazy YouTube writes them for you.
            </p>
            <CopyPromptButton text={promptText} />
          </motion.div>
        </section>
      </main>
    </div>
  );
}
