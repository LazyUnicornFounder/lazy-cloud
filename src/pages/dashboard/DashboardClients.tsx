import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Users, Mail, DollarSign, Loader2 } from "lucide-react";

interface Client {
  user_id: string;
  full_name: string | null;
  email: string;
  paid_tier: string;
  company_name: string | null;
  created_at: string;
  last_sign_in: string | null;
}

export default function DashboardClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const password = sessionStorage.getItem("admin_pw") || "";
    supabase.functions
      .invoke("admin-clients", {
        body: { password, action: "list_clients" },
      })
      .then(({ data, error: fnError }) => {
        if (fnError || data?.error) {
          setError(data?.error || fnError?.message || "Failed to load clients");
        } else {
          setClients(data?.clients || []);
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl">
        <h1 className="text-2xl font-bold font-display mb-4">Clients</h1>
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="p-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    total: clients.length,
    starter: clients.filter((c) => c.paid_tier === "starter").length,
    professional: clients.filter((c) => c.paid_tier === "professional").length,
    revenue:
      clients.reduce(
        (sum, c) => sum + (c.paid_tier === "professional" ? 999 : 499),
        0,
      ),
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display mb-1">Clients</h1>
          <p className="text-sm text-muted-foreground">Manage purchases and communicate with clients</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Clients", value: stats.total, icon: Users },
          { label: "Starter", value: stats.starter, icon: Users },
          { label: "Professional", value: stats.professional, icon: Users },
          { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <stat.icon className="h-4 w-4" />
                <span className="text-xs">{stat.label}</span>
              </div>
              <div className="text-xl font-bold font-display">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Client list */}
      {clients.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center text-muted-foreground text-sm">
            No clients yet. Purchases will appear here.
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {clients.map((client) => (
                <div key={client.user_id} className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">
                        {client.full_name || client.email}
                      </span>
                      <Badge variant={client.paid_tier === "professional" ? "default" : "secondary"} className="text-[10px]">
                        {client.paid_tier}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {client.email}
                      {client.company_name && ` · ${client.company_name}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground hidden md:block">
                      {new Date(client.created_at).toLocaleDateString()}
                    </span>
                    <Link to={`/dashboard/clients/${client.user_id}`}>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4 mr-1" /> Message
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
