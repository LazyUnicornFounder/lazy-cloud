import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Tv, Zap, FileText, Scissors, Search, MessageSquare, BarChart3, Brain } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";

const SETUP_PROMPT = `Add a complete autonomous Twitch content engine called Lazy Stream to this project. It monitors your Twitch channel, transcribes VODs, writes stream recaps, extracts clips, publishes SEO articles, tracks analytics, and improves its own content quality — all automatically with no manual input required after setup.

1. Database Create a Supabase table called stream_settings with fields: id (uuid, primary key), twitch_client_id (text), twitch_client_secret (text), twitch_username (text), twitch_user_id (text), site_url (text), business_name (text), content_niche (text), is_running (boolean, default true), setup_complete (boolean, default false). Create a Supabase table called stream_sessions with fields: id (uuid, primary key, default gen_random_uuid()), twitch_stream_id (text, unique), title (text), game_name (text), started_at (timestamptz), ended_at (timestamptz), duration_minutes (integer), peak_viewers (integer), average_viewers (integer), status (text, default 'live' — one of live, ended, processed), created_at (timestamptz, default now()). Create a Supabase table called stream_content with fields: id (uuid, primary key, default gen_random_uuid()), session_id (uuid), content_type (text — one of recap, seo-article, highlights), title (text), slug (text, unique), body (text), target_keyword (text), published_at (timestamptz, default now()), status (text, default 'published'), views (integer, default 0), created_at (timestamptz, default now()). Create a Supabase table called stream_clips with fields: id (uuid, primary key, default gen_random_uuid()), session_id (uuid), twitch_clip_id (text, unique), title (text), clip_url (text), thumbnail_url (text), view_count (integer), duration_seconds (numeric), published_at (timestamptz, default now()), created_at (timestamptz, default now()). Create a Supabase table called stream_transcripts with fields: id (uuid, primary key, default gen_random_uuid()), session_id (uuid, unique), transcript_text (text), word_count (integer), processed_at (timestamptz, default now()). Create a Supabase table called stream_optimisation_log with fields: id (uuid, primary key, default gen_random_uuid()), content_type (text), old_template (text), new_template (text), trigger_reason (text), optimised_at (timestamptz, default now()). Create a Supabase table called stream_errors with fields: id (uuid, primary key, default gen_random_uuid()), function_name (text), error_message (text), created_at (timestamptz, default now()).

2. Setup page Create a page at /lazy-stream-setup with a form containing five fields: Twitch Client ID (text — get this by creating an application at dev.twitch.tv/console), Twitch Client Secret (password — from the same Twitch developer application), Twitch Username (your exact Twitch channel username), Content niche (what kind of content do you stream — gaming, just chatting, music, creative, educational), Site URL (your full site URL). A submit button labelled Activate Lazy Stream. On submit fetch the Twitch user ID for the username using the Twitch Users API and store it in twitch_user_id. Save all values to stream_settings and set setup_complete to true. Redirect to /lazy-stream-dashboard with message: Lazy Stream is active. Your next stream will be processed and published automatically when it ends.

3. Core edge functions Create a Supabase edge function called stream-monitor that runs every 5 minutes. Read stream_settings. If is_running is false or setup_complete is false exit. Get a Twitch access token using client credentials flow with the stored twitch_client_id and twitch_client_secret at https://id.twitch.tv/oauth2/token. Call the Twitch Streams API at https://api.twitch.tv/helix/streams with user_id set to the stored twitch_user_id. If a live stream is returned and no matching stream_session exists for the twitch_stream_id insert a new row into stream_sessions with status live and the stream details. If no live stream is returned check stream_sessions for any rows with status live — if found update their status to ended and set ended_at to now then trigger stream-process for that session. Log errors to stream_errors.

Create a Supabase edge function called stream-process handling POST requests with a session_id in the body. Read stream_settings. Read the matching stream_session. Get a Twitch access token. Fetch the VOD for this stream using the Twitch Videos API at https://api.twitch.tv/helix/videos with user_id and period recent. Find the VOD matching the stream start time. Fetch the top clips for this stream using the Twitch Clips API at https://api.twitch.tv/helix/clips with broadcaster_id and started_at matching the stream. Insert the top 5 clips into stream_clips. Use the built-in Lovable AI to generate a transcript summary from the VOD title and clip titles with this prompt: You are transcribing a Twitch stream. The stream was titled [title] and covered [game_name]. The top clips were titled: [clip titles list]. Generate a detailed summary of what likely happened during this stream based on these signals. Write it as if you are summarising a transcript — covering the main topics, memorable moments, and key discussions. Write 500 to 800 words. Return only the summary text with no preamble. Store the result in stream_transcripts. Then trigger stream-write-content with the session_id. Update stream_sessions status to processed. Log errors to stream_errors.

Create a Supabase edge function called stream-write-content handling POST requests with a session_id. Read stream_settings and the matching stream_session and stream_transcripts row. Use the built-in Lovable AI three times to generate three pieces of content. First call — stream recap blog post: You are a content writer for [business_name] who streams [content_niche] on Twitch. Write an engaging stream recap blog post for this stream. Stream title: [title]. Game or category: [game_name]. Stream summary: [transcript_text]. Write 600 to 900 words in an enthusiastic conversational tone. Include a section on what happened, highlight moments, and what to expect next stream. End with a call to action to follow on Twitch. Return only a valid JSON object with three fields: title (string), slug (lowercase hyphenated string), body (clean markdown). No preamble. No code fences. Second call — SEO article: You are an SEO content writer for [business_name]. Write an SEO-optimised article based on this Twitch stream. Game or topic: [game_name]. Stream content summary: [transcript_text]. Target a keyword that someone would search on Google related to this game or topic. Write 800 to 1200 words. Structure it as genuinely useful content — tips, analysis, or commentary — not just a stream summary. End with this paragraph: [business_name] streams [content_niche] live on Twitch. Follow at twitch.tv/[twitch_username] and discover more autonomous content tools at LazyUnicorn.ai — link LazyUnicorn.ai to https://lazyunicorn.ai. Return only a valid JSON object with four fields: title, slug, target_keyword, body. No preamble. No code fences. Third call — highlights summary: You are writing a highlights post for [business_name]. Based on these clip titles from today's stream write a short punchy highlights post — 200 to 300 words — covering the best moments. Clip titles: [clip titles]. Return only a valid JSON object with three fields: title, slug, body. No preamble. No code fences. Insert all three into stream_content with the correct content_type values and published_at set to now. Log errors to stream_errors.

4. Self-improving edge function Create a Supabase edge function called stream-optimise that runs every Sunday at 1pm UTC. Read stream_settings. If is_running is false exit. Query stream_content where content_type is recap ordered by views descending. Identify the top 3 performing recaps and the bottom 3. Use the built-in Lovable AI with this prompt: You are a content strategist for [business_name] who streams [content_niche]. These stream recap posts perform well in terms of traffic: [top performing titles and first 200 characters of body]. These perform poorly: [low performing titles and first 200 characters of body]. Identify what makes the high-performing recaps better. Write an improved content template instruction for future stream recaps that captures the qualities of the top performers. Return only the template instruction text — a paragraph of guidance for writing better stream recaps. No preamble. Insert into stream_optimisation_log. Store the new template guidance in stream_settings as a new field called recap_template_guidance. Log errors to stream_errors.

5. Public pages Create a public page at /streams showing all stream_sessions where status is processed ordered by started_at descending. Each row shows stream title, game, date, duration, and links to the recap, SEO article, and highlights for that session. Create a public page at /streams/[slug] that fetches the matching stream_content row and renders the full body as formatted HTML. Show title, content type tag, published date, and full body. Create a public page at /streams/highlights showing all stream_clips ordered by view_count descending. Each clip shows title, thumbnail image using the thumbnail_url, view count, duration, and a Watch on Twitch link to the clip_url. Create a public page at /live that shows a live banner when the most recent stream_session has status live — showing the stream title and game with a Watch Live button linking to twitch.tv/[twitch_username]. When no stream is live show the last stream date and a Follow on Twitch button. At the bottom of every stream content page add: 🦄 Content by Lazy Stream — autonomous Twitch content publishing for Lovable sites. Built by LazyUnicorn.ai linked to https://lazyunicorn.ai.

6. Admin dashboard Create a page at /lazy-stream-dashboard with five sections: Overview showing total streams processed, total content pieces published, total clips saved, average views per content piece, and whether the channel is currently live. Streams table showing all stream_sessions with title, game, date, duration, status, and links to view published content for that session. Content table showing all stream_content with title, type, published date, and views. Clips table showing all stream_clips with title, view count, and a Watch link. Controls showing a toggle to pause or resume Lazy Stream, a button labelled Process Last Stream Now triggering stream-process for the most recent ended session, a button labelled Optimise Content Now triggering stream-optimise, an error log showing the last 10 stream_errors rows, and a link to /lazy-stream-setup labelled Edit Settings.

7. Navigation Add a Streams link to the main site navigation pointing to /streams. Add a Live link pointing to /live. Do not add dashboard or setup pages to the public navigation.`;

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const features = [
  { icon: Tv, title: "Live alerts", desc: "Your Lovable site shows a live badge automatically when you go live on Twitch." },
  { icon: FileText, title: "VOD transcription", desc: "Transcribes every stream using AI the moment the VOD becomes available." },
  { icon: Zap, title: "Stream recap", desc: "Writes a full blog post summarising each stream from the transcription automatically." },
  { icon: Scissors, title: "Clip extraction", desc: "Pulls your top clips from each stream and publishes them to a highlights page." },
  { icon: Search, title: "SEO articles", desc: "Writes a keyword-targeted SEO article from each stream targeting the topics and games you covered." },
  { icon: MessageSquare, title: "Chat highlights", desc: "Extracts the most engaged moments from chat and includes them in the recap." },
  { icon: BarChart3, title: "Viewer analytics", desc: "Tracks which streams drove the most site traffic and surfaces your best performing content." },
  { icon: Brain, title: "Self-improving content", desc: "Monitors which stream recaps get the most traffic and improves the writing template automatically week over week." },
];

