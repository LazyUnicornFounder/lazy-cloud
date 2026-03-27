import { useState } from "react";
import { ChevronDown, ChevronRight, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Field {
  key: string;
  label: string;
  type?: "text" | "password" | "number" | "textarea";
  placeholder?: string;
  hint?: string;
}

interface Props {
  title?: string;
  fields: Field[];
  values: Record<string, any>;
  onSave: (values: Record<string, any>) => Promise<void>;
}

export default function SettingsPanel({ title = "Settings", fields, values, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, any>>(values);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(form);
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
    setSaving(false);
  };

  return (
    <div className="mt-8 border border-[#f0ead6]/8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 font-body text-xs text-[#f0ead6]/82 hover:text-[#f0ead6]/95 transition-colors"
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        {title}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block font-body text-[13px] tracking-[0.12em] uppercase text-[#f0ead6]/72 mb-1">{f.label}</label>
              {f.type === "textarea" ? (
                <textarea
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  rows={3}
                  className="w-full bg-transparent border border-[#f0ead6]/8 text-[#f0ead6] px-3 py-2 font-body text-xs focus:outline-none focus:border-[#f0ead6]/20 resize-none"
                />
              ) : (
                <input
                  type={f.type || "text"}
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })}
                  placeholder={f.placeholder}
                  className="w-full bg-transparent border border-[#f0ead6]/8 text-[#f0ead6] px-3 py-2 font-body text-xs focus:outline-none focus:border-[#f0ead6]/20"
                />
              )}
              {f.hint && <p className="font-body text-[13px] text-[#f0ead6]/68 mt-1">{f.hint}</p>}
            </div>
          ))}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#f0ead6] text-[#0a0a08] px-4 py-2 font-display text-xs tracking-[0.1em] uppercase font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            Save Settings
          </button>
        </div>
      )}
    </div>
  );
}
