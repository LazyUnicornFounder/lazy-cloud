import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Cloud, Users, TrendingUp } from "lucide-react";

export default function AdminCloudSignups() {
  const { data: signups, isLoading } = useQuery({
    queryKey: ["admin-cloud-signups"],
    queryFn: async () => {
      const { data, error } = await supabase.from("early_access").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const cloudSignups = signups?.filter((s) => s.source?.startsWith("lazy-cloud")) ?? [];
  const allSignups = signups ?? [];

  const byPlan: Record<string, typeof allSignups> = {};
  for (const s of cloudSignups) {
    const plan = s.source?.replace("lazy-cloud-", "") ?? "unknown";
    if (!byPlan[plan]) byPlan[plan] = [];
    byPlan[plan].push(s);
  }

  const planColors: Record<string, string> = { starter: "var(--admin-success)", growth: "var(--admin-accent)", agency: "#8b5cf6" };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: "var(--admin-text)" }}>
        <Cloud size={18} className="inline mr-2 mb-0.5" />Cloud Signups
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--admin-text-tertiary)" }}>People who signed up from the marketing page.</p>

      <div className="flex gap-3 mb-8 flex-wrap">
        {[
          { label: "Total Cloud", value: cloudSignups.length },
          { label: "All Early Access", value: allSignups.length },
          ...Object.entries(byPlan).map(([plan, list]) => ({ label: plan.charAt(0).toUpperCase() + plan.slice(1), value: list.length, color: planColors[plan] })),
        ].map((stat, i) => (
          <div key={i} className="px-4 py-3 rounded-lg min-w-[120px]" style={{ background: "var(--admin-bg-elevated)", border: "1px solid var(--admin-border)" }}>
            <div className="text-xs mb-1" style={{ color: "var(--admin-text-tertiary)" }}>{stat.label}</div>
            <div className="text-xl font-semibold tabular-nums" style={{ color: ("color" in stat && stat.color) || "var(--admin-text)" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--admin-border)" }}>
        <div className="grid grid-cols-[1fr_120px_120px] py-2.5 px-4 text-[11px] font-medium uppercase tracking-wider" style={{ borderBottom: "1px solid var(--admin-border-strong)", color: "var(--admin-text-tertiary)" }}>
          <div>Email</div><div>Plan</div><div>Date</div>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-sm" style={{ color: "var(--admin-text-tertiary)" }}>Loading…</div>
        ) : cloudSignups.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "var(--admin-text-tertiary)" }}>No cloud signups yet.</div>
        ) : (
          cloudSignups.map((s) => {
            const plan = s.source?.replace("lazy-cloud-", "") ?? "unknown";
            return (
              <div key={s.id} className="grid grid-cols-[1fr_120px_120px] items-center py-2.5 px-4 text-sm" style={{ borderBottom: "1px solid var(--admin-border)" }}>
                <div style={{ color: "var(--admin-text)" }}>{s.email}</div>
                <div><span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: `${planColors[plan] ?? "var(--admin-text)"}15`, color: planColors[plan] ?? "var(--admin-text-secondary)" }}>{plan}</span></div>
                <div style={{ color: "var(--admin-text-tertiary)" }}>{format(new Date(s.created_at), "MMM d, yyyy")}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
