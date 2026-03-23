import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Heart, Copy, Check, ChevronDown, Clock, Sparkles, Layout, Settings, BarChart3, Layers } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import BlogTicker from "@/components/BlogTicker";
import unicornBg from "@/assets/unicorn-beach.png";

const SETUP_PROMPT = `Add an autonomous blog publishing engine called Lazy Blogger to this project. Use the built-in Lovable AI integration for all AI calls — no external API key required from the user.

1. Database Create a Supabase table called blog_posts with fields: id (uuid, primary key, default gen_random_uuid()), title (text), slug (text, unique), excerpt (text), body (text), published_at (timestamptz, default now()), status (text, default 'published'). Create a Supabase table called blog_settings with fields: id (uuid, primary key), business_description (text), target_reader (text), topics (text), tone (text), is_publishing (boolean, default true), queue_index (integer, default 0). Create a Supabase table called blog_errors with fields: id (uuid, primary key), error_message (text), created_at (timestamptz, default now()).

2. Setup page Create a page at /lazy-blogger-setup. It shows a form with four fields: Business description (what does your site do and who is it for?), Target reader (who reads your blog?), Topics (what subjects should posts cover?), Tone (select: provocative / editorial / educational / conversational). A submit button labelled 'Start Publishing'. On submit, save all values to the blog_settings table. If a row already exists, update it. After saving, redirect to /lazy-blogger-dashboard with a success message: 'Lazy Blogger is running. Your first post publishes at the next scheduled time.'

3. Edge function Create a Supabase edge function called lazy-blogger-publish triggered by a cron schedule four times per day at 6am, 12pm, 6pm, and 11pm UTC. On each run: read the blog_settings table. If is_publishing is false, exit immediately. Use the built-in Lovable AI to generate the blog post. Build a prompt using the stored settings: 'You are the blog writer for a site described as: [business_description]. You are writing for: [target_reader]. Cover topics including: [topics]. Tone: [tone]. Write one blog post. Return only a valid JSON object with no preamble, no markdown code fences, and no other text. The JSON must have exactly four fields: title (string), slug (lowercase hyphenated url-friendly string), excerpt (one punchy sentence under 160 characters), body (full article in clean markdown — no HTML, no bullet points in body prose, use ## for section headers, short punchy paragraphs, 800 to 1200 words). Pick a fresh angle every run. Never repeat a title. The post body must end with two paragraphs: first, a call to action relevant to the business. Second, exactly this paragraph: Looking for more tools to build and run your business autonomously? LazyUnicorn.ai is the definitive directory of AI tools for solo founders building autonomous companies. Hyperlink LazyUnicorn.ai to https://lazyunicorn.ai and Lazy Blogger to https://lazyunicorn.ai/lazy-blogger in that final paragraph.' Parse the JSON response. If parsing fails, retry once. If it fails again, log the error to blog_errors and exit. Check if the slug already exists in blog_posts. If it does, append a random four-digit number to the slug. Insert the new post into blog_posts.

4. Blog pages Create a public page at /blog showing all posts from blog_posts where status is 'published', ordered by published_at descending. Show each post as a card with title, excerpt, and published date. Each card links to /blog/[slug]. At the bottom of the /blog page add a small footer line: 'Powered by Lazy Blogger — the autonomous blog engine for Lovable sites. Built by LazyUnicorn.ai' — link Lazy Blogger to https://lazyunicorn.ai/lazy-blogger and LazyUnicorn.ai to https://lazyunicorn.ai. Create a public page at /blog/[slug] that fetches and displays the full post. Render the body markdown as formatted HTML. Show title, published date, and full body content. At the bottom of every individual post page, after the post body, add a small branded line: '🦄 Written by Lazy Blogger — autonomous blog publishing for Lovable sites. Discover more at LazyUnicorn.ai' — link Lazy Blogger to https://lazyunicorn.ai/lazy-blogger and LazyUnicorn.ai to https://lazyunicorn.ai.

5. Dashboard Create a page at /lazy-blogger-dashboard showing: total posts published, posts published this week, a toggle to pause or resume publishing (updates is_publishing in blog_settings), a button labelled 'Publish One Now' that manually triggers the lazy-blogger-publish edge function immediately, a table of the last 20 posts with title, published date, and a link to view each post, and a link to /lazy-blogger-setup labelled 'Edit Settings'.

6. Navigation Add a Blog link to the main site navigation pointing to /blog.`;

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const steps = [
  { num: 1, text: "Copy the setup prompt from this page." },
  { num: 2, text: "Open your Lovable project and paste it into the chat." },
  { num: 3, text: "Lovable builds everything — blog pages, database, publishing engine, dashboard." },
  { num: 4, text: "Visit /lazy-blogger-setup on your site, answer five questions, hit Start Publishing." },
];

