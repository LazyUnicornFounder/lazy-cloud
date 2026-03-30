import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import IdeaCard from "@/components/IdeaCard";
import { fetchIdeasForDate } from "@/lib/ideas";
import { Search, RefreshCw, Lightbulb } from "lucide-react";
import SEO from "@/components/SEO";

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
        path="/lazy-idea"
      />
      <div className="min-h-screen bg-background">
        <main className="max-w-7xl mx-auto px-6 py-6">
          {/* Hero */}
          <div className="flex flex-col items-center justify-center gap-2 py-12 mb-4">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-10 h-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Lazy Idea
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground tracking-tight font-medium">
              Turn today's news into your next startup idea.
            </p>
          </div>

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
