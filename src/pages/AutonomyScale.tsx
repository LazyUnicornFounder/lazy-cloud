import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";

const levels = [
  { level: 1, name: "Critical", barColor: "bg-destructive", tagLine: "The business is you.", description: "Revenue stops when you stop. Every function — sales, delivery, support, marketing — requires your personal involvement.", signs: ["Revenue disappears when you take a day off", "You personally handle every customer interaction", "No systems run without your direct involvement"] },
  { level: 2, name: "Fragile", barColor: "bg-foreground/30", tagLine: "Tolerates your absence — briefly.", description: "Revenue slows but doesn't stop immediately. Some systems run without you for a few days before things start to slip.", signs: ["Things hold for 2–3 days without you", "Outbound stops when you stop sending it", "Content stops publishing when you stop writing"] },
  { level: 3, name: "Managed", barColor: "bg-foreground/50", tagLine: "Runs with weekly check-ins.", description: "You've handed off execution. Agents or team members handle day-to-day operations. You review outputs weekly.", signs: ["Revenue arrives while you sleep", "Content publishes without you writing it", "Weekly reviews replace daily firefighting"] },
  { level: 4, name: "Autonomous", barColor: "bg-foreground/70", tagLine: "Runs and grows without you.", description: "Agents handle operations and growth loops run continuously. Revenue arrives without your initiation.", signs: ["Growth loops run without initiation", "Outbound agents improve conversion automatically", "Monthly strategic involvement is all that's required"] },
  { level: 5, name: "Recursive", barColor: "bg-foreground", tagLine: "Improves its own ability to grow.", description: "Agents measure, learn, and update their own behaviour based on results. The system gets better at running itself every week.", signs: ["Agents optimise their own processes", "The business learns from every interaction", "The founder is optional for daily operations"] },
];

const AutonomyScale = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Autonomy Scale — 5 Levels of Business Independence" description="Where does your business sit on the autonomy spectrum?" url="/autonomy-scale" breadcrumbs={[{ name: "Home", url: "/" }, { name: "Autonomy Scale", url: "/autonomy-scale" }]} />
      <Navbar activePage="autonomy" />

      <div className="pt-32 pb-16 px-6 md:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto text-center">
          <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4 font-bold">The Dependency Spectrum</p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] mb-6">How Autonomous<br />Is Your Business?</h1>
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">Most founders are at Level 1 or 2. The infrastructure to reach Level 5 already exists.</p>
        </motion.div>
      </div>

      <div className="px-6 md:px-12 pb-12">
        <div className="max-w-4xl mx-auto space-y-0 border border-border">
          {levels.map((level, i) => (
            <motion.div key={level.level} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }} className="border-b last:border-b-0 border-border p-6 md:p-8 relative">
              <div className={`absolute top-0 left-0 h-full w-1 ${level.barColor}`} />
              <div className="pl-4">
                <div className="flex items-center gap-4 mb-3">
                  <span className="font-display text-2xl font-extrabold text-foreground">{level.level}</span>
                  <div>
                    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">{level.name}</h2>
                    <p className="font-body text-sm text-muted-foreground">{level.tagLine}</p>
                  </div>
                </div>
                <p className="font-body text-sm text-foreground/50 leading-relaxed mb-4">{level.description}</p>
                <div className="flex flex-wrap gap-2">
                  {level.signs.map((sign) => (
                    <span key={sign} className="font-body text-[11px] px-3 py-1.5 border border-border bg-card text-foreground/40">{sign}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-12 py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.6 }} className="max-w-3xl mx-auto text-center">
          <div className="p-10 border border-border bg-card">
            <h2 className="font-display text-2xl md:text-4xl font-extrabold text-foreground mb-4">Ready to climb the scale?</h2>
            <p className="font-body text-sm md:text-base text-muted-foreground mb-8 max-w-lg mx-auto">The tools to move from Level 1 to Level 5 already exist. Start building your autonomous company today.</p>
            <a href="/launch" className="inline-block font-body text-sm tracking-[0.1em] uppercase bg-foreground text-background px-8 py-3 font-semibold hover:opacity-90 transition-opacity">Launch Your Autonomous Startup</a>
          </div>
        </motion.div>
      </div>

      <footer className="px-8 md:px-12 py-8 border-t border-border">
        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/30">Lazy Unicorn © 2026</span>
      </footer>
    </div>
  );
};

export default AutonomyScale;
