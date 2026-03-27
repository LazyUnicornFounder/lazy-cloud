import { Loader2 } from "lucide-react";

interface Props {
  name: string;
  running: boolean;
  onToggle: () => void;
  toggling?: boolean;
  publishedToday: number;
  publishedTotal: number;
  lastRun: string | null;
}

export default function EngineStatusBar({ name, running, onToggle, toggling, publishedToday, publishedTotal, lastRun }: Props) {
  return (
    <div className="border border-[#f0ead6]/8 p-5 flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="font-display text-lg font-bold tracking-tight">{name}</h1>
        <button
          onClick={onToggle}
          disabled={toggling}
          className={`relative w-12 h-6 rounded-none transition-colors ${running ? "bg-emerald-600" : "bg-[#f0ead6]/10"}`}
        >
          {toggling && <Loader2 size={10} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-[#f0ead6]" />}
          <span className={`block w-5 h-5 bg-[#f0ead6] transition-transform ${running ? "translate-x-6" : "translate-x-0.5"}`} />
        </button>
        <span className={`font-body text-[13px] tracking-[0.15em] uppercase ${running ? "text-emerald-500" : "text-[#f0ead6]/75"}`}>
          {running ? "Running" : "Paused"}
        </span>
      </div>
      <div className="flex items-center gap-6 text-[#f0ead6]/82 font-body text-xs">
        <div><span className="text-[#f0ead6]/68 text-[13px] uppercase tracking-wider">Today</span> <span className="text-[#f0ead6] font-bold ml-1">{publishedToday}</span></div>
        <div><span className="text-[#f0ead6]/68 text-[13px] uppercase tracking-wider">Total</span> <span className="text-[#f0ead6] font-bold ml-1">{publishedTotal}</span></div>
        <div><span className="text-[#f0ead6]/68 text-[13px] uppercase tracking-wider">Last run</span> <span className="ml-1">{lastRun ? new Date(lastRun).toLocaleString() : "—"}</span></div>
      </div>
    </div>
  );
}
