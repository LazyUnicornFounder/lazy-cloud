import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TotalVisitorCount = () => {
  const { data: count } = useQuery({
    queryKey: ["total-visitors"],
    queryFn: async () => {
      const { data } = await supabase
        .from("app_config")
        .select("value")
        .eq("key", "total_visitors")
        .maybeSingle();
      return data?.value ? parseInt(data.value, 10) : null;
    },
    refetchInterval: 60000,
  });

  if (!count) return null;

  return (
    <span className="inline-flex items-center gap-1.5 font-body text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-primary/70">
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      {count.toLocaleString()} visitors
    </span>
  );
};

export default TotalVisitorCount;
