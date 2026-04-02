import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ companyName: "", fullName: "", email: "", password: "", dataSize: "", industry: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.fullName || !form.email || !form.password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.fullName },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;

      if (data.user) {
        // Create organization
        const { data: org, error: orgErr } = await supabase.from("organizations").insert({
          name: form.companyName,
          industry: form.industry || null,
        }).select().single();
        if (orgErr) throw orgErr;

        // Add user as admin member
        await supabase.from("org_members").insert({
          org_id: org.id,
          user_id: data.user.id,
          role: "admin",
        });
      }

      toast.success("Check your email to confirm your account.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <Cloud className="h-7 w-7 text-primary" />
            <span className="text-xl font-extrabold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Lazy Cloud</span>
          </Link>
          <h1 className="text-3xl font-extrabold mb-2">Start your free trial</h1>
          <p className="text-muted-foreground mb-8">No credit card required. Set up in minutes.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="companyName">Company name *</Label>
              <Input id="companyName" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} placeholder="Acme Corp" />
            </div>
            <div>
              <Label htmlFor="fullName">Full name *</Label>
              <Input id="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="John Smith" />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@acme.com" />
            </div>
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" />
            </div>
            <div>
              <Label>How much data?</Label>
              <Select onValueChange={(v) => setForm({ ...form, dataSize: v })}>
                <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="<10GB">&lt;10GB</SelectItem>
                  <SelectItem value="10-50GB">10–50GB</SelectItem>
                  <SelectItem value="50-200GB">50–200GB</SelectItem>
                  <SelectItem value="200GB-1TB">200GB–1TB</SelectItem>
                  <SelectItem value="1TB+">1TB+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Industry</Label>
              <Select onValueChange={(v) => setForm({ ...form, industry: v })}>
                <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                <SelectContent>
                  {["Construction", "Legal", "Engineering", "Government", "Corporate", "Healthcare", "Other"].map((i) => (
                    <SelectItem key={i} value={i.toLowerCase()}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
              {loading ? "Creating account..." : "Start Free Trial"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-6 text-center">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>

      {/* Right — branding panel */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground">
          <h2 className="text-3xl font-extrabold mb-4">25 years of documents. One search.</h2>
          <p className="text-lg opacity-80 leading-relaxed">
            Upload your files, we index everything, and your team can search across your entire archive in seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
