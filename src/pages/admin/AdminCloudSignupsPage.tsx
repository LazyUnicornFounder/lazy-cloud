import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Cloud, Mail } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Signup {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
}

export default function AdminCloudSignupsPage() {
  const { data: signups = [], isLoading } = useQuery({
    queryKey: ["admin-cloud-signups"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("early_access")
        .select("id, email, source, created_at")
        .like("source", "lazy-cloud%")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Signup[];
    },
    refetchInterval: 30_000,
  });

  const planCounts = signups.reduce<Record<string, number>>((acc, s) => {
    const plan = s.source?.replace("lazy-cloud-", "") || "unknown";
    acc[plan] = (acc[plan] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Cloud size={18} className="text-[#c8a961]" />
        <h1 className="font-display text-lg font-bold tracking-[0.08em] uppercase text-[#f0ead6]">
          Lazy Cloud Signups
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border border-[#f0ead6]/10 mb-8">
        <div className="p-4 border-r border-b sm:border-b-0 border-[#f0ead6]/10">
          <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/40 mb-1">Total</p>
          <p className="font-display text-2xl font-bold text-[#f0ead6]">{signups.length}</p>
        </div>
        {Object.entries(planCounts).map(([plan, count]) => (
          <div key={plan} className="p-4 border-r last:border-r-0 border-[#f0ead6]/10">
            <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/40 mb-1 capitalize">{plan}</p>
            <p className="font-display text-2xl font-bold text-[#f0ead6]">{count}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={18} className="animate-spin text-[#f0ead6]/30" />
        </div>
      ) : signups.length === 0 ? (
        <p className="font-body text-sm text-[#f0ead6]/40 text-center py-16">No Lazy Cloud signups yet.</p>
      ) : (
        <div className="border border-[#f0ead6]/10 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#f0ead6]/10">
                <th className="px-4 py-3 font-body text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/40">Email</th>
                <th className="px-4 py-3 font-body text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/40">Plan</th>
                <th className="px-4 py-3 font-body text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/40 text-right">Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {signups.map((s) => (
                <tr key={s.id} className="border-b border-[#f0ead6]/5 last:border-b-0 hover:bg-[#f0ead6]/3 transition-colors">
                  <td className="px-4 py-3 font-body text-sm text-[#f0ead6]/80 flex items-center gap-2">
                    <Mail size={12} className="text-[#f0ead6]/30 shrink-0" />
                    {s.email}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-body text-[11px] tracking-[0.1em] uppercase px-2 py-0.5 border border-[#c8a961]/30 text-[#c8a961] capitalize">
                      {s.source?.replace("lazy-cloud-", "") || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-body text-xs text-[#f0ead6]/40 text-right whitespace-nowrap">
                    {formatDistanceToNow(new Date(s.created_at), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
