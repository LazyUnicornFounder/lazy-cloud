import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";

const db = supabase as any;

interface Release {
  id: string;
  agent_name: string;
  version: string;
  release_date: string;
  change_type: string;
  summary: string;
  changes: string | null;
  upgrade_complexity: string;
  upgrade_instructions: string | null;
  download_url: string | null;
  published: boolean;
}

const EMPTY: Partial<Release> = {
  agent_name: "", version: "", release_date: new Date().toISOString().split("T")[0],
  change_type: "minor", summary: "", changes: "", upgrade_complexity: "drop-in",
  upgrade_instructions: "", download_url: "", published: true,
};

function changeTypeBadge(type: string) {
  const c: Record<string, string> = { major: "bg-[#c8a961]/20 text-[#c8a961]", minor: "bg-blue-500/20 text-blue-400", fix: "bg-emerald-500/20 text-emerald-400", security: "bg-red-500/20 text-red-400" };
  return c[type] || c.minor;
}

function complexityBadge(c: string) {
  const colors: Record<string, string> = { "drop-in": "bg-emerald-500/20 text-emerald-400", "setup-required": "bg-amber-500/20 text-amber-400", "breaking": "bg-red-500/20 text-red-400" };
  return colors[c] || colors["drop-in"];
}

export default function AdminChangelogPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Partial<Release> | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: releases = [] } = useQuery<Release[]>({
    queryKey: ["admin-changelog"],
    queryFn: async () => {
      const { data } = await db.from("prompt_releases").select("*").order("release_date", { ascending: false });
      return (data || []) as Release[];
    },
  });

  const handleSave = async () => {
    if (!editing?.agent_name || !editing?.version || !editing?.summary) {
      toast.error("Fill in required fields");
      return;
    }
    try {
      if (editId) {
        const { error } = await db.from("prompt_releases").update(editing).eq("id", editId);
        if (error) throw error;
        toast.success("Release updated");
      } else {
        const { error } = await db.from("prompt_releases").insert(editing);
        if (error) throw error;
        toast.success("Release added");
      }
      setEditing(null);
      setEditId(null);
      queryClient.invalidateQueries({ queryKey: ["admin-changelog"] });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const togglePublished = async (id: string, current: boolean) => {
    await db.from("prompt_releases").update({ published: !current }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin-changelog"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-lg font-bold tracking-[0.06em] uppercase">Changelog</h1>
        <button
          onClick={() => { setEditing({ ...EMPTY }); setEditId(null); }}
          className="flex items-center gap-1.5 font-body text-[14px] tracking-[0.1em] uppercase text-[#c8a961] hover:text-[#c8a961]/70 transition-colors"
        >
          <Plus size={14} /> Add Release
        </button>
      </div>

      {/* Inline form */}
      {editing && (
        <div className="border border-[#f0ead6]/10 p-4 mb-6 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="font-body text-[13px] tracking-[0.12em] uppercase text-[#f0ead6]/72 block mb-1">Agent name</label>
              <input value={editing.agent_name || ""} onChange={e => setEditing({ ...editing, agent_name: e.target.value })} className="w-full bg-transparent border border-[#f0ead6]/10 text-[#f0ead6] px-2 py-1.5 font-body text-xs focus:outline-none" />
            </div>
            <div>
              <label className="font-body text-[13px] tracking-[0.12em] uppercase text-[#f0ead6]/72 block mb-1">Version</label>
              <input value={editing.version || ""} onChange={e => setEditing({ ...editing, version: e.target.value })} className="w-full bg-transparent border border-[#f0ead6]/10 text-[#f0ead6] px-2 py-1.5 font-body text-xs focus:outline-none" />
            </div>
            <div>
              <label className="font-body text-[13px] tracking-[0.12em] uppercase text-[#f0ead6]/72 block mb-1">Release date</label>
              <input type="date" value={editing.release_date || ""} onChange={e => setEditing({ ...editing, release_date: e.target.value })} className="w-full bg-transparent border border-[#f0ead6]/10 text-[#f0ead6] px-2 py-1.5 font-body text-xs focus:outline-none" />
            </div>
            <div>
              <label className="font-body text-[13px] tracking-[0.12em] uppercase text-[#f0ead6]/72 block mb-1">Change type</label>
              <select value={editing.change_type || "minor"} onChange={e => setEditing({ ...editing, change_type: e.target.value })} className="w-full bg-[#0a0a08] border border-[#f0ead6]/10 text-[#f0ead6] px-2 py-1.5 font-body text-xs focus:outline-none">
                <option value="major">Major</option>
                <option value="minor">Minor</option>
                <option value="fix">Fix</option>
                <option value="security">Security</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-body text-[13px] tracking-[0.12em] uppercase text-[#f0ead6]/72 block mb-1">Upgrade complexity</label>
              <select value={editing.upgrade_complexity || "drop-in"} onChange={e => setEditing({ ...editing, upgrade_complexity: e.target.value })} className="w-full bg-[#0a0a08] border border-[#f0ead6]/10 text-[#f0ead6] px-2 py-1.5 font-body text-xs focus:outline-none">
                <option value="drop-in">Drop-in</option>
                <option value="setup-required">Setup required</option>
                <option value="breaking">Breaking</option>
              </select>
            </div>
            <div>
              <label className="font-body text-[13px] tracking-[0.12em] uppercase text-[#f0ead6]/72 block mb-1">Download URL</label>
              <input value={editing.download_url || ""} onChange={e => setEditing({ ...editing, download_url: e.target.value })} className="w-full bg-transparent border border-[#f0ead6]/10 text-[#f0ead6] px-2 py-1.5 font-body text-xs focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="font-body text-[13px] tracking-[0.12em] uppercase text-[#f0ead6]/72 block mb-1">Summary</label>
            <input value={editing.summary || ""} onChange={e => setEditing({ ...editing, summary: e.target.value })} className="w-full bg-transparent border border-[#f0ead6]/10 text-[#f0ead6] px-2 py-1.5 font-body text-xs focus:outline-none" />
          </div>
          <div>
            <label className="font-body text-[13px] tracking-[0.12em] uppercase text-[#f0ead6]/72 block mb-1">Changes (markdown)</label>
            <textarea value={editing.changes || ""} onChange={e => setEditing({ ...editing, changes: e.target.value })} rows={3} className="w-full bg-transparent border border-[#f0ead6]/10 text-[#f0ead6] px-2 py-1.5 font-body text-xs focus:outline-none resize-y" />
          </div>
          <div>
            <label className="font-body text-[13px] tracking-[0.12em] uppercase text-[#f0ead6]/72 block mb-1">Upgrade instructions (markdown)</label>
            <textarea value={editing.upgrade_instructions || ""} onChange={e => setEditing({ ...editing, upgrade_instructions: e.target.value })} rows={3} className="w-full bg-transparent border border-[#f0ead6]/10 text-[#f0ead6] px-2 py-1.5 font-body text-xs focus:outline-none resize-y" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex items-center gap-1.5 bg-[#f0ead6] text-[#0a0a08] font-display text-[13px] tracking-[0.12em] uppercase font-bold px-4 py-2 hover:opacity-90">
              <Save size={12} /> {editId ? "Update" : "Add"}
            </button>
            <button onClick={() => { setEditing(null); setEditId(null); }} className="flex items-center gap-1.5 border border-[#f0ead6]/10 font-display text-[13px] tracking-[0.12em] uppercase px-4 py-2 text-[#f0ead6]/82 hover:text-[#f0ead6]/95">
              <X size={12} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border border-[#f0ead6]/8 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f0ead6]/8">
              {["Engine", "Version", "Date", "Type", "Complexity", "Summary", "Published", ""].map(h => (
                <th key={h} className="font-body text-[13px] tracking-[0.12em] uppercase text-[#f0ead6]/68 px-3 py-2.5 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {releases.map(r => (
              <tr key={r.id} className="border-b border-[#f0ead6]/15 last:border-0">
                <td className="px-3 py-2 font-body text-[14px] text-[#f0ead6]/92">{r.agent_name}</td>
                <td className="px-3 py-2"><code className="text-[13px] bg-[#f0ead6]/5 px-1 py-0.5 text-[#f0ead6]/88">{r.version}</code></td>
                <td className="px-3 py-2 font-body text-[14px] text-[#f0ead6]/82">{r.release_date}</td>
                <td className="px-3 py-2"><span className={`text-[13px] px-1.5 py-0.5 uppercase tracking-wider ${changeTypeBadge(r.change_type)}`}>{r.change_type}</span></td>
                <td className="px-3 py-2"><span className={`text-[13px] px-1.5 py-0.5 uppercase tracking-wider ${complexityBadge(r.upgrade_complexity)}`}>{r.upgrade_complexity}</span></td>
                <td className="px-3 py-2 font-body text-[14px] text-[#f0ead6]/82 max-w-[200px] truncate">{r.summary}</td>
                <td className="px-3 py-2">
                  <button onClick={() => togglePublished(r.id, r.published)} className={`w-3 h-3 rounded-full ${r.published ? "bg-emerald-500" : "bg-[#f0ead6]/15"}`} />
                </td>
                <td className="px-3 py-2">
                  <button onClick={() => { setEditing(r); setEditId(r.id); }} className="text-[#f0ead6]/68 hover:text-[#f0ead6]/88">
                    <Edit2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
