import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/pages/DashboardPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { UserPlus, Trash2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";

export default function TeamPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) navigate("/login");
      else setUser(session.user);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) { navigate("/login"); return; }
      setUser(session.user);

      const { data: membership } = await supabase.from("org_members").select("org_id").eq("user_id", session.user.id).limit(1).single();
      if (membership) {
        setOrgId(membership.org_id);
        const { data: m } = await supabase.from("org_members").select("*").eq("org_id", membership.org_id);
        setMembers(m || []);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleInvite = async () => {
    if (!inviteEmail || !orgId || !user) return;
    const { error } = await supabase.from("org_invites").insert({
      org_id: orgId,
      email: inviteEmail,
      role: "member",
      invited_by: user.id,
    });
    if (error) toast.error(error.message);
    else {
      toast.success(`Invite sent to ${inviteEmail}`);
      setInviteEmail("");
    }
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-extrabold mb-1">Team</h1>
        <p className="text-muted-foreground mb-8">Manage team members and invitations.</p>

        {/* Invite */}
        <Card className="border border-border mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Invite a team member</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input placeholder="colleague@company.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="flex-1" />
              <Button onClick={handleInvite}><UserPlus className="h-4 w-4 mr-2" /> Invite</Button>
            </div>
          </CardContent>
        </Card>

        {/* Members */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-lg">Members ({members.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-4">
                  <div>
                    <div className="text-sm font-medium">{m.user_id === user.id ? user.email : m.user_id}</div>
                    <div className="text-xs text-muted-foreground capitalize">{m.role}</div>
                  </div>
                  {m.user_id !== user.id && (
                    <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  )}
                </div>
              ))}
              {members.length === 0 && <p className="text-sm text-muted-foreground py-4">No team members yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