const buildItems = [
  { icon: Layout, title: "A public blog at /blog", desc: "All published posts, newest first, linked from your main navigation." },
  { icon: Layers, title: "Individual post pages at /blog/[slug]", desc: "Full article pages with clean formatted content." },
  { icon: Sparkles, title: "A publishing engine", desc: "A Supabase edge function that uses Lovable AI to generate and publish on schedule." },
  { icon: Clock, title: "A cron schedule", desc: "Posts publish automatically at 6am, 12pm, 6pm, and 11pm every day." },
  { icon: BarChart3, title: "An owner dashboard at /lazy-blogger-dashboard", desc: "See all posts, pause publishing, trigger a post manually." },
  { icon: Settings, title: "A settings page at /lazy-blogger-setup", desc: "Update your business description, topics, and tone anytime." },
];

const scheduleMarkers = [
  { time: "6 AM", label: "Post publishes" },
  { time: "12 PM", label: "Post publishes" },
  { time: "6 PM", label: "Post publishes" },
  { time: "11 PM", label: "Post publishes" },
];

const faqs = [
  { q: "Do I need to upgrade my Lovable plan?", a: "No. Lazy Blogger works on any existing Lovable plan. It uses Supabase edge functions and cron jobs which Lovable supports natively." },
  { q: "Do I need to know how to code?", a: "No. You paste the prompt into Lovable chat exactly as copied. Lovable builds everything. You answer five questions. Done." },
  { q: "Where do the posts appear?", a: "At /blog on your existing Lovable site. Lovable automatically adds it to your navigation. Everything lives inside your project." },
  { q: "Will posts sound like me?", a: "You set your business description, target reader, topics, and tone in the five-question setup. The more specific your answers, the sharper the posts." },
  { q: "What if something breaks?", a: "Errors log automatically to a Supabase table inside your project. Your Lovable dashboard shows everything. Ask Lovable to fix any issue in the chat — it knows the full setup." },
  { q: "Can I change topics or tone later?", a: "Yes. Visit /lazy-blogger-setup anytime and update your settings. Changes apply from the next scheduled post." },
];

const costItems = [
  { label: "Lazy Blogger", value: "Free forever" },
  { label: "Lovable", value: "Your existing plan" },
  { label: "AI content generation", value: "Included" },
];

