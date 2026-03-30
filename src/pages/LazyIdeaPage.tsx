import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import IdeaCard from "@/components/IdeaCard";
import { fetchIdeasForDate } from "@/lib/ideas";
import { Search, RefreshCw } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const categories = [
  "All", "Architecture", "Art", "Boxing", "Cars", "Coffee", "Construction",
  "Creator", "Crypto", "Culture", "Design", "Education", "Fashion", "Film",
  "Food", "Gaming", "Health", "Humanitarian", "Law", "Living", "Money",
  "Music", "Outdoors", "Parenting", "Pets", "Politics", "Real Estate",
  "Science", "Space", "Sports", "Tech", "Travel", "VC", "Weather",
];

function getAmmanDate(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Amman" });
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const LazyIdeaPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const today = getAmmanDate();
  const selectedDate = today;

  const { data, isLoading } = useQuery({
    queryKey: ["ideas", selectedDate],
    queryFn: () => fetchIdeasForDate(selectedDate),
    staleTime: 5 * 60 * 1000,
  });

  const featured = data?.featured || [];
  const allByCategory = data?.all || {};

  const filteredIdeas = useMemo(() => {
    const allIdeas = Object.values(allByCategory).flat();

    let ideas = activeCategory !== "All"
      ? (allByCategory[activeCategory] || [])
      : (searchQuery.trim() ? allIdeas : featured);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      ideas = ideas.filter(
        (idea) =>
          idea.title.toLowerCase().includes(q) ||
          idea.description.toLowerCase().includes(q) ||
          idea.tag.toLowerCase().includes(q) ||
          idea.sourceEvent.toLowerCase().includes(q)
      );
    }

    return ideas;
  }, [searchQuery, activeCategory, featured, allByCategory]);

  return (
    <>
      <SEO
        title="Lazy Idea — AI Startup Ideas from Today's News"
        description="Fresh startup ideas generated daily from breaking news. Browse by category, search, and discover your next big idea."
        url="https://lazyunicorn.ai/lazy-idea"
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="relative z-10 pb-32">
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32">
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <span className="font-display text-[11px] tracking-[0.2em] uppercase font-bold text-foreground/40 mb-4 block">BETA</span>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy Idea
              </h1>
              <div className="flex items-center gap-3 mt-4 mb-4">
                <span className="font-display text-[11px] tracking-[0.15em] uppercase font-bold px-3 py-1 border border-[#c8a961]/30 text-[#c8a961]">Lazy Content</span>
              </div>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/50 max-w-xl leading-relaxed">
                Turn today's news into your next startup idea. Fresh ideas generated daily from breaking news, organized by category.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Categories */}
          <div className="relative z-10 flex gap-2 overflow-x-auto justify-center mb-3 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? "All" : cat)}
                className={`text-sm font-medium transition-colors whitespace-nowrap px-4 py-2 rounded-full cursor-pointer select-none ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex justify-center mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search ideas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <RefreshCw className="w-6 h-6 text-muted-foreground animate-spin" />
            </div>
          )}

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredIdeas.map((idea, i) => {
              const prevIdeas = activeCategory === "All"
                ? (allByCategory[idea.tag] || [])
                    .filter((p) => p.title !== idea.title)
                    .map((p) => ({
                      title: p.title,
                      description: p.description,
                      sourceEvent: p.sourceEvent,
                      sourceUrl: p.sourceUrl,
                    }))
                : [];

              return (
                <IdeaCard
                  key={`${idea.tag}-${idea.title}`}
                  title={idea.title}
                  description={idea.description}
                  sourceEvent={idea.sourceEvent}
                  sourceUrl={idea.sourceUrl}
                  tag={idea.tag}
                  delay={i * 60}
                  previousIdeas={prevIdeas}
                />
              );
            })}
          </div>

          {!isLoading && filteredIdeas.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No ideas found.</p>
          )}
        </main>
      </div>
    </>
  );
};

export default LazyIdeaPage;
