import { motion } from "framer-motion";
import unicornBg from "@/assets/unicorn-beach.png";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import ProductPromoBanner from "@/components/ProductPromoBanner";

const levels = [
  {
    level: 1,
    name: "Critical",
    color: "destructive",
    barWidth: "w-[20%]",
    barColor: "bg-destructive",
    tagLine: "The business is you.",
    description:
      "Revenue stops when you stop. Every function — sales, delivery, support, marketing — requires your personal involvement. You are not the owner. You are the product.",
    signs: [
      "Revenue disappears when you take a day off",
      "You personally handle every customer interaction",
      "No systems run without your direct involvement",
    ],
  },
  {
    level: 2,
    name: "Fragile",
    color: "destructive",
    barWidth: "w-[40%]",
    barColor: "bg-[hsl(25,90%,55%)]",
    tagLine: "Tolerates your absence — briefly.",
    description:
      "Revenue slows but doesn't stop immediately. Some systems run without you for a few days before things start to slip. You've systemised some functions but you're still the orchestrator.",
    signs: [
      "Things hold for 2–3 days without you",
      "Outbound stops when you stop sending it",
      "Content stops publishing when you stop writing",
    ],
  },
  {
    level: 3,
    name: "Managed",
    color: "primary",
    barWidth: "w-[60%]",
    barColor: "bg-primary",
    tagLine: "Runs with weekly check-ins.",
    description:
      "You've handed off execution. Agents or team members handle day-to-day operations. You review outputs weekly and make strategic decisions. Revenue continues during your absence.",
    signs: [
      "Revenue arrives while you sleep",
      "Content publishes without you writing it",
      "Weekly reviews replace daily firefighting",
    ],
  },
  {
    level: 4,
    name: "Autonomous",
    color: "accent",
    barWidth: "w-[80%]",
    barColor: "bg-[hsl(142,70%,50%)]",
    tagLine: "Runs and grows without you.",
    description:
      "Agents handle operations and growth loops run continuously. Revenue arrives without your initiation. The business compounds. You are the direction, not the engine.",
    signs: [
      "Growth loops run without initiation",
      "Outbound agents improve conversion automatically",
      "Monthly strategic involvement is all that's required",
    ],
  },
  {
    level: 5,
    name: "Recursive",
    color: "accent",
    barWidth: "w-full",
    barColor: "bg-[hsl(142,70%,50%)]",
    tagLine: "Improves its own ability to grow.",
    description:
      "Agents measure, learn, and update their own behaviour based on results. The system gets better at running itself every week. The founder sets direction occasionally.",
    signs: [
      "Agents optimise their own processes",
      "The business learns from every interaction",
      "The founder is optional for daily operations",
    ],
  },
];

const AutonomyScale = () => {
  return (
    <div className="min-h-screen text-foreground relative">
      <SEO
        title="Autonomy Scale — 5 Levels of Business Independence"
        description="Where does your business sit on the autonomy spectrum? From founder-dependent to fully recursive — discover the 5 levels and how to climb them."
        url="/autonomy-scale"
        keywords="autonomous business, business autonomy levels, founder independence, recursive startup, autonomous company scale, solo founder autonomy"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Autonomy Scale", url: "/autonomy-scale" },
        ]}
      />

      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src={unicornBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <Navbar activePage="autonomy" />

      {/* Hero */}
      <div className="relative z-10 pt-32 pb-16 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="inline-block font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-6">
            The Dependency Spectrum
          </span>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] mb-6">
            How Autonomous
            <br />
            <span className="text-primary">Is Your Business?</span>
          </h1>
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Most founders are at Level 1 or 2. The infrastructure to reach Level
            5 already exists. The question is whether you're using it.
          </p>
        </motion.div>
      </div>

      {/* Scale visualization */}
      <div className="relative z-10 px-6 md:px-12 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress bar overview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-16 p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                Founder Dependency
              </span>
              <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                Full Autonomy
              </span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden flex">
              <div className="h-full w-[20%] bg-destructive" />
              <div className="h-full w-[20%] bg-[hsl(25,90%,55%)]" />
              <div className="h-full w-[20%] bg-primary" />
              <div className="h-full w-[20%] bg-[hsl(142,70%,50%)]" />
              <div className="h-full w-[20%] bg-[hsl(142,80%,45%)]" />
            </div>
            <div className="flex justify-between mt-2">
              {levels.map((l) => (
                <span
                  key={l.level}
                  className="font-body text-[9px] tracking-wider uppercase text-foreground/40 text-center"
                  style={{ width: "20%" }}
                >
                  L{l.level}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Level cards */}
          <div className="space-y-6">
            {levels.map((level, i) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
                className="group relative rounded-2xl border border-border bg-card/50 backdrop-blur-lg overflow-hidden hover:border-primary/30 transition-all duration-300"
              >
                {/* Level bar accent */}
                <div
                  className={`absolute top-0 left-0 h-full w-1 ${level.barColor}`}
                />

                <div className="p-6 md:p-8 pl-8 md:pl-10">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-xl ${level.barColor} bg-opacity-20 border border-foreground/5`}
                        style={{ background: `${level.barColor.includes('hsl') ? '' : ''}` }}
                      >
                        <span className="font-display text-xl font-extrabold text-foreground">
                          {level.level}
                        </span>
                      </div>
                      <div>
                        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
                          {level.name}
                        </h2>
                        <p className="font-body text-sm text-muted-foreground">
                          {level.tagLine}
                        </p>
                      </div>
                    </div>

                    {/* Bar indicator */}
                    <div className="hidden md:block w-32">
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${level.barColor} ${level.barWidth}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="font-body text-sm md:text-base text-foreground/70 leading-relaxed mb-5">
                    {level.description}
                  </p>

                  {/* Signs */}
                  <div className="flex flex-wrap gap-2">
                    {level.signs.map((sign) => (
                      <span
                        key={sign}
                        className="font-body text-[11px] px-3 py-1.5 rounded-full border border-foreground/10 bg-background/40 text-foreground/60"
                      >
                        {sign}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 px-6 md:px-12 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="p-10 rounded-2xl border border-primary/20 bg-card/30 backdrop-blur-lg">
            <h2 className="font-display text-2xl md:text-4xl font-extrabold text-foreground mb-4">
              Ready to climb the scale?
            </h2>
            <p className="font-body text-sm md:text-base text-muted-foreground mb-8 max-w-lg mx-auto">
              The tools to move from Level 1 to Level 5 already exist. They cost
              less than $200/month. Start building your autonomous company today.
            </p>
            <a
              href="/launch"
              className="inline-block font-body text-sm tracking-[0.1em] uppercase bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Launch Your Autonomous Startup
            </a>
          </div>
        </motion.div>
      </div>

      {/* Product Promo */}
      <div className="relative z-10 px-6 md:px-12 pb-12 max-w-4xl mx-auto">
        <ProductPromoBanner />
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-8 md:px-12 py-8 pb-20 border-t border-foreground/10">
        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/50">
          Lazy Unicorn © 2026
        </span>
      </footer>
    </div>
  );
};

export default AutonomyScale;
