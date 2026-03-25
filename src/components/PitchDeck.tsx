import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { slides } from "./pitch-deck/slideData";

const PitchDeck = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c > 0 ? c - 1 : c));
  const next = () => setCurrent((c) => (c < slides.length - 1 ? c + 1 : c));

  return (
    <section id="pitch" className="relative z-10 px-8 md:px-12 pb-16 scroll-mt-24">
      <div className="max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-4"
        >
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Pitch Deck
          </h2>
          <div className="hidden md:flex items-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrent(i)}
                className="group relative"
              >
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-8 bg-primary"
                      : i < current
                      ? "w-3 bg-primary/40"
                      : "w-3 bg-foreground/10 group-hover:bg-foreground/20"
                  }`}
                />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Slide navigation tabs */}
        <div className="flex gap-1 mb-0 overflow-x-auto pb-0 scrollbar-hide">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              className={`shrink-0 font-body text-[10px] tracking-[0.15em] uppercase px-4 py-2 rounded-t-xl transition-all border border-b-0 ${
                i === current
                  ? "bg-card text-primary border-border"
                  : "bg-transparent text-muted-foreground border-transparent hover:text-foreground/60"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Slide viewport */}
        <div className="bg-card border border-border rounded-b-3xl rounded-tr-3xl shadow-[0_8px_40px_rgba(0,0,0,0.3)] overflow-hidden">
          <div className="relative aspect-[16/10] md:aspect-[16/9]">
            <AnimatePresence mode="wait">
              <motion.div
                key={slides[current].id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0"
              >
                {slides[current].content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <div className="flex items-center gap-3">
              <a
                href="https://x.com/SaadSahawneh"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[10px] tracking-[0.12em] uppercase text-muted-foreground hover:text-primary transition-colors border border-border rounded-full px-3 py-1.5"
              >
                𝕏
              </a>
              <a
                href="https://www.linkedin.com/company/lazy-unicorn/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[10px] tracking-[0.12em] uppercase text-muted-foreground hover:text-primary transition-colors border border-border rounded-full px-3 py-1.5"
              >
                LinkedIn
              </a>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-body text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                {slides[current].label} / {String(slides.length).padStart(2, "0")}
              </span>
              <button
                onClick={prev}
                disabled={current === 0}
                className="p-2 rounded-full bg-secondary hover:bg-secondary/80 disabled:opacity-20 transition-all border border-border"
              >
                <ChevronLeft className="w-4 h-4 text-foreground/60" />
              </button>
              <button
                onClick={next}
                disabled={current === slides.length - 1}
                className="p-2 rounded-full bg-secondary hover:bg-secondary/80 disabled:opacity-20 transition-all border border-border"
              >
                <ChevronRight className="w-4 h-4 text-foreground/60" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PitchDeck;
