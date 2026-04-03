import { useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ShieldAlert, Loader2, LayoutDashboard, Users, CreditCard, LogOut, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const ALLOWED_ADMIN_EMAILS = ["f.mardini@gmail.com", "lazy@lazyunicorn.ai"];

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin" },
  { label: "Signups", icon: Users, path: "/admin/signups" },
];

export default function AdminLayout() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  const isAllowed = ALLOWED_ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "");

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-sm space-y-4">
          <ShieldAlert className="h-10 w-10 text-destructive mx-auto" />
          <h1 className="text-xl font-bold font-display">Access denied</h1>
          <p className="text-sm text-muted-foreground">
            This area is restricted. You don't have permission to access the admin panel.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/")}>Go home</Button>
            <Button variant="ghost" onClick={signOut}>Sign out</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-56 border-r border-border flex flex-col bg-card shrink-0 hidden md:flex">
        <div className="h-16 border-b border-border flex items-center px-5">
          <Link to="/admin" className="font-display text-base font-bold tracking-tight">Admin</Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
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
          <Link to="/">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary">
              <Globe className="h-4 w-4" />
              View site ↗
            </div>
          </Link>
        </nav>
        <div className="p-3 border-t border-border">
          <p className="text-xs text-muted-foreground px-3 mb-2 truncate">{user.email}</p>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
