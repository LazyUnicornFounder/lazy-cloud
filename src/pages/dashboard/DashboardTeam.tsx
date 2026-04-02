import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useOrg } from "@/hooks/useOrg";
import { toast } from "sonner";
import { UserPlus, Trash2 } from "lucide-react";

interface Member {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

interface Invite {
  id: string;
  email: string;
  role: string;
  accepted: boolean;
}

export default function DashboardTeam() {
  const { user } = useAuth();
  const { org } = useOrg();
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!org) return;
    const [membersRes, invitesRes] = await Promise.all([
      supabase.from("org_members").select("*").eq("org_id", org.id),
      supabase.from("org_invites").select("*").eq("org_id", org.id).eq("accepted", false),
    ]);
    setMembers((membersRes.data as Member[]) || []);
    setInvites((invitesRes.data as Invite[]) || []);
  };

  useEffect(() => { fetchData(); }, [org]);

  const handleInvite = async () => {
    if (!inviteEmail || !org || !user) return;
    setLoading(true);
    const { error } = await supabase.from("org_invites").insert({
      org_id: org.id,
      email: inviteEmail,
      role: "member",
      invited_by: user.id,
    });
    if (error) toast.error(error.message);
    else {
      toast.success(`Invite sent to ${inviteEmail}`);
      setInviteEmail("");
      fetchData();
    }
    setLoading(false);
  };

  const handleRemoveMember = async (memberId: string) => {
    const { error } = await supabase.from("org_members").delete().eq("id", memberId);
    if (error) toast.error(error.message);
    else { toast.success("Member removed"); fetchData(); }
  };

  const handleDeleteInvite = async (inviteId: string) => {
    const { error } = await supabase.from("org_invites").delete().eq("id", inviteId);
    if (error) toast.error(error.message);
    else { toast.success("Invite cancelled"); fetchData(); }
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold font-display mb-1">Team</h1>
      <p className="text-sm text-muted-foreground mb-8">Manage your organisation's members</p>

      {/* Invite */}
      <Card className="bg-card border-border mb-8">
        <CardContent className="p-6">
          <h2 className="font-semibold mb-4">Invite a team member</h2>
          <div className="flex gap-3">
            <Input
              placeholder="email@company.com"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleInvite} disabled={loading || !inviteEmail}>
              <UserPlus className="h-4 w-4 mr-2" /> Invite
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members */}
      <h2 className="font-semibold mb-3">Members ({members.length})</h2>
      <div className="border border-border rounded-lg overflow-hidden mb-8">
        {members.map((m) => (
          <div key={m.id} className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0">
            <div>
              <div className="text-sm">{m.user_id === user?.id ? "You" : m.user_id.slice(0, 8) + "…"}</div>
              <div className="text-xs text-muted-foreground capitalize">{m.role}</div>
            </div>
            {m.user_id !== user?.id && (
              <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(m.id)}>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Pending invites */}
      {invites.length > 0 && (
        <>
          <h2 className="font-semibold mb-3">Pending invites</h2>
          <div className="border border-border rounded-lg overflow-hidden">
            {invites.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0">
                <div className="text-sm">{inv.email}</div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteInvite(inv.id)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