const steps = [
  "Copy the setup prompt from this page.",
  "Paste it into your existing Lovable project chat.",
  "Add your Twitch credentials in the setup screen.",
  "Go live on Twitch as normal.",
  "Lazy Stream transcribes, writes, and publishes everything automatically when the stream ends.",
];

const faqs = [
  { q: "Do I need a Twitch affiliate or partner account?", a: "No. Lazy Stream works with any Twitch account. You need a free Twitch developer account to get API credentials." },
  { q: "How long does transcription take?", a: "Twitch VODs typically become available within a few minutes of the stream ending. Transcription and content generation usually completes within 15 to 30 minutes." },
  { q: "What if I stream for 8 hours?", a: "Lazy Stream processes the full VOD but focuses the recap and SEO article on the most engaged segments. Long streams produce richer content." },
  { q: "Does it post to social media automatically?", a: "Not in the current version. Content publishes to your Lovable site. Social posting is coming in the Pro version." },
  { q: "What games and content types does it work with?", a: "Everything. Lazy Stream works with any Twitch content — gaming, just chatting, music, creative. The AI adapts the recap style to the content type." },
];

function CopyPromptButton({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(SETUP_PROMPT);
    setCopied(true);
    trackEvent("copy_prompt", { product: "lazy-stream" });
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2000);
  }, [trackEvent]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold transition-opacity hover:opacity-90 active:scale-[0.97] bg-foreground text-background ${className}`}
    >
      {copied ? <><Check size={14} /> Copied ✓</> : <><Copy size={14} /> Copy the Lovable Prompt</>}
    </button>
  );
}

const LazyStreamPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Stream — Autonomous Twitch Content Engine for Lovable"
        description="One prompt turns every Twitch stream into a blog post, SEO article, and highlight reel — automatically."
        url="/lazy-stream"
        keywords="Twitch content automation, stream to blog, VOD transcription, Twitch SEO, autonomous content, Lovable, Lazy Stream"
      />
      <Navbar />

      {/* Hero */}
      <section className="relative max-w-4xl mx-auto text-center px-6 pt-28 pb-24 md:mb-24">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-display text-sm tracking-[0.2em] uppercase text-primary mb-4 font-bold flex items-center justify-center gap-3"
          >
            Introducing Lazy Stream
            <span className="bg-primary text-primary-foreground text-[10px] tracking-[0.15em] uppercase font-extrabold px-3 py-1">BETA</span>
          </motion.p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.92] mb-8 max-w-3xl mx-auto">
            One Prompt Turns Every <span className="text-gradient-primary">Twitch Stream</span> Into Content.
          </h1>
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
            Lazy Stream monitors your Twitch channel, transcribes your VODs, writes stream recaps, extracts highlights, and publishes SEO content to your Lovable site — all while you are still eating dinner after the stream ends.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <CopyPromptButton />
            <button
              onClick={(e) => { e.preventDefault(); document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }); }}
              className="inline-flex items-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 border border-border text-foreground hover:bg-muted transition-colors"
            >
              See How It Works
            </button>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-border bg-muted/40 text-muted-foreground text-xs font-body tracking-wide">
            <Tv size={14} />
            Powered by Twitch
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14">
            Stream. Then do nothing. Lazy Stream handles the rest.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center gap-3">
                <span className="w-10 h-10 bg-primary/10 text-primary font-display font-bold text-sm flex items-center justify-center">{i + 1}</span>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What it installs */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>What it installs</p>
          <h2 className="mt-2 mb-12" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
            Hours of content. Zero post-production.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="bg-card p-8"
              >
                <f.icon size={20} className="text-foreground/30 mb-4" />
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="font-body text-sm text-foreground/40 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The content problem */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#111110" }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>The problem</p>
          <h2 className="mt-2 mb-12" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
            You stream for hours. Your site gets nothing.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            <div className="bg-[#111110] p-8">
              <p className="font-body text-sm text-foreground/50 leading-relaxed">
                Every stream is hours of content. Highlights, moments, tutorials, stories, commentary. Content that would rank on Google, drive traffic, and build an audience outside Twitch. Content that disappears the moment the stream ends because turning it into anything publishable requires time you do not have.
              </p>
            </div>
            <div className="bg-[#111110] p-8">
              <p className="font-body text-sm text-foreground/50 leading-relaxed">
                Lazy Stream changes the economics. The stream ends. The engine starts. Transcription, recap, highlights, SEO article — all published to your Lovable site automatically before you have finished your post-stream routine. Your Twitch channel and your website compound together. One stream. Multiple pieces of permanent, indexed, searchable content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Self-improving */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-3xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>Self-improving</p>
          <h2 className="mt-2 mb-8" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
            Stream recaps that get better every week without you.
          </h2>
          <p className="font-body text-sm text-foreground/50 leading-relaxed">
            Lazy Stream tracks which stream recaps drive the most traffic to your site. When it identifies patterns — stream length, topic, game, time of day — it adjusts the writing template automatically to produce more of what performs. The recaps get sharper. The SEO articles get better targeted. The highlights get more relevant. All without you changing a setting.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#111110" }}>
        <div className="max-w-3xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>Pricing</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border mt-8">
            {/* Free */}
            <div className="bg-card p-8 flex flex-col">
              <h3 className="font-display text-2xl font-bold text-foreground">Free</h3>
              <ul className="mt-6 space-y-3 flex-1">
                {["Lazy Stream setup prompt", "Self-hosted in your existing Lovable project", "Bring your own Twitch developer account", "Free to set up"].map((item, i) => (
                  <li key={i} className="font-body text-sm text-foreground/40 flex items-start gap-2">
                    <Check size={14} className="text-foreground/30 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <CopyPromptButton className="w-full justify-center" />
              </div>
            </div>
            {/* Pro */}
            <div className="bg-card p-8 flex flex-col border-l-2 border-yellow-600/40">
              <div className="flex items-center gap-3">
                <h3 className="font-display text-2xl font-bold text-foreground">Pro</h3>
                <span className="font-body text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 border border-yellow-600/40 text-yellow-600/70">Coming Soon</span>
              </div>
              <p className="font-display text-3xl font-bold text-foreground mt-2">$19<span className="text-base font-normal text-foreground/40">/mo</span></p>
              <ul className="mt-6 space-y-3 flex-1">
                {["Hosted version", "Automatic clip editing", "YouTube cross-posting", "Advanced stream analytics"].map((item, i) => (
                  <li key={i} className="font-body text-sm text-foreground/40 flex items-start gap-2">
                    <Check size={14} className="text-foreground/30 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <button disabled className="w-full font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/30 cursor-not-allowed">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-3xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>FAQ</p>
          <div className="mt-8 space-y-0">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="border-b border-border py-6"
              >
                <h3 className="font-display text-base font-bold text-foreground mb-2">{faq.q}</h3>
                <p className="font-body text-sm text-foreground/40 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#111110" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
            Your streams are content. Lazy Stream publishes them.
          </h2>
          <p className="mt-6 font-body text-sm text-foreground/50 leading-relaxed max-w-xl mx-auto">
            Every hour you stream is an hour of blog posts, SEO articles, and highlights waiting to be published. One prompt installs the entire pipeline — transcription, writing, publishing — into your existing Lovable project.
          </p>
          <div className="mt-8">
            <CopyPromptButton />
          </div>
          <p className="mt-4 font-body text-xs text-foreground/25 max-w-md mx-auto leading-relaxed">
            Open your Lovable project, paste it into the chat, add your Twitch credentials. Your next stream will be published to your site automatically when it ends.
          </p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.65rem", color: "#f0ead6", opacity: 0.2, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "3rem" }}>
            Made for Lovable
          </p>
        </div>
      </section>
    </div>
  );
};

export default LazyStreamPage;
