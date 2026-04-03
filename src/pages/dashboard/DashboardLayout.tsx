import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Files, Users, Settings, Search, LogOut, Lock, UserCheck
} from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Files", icon: Files, path: "/dashboard/files" },
  { label: "Clients", icon: UserCheck, path: "/dashboard/clients" },
  { label: "Team", icon: Users, path: "/dashboard/team" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export default function DashboardLayout() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [accessChecked, setAccessChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    if (!user) return;

    // Check for pending tier from Google OAuth redirect
    const pendingTier = sessionStorage.getItem("pending_tier");
    const pendingCheckoutId = sessionStorage.getItem("pending_checkout_id");
    if (pendingTier && pendingCheckoutId) {
      sessionStorage.removeItem("pending_tier");
      sessionStorage.removeItem("pending_checkout_id");
      supabase
        .from("profiles")
        .update({ paid_tier: pendingTier, polar_checkout_id: pendingCheckoutId })
        .eq("user_id", user.id)
        .then(() => {
          setHasAccess(true);
          setAccessChecked(true);
        });
      return;
    }

    // Check if user has a paid tier
    supabase
      .from("profiles")
      .select("paid_tier")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        setHasAccess(!!data?.paid_tier);
        setAccessChecked(true);
      });
  }, [user, loading, navigate]);

  if (loading || !accessChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-display mb-2">No active plan</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Purchase a plan to access your dashboard.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => { window.location.href = "/#pricing"; }}>
              View plans
            </Button>
            <Button variant="ghost" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col bg-card shrink-0 hidden md:flex">
        <div className="h-16 border-b border-border flex items-center px-6">
          <Link to="/" className="font-display text-lg font-bold tracking-tight">Lazy Cloud</Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
          <a href="#" target="_blank" rel="noopener noreferrer">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary">
              <Search className="h-4 w-4" />
              Search App ↗
            </div>
          </a>
        </nav>
        <div className="p-4 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
