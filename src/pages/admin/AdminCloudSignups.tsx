import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Cloud, Users, TrendingUp } from "lucide-react";

export default function AdminCloudSignups() {
  const { data: signups, isLoading } = useQuery({
    queryKey: ["admin-cloud-signups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("early_access")
        .select("*")
        .order("created_at", { ascending: false });
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

  const planColors: Record<string, string> = {
    starter: "#4ade80",
    growth: "#c9a84c",
    agency: "#a78bfa",
  };

  return (
    <div>
      <h1 className="text-[22px] font-bold mb-1" style={{ color: "#f0ead6" }}>
        <Cloud size={20} className="inline mr-2 mb-0.5" />
        Lazy Cloud Signups
      </h1>
      <p className="mb-6" style={{ fontSize: 13, color: "rgba(240,234,214,0.4)" }}>
        People who signed up for Lazy Cloud from the marketing page.
      </p>

      {/* Stats row */}
      <div className="flex gap-4 mb-8">
        {[
          { label: "Total Cloud", value: cloudSignups.length, icon: Users },
          { label: "All Early Access", value: allSignups.length, icon: TrendingUp },
          ...Object.entries(byPlan).map(([plan, list]) => ({
            label: plan.charAt(0).toUpperCase() + plan.slice(1),
            value: list.length,
            icon: Cloud,
            color: planColors[plan],
          })),
        ].map((stat, i) => (
          <div key={i} className="px-4 py-3 rounded-lg" style={{ background: "rgba(240,234,214,0.04)", border: "1px solid rgba(240,234,214,0.08)", minWidth: 120 }}>
            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(240,234,214,0.4)" }}>{stat.label}</div>
            <div className="text-[22px] font-bold" style={{ color: ("color" in stat && stat.color) || "#f0ead6" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(240,234,214,0.08)" }}>
        <div className="flex py-2.5 px-4" style={{ borderBottom: "1px solid rgba(240,234,214,0.1)", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(240,234,214,0.3)" }}>
          <div style={{ flex: 2 }}>Email</div>
          <div style={{ flex: 1 }}>Plan</div>
          <div style={{ flex: 1 }}>Date</div>
        </div>

        {isLoading ? (
          <div className="p-6 text-center" style={{ color: "rgba(240,234,214,0.4)", fontSize: 13 }}>Loading…</div>
        ) : cloudSignups.length === 0 ? (
          <div className="p-6 text-center" style={{ color: "rgba(240,234,214,0.35)", fontSize: 13 }}>
            No cloud signups yet. They'll appear here when people sign up from <span style={{ color: "#c9a84c" }}>/lazy-cloud</span>.
          </div>
        ) : (
          cloudSignups.map((s) => {
            const plan = s.source?.replace("lazy-cloud-", "") ?? "unknown";
            return (
              <div key={s.id} className="flex items-center py-2.5 px-4" style={{ borderBottom: "1px solid rgba(240,234,214,0.04)", fontSize: 13 }}>
                <div style={{ flex: 2, color: "#f0ead6" }}>{s.email}</div>
                <div style={{ flex: 1 }}>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                    style={{ background: `${planColors[plan] ?? "#f0ead6"}20`, color: planColors[plan] ?? "rgba(240,234,214,0.5)" }}>
                    {plan}
                  </span>
                </div>
                <div style={{ flex: 1, color: "rgba(240,234,214,0.4)" }}>
                  {format(new Date(s.created_at), "MMM d, yyyy")}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
