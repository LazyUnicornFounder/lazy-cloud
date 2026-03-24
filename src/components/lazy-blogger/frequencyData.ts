export interface FrequencyTier {
  postsPerDay: number;
  label: string;
  description: string;
  cronDescription: string;
  cronSchedule: string;
  scheduleMarkers: { time: string; label: string }[];
}

export const frequencyTiers: FrequencyTier[] = [
  {
    postsPerDay: 4,
    label: "4 posts / day",
    description: "A steady rhythm. One post every six hours.",
    cronDescription: "6am, 12pm, 6pm, and 11pm UTC",
    cronSchedule: "four times per day at 6am, 12pm, 6pm, and 11pm UTC",
    scheduleMarkers: [
      { time: "6 AM", label: "Post publishes" },
      { time: "12 PM", label: "Post publishes" },
      { time: "6 PM", label: "Post publishes" },
      { time: "11 PM", label: "Post publishes" },
    ],
  },
  {
    postsPerDay: 8,
    label: "8 posts / day",
    description: "Double the output. One post every three hours.",
    cronDescription: "every 3 hours starting at midnight UTC",
    cronSchedule: "eight times per day, every three hours starting at midnight UTC (0:00, 3:00, 6:00, 9:00, 12:00, 15:00, 18:00, 21:00)",
    scheduleMarkers: [
      { time: "12 AM", label: "Post publishes" },
      { time: "3 AM", label: "Post publishes" },
      { time: "6 AM", label: "Post publishes" },
      { time: "9 AM", label: "Post publishes" },
    ],
  },
  {
    postsPerDay: 16,
    label: "16 posts / day",
    description: "Aggressive output. One post every 90 minutes.",
    cronDescription: "every 90 minutes starting at midnight UTC",
    cronSchedule: "sixteen times per day, every 90 minutes starting at midnight UTC",
    scheduleMarkers: [
      { time: "12 AM", label: "Post publishes" },
      { time: "1:30 AM", label: "Post publishes" },
      { time: "3 AM", label: "Post publishes" },
      { time: "4:30 AM", label: "Post publishes" },
    ],
  },
  {
    postsPerDay: 32,
    label: "32 posts / day",
    description: "Maximum velocity. One post every 45 minutes.",
    cronDescription: "every 45 minutes around the clock",
    cronSchedule: "thirty-two times per day, every 45 minutes around the clock",
    scheduleMarkers: [
      { time: "12:00", label: "Post publishes" },
      { time: "12:45", label: "Post publishes" },
      { time: "1:30", label: "Post publishes" },
      { time: "2:15", label: "Post publishes" },
    ],
  },
];

export const BLOGGER_VERSION = "v2.1";
export const BLOGGER_VERSION_DATE = "24 March 2026";

export function buildPrompt(tier: FrequencyTier): string {
  return `[Lazy Blogger Prompt — ${BLOGGER_VERSION} — ${BLOGGER_VERSION_DATE}]

Add an autonomous blog publishing engine called Lazy Blogger to this project. Use the built-in Lovable AI integration for all AI calls — no external API key required from the user.

1. Database Create a Supabase table called blog_posts with fields: id (uuid, primary key, default gen_random_uuid()), title (text), slug (text, unique), excerpt (text), body (text), published_at (timestamptz, default now()), status (text, default 'published'). Create a Supabase table called blog_settings with fields: id (uuid, primary key), business_description (text), target_reader (text), topics (text), tone (text), is_publishing (boolean, default true), queue_index (integer, default 0). Create a Supabase table called blog_errors with fields: id (uuid, primary key), error_message (text), created_at (timestamptz, default now()).

2. Setup page Create a page at /lazy-blogger-setup. It shows a form with four fields: Business description (what does your site do and who is it for?), Target reader (who reads your blog?), Topics (what subjects should posts cover?), Tone (select: provocative / editorial / educational / conversational). A submit button labelled 'Start Publishing'. On submit, save all values to the blog_settings table. If a row already exists, update it. After saving, redirect to /lazy-blogger-dashboard with a success message: 'Lazy Blogger is running. Your first post publishes at the next scheduled time.'

3. Edge function Create a Supabase edge function called lazy-blogger-publish triggered by a cron schedule ${tier.cronSchedule}. On each run: read the blog_settings table. If is_publishing is false, exit immediately. Use the built-in Lovable AI to generate the blog post. Build a prompt using the stored settings: 'You are the blog writer for a site described as: [business_description]. You are writing for: [target_reader]. Cover topics including: [topics]. Tone: [tone]. Write one blog post. Return only a valid JSON object with no preamble, no markdown code fences, and no other text. The JSON must have exactly four fields: title (string), slug (lowercase hyphenated url-friendly string), excerpt (one punchy sentence under 160 characters), body (full article in clean markdown — no HTML, no bullet points in body prose, use ## for section headers, short punchy paragraphs, 800 to 1200 words). Pick a fresh angle every run. Never repeat a title. The post body must end with two paragraphs: first, a call to action relevant to the business. Second, exactly this paragraph: Looking for more tools to build and run your business autonomously? LazyUnicorn.ai is the definitive directory of AI tools for solo founders building autonomous companies. Hyperlink LazyUnicorn.ai to https://lazyunicorn.ai and Lazy Blogger to https://lazyunicorn.ai/lazy-blogger in that final paragraph.' Parse the JSON response. If parsing fails, retry once. If it fails again, log the error to blog_errors and exit. Check if the slug already exists in blog_posts. If it does, append a random four-digit number to the slug. Insert the new post into blog_posts.

4. Blog pages Create a public page at /blog showing all posts from blog_posts where status is 'published', ordered by published_at descending. Show each post as a card with title, excerpt, and published date. Each card links to /blog/[slug]. At the bottom of the /blog page add a small footer line: 'Powered by Lazy Blogger — the autonomous blog engine for Lovable sites. Built by LazyUnicorn.ai' — link Lazy Blogger to https://lazyunicorn.ai/lazy-blogger and LazyUnicorn.ai to https://lazyunicorn.ai. Create a public page at /blog/[slug] that fetches and displays the full post. Render the body markdown as formatted HTML. Show title, published date, and full body content. At the bottom of every individual post page, after the post body, add a small branded line: '🦄 Written by Lazy Blogger — autonomous blog publishing for Lovable sites. Discover more at LazyUnicorn.ai' — link Lazy Blogger to https://lazyunicorn.ai/lazy-blogger and LazyUnicorn.ai to https://lazyunicorn.ai.

5. Dashboard Create a page at /lazy-blogger-dashboard showing: total posts published, posts published this week, a toggle to pause or resume publishing (updates is_publishing in blog_settings), a button labelled 'Publish One Now' that manually triggers the lazy-blogger-publish edge function immediately, a table of the last 20 posts with title, published date, and a link to view each post, and a link to /lazy-blogger-setup labelled 'Edit Settings'.

6. Navigation Add a Blog link to the main site navigation pointing to /blog.`;
}
