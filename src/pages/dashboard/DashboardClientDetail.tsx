import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Send, Loader2, User, Mail, Building2, Calendar } from "lucide-react";
import { toast } from "sonner";

interface ClientDetail {
  user_id: string;
  full_name: string | null;
  email: string;
  paid_tier: string;
  polar_checkout_id: string | null;
  company_name: string | null;
  industry: string | null;
  created_at: string;
  last_sign_in: string | null;
  org: { name: string; plan: string; industry: string | null } | null;
}

interface Message {
  id: string;
  subject: string;
  body: string;
  status: string;
  created_at: string;
}

export default function DashboardClientDetail() {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const password = sessionStorage.getItem("admin_pw") || "";

  useEffect(() => {
    if (!clientId) return;

    Promise.all([
      supabase.functions.invoke("admin-clients", {
        body: { password, action: "get_client", client_id: clientId },
      }),
      supabase.functions.invoke("admin-clients", {
        body: { password, action: "list_messages", client_id: clientId },
      }),
    ]).then(([clientRes, messagesRes]) => {
      if (clientRes.data?.client) setClient(clientRes.data.client);
      if (messagesRes.data?.messages) setMessages(messagesRes.data.messages);
      setLoading(false);
    });
  }, [clientId]);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error("Subject and message are required");
      return;
    }
    setSending(true);
    const { data, error } = await supabase.functions.invoke("admin-clients", {
      body: { password, action: "send_email", client_id: clientId, subject, body },
    });
    if (error || data?.error) {
      toast.error(data?.error || "Failed to send message");
    } else {
      toast.success(`Message sent to ${data?.email}`);
      setSubject("");
      setBody("");
      setMessages((prev) => [
        { id: crypto.randomUUID(), subject, body, status: "sent", created_at: new Date().toISOString() },
        ...prev,
      ]);
    }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Client not found.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <Link to="/dashboard/clients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to clients
      </Link>

      {/* Client info */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold font-display mb-1">
                {client.full_name || client.email}
              </h1>
              <Badge variant={client.paid_tier === "professional" ? "default" : "secondary"}>
                {client.paid_tier}
              </Badge>
            </div>
            <span className="text-2xl font-bold font-display text-primary">
              ${client.paid_tier === "professional" ? "999" : "499"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" /> {client.email}
            </div>
            {client.company_name && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" /> {client.company_name}
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" /> Joined {new Date(client.created_at).toLocaleDateString()}
            </div>
            {client.last_sign_in && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" /> Last seen {new Date(client.last_sign_in).toLocaleDateString()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Send message */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="p-6">
          <h2 className="font-semibold mb-4">Send message</h2>
          <div className="space-y-3">
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <Textarea
              placeholder="Write your message..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
            />
            <Button onClick={handleSend} disabled={sending}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              {sending ? "Sending..." : "Send email"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Message history */}
      <h2 className="font-semibold mb-3">Message history</h2>
      {messages.length === 0 ? (
        <p className="text-sm text-muted-foreground">No messages sent yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <Card key={msg.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{msg.subject}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{msg.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
