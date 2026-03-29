import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { adminWrite } from "@/lib/adminWrite";

const meetingTypeOptions = [
  { value: "all", label: "All meetings" },
  { value: "customer-discovery", label: "Customer discovery calls" },
  { value: "planning", label: "Planning sessions" },
  { value: "product-review", label: "Product reviews" },
  { value: "standup", label: "Standups" },
  { value: "1on1", label: "1-on-1s" },
  { value: "pitch", label: "Pitch meetings" },
  { value: "other", label: "Other" },
];

export default function LazyGranolaSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    brand_name: "",
    site_url: "",
    meeting_types: ["all"] as string[],
    publish_blog_posts: true,
    create_linear_issues: true,
    send_slack_summary: true,
    publish_product_updates: true,
    feed_customer_intelligence: true,
    weekly_digest_enabled: true,
    weekly_digest_day: "monday",
    slack_webhook_url: "",
  });

  const toggleMeetingType = (val: string) => {
    if (val === "all") {
      setForm((p) => ({ ...p, meeting_types: p.meeting_types.includes("all") ? [] : ["all"] }));
    } else {
      setForm((p) => {
        const types = p.meeting_types.filter((t) => t !== "all");
        return { ...p, meeting_types: types.includes(val) ? types.filter((t) => t !== val) : [...types, val] };
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.brand_name || !form.site_url) {
      toast.error("Please fill in brand name and site URL.");
      return;
    }
    setLoading(true);
    try {
      const meetingTypes = form.meeting_types.length === 0 ? "all" : form.meeting_types.join(",");
      const { error } = await adminWrite({ table: "granola_settings", operation: "insert", data: {
        brand_name: form.brand_name,
        site_url: form.site_url,
        meeting_types_to_process: meetingTypes,
        publish_blog_posts: form.publish_blog_posts,
        create_linear_issues: form.create_linear_issues,
        send_slack_summary: form.send_slack_summary,
        publish_product_updates: form.publish_product_updates,
        feed_customer_intelligence: form.feed_customer_intelligence,
        weekly_digest_enabled: form.weekly_digest_enabled,
        weekly_digest_day: form.weekly_digest_day,
        slack_webhook_url: form.slack_webhook_url || null,
        setup_complete: true,
        is_running: true,
        prompt_version: "v0.0.1",
      } }).catch((e: any) => ({ data: null, error: e }));
      if (error) throw error;

      // Trigger initial sync
      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/granola-sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        });
      } catch {
        // Non-blocking
      }

      toast.success("Lazy Granola is connected. Recent meetings are being processed.");
      navigate("/admin");
    } catch (err: any) {
      toast.error(err.message || "Setup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Setup — Lazy Granola" description="Connect Granola to the Lazy Stack." />
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 px-6" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: "#f0ead6", lineHeight: 1.15 }}
              className="mb-4"
            >
              Connect Granola
            </h1>
            <p className="font-body text-foreground/60 text-[15px] leading-relaxed mb-6">
              Every meeting you have is a blog post, a product update, a set of Linear issues, and a customer insight sitting unwritten. Lazy Granola writes all of it automatically — the moment your meeting ends.
            </p>

            <div className="border border-primary/30 bg-primary/5 p-4 mb-8">
              <p className="font-body text-foreground/70 text-[13px] leading-relaxed">
                <strong>Prerequisites:</strong> Before setup you must connect Granola in your Lovable project. Go to Settings → Connectors → Personal connectors → Granola and click Connect. Sign in with your Granola account. Once connected come back here to complete setup.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Brand name */}
              <div>
                <label className="font-display text-[12px] tracking-[0.15em] uppercase font-bold text-foreground/70 block mb-2">Brand name</label>
                <input type="text" value={form.brand_name} onChange={(e) => setForm((p) => ({ ...p, brand_name: e.target.value }))}
                  className="w-full bg-transparent border border-border text-foreground px-4 py-3 font-body text-sm focus:outline-none focus:border-foreground/30" />
              </div>

              {/* Site URL */}
              <div>
                <label className="font-display text-[12px] tracking-[0.15em] uppercase font-bold text-foreground/70 block mb-2">Site URL</label>
                <input type="url" value={form.site_url} onChange={(e) => setForm((p) => ({ ...p, site_url: e.target.value }))} placeholder="https://"
                  className="w-full bg-transparent border border-border text-foreground px-4 py-3 font-body text-sm focus:outline-none focus:border-foreground/30" />
              </div>

              {/* Meeting types */}
              <div>
                <label className="font-display text-[12px] tracking-[0.15em] uppercase font-bold text-foreground/70 block mb-3">Meeting types to process</label>
                <div className="grid grid-cols-2 gap-2">
                  {meetingTypeOptions.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer font-body text-[13px] text-foreground/70">
                      <input type="checkbox" checked={form.meeting_types.includes(opt.value)} onChange={() => toggleMeetingType(opt.value)}
                        className="accent-primary" />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              {[
                { key: "publish_blog_posts", label: "Publish blog posts from meetings", desc: "Planning sessions and product reviews become build-in-public posts." },
                { key: "create_linear_issues", label: "Create Linear issues from action items", desc: "Requires Lazy Linear to be installed." },
                { key: "send_slack_summary", label: "Send Slack summary after each meeting", desc: "Requires a Slack webhook URL below." },
                { key: "publish_product_updates", label: "Publish product updates from sprint/planning meetings" },
                { key: "feed_customer_intelligence", label: "Feed customer intelligence to content agents" },
                { key: "weekly_digest_enabled", label: "Weekly digest", desc: "Publishes a summary of the week's meetings." },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-start gap-3">
                  <input type="checkbox" checked={(form as any)[key]} onChange={() => setForm((p) => ({ ...p, [key]: !(p as any)[key] }))}
                    className="accent-primary mt-1" />
                  <div>
                    <span className="font-body text-foreground/80 text-[14px]">{label}</span>
                    {desc && <p className="font-body text-foreground/40 text-[12px]">{desc}</p>}
                  </div>
                </div>
              ))}

              {/* Weekly digest day */}
              {form.weekly_digest_enabled && (
                <div>
                  <label className="font-display text-[12px] tracking-[0.15em] uppercase font-bold text-foreground/70 block mb-2">Weekly digest day</label>
                  <select value={form.weekly_digest_day} onChange={(e) => setForm((p) => ({ ...p, weekly_digest_day: e.target.value }))}
                    className="bg-transparent border border-border text-foreground px-4 py-3 font-body text-sm focus:outline-none focus:border-foreground/30">
                    <option value="monday">Monday</option>
                    <option value="friday">Friday</option>
                  </select>
                </div>
              )}

              {/* Slack webhook */}
              {form.send_slack_summary && (
                <div>
                  <label className="font-display text-[12px] tracking-[0.15em] uppercase font-bold text-foreground/70 block mb-2">Slack webhook URL</label>
                  <input type="url" value={form.slack_webhook_url} onChange={(e) => setForm((p) => ({ ...p, slack_webhook_url: e.target.value }))} placeholder="https://hooks.slack.com/..."
                    className="w-full bg-transparent border border-border text-foreground px-4 py-3 font-body text-sm focus:outline-none focus:border-foreground/30" />
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-primary text-primary-foreground font-display text-[13px] tracking-[0.15em] uppercase font-bold py-4 hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading ? "Syncing your recent meetings from Granola..." : "Connect Granola"}
              </button>
            </form>
          </motion.div>
        </div>
      </main>
    </>
  );
}
