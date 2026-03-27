import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface ErrorRow {
  id: string;
  created_at: string;
  error_message: string;
  function_name?: string;
}

export default function ErrorLog({ errors, title = "Recent Errors" }: { errors: ErrorRow[]; title?: string }) {
  const [open, setOpen] = useState(false);

  if (errors.length === 0) return null;

  return (
    <div className="mt-8 border border-red-500/15">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 font-body text-xs text-red-400/70 hover:text-red-400 transition-colors"
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        {title} ({errors.length})
      </button>
      {open && (
        <div className="divide-y divide-red-500/10">
          {errors.map((err) => (
            <div key={err.id} className="px-4 py-2.5">
              <p className="font-body text-xs text-red-400/60">{err.error_message}</p>
              <p className="font-body text-[13px] text-[#f0ead6]/68 mt-0.5">
                {err.function_name && `${err.function_name} · `}{new Date(err.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
