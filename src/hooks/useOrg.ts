import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface Org {
  id: string;
  name: string;
  industry: string | null;
  logo_url: string | null;
  plan: string;
}

export function useOrg() {
  const { user } = useAuth();
  const [org, setOrg] = useState<Org | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrg(null);
      setLoading(false);
      return;
    }

    const fetchOrg = async () => {
      const { data: membership } = await supabase
        .from("org_members")
        .select("org_id")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (membership) {
        const { data: orgData } = await supabase
          .from("organizations")
          .select("*")
          .eq("id", membership.org_id)
          .single();
        setOrg(orgData);
      }
      setLoading(false);
    };

    fetchOrg();
  }, [user]);

  return { org, loading };
}
