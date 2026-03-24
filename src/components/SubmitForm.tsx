import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { X, Sparkles } from "lucide-react";
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

interface SubmitFormProps {
  open: boolean;
  onClose: () => void;
}

const SubmitForm = ({ open, onClose }: SubmitFormProps) => {
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
      setErrors({ name: "Failed to start checkout. Please try again." });
    }
    setCheckoutLoading(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setForm({ name: "", url: "", tagline: "" });
      setErrors({});
      setSubmitted(false);
      setSubmissionId(null);
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md border border-border bg-card p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-foreground">Submit a Company</h2>
              <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-4 space-y-6">
                <div>
                  <p className="font-body text-foreground text-lg font-medium">Thanks for submitting! 🎉</p>
                  <p className="font-body text-muted-foreground text-sm mt-1">
                    Your startup will appear after review.
                  </p>
                </div>

                <div className="bg-primary/5 border border-primary/20 p-5 text-left">
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
                    className="w-full bg-gradient-primary text-primary-foreground font-body font-medium text-sm py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {checkoutLoading ? "Redirecting to checkout…" : "Upgrade to Pro →"}
                  </button>
                </div>
              </div>
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
                      className="w-full font-body text-sm bg-background border border-border rounded-lg px-3 py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                    {errors[key] && (
                      <p className="font-body text-xs text-destructive mt-1">{errors[key]}</p>
                    )}
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-primary text-primary-foreground font-body font-medium text-sm py-2.5 rounded-lg hover:opacity-90 transition-opacity mt-2 disabled:opacity-50"
                >
                  {loading ? "Submitting…" : "Submit"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubmitForm;
