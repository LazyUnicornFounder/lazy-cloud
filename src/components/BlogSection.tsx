import { motion } from "framer-motion";

interface BlogPost {
  title: string;
  date: string;
  readTime: string;
  content: string[];
}

const blogPosts: BlogPost[] = [
  {
    title: "The Rise of Autonomous Companies: Why Your Next Startup Runs Itself",
    date: "March 2026",
    readTime: "6 min read",
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
      <div className="max-w-2xl bg-background/60 backdrop-blur-2xl rounded-3xl px-8 py-10 border border-foreground/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl font-extrabold tracking-[0.1em] uppercase text-foreground/60 mb-8"
        >
          Blog
        </motion.p>

        {blogPosts.map((post, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="font-body text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">
                {post.date}
              </span>
              <span className="w-1 h-1 rounded-full bg-foreground/20" />
              <span className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/40">
                {post.readTime}
              </span>
            </div>

            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-foreground leading-tight mb-6">
              {post.title}
            </h2>

            <div className="space-y-5">
              {post.content.map((paragraph, j) => (
                <motion.p
                  key={j}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: j * 0.04 }}
                  className="font-body text-base text-foreground/60 leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
