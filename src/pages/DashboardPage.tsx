import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Cloud, LayoutDashboard, Users, Settings, Search, FileText, LogOut, Upload, HardDrive, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@supabase/supabase-js";

function DashboardLayout({ children, user }: { children: React.ReactNode; user: User }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const links = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { to: "/dashboard/team", icon: Users, label: "Team" },
    { to: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-muted/30 flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <Cloud className="h-6 w-6 text-primary" />
            <span className="font-extrabold text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Lazy Cloud</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === l.to ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-border mt-4">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Search className="h-4 w-4" />
              Search App
            </a>
          </div>
        </nav>
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2 truncate">{user.email}</div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Log Out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [orgName, setOrgName] = useState("");
  const [hasFiles, setHasFiles] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        navigate("/login");
        return;
      }
      setUser(session.user);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/login");
        return;
      }
      setUser(session.user);
      // Load org data
      supabase.from("org_members").select("org_id, organizations(name)").eq("user_id", session.user.id).limit(1).single()
        .then(({ data }) => {
          if (data?.organizations) {
            setOrgName((data.organizations as any).name || "");
          }
        });
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-5xl">
        <h1 className="text-2xl font-extrabold mb-1">Dashboard</h1>
        <p className="text-muted-foreground mb-8">{orgName || "Your organisation"}</p>

        {/* Overview cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Files Indexed", value: "0", icon: FileText },
            { label: "Total Storage", value: "0 GB", icon: HardDrive },
            { label: "Searches This Month", value: "0", icon: Search },
            { label: "Active Users", value: "1", icon: Users },
          ].map((card) => (
            <Card key={card.label} className="border border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{card.label}</span>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-3xl font-extrabold">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Setup wizard (shown when no files) */}
        {!hasFiles && (
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-xl">Get Started</CardTitle>
              <p className="text-sm text-muted-foreground">Connect your file storage to start indexing.</p>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <button className="p-6 border border-border rounded-xl text-center hover:border-primary hover:bg-primary/5 transition-all group">
                  <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  <h3 className="font-semibold mb-1">Upload Files</h3>
                  <p className="text-xs text-muted-foreground">Drag & drop, max 5GB per upload</p>
                </button>
                <button className="p-6 border border-border rounded-xl text-center hover:border-primary hover:bg-primary/5 transition-all group">
                  <FolderOpen className="h-8 w-8 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  <h3 className="font-semibold mb-1">Connect AWS S3</h3>
                  <p className="text-xs text-muted-foreground">Bucket, region, access key</p>
                </button>
                <button className="p-6 border border-border rounded-xl text-center hover:border-primary hover:bg-primary/5 transition-all group">
                  <Cloud className="h-8 w-8 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  <h3 className="font-semibold mb-1">Google Drive</h3>
                  <p className="text-xs text-muted-foreground">Connect via OAuth</p>
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export { DashboardLayout };
