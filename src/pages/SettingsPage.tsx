import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/pages/DashboardPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState<any>(null);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) navigate("/login");
      else setUser(session.user);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) { navigate("/login"); return; }
      setUser(session.user);

      const { data: membership } = await supabase.from("org_members").select("org_id, organizations(*)").eq("user_id", session.user.id).limit(1).single();
      if (membership?.organizations) {
        const o = membership.organizations as any;
        setOrg(o);
        setName(o.name || "");
        setIndustry(o.industry || "");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSave = async () => {
    if (!org) return;
    const { error } = await supabase.from("organizations").update({ name, industry }).eq("id", org.id);
    if (error) toast.error(error.message);
    else toast.success("Settings saved.");
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-extrabold mb-1">Settings</h1>
        <p className="text-muted-foreground mb-8">Manage your organization settings.</p>

        {/* Company profile */}
        <Card className="border border-border mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Company Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Company Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Industry</Label>
              <Input value={industry} onChange={(e) => setIndustry(e.target.value)} />
            </div>
            <Button onClick={handleSave}>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Billing */}
        <Card className="border border-border mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Billing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold capitalize">{org?.plan || "Starter"} Plan</div>
                <div className="text-sm text-muted-foreground">Free trial active</div>
              </div>
              <Button variant="outline">Upgrade</Button>
            </div>
          </CardContent>
        </Card>

        {/* API Key */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-lg">API Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Use the API to integrate Lazy Cloud search into your own applications.</p>
            <div className="flex gap-3">
              <Input value="lc_••••••••••••••••••••" readOnly className="font-mono text-sm" />
              <Button variant="outline">Regenerate</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
