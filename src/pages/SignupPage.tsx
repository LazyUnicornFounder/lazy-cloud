import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
