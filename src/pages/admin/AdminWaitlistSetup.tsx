import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";

export default function AdminWaitlistSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    waitlist_name: "Join Our Waitlist",
    launch_date: "",
    referral_enabled: true,
    referral_reward_threshold: 3,
    page_headline: "Something Amazing is Coming",
    page_subheadline: "Join the waitlist and be the first to know.",
    page_cta_text: "Join Waitlist",
    page_accent_color: "#6366f1",
    page_show_counter: true,
    page_show_position: true,
    welcome_email_subject: "You're on the list! 🎉",
    welcome_email_body: "Thanks for joining our waitlist. We'll notify you as soon as we launch.\n\nYour referral link: {{referral_link}}",
    followup_enabled: false,
    followup_delay_days: 3,
    followup_subject: "Still excited? We are too!",
    followup_body: "Just a quick update - we're working hard to launch soon.",
  });

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("waitlist_settings").insert({
        ...form,
        launch_date: form.launch_date || null,
        setup_complete: true,
        is_running: true,
      } as any);

      if (error) throw error;
      toast.success("Waitlist engine configured successfully!");
      navigate("/admin/waitlist");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    { num: 1, title: "Waitlist Config" },
    { num: 2, title: "Page Design" },
    { num: 3, title: "Email Templates" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Setup Lazy Waitlist</h1>
        <p className="text-muted-foreground">Configure your pre-launch email capture engine</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s.num ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s.num ? <Check className="h-4 w-4" /> : s.num}
            </div>
            <span className="text-sm hidden sm:inline">{s.title}</span>
            {i < steps.length - 1 && <div className="h-px w-8 bg-border" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Waitlist Configuration</CardTitle>
            <CardDescription>Basic settings for your waitlist</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Waitlist Name</Label>
              <Input value={form.waitlist_name} onChange={(e) => set("waitlist_name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Launch Date (optional)</Label>
              <Input type="datetime-local" value={form.launch_date} onChange={(e) => set("launch_date", e.target.value)} />
              <p className="text-xs text-muted-foreground">Set a target launch date to display a countdown</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Referral System</Label>
                <p className="text-xs text-muted-foreground">Let subscribers share and move up the list</p>
              </div>
              <Switch checked={form.referral_enabled} onCheckedChange={(v) => set("referral_enabled", v)} />
            </div>
            {form.referral_enabled && (
              <div className="space-y-2">
                <Label>Referrals Needed for Priority</Label>
                <Input type="number" min={1} value={form.referral_reward_threshold} onChange={(e) => set("referral_reward_threshold", parseInt(e.target.value) || 3)} />
                <p className="text-xs text-muted-foreground">How many referrals for priority access</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Page Customization</CardTitle>
            <CardDescription>Design your public waitlist page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input value={form.page_headline} onChange={(e) => set("page_headline", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Subheadline</Label>
              <Textarea value={form.page_subheadline} onChange={(e) => set("page_subheadline", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>CTA Button Text</Label>
              <Input value={form.page_cta_text} onChange={(e) => set("page_cta_text", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Accent Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.page_accent_color} onChange={(e) => set("page_accent_color", e.target.value)} className="h-10 w-16 rounded cursor-pointer" />
                <Input value={form.page_accent_color} onChange={(e) => set("page_accent_color", e.target.value)} className="flex-1" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Show Live Counter</Label>
              <Switch checked={form.page_show_counter} onCheckedChange={(v) => set("page_show_counter", v)} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Show Position After Signup</Label>
              <Switch checked={form.page_show_position} onCheckedChange={(v) => set("page_show_position", v)} />
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>Configure automated emails. Variables: {"{{name}}, {{position}}, {{referral_link}}"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Welcome Email Subject</Label>
              <Input value={form.welcome_email_subject} onChange={(e) => set("welcome_email_subject", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Welcome Email Body</Label>
              <Textarea rows={4} value={form.welcome_email_body} onChange={(e) => set("welcome_email_body", e.target.value)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Follow-up Email</Label>
                <p className="text-xs text-muted-foreground">Send a follow-up after a delay</p>
              </div>
              <Switch checked={form.followup_enabled} onCheckedChange={(v) => set("followup_enabled", v)} />
            </div>
            {form.followup_enabled && (
              <>
                <div className="space-y-2">
                  <Label>Follow-up Delay (days)</Label>
                  <Input type="number" min={1} value={form.followup_delay_days} onChange={(e) => set("followup_delay_days", parseInt(e.target.value) || 3)} />
                </div>
                <div className="space-y-2">
                  <Label>Follow-up Subject</Label>
                  <Input value={form.followup_subject} onChange={(e) => set("followup_subject", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Follow-up Body</Label>
                  <Textarea rows={3} value={form.followup_body} onChange={(e) => set("followup_body", e.target.value)} />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        {step < 3 ? (
          <Button onClick={() => setStep((s) => s + 1)}>
            Next <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Check className="h-4 w-4 mr-1" />}
            Complete Setup
          </Button>
        )}
      </div>
    </div>
  );
}
