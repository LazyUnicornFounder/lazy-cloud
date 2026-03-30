import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy, Twitter, Linkedin, Mail, Loader2, CheckCircle2, Users, Clock } from "lucide-react";
import SEO from "@/components/SEO";

interface WaitlistSettings {
  page_headline: string;
  page_subheadline: string;
  page_cta_text: string;
  page_accent_color: string;
  page_show_counter: boolean;
  page_show_position: boolean;
  referral_enabled: boolean;
  referral_reward_threshold: number;
  referral_reward_description: string;
  share_enabled: boolean;
  share_twitter_text: string;
  share_linkedin_text: string;
  launch_date: string | null;
  is_launched: boolean;
}

export default function WaitlistPage() {
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref");

  const [settings, setSettings] = useState<WaitlistSettings | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const [referralCode, setReferralCode] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("waitlist_settings")
        .select("*")
        .single();
      if (data) setSettings(data as unknown as WaitlistSettings);

      const { count } = await supabase
        .from("waitlist_subscribers")
        .select("*", { count: "exact", head: true });
      setTotalCount(count || 0);
    };
    load();

    const interval = setInterval(async () => {
      const { count } = await supabase
        .from("waitlist_subscribers")
        .select("*", { count: "exact", head: true });
      setTotalCount(count || 0);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!settings?.launch_date) return;
    const target = new Date(settings.launch_date).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [settings?.launch_date]);

  const siteUrl = window.location.origin;
  const referralLink = `${siteUrl}/waitlist?ref=${referralCode}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/waitlist-signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            name: name.trim() || null,
            referralCode: refCode || null,
            utmSource: searchParams.get("utm_source"),
            utmMedium: searchParams.get("utm_medium"),
            utmCampaign: searchParams.get("utm_campaign"),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPosition(data.position);
      setReferralCode(data.referralCode);
      setSubmitted(true);

      if (data.alreadyExists) {
        toast.info("Welcome back! You're already on the list.");
      } else {
        toast.success("You're on the waitlist! 🎉");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  const accent = settings?.page_accent_color || "#6366f1";

  if (!settings) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <>
      <SEO
        title="Join the Waitlist"
        description={settings.page_subheadline}
      />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-background relative overflow-hidden">
        {/* Subtle background gradient */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${accent}, transparent 70%)`,
          }}
        />

        <div className="relative z-10 w-full max-w-lg text-center space-y-8">
          {!submitted ? (
            <>
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                  {settings.page_headline}
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  {settings.page_subheadline}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 max-w-sm mx-auto">
                <Input
                  type="email"
                  placeholder="📧 Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-base"
                />
                <Input
                  type="text"
                  placeholder="👤 Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-base"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-base font-bold"
                  style={{ background: accent }}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    settings.page_cta_text
                  )}
                </Button>
              </form>

              {settings.page_show_counter && totalCount > 0 && (
                <p className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="font-semibold text-foreground">{totalCount.toLocaleString()}</span>{" "}
                  people waiting
                </p>
              )}

              {settings.launch_date && (
                <div className="flex items-center justify-center gap-4 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {[
                    { val: countdown.days, label: "days" },
                    { val: countdown.hours, label: "hrs" },
                    { val: countdown.minutes, label: "min" },
                    { val: countdown.seconds, label: "sec" },
                  ].map((t) => (
                    <div key={t.label} className="text-center">
                      <div className="text-2xl font-mono font-bold text-foreground">{t.val}</div>
                      <div className="text-xs text-muted-foreground">{t.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="space-y-3">
                <CheckCircle2 className="h-16 w-16 mx-auto" style={{ color: accent }} />
                <h2 className="text-4xl font-black text-foreground">You're In! 🎉</h2>
                {settings.page_show_position && position && (
                  <p className="text-lg text-muted-foreground">
                    You're <span className="font-bold text-foreground">#{position}</span> on the waitlist
                  </p>
                )}
              </div>

              {settings.referral_enabled && (
                <div className="space-y-4 p-6 rounded-xl border bg-card">
                  <p className="font-semibold text-foreground">Move up the list by sharing:</p>
                  <div className="flex gap-2">
                    <Input
                      value={referralLink}
                      readOnly
                      className="text-sm flex-1"
                    />
                    <Button variant="outline" size="icon" onClick={copyLink}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  {settings.share_enabled && (
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `https://twitter.com/intent/tweet?text=${encodeURIComponent(settings.share_twitter_text)}&url=${encodeURIComponent(referralLink)}`,
                            "_blank"
                          )
                        }
                      >
                        <Twitter className="h-4 w-4 mr-1" /> Twitter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
                            "_blank"
                          )
                        }
                      >
                        <Linkedin className="h-4 w-4 mr-1" /> LinkedIn
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `mailto:?subject=${encodeURIComponent("Join this waitlist!")}&body=${encodeURIComponent(referralLink)}`,
                            "_blank"
                          )
                        }
                      >
                        <Mail className="h-4 w-4 mr-1" /> Email
                      </Button>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Your referrals: 0 / {settings.referral_reward_threshold} for{" "}
                      {settings.referral_reward_description}
                    </p>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: "0%", background: accent }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="relative z-10 mt-16 text-xs text-muted-foreground">
          Powered by{" "}
          <a href="https://lazyunicorn.ai" className="underline hover:text-foreground">
            LazyUnicorn.ai
          </a>
        </div>
      </div>
    </>
  );
}