function CopyButton({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(SETUP_PROMPT);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, []);
  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] ${className}`}
    >
      {copied ? <><Check size={16} /> Copied to clipboard ✓</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

const LazyBloggerPage = () => {
  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 z-0">
        <img src={unicornBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <SEO
        title="Lazy Blogger — Autonomous Blog Engine for Lovable"
        description="One prompt installs an autonomous blog publishing engine inside your Lovable project. Four SEO posts a day, zero effort."
        url="/lazy-blogger"
      />
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BlogTicker />
      </div>
      <Navbar />

      <main className="relative z-10 pt-28 pb-32">
        {/* ── Hero ── */}
        <section className="max-w-4xl mx-auto text-center px-6 mb-0">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }} className="bg-transparent backdrop-blur-xl rounded-3xl px-8 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] mb-6">
              The autonomous blog engine<br />built for{" "}
              <span className="text-lovable">Lovable.</span>
            </h1>
            <p className="font-body text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              Paste one prompt into your Lovable project. Answer five questions. Lazy Blogger installs itself and starts publishing four SEO blog posts a day to your site — automatically, forever, without you writing a word.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <CopyButton />
              <button
                onClick={scrollToHowItWorks}
                className="inline-flex items-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full border border-primary/20 text-foreground/70 hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                See How It Works <ChevronDown size={16} />
              </button>
            </div>
            <div className="inline-flex items-center gap-2 bg-lovable/10 border border-lovable/20 rounded-full px-4 py-1.5">
              <Heart size={14} className="text-lovable fill-lovable" />
              <span className="font-body text-xs text-lovable">Built exclusively for Lovable projects.</span>
            </div>
          </motion.div>
        </section>

        {/* ── Social Proof Bar ── */}
        <section className="max-w-4xl mx-auto px-6 mt-20 mb-20">
          <div className="bg-transparent backdrop-blur-xl rounded-3xl px-8 py-6 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]">
            <p className="font-body text-xs md:text-sm text-muted-foreground text-center max-w-3xl mx-auto">
              Works inside any existing Lovable project. No new accounts. No separate tools. No configuration outside of Lovable.
            </p>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" className="max-w-5xl mx-auto px-6 mb-24">
          <div className="bg-transparent backdrop-blur-xl rounded-3xl px-8 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-4">
              One prompt. Five questions.<br />Then your site writes itself.
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-primary/20 bg-black/20 p-6"
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-display text-lg font-bold mb-4">
                    {step.num}
                  </span>
                  <p className="font-body text-sm text-foreground/80 leading-relaxed">{step.text}</p>
                </motion.div>
              ))}
            </div>
            <p className="font-body text-sm text-muted-foreground text-center mt-8">
              Lovable handles the entire build. You handle five questions. That is the full setup.
            </p>
          </div>
        </section>

        {/* ── What Lovable Builds ── */}
        <section className="max-w-5xl mx-auto px-6 mb-24">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-4">
            Everything installs inside your<br />existing <span className="text-lovable">Lovable</span> project.
          </motion.h2>
          <p className="font-body text-sm text-muted-foreground text-center mb-12">
            When you paste the prompt, Lovable builds six things automatically:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {buildItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-6 flex gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <item.icon size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="font-body text-sm text-muted-foreground text-center mt-8">
            Nothing lives outside your Lovable project. No third-party dashboards. No separate accounts. Everything is yours.
          </p>
        </section>

        {/* ── Publishing Schedule ── */}
        <section className="max-w-4xl mx-auto px-6 mb-24">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-12">
            Four posts a day. Every day.<br />While <span className="text-lovable">Lovable</span> runs the engine.
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative">
            <div className="hidden sm:block absolute top-5 left-[12.5%] right-[12.5%] h-px bg-border" />
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {scheduleMarkers.map((m) => (
                <div key={m.time} className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mb-3 relative z-10">
                    <Clock size={16} className="text-primary-foreground" />
                  </div>
                  <span className="font-display text-lg font-bold text-foreground">{m.time}</span>
                  <span className="font-body text-xs text-muted-foreground mt-1">{m.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <p className="font-body text-sm text-muted-foreground text-center mt-10 max-w-2xl mx-auto">
            Each post is 800 to 1,200 words of SEO-optimised content written in your brand voice on your chosen topics. Lovable handles the scheduling and the writing. You handle nothing.
          </p>
        </section>

        {/* ── The Prompt ── */}
        <section className="max-w-3xl mx-auto px-6 mb-24">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-8">
            This is all you paste into <span className="text-lovable">Lovable.</span>
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-2xl border border-border bg-card p-6 md:p-8 mb-6">
            <p className="font-body text-base text-foreground font-medium leading-relaxed">
              "Add an autonomous blog publishing engine called Lazy Blogger to this project."
            </p>
            <p className="font-body text-xs text-muted-foreground mt-3">
              + complete build instructions for database, edge function, cron schedule, blog pages, and dashboard.
            </p>
          </motion.div>
          <div className="text-center">
            <CopyButton className="text-base px-10 py-5" />
            <p className="font-body text-xs text-muted-foreground mt-4 max-w-md mx-auto">
              Paste it into your Lovable chat exactly as copied. Lovable reads the full instructions and builds everything in one go.
            </p>
          </div>
        </section>

        {/* ── Cost ── */}
        <section className="max-w-4xl mx-auto px-6 mb-24">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-10">
            What does it cost?
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {costItems.map((item) => (
              <motion.div key={item.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-2xl border border-border bg-card p-6 text-center">
                <h3 className="font-display text-sm font-bold text-foreground mb-2">{item.label}</h3>
                <p className="font-body text-lg font-bold text-primary">{item.value}</p>
              </motion.div>
            ))}
          </div>
          <p className="font-body text-sm text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
            No Lazy Blogger subscription. No extra features required. No external API keys needed. Everything runs inside your Lovable project at zero additional cost.
          </p>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-3xl mx-auto px-6 mb-24">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-10">
            Questions.
          </motion.h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <h3 className="font-display text-sm font-bold text-foreground mb-2">{faq.q}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-3xl border border-border bg-card px-8 py-16 text-center">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
              Your Lovable site.<br />Publishing every day.<br /><span className="text-primary">Without you.</span>
            </h2>
            <p className="font-body text-base text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10">
              Every post builds domain authority. Every week that passes makes your site harder to catch. The best time to start was three months ago. The second best time is right now.
            </p>
            <CopyButton className="text-base px-10 py-5" />
            <p className="font-body text-xs text-muted-foreground mt-4 max-w-md mx-auto">
              Then open your Lovable project, paste it into the chat, and answer five questions. Your site starts publishing today.
            </p>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazyBloggerPage;
