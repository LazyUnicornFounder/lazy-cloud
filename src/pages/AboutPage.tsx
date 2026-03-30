import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";

const fade = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About — One Founder, Zero Employees"
        description="Lazy Unicorn is a company that builds itself. One founder, zero employees — autonomous agents run operations and grow the business on autopilot."
      />
      <Navbar />

      <main>
      {/* Hero — full-bleed manifesto */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center px-6 md:px-12"
       
      >
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(200,169,97,0.06) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fade}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <p
            className="font-body text-sm md:text-base tracking-wide mb-3"
            style={{ color: "rgba(240,234,214,0.45)" }}
          >
            The autonomous layer for Lovable
          </p>
          <p
            className="font-display text-[13px] tracking-[0.3em] uppercase font-bold mb-8"
            style={{ color: "rgba(240,234,214,0.3)" }}
          >
            About Lazy Unicorn
          </p>

          <h1
            className="mb-6"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              color: "#f0ead6",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontWeight: 800,
            }}
          >
            Here's to the lazy ones.
          </h1>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fade}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <p
              className="font-body text-lg md:text-xl leading-relaxed max-w-xl mx-auto"
              style={{ color: "rgba(240,234,214,0.5)" }}
            >
              The ones who automate. The ones who sleep while their sites publish. The ones who push one prompt and walk away.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Manifesto body */}
      <section className="relative py-24 md:py-32 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fade}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <div
            className="space-y-8 font-body text-base md:text-lg leading-[1.8]"
            style={{ color: "rgba(240,234,214,0.45)" }}
          >
            <p>
              The ones who see a task and ask — <em style={{ color: "rgba(240,234,214,0.7)" }}>does this have to be me?</em>
            </p>
            <p>
              They're not actually lazy. They move fast enough to make the work disappear. They build systems instead of doing things twice. They think the most valuable thing you can do is stop doing things manually.
            </p>
            <p>
              You can quote them, disagree with them, try to outwork them. The only thing you can't do is ignore what they've built.
            </p>
            <p style={{ color: "rgba(240,234,214,0.7)", fontSize: "1.15em" }}>
              Because while you were doing it yourself, they shipped.
            </p>
            <p>
              They turn streams into articles. Commits into changelogs. Payments into optimised revenue. Customers into conversations. Posts into podcasts. Sites into businesses.
            </p>
            <p>
              Some see a blank text editor. The lazy ones see thirty-five agents that will never need one.
            </p>
            <p>
              And the sites they run on Lovable — the ones that publish four posts before sunrise, that text customers before you've had coffee, that pentest themselves while you sleep, that get cited by ChatGPT without you asking — they change things.
            </p>
            <p
              className="text-xl md:text-2xl font-display font-bold tracking-tight"
              style={{ color: "#f0ead6", lineHeight: 1.3 }}
            >
              Because the people who are lazy enough to think they don't have to do everything manually, are the ones who actually do everything.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Divider line */}
      <div className="max-w-2xl mx-auto px-6">
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(200,169,97,0.3), transparent)" }} />
      </div>

      {/* Mission */}
      <section className="py-24 md:py-32 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fade}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p
            className="font-display text-[12px] tracking-[0.3em] uppercase font-bold mb-6"
            style={{ color: "rgba(240,234,214,0.3)" }}
          >
            Mission
          </p>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
              color: "#f0ead6",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              fontWeight: 800,
            }}
          >
            Accelerate autonomous capitalism.
          </h2>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="max-w-2xl mx-auto px-6">
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(200,169,97,0.3), transparent)" }} />
      </div>

      {/* The story */}
      <section className="py-24 md:py-32 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fade}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <p
            className="font-display text-[12px] tracking-[0.3em] uppercase font-bold mb-8"
            style={{ color: "rgba(240,234,214,0.3)" }}
          >
            The Story
          </p>

          <h2
            className="mb-10"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              color: "#f0ead6",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              fontWeight: 700,
            }}
          >
            One founder. Zero employees.<br />
            A company that builds itself.
          </h2>

          <div
            className="space-y-7 font-body text-base leading-[1.8]"
            style={{ color: "rgba(240,234,214,0.45)" }}
          >
            <p>
              Lazy Unicorn is an experiment in autonomous capitalism. The idea is simple: what happens when you replace every human role in a company with an AI agent?
            </p>
            <p>
              No content team. No SEO specialist. No social media manager. No podcast producer. No customer support agents. No employees at all. Just a single founder and a growing ecosystem of autonomous agents that handle everything — from writing and publishing to optimisation and distribution.
            </p>

            <blockquote
              className="border-l-2 pl-6 my-10"
              style={{ borderColor: "rgba(200,169,97,0.4)" }}
            >
              <p
                className="italic text-lg"
                style={{ color: "rgba(240,234,214,0.65)" }}
              >
                "The goal isn't to automate tasks. It's to build a company where the tasks don't exist in the first place."
              </p>
            </blockquote>

            <p>
              The agents don't just execute — they learn. Lazy SEO analyses what's ranking and adjusts its strategy. Lazy GEO tests whether AI models cite your brand and writes content to improve citation rates. Lazy Voice converts every blog post into a podcast episode automatically. Each agent feeds the others, creating a compounding loop of content, traffic, and growth.
            </p>
            <p>
              Lazy Unicorn is built entirely on{" "}
              <a
                href="https://lovable.dev"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "rgba(200,169,97,0.8)" }}
                className="hover:underline"
              >
                Lovable
              </a>
              . The website, the agents, the admin dashboard, the edge functions — everything runs on a single Lovable project. No external servers. No DevOps. No infrastructure team.
            </p>
            <p style={{ color: "rgba(240,234,214,0.65)" }}>
              This is what a company looks like when autonomy is the default and humans are optional.
            </p>

            <div className="mt-10 pt-8 space-y-3" style={{ borderTop: "1px solid rgba(200,169,97,0.15)" }}>
              <p className="font-body text-sm" style={{ color: "rgba(240,234,214,0.5)" }}>
                → See{" "}
                <Link to="/how-it-works" className="underline hover:opacity-80 transition-opacity" style={{ color: "rgba(200,169,97,0.7)" }}>
                  how the autonomous layer works
                </Link>
              </p>
              <p className="font-body text-sm" style={{ color: "rgba(240,234,214,0.5)" }}>
                → Explore{" "}
                <Link to="/lazy-agents" className="underline hover:opacity-80 transition-opacity" style={{ color: "rgba(200,169,97,0.7)" }}>
                  all 35 autonomous agents
                </Link>
              </p>
              <p className="font-body text-sm" style={{ color: "rgba(240,234,214,0.5)" }}>
                → Read the{" "}
                <Link to="/blog" className="underline hover:opacity-80 transition-opacity" style={{ color: "rgba(200,169,97,0.7)" }}>
                  blog on autonomous capitalism
                </Link>
              </p>
              <p className="font-body text-sm" style={{ color: "rgba(240,234,214,0.5)" }}>
                → Check{" "}
                <Link to="/pricing" className="underline hover:opacity-80 transition-opacity" style={{ color: "rgba(200,169,97,0.7)" }}>
                  plans and pricing
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="max-w-2xl mx-auto px-6">
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(200,169,97,0.3), transparent)" }} />
      </div>

      {/* Founder */}
      <section className="py-24 md:py-32 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fade}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p
            className="font-display text-[12px] tracking-[0.3em] uppercase font-bold mb-8"
            style={{ color: "rgba(240,234,214,0.3)" }}
          >
            Founded by
          </p>
          <p
            className="font-display text-2xl md:text-3xl font-bold tracking-tight"
            style={{ color: "#f0ead6" }}
          >
            Saad Sahawneh
          </p>
          <div className="flex items-center justify-center gap-6 mt-6">
            <a
              href="https://x.com/SaadSahawneh"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm tracking-[0.1em] uppercase transition-colors"
              style={{ color: "rgba(240,234,214,0.5)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f0ead6")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,234,214,0.5)")}
            >
              𝕏
            </a>
            <a
              href="https://www.linkedin.com/company/lazy-unicorn/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm tracking-[0.1em] uppercase transition-colors"
              style={{ color: "rgba(240,234,214,0.5)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f0ead6")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,234,214,0.5)")}
            >
              LinkedIn
            </a>
          </div>
        </motion.div>
      </section>

      {/* Back link */}
      <section className="pb-20 px-6 text-center">
        <Link
          to="/"
          className="font-body text-sm tracking-[0.15em] uppercase transition-colors"
          style={{ color: "rgba(240,234,214,0.4)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f0ead6")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,234,214,0.4)")}
        >
          ← Back to home
        </Link>
      </section>
      </main>
    </>
  );
}
