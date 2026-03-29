import { supabase } from "@/integrations/supabase/client";

/**
 * Proxy writes to protected tables through the admin-write edge function.
 * Validates ADMIN_PASSWORD server-side before performing the write.
 */
export async function adminWrite({
  table,
  operation,
  data,
  match,
}: {
  table: string;
  operation: "insert" | "update" | "upsert" | "select";
  data?: Record<string, any>;
  match?: Record<string, any>;
}) {
  const password = sessionStorage.getItem("admin_pw") || "";
  const { data: result, error } = await supabase.functions.invoke("admin-write", {
    body: { password, table, operation, data, match },
  });

  if (error) throw new Error(error.message);
  if (result?.error) throw new Error(result.error);
  return { data: result?.data, error: null };
}
