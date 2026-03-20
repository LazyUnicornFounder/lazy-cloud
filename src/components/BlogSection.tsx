import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import unicornBg from "@/assets/unicorn-beach.png";
import type { BlogPost } from "@/data/blogPosts";

export const blogPosts: BlogPost[] = [
  {
    slug: "rise-of-autonomous-companies",
    title: "The Rise of Autonomous Companies: Why Your Next Startup Runs Itself",
    date: "March 2026",
    readTime: "6 min read",
    thumbnail: unicornBg,
    excerpt: "The convergence of agentic AI, vertical SaaS, and API-first infrastructure has unlocked businesses that compound without burning runway on headcount.",
    content: [
      "We're at an inflection point. The convergence of agentic AI, vertical SaaS, and API-first infrastructure has unlocked something founders have been chasing since the first YC batch: businesses that compound without burning runway on headcount.",
      "The playbook is shifting. Traditional scaling meant hiring — SDRs, ops managers, customer success reps — and hoping your Series A would cover the burn long enough to hit product-market fit. Now, a single founder with the right stack can deploy autonomous agents that handle everything from lead qualification to inventory management to dynamic pricing. The unit economics are absurd.",
      "Companies like those in our directory are building the picks and shovels of this new paradigm. We're talking about AI-native platforms that don't just automate tasks — they make decisions. They run A/B tests on your landing pages at 3 AM. They renegotiate supplier contracts. They spin up micro-campaigns targeting intent signals your human marketing team would miss entirely.",
      "The technical moat here isn't the model — it's the orchestration layer. The winners are companies building robust agent frameworks with real-time feedback loops, RAG pipelines connected to live business data, and fault-tolerant execution engines that can handle the messiness of real-world commerce. Think LangChain meets Shopify meets a 24/7 fractional COO.",
      "For bootstrapped founders and solo operators, this is the unlock. You don't need a 15-person team to hit $1M ARR anymore. You need a well-architected agent stack, solid GTM positioning, and enough domain expertise to know which workflows to automate first. The leverage is unprecedented.",
      "The skeptics will say we're in a hype cycle — and they're partially right. Not every \"AI-powered\" SaaS tool actually delivers autonomous value. The directory exists to separate signal from noise. We're curating the platforms that are genuinely shipping agentic capabilities, not just wrapping GPT-4 in a chatbot widget and calling it innovation.",
      "What excites us most is the second-order effect: when businesses run autonomously, founders get time back. Time to think strategically, to build community, to explore adjacent markets. The best companies in this space aren't just selling efficiency — they're selling optionality.",
      "We're still in the first inning. The agent infrastructure layer is maturing fast, multimodal models are getting cheaper by the quarter, and the tooling around eval, monitoring, and guardrails is finally catching up. If you're building in this space — or running a business on top of it — the Lazy Unicorn directory is your starting point.",
      "Autonomous capitalism isn't a meme. It's a market thesis. And the founders who get it are already shipping."
    ],
  },
];

const BlogSection = () => {
  return (
    <section id="blog" className="relative z-10 px-8 md:px-12 pb-16 scroll-mt-24">
      <div className="max-w-3xl">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-background/60 backdrop-blur-2xl rounded-3xl px-8 py-10 border border-foreground/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-8"
        >
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-3">
            Blog
          </h1>
          <p className="font-body text-lg text-foreground/50 leading-relaxed">
            Accelerate the future of autonomous capitalism.
          </p>
        </motion.div>

        {/* Post grid */}
        <div className="grid gap-6">
          {blogPosts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="group block bg-background/60 backdrop-blur-2xl rounded-3xl border border-foreground/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden hover:border-primary/30 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative h-48 md:h-64 overflow-hidden">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>

                {/* Info */}
                <div className="px-8 py-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-body text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">
                      {post.date}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-foreground/20" />
                    <span className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/40">
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="font-display text-xl md:text-2xl font-extrabold text-foreground group-hover:text-primary transition-colors leading-tight mb-2">
                    {post.title}
                  </h2>
                  <p className="font-body text-sm text-foreground/50 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <span className="inline-block mt-4 font-body text-[10px] tracking-[0.2em] uppercase text-primary font-semibold group-hover:translate-x-1 transition-transform">
                    Read article →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
