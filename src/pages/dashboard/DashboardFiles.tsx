import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/hooks/useOrg";
import { FileText } from "lucide-react";

interface FileRow {
  id: string;
  file_name: string;
  file_type: string | null;
  size_bytes: number;
  status: string;
  created_at: string;
}

export default function DashboardFiles() {
  const { org } = useOrg();
  const [files, setFiles] = useState<FileRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!org) return;
    supabase
      .from("files")
      .select("*")
      .eq("org_id", org.id)
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        setFiles((data as FileRow[]) || []);
        setLoading(false);
      });
  }, [org]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold font-display mb-1">Files</h1>
      <p className="text-sm text-muted-foreground mb-8">Browse your indexed documents</p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : files.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No files indexed yet. Go to Overview to connect your storage.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Size</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{file.file_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{file.file_type || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatBytes(file.size_bytes)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      file.status === "indexed" ? "bg-green-500/10 text-green-400" :
                      file.status === "error" ? "bg-red-500/10 text-red-400" :
                      "bg-yellow-500/10 text-yellow-400"
                    }`}>
                      {file.status}
                    </span>
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
