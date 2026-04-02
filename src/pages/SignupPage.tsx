import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

const dataSizes = ["< 10 GB", "10–50 GB", "50–200 GB", "200 GB – 1 TB", "1 TB+"];
const industries = ["Construction", "Legal", "Engineering", "Government", "Corporate", "Healthcare", "Other"];

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") navigate("/"); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);
  const [form, setForm] = useState({
    companyName: "",
    fullName: "",
    email: "",
    password: "",
    dataSize: "",
    industry: "",
  });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.fullName || !form.email || !form.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            company_name: form.companyName,
            data_size: form.dataSize,
            industry: form.industry,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create organization and add user as admin
        const { data: org, error: orgError } = await supabase
          .from("organizations")
          .insert({ name: form.companyName, industry: form.industry || null })
          .select()
          .single();

        if (orgError) throw orgError;

        const { error: memberError } = await supabase
          .from("org_members")
          .insert({ org_id: org.id, user_id: data.user.id, role: "admin" });

        if (memberError) throw memberError;

        // Update profile with extra fields
        await supabase
          .from("profiles")
          .update({
            company_name: form.companyName,
            data_size: form.dataSize,
            industry: form.industry,
          })
          .eq("user_id", data.user.id);

        toast.success("Check your email to verify your account");
        navigate("/login");
      }
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-lg font-bold tracking-tight">
            Lazy Cloud
          </Link>
          <h1 className="text-2xl font-bold font-display mt-6 mb-2">Get Early Access</h1>
          <p className="text-sm text-muted-foreground">Be the first to try Lazy Cloud</p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full mb-6"
          onClick={async () => {
            setGoogleLoading(true);
            try {
              const result = await lovable.auth.signInWithOAuth("google", {
                redirect_uri: window.location.origin,
              });
              if (result.error) {
                toast.error(result.error.message || "Google sign-in failed");
                return;
              }
              if (result.redirected) return;
              navigate("/dashboard");
            } catch (err: any) {
              toast.error(err.message || "Google sign-in failed");
            } finally {
              setGoogleLoading(false);
            }
          }}
          disabled={googleLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {googleLoading ? "Signing in..." : "Continue with Google"}
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <Label htmlFor="companyName">Company name *</Label>
            <Input id="companyName" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="fullName">Full name *</Label>
            <Input id="fullName" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password *</Label>
            <Input id="password" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required minLength={8} />
          </div>
          <div>
            <Label htmlFor="dataSize">How much data?</Label>
            <select
              id="dataSize"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={form.dataSize}
              onChange={(e) => update("dataSize", e.target.value)}
            >
              <option value="">Select...</option>
              {dataSizes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="industry">What industry?</Label>
            <select
              id="industry"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={form.industry}
              onChange={(e) => update("industry", e.target.value)}
            >
              <option value="">Select...</option>
              {industries.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Get Early Access"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
