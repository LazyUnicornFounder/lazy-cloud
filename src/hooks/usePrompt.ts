import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminWrite } from "@/lib/adminWrite";

export interface PromptVersion {
  id: string;
  product: string;
  version: string;
  prompt_text: string;
  is_current: boolean;
  created_at: string;
}

// Cast to bypass typed client since prompt_versions isn't in generated types yet
const db = supabase as any;

export function useCurrentPrompt(product: string) {
  const [prompt, setPrompt] = useState<PromptVersion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db
      .from("prompt_versions")
      .select("*")
      .eq("product", product)
      .eq("is_current", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }: { data: any }) => {
        if (data) setPrompt(data as PromptVersion);
        setLoading(false);
      });
  }, [product]);

  return { prompt, loading };
}

export function usePromptHistory(product: string) {
  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVersions = async () => {
    setLoading(true);
    const { data } = await db
      .from("prompt_versions")
      .select("*")
      .eq("product", product)
      .order("created_at", { ascending: false });
    if (data) setVersions(data as PromptVersion[]);
    setLoading(false);
  };

  useEffect(() => { fetchVersions(); }, [product]);

  return { versions, loading, refetch: fetchVersions };
}

/** Save a new prompt version and mark all previous versions as not current */
export async function savePromptVersion(product: string, promptText: string, version: string) {
  await adminWrite({
    table: "prompt_versions",
    operation: "update",
    data: { is_current: false },
    match: { product, is_current: true },
  });

  const { error } = await adminWrite({
    table: "prompt_versions",
    operation: "insert",
    data: { product, version, prompt_text: promptText, is_current: true },
  });

  return { error };
}
