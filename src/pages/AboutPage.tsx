import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";


export default function AboutPage() {
  return (
    <>
      <SEO
        title="About Lazy Unicorn — One Founder. Zero Employees."
        description="Lazy Unicorn is a company that builds itself. Autonomous engines replace teams, run operations, and grow the business — all without manual input."
      />
      <Navbar />
      <div className="min-h-screen bg-background text-foreground pt-32 pb-20 px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-display text-sm tracking-[0.2em] uppercase text-primary mb-6 font-bold">
              About
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4">
              One founder. Zero employees.<br />
              A company that builds itself.
            </h1>

            <div className="mb-8 py-4 px-5 rounded-xl bg-primary/5 border border-primary/10">
              <p className="font-display text-[14px] tracking-[0.2em] uppercase text-primary/60 mb-1 font-bold">Mission</p>
              <p className="font-display text-lg md:text-xl font-bold text-foreground/90 tracking-tight">
                Accelerate autonomous capitalism.
              </p>
            </div>

            <div className="space-y-6 font-body text-sm text-foreground/50 leading-relaxed">
              <p>
                Lazy Unicorn is an experiment in autonomous capitalism. The idea is simple: what happens when you replace every human role in a company with an AI engine?
              </p>
              <p>
                No content team. No SEO specialist. No social media manager. No podcast producer. No customer support agents. No employees at all. Just a single founder and a growing ecosystem of autonomous engines that handle everything — from writing and publishing to optimisation and distribution.
              </p>
              <p>
                Every product in the Lazy ecosystem — Lazy Blogger, Lazy SEO, Lazy GEO, Lazy Voice, Lazy Stream, and more — is a self-running engine. Each one operates independently, makes its own decisions, improves its own output, and publishes content without any manual input after initial setup.
              </p>

              <div className="border-l-2 border-primary/30 pl-5 my-8">
                <p className="text-foreground/70 italic">
                  "The goal isn't to automate tasks. It's to build a company where the tasks don't exist in the first place."
                </p>
              </div>

              <p>
                The engines don't just execute — they learn. Lazy SEO analyses what's ranking and adjusts its strategy. Lazy GEO tests whether AI models cite your brand and writes content to improve citation rates. Lazy Voice converts every blog post into a podcast episode automatically. Each engine feeds the others, creating a compounding loop of content, traffic, and growth.
              </p>
              <p>
                Lazy Unicorn is built entirely on <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Lovable</a>. The website, the engines, the admin dashboard, the edge functions — everything runs on a single Lovable project. No external servers. No DevOps. No infrastructure team.
              </p>
              <p>
                This is what a company looks like when autonomy is the default and humans are optional.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="font-body text-[14px] tracking-[0.15em] uppercase text-foreground/60 mb-3">Founded by</p>
              <p className="font-display text-lg font-bold">Saad Sahawneh</p>
              <div className="flex items-center gap-4 mt-3">
                <a href="https://x.com/SaadSahawneh" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-foreground/70 hover:text-foreground transition-colors">𝕏</a>
                <a href="https://www.linkedin.com/company/lazy-unicorn/" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-foreground/70 hover:text-foreground transition-colors">LinkedIn</a>
              </div>
            </div>


            <div className="mt-8">
              <Link
                to="/"
                className="font-body text-sm tracking-[0.15em] uppercase text-foreground/70 hover:text-foreground transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
