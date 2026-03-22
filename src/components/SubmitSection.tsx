import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const submitSchema = z.object({
  name: z.string().trim().min(1, "Company name is required").max(100, "Name must be under 100 characters"),
  url: z.string().trim().min(1, "URL is required").max(255, "URL must be under 255 characters")
    .transform((val) => {
      if (!/^https?:\/\//i.test(val)) {
        return `https://${val.replace(/^www\./i, "")}`;
      }
      return val;
    })
    .pipe(z.string().url("Please enter a valid URL")),
  tagline: z.string().trim().min(1, "Tagline is required").max(200, "Tagline must be under 200 characters"),
});

type FormData = z.infer<typeof submitSchema>;

const SubmitSection = () => {
  const [form, setForm] = useState<FormData>({ name: "", url: "", tagline: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = submitSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.errors.forEach((err) => {
        const key = err.path[0] as keyof FormData;
        if (!fieldErrors[key]) fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    const slug = result.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const submissionSlug = `${slug}-${Date.now()}`;
    const { error } = await supabase.from("submissions").insert({
      name: result.data.name,
      url: result.data.url,
      tagline: result.data.tagline,
      slug: submissionSlug,
    });
    setLoading(false);
    if (error) {
      setErrors({ name: "Something went wrong. Please try again." });
      return;
    }
    // We can't read back the id due to RLS, so use slug for checkout
    setSubmissionId(submissionSlug);
    setSubmitted(true);
  };

  const handleUpgrade = async () => {
    if (!submissionId) return;
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("polar-checkout", {
        body: { action: "create_checkout", submission_id: submissionId },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch {
      // silent
    }
    setCheckoutLoading(false);
  };

  return (
    <section id="launch" className="relative z-10 px-8 md:px-12 pb-32 scroll-mt-24">
      <div className="max-w-2xl bg-transparent backdrop-blur-3xl rounded-3xl px-8 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-body text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-4"
        >
          Submit
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-[1] text-foreground mb-4"
        >
          Feature your autonomous startup.
        </motion.h2>
        <p className="font-body text-sm text-foreground/50 leading-relaxed mb-8">
          Are you building a startup that helps people build autonomous startups? Get featured in the Directory.
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4 space-y-6"
          >
            <div>
              <p className="font-body text-foreground text-lg font-medium">Thanks for submitting! 🎉</p>
              <p className="font-body text-muted-foreground text-sm mt-1">
                Your startup is under review.
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-left">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-primary" />
                <p className="font-display text-sm font-bold text-foreground">Get a Pro Listing — $5/mo</p>
              </div>
              <p className="font-body text-xs text-muted-foreground leading-relaxed mb-4">
                Unlock your own product page with full description, features list, screenshots, and a "Pro" badge in the directory.
              </p>
              <button
                onClick={handleUpgrade}
                disabled={checkoutLoading}
                className="w-full bg-primary text-primary-foreground font-body font-semibold text-sm py-2.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {checkoutLoading ? "Redirecting to checkout…" : "Upgrade to Pro →"}
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {([
              { key: "name" as const, label: "Company Name", placeholder: "e.g. Naive" },
              { key: "url" as const, label: "Website URL", placeholder: "https://example.com" },
              { key: "tagline" as const, label: "Tagline", placeholder: "What does this company do?" },
            ]).map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                  {label}
                </label>
                <input
                  type="text"
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full font-body text-sm bg-background/40 border border-foreground/10 rounded-lg px-3 py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                />
                {errors[key] && (
                  <p className="font-body text-xs text-destructive mt-1">{errors[key]}</p>
                )}
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-body font-semibold text-sm py-2.5 rounded-full hover:opacity-90 transition-opacity mt-2 disabled:opacity-50"
            >
              {loading ? "Submitting…" : "Submit Company"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default SubmitSection;
