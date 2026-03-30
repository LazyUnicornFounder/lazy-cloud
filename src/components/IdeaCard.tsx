import { useState } from "react";
import { ArrowUpRight, Clock } from "lucide-react";

interface PrevIdea {
  title: string;
  description: string;
  sourceEvent: string;
  sourceUrl: string;
}

interface IdeaCardProps {
  title: string;
  description: string;
  sourceEvent: string;
  sourceUrl?: string;
  tag: string;
  delay: number;
  previousIdeas?: PrevIdea[];
  historyLabel?: string;
}

const IdeaCard = ({ title, description, sourceEvent, sourceUrl, tag, delay, previousIdeas = [], historyLabel = "Previous ideas today" }: IdeaCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [expandedIdea, setExpandedIdea] = useState<number | null>(null);
  const history = previousIdeas;

  return (
    <div
      className="relative opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setExpandedIdea(null); }}
    >
      {history.length > 0 && (
        <>
          <div
            className="absolute inset-0 bg-card border border-border rounded-lg transition-all duration-300 ease-out"
            style={{
              transform: isHovered ? "rotate(-2deg) translateY(8px) scale(0.96)" : "rotate(0) translateY(0) scale(1)",
              opacity: isHovered ? 0.5 : 0,
              zIndex: 0,
            }}
          />
          <div
            className="absolute inset-0 bg-card border border-border rounded-lg transition-all duration-300 ease-out"
            style={{
              transform: isHovered ? "rotate(1.5deg) translateY(4px) scale(0.98)" : "rotate(0) translateY(0) scale(1)",
              opacity: isHovered ? 0.7 : 0,
              zIndex: 1,
            }}
          />
        </>
      )}

      <div
        className={`group relative z-10 bg-card rounded-lg border border-border transition-all duration-300 ${
          isHovered ? "shadow-xl -translate-y-1" : "shadow-none"
        }`}
      >
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-sm bg-primary text-primary-foreground shadow-sm">
              {tag}
            </span>
            {sourceUrl && (
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer" aria-label="Read source article">
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}
          </div>

          <h3 className="text-lg leading-snug mb-2 text-card-foreground font-semibold">
            {title}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {description}
          </p>

          <div className="pt-3 border-t border-border">
            {sourceUrl ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground/60 hover:text-primary transition-colors"
              >
                <span className="font-medium text-muted-foreground/70">Source:</span> {sourceEvent} ↗
              </a>
            ) : (
              <p className="text-xs text-muted-foreground/60">
                <span className="font-medium text-muted-foreground/70">Source:</span> {sourceEvent}
              </p>
            )}
          </div>
        </div>

        <div
          className="overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: isHovered && history.length > 0 ? "2000px" : "0px",
            opacity: isHovered ? 1 : 0,
          }}
        >
          <div className="px-5 pb-4 pt-1 border-t border-dashed border-border">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {historyLabel}
              </span>
            </div>
            <div className="space-y-1">
              {history.map((prev, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setExpandedIdea(i)}
                  onMouseLeave={() => setExpandedIdea(null)}
                >
                  <div className="w-full flex items-center justify-between gap-2 py-1.5 px-2 -mx-2 rounded-md hover:bg-muted/50 transition-colors text-left group/prev cursor-default">
                    <p className="text-xs text-muted-foreground truncate group-hover/prev:text-foreground transition-colors">
                      {prev.title}
                    </p>
                  </div>

                  <div
                    className="overflow-hidden transition-all duration-200 ease-out"
                    style={{
                      maxHeight: expandedIdea === i ? "200px" : "0px",
                      opacity: expandedIdea === i ? 1 : 0,
                    }}
                  >
                    <div className="ml-2 pl-3 border-l-2 border-primary/30 py-2 mb-1">
                      <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
                        {prev.description}
                      </p>
                      {prev.sourceUrl ? (
                        <a
                          href={prev.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-muted-foreground hover:text-primary transition-colors"
                        >
                          <span className="font-medium text-card-foreground">Source:</span> {prev.sourceEvent} ↗
                        </a>
                      ) : prev.sourceEvent ? (
                        <p className="text-[10px] text-muted-foreground">
                          <span className="font-medium text-card-foreground">Source:</span> {prev.sourceEvent}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
