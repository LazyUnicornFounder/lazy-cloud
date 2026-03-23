import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Rocket } from "lucide-react";

const LazySeoSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    site_url: "",
    business_description: "",
    target_keywords: "",
    competitors: "",
    publishing_frequency: "1",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.site_url || !form.business_description || !form.target_keywords) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("seo_settings").insert({
      site_url: form.site_url,
      business_description: form.business_description,
      target_keywords: form.target_keywords,
      competitors: form.competitors,
      publishing_frequency: form.publishing_frequency,
    });
    setLoading(false);
    if (error) {
      toast.error("Failed to save settings: " + error.message);
      return;
    }
    toast.success("Lazy SEO is running. Your first SEO post publishes within 24 hours.");
    navigate("/lazy-seo-dashboard");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Rocket className="w-4 h-4" /> Lazy SEO
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Set Up Lazy SEO</h1>
          <p className="text-muted-foreground">Configure your autonomous SEO engine. It runs silently in the background.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border rounded-xl p-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Site URL</label>
            <Input
              placeholder="https://yoursite.com"
              value={form.site_url}
              onChange={(e) => setForm({ ...form, site_url: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">The full URL of your site.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Business Description</label>
            <Textarea
              placeholder="What does your site do and who is it for?"
              value={form.business_description}
              onChange={(e) => setForm({ ...form, business_description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Target Keywords</label>
            <Textarea
              placeholder="ai tools, solo founder, autonomous business (comma separated)"
              value={form.target_keywords}
              onChange={(e) => setForm({ ...form, target_keywords: e.target.value })}
              rows={2}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Competitors</label>
            <Textarea
              placeholder="https://competitor1.com, https://competitor2.com (comma separated, up to 3)"
              value={form.competitors}
              onChange={(e) => setForm({ ...form, competitors: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Publishing Frequency</label>
            <Select value={form.publishing_frequency} onValueChange={(v) => setForm({ ...form, publishing_frequency: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 post per day</SelectItem>
                <SelectItem value="2">2 posts per day</SelectItem>
                <SelectItem value="4">4 posts per day</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Setting up…" : "Start Lazy SEO"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LazySeoSetup;
