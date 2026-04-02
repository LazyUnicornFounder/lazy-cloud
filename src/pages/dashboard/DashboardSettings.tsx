import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/hooks/useOrg";
import { toast } from "sonner";
import { Building2, CreditCard, Database, Palette, Key } from "lucide-react";

export default function DashboardSettings() {
  const { org } = useOrg();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (org) {
      setName(org.name);
      setIndustry(org.industry || "");
    }
  }, [org]);

  const handleSave = async () => {
    if (!org) return;
    setSaving(true);
    const { error } = await supabase
      .from("organizations")
      .update({ name, industry: industry || null })
      .eq("id", org.id);
    if (error) toast.error(error.message);
    else toast.success("Settings saved");
    setSaving(false);
  };

  const sections = [
    {
      icon: Building2,
      title: "Company Profile",
      content: (
        <div className="space-y-4">
          <div>
            <Label>Company name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Industry</Label>
            <Input value={industry} onChange={(e) => setIndustry(e.target.value)} />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      ),
    },
    {
      icon: CreditCard,
      title: "Billing",
      content: (
        <div>
          <div className="text-sm mb-2">
            Current plan: <span className="font-semibold capitalize">{org?.plan || "Starter"}</span>
          </div>
          <Button variant="outline" size="sm">Upgrade plan</Button>
        </div>
      ),
    },
    {
      icon: Database,
      title: "Storage Connections",
      content: (
        <div className="text-sm text-muted-foreground">
          Manage your connected storage sources from the Overview page.
        </div>
      ),
    },
    {
      icon: Palette,
      title: "Branding",
      content: (
        <div className="text-sm text-muted-foreground">
          Custom logo and colours for white-label deployments. Available on Professional and Enterprise plans.
        </div>
      ),
    },
    {
      icon: Key,
      title: "API Access",
      content: (
        <div className="text-sm text-muted-foreground">
          API key for programmatic access. Contact support to enable.
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold font-display mb-1">Settings</h1>
      <p className="text-sm text-muted-foreground mb-8">Manage your organisation</p>

      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.title} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <section.icon className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold">{section.title}</h2>
              </div>
              {section.content}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
