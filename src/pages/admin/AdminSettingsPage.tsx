import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Save, CheckCircle, XCircle } from "lucide-react";
import { useAdminContext } from "./AdminLayout";
import { AGENTS } from "./agentRegistry";

export default function AdminSettingsPage() {
  const { installed } = useAdminContext();
  const [saving, setSaving] = useState(false);
  const [siteForm, setSiteForm] = useState({ site_url: "", brand_name: "", business_description: "", support_email: "" });

  const { data: versions } = useQuery({
    queryKey: ["admin-versions"],
    queryFn: async () => {
      try {
        const c = new AbortController(); setTimeout(() => c.abort(), 5000);
        const res = await fetch("https://lazyunicorn.ai/api/versions", { signal: c.signal });
        return res.ok ? await res.json() : null;
      } catch { return null; }
    },
    staleTime: 300_000,
  });

  const { data: promptVersions = [] } = useQuery({
    queryKey: ["admin-prompt-versions"],
    queryFn: async () => {
      const { data } = await supabase.from("prompt_versions").select("product, version").eq("is_current", true);
      return data || [];
    },
  });

  const [dismissed, setDismissed] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem("lazy-version-dismissed") || "[]"); } catch { return []; } });
  const outdated = versions ? promptVersions.filter(p => { const l = versions[p.product]; return l && l !== p.version && !dismissed.includes(`${p.product}:${l}`); }) : [];
  const dismissAll = () => { const k = outdated.map(p => `${p.product}:${versions[p.product]}`); const n = [...dismissed, ...k]; setDismissed(n); localStorage.setItem("lazy-version-dismissed", JSON.stringify(n)); };

  return (
    <div>
      <h1 className="font-display text-xl font-bold tracking-tight mb-6">Settings</h1>
      {outdated.length > 0 && (
        <div className="border border-[#c8a961]/30 bg-[#c8a961]/5 p-4 flex items-center justify-between mb-6">
          <span className="font-body text-[13px] text-[#c8a961]">Updates available for {outdated.length} agent{outdated.length > 1 ? "s" : ""}</span>
          <button onClick={dismissAll} className="font-body text-[11px] uppercase tracking-wider text-[#f0ead6]/50 hover:text-[#f0ead6]">Dismiss</button>
        </div>
      )}
      <div className="border border-[#f0ead6]/8 p-5 mb-6">
        <h2 className="font-display text-sm font-bold tracking-[0.1em] uppercase text-[#f0ead6]/50 mb-4">Site Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[{key:"site_url",label:"Site URL",ph:"https://yoursite.com"},{key:"brand_name",label:"Brand Name",ph:"Your Brand"},{key:"business_description",label:"Description",ph:"What your business does"},{key:"support_email",label:"Support Email",ph:"support@yoursite.com"}].map(f=>(
            <div key={f.key}><label className="block font-body text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/40 mb-1">{f.label}</label>
            <input type="text" value={(siteForm as any)[f.key]||""} onChange={e=>setSiteForm({...siteForm,[f.key]:e.target.value})} placeholder={f.ph}
              className="w-full bg-transparent border border-[#f0ead6]/8 text-[#f0ead6] px-3 py-2 font-body text-[12px] focus:outline-none focus:border-[#f0ead6]/20"/></div>
          ))}
        </div>
        <button disabled={saving} onClick={async()=>{setSaving(true);const agents=AGENTS.filter(a=>installed.has(a.key));for(const a of agents){try{const u:Record<string,string>={};if(siteForm.site_url)u.site_url=siteForm.site_url;if(siteForm.brand_name)u.brand_name=siteForm.brand_name;if(Object.keys(u).length>0)await(supabase as any).from(a.settingsTable).update(u);}catch{}}toast.success("Settings propagated");setSaving(false);}}
          className="mt-4 inline-flex items-center gap-2 bg-[#f0ead6] text-[#0a0a08] px-4 py-2 font-display text-[11px] tracking-[0.1em] uppercase font-bold hover:opacity-90 disabled:opacity-50">
          {saving?<Loader2 size={12} className="animate-spin"/>:<Save size={12}/>} Propagate to All Agents
        </button>
      </div>
      {promptVersions.length > 0 && (
        <div className="border border-[#f0ead6]/8 p-5">
          <h2 className="font-display text-sm font-bold tracking-[0.1em] uppercase text-[#f0ead6]/50 mb-4">Installed Versions</h2>
          <div className="border border-[#f0ead6]/8 overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-[#f0ead6]/8">{["Agent","Installed","Latest","Status"].map(h=><th key={h} className="px-3 py-2 font-body text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/40 font-normal">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-[#f0ead6]/5">{promptVersions.map(p=>{const l=versions?.[p.product];const ok=!l||l===p.version;return(
                <tr key={p.product} className="hover:bg-[#f0ead6]/3">
                  <td className="px-3 py-2 font-body text-[12px] text-[#f0ead6]/80">{p.product}</td>
                  <td className="px-3 py-2 font-body text-[12px] text-[#f0ead6]/60">{p.version}</td>
                  <td className="px-3 py-2 font-body text-[12px] text-[#f0ead6]/60">{l||"—"}</td>
                  <td className="px-3 py-2">{ok?<span className="inline-flex items-center gap-1 text-emerald-500 text-[10px] uppercase tracking-wider"><CheckCircle size={10}/>Current</span>:<span className="inline-flex items-center gap-1 text-[#c8a961] text-[10px] uppercase tracking-wider"><XCircle size={10}/>Update</span>}</td>
                </tr>);})}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
