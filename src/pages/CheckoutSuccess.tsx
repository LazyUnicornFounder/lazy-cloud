import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const checkoutId = searchParams.get("checkout_id");
  const submissionId = searchParams.get("submission_id");
  const [status, setStatus] = useState<"loading" | "succeeded" | "failed">("loading");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!checkoutId || !submissionId) {
      setStatus("failed");
      return;
    }

    const verify = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("polar-checkout", {
          body: { action: "verify_checkout", checkout_id: checkoutId, submission_id: submissionId },
        });
        if (error) throw error;
        setStatus(data.status === "succeeded" ? "succeeded" : "failed");
      } catch {
        setStatus("failed");
      }
    };

    verify();
  }, [checkoutId, submissionId]);

  const handleSave = async () => {
    if (!submissionId) return;
    setSaving(true);
    try {
      await supabase.functions.invoke("polar-checkout", {
        body: {
          action: "update_listing",
          submission_id: submissionId,
          product_data: {
            description,
            features: features.split("\n").map((f) => f.trim()).filter(Boolean),
            logo_url: logoUrl || null,
            screenshot_url: screenshotUrl || null,
          },
        },
      });
      setSaved(true);
    } catch {
      // silent fail
    }
    setSaving(false);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6">
        <XCircle className="text-destructive" size={48} />
        <p className="font-display text-2xl font-bold text-foreground">Payment failed</p>
        <p className="font-body text-muted-foreground text-center max-w-md">
          Something went wrong with your payment. Please try again or contact support.
        </p>
        <Link to="/" className="font-body text-primary hover:underline text-sm mt-4">← Back to directory</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto"
      >
        <div className="text-center mb-10">
          <CheckCircle className="text-primary mx-auto mb-4" size={48} />
          <h1 className="font-display text-3xl font-extrabold">You're listed! 🦄</h1>
          <p className="font-body text-muted-foreground mt-2">
            Now enrich your listing with details to make it stand out.
          </p>
        </div>

        {saved ? (
          <div className="text-center space-y-4">
            <p className="font-body text-lg text-primary font-semibold">Listing updated!</p>
            <Link
              to="/"
              className="inline-block font-body text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-6 py-2.5 font-semibold hover:opacity-90 transition-opacity"
            >
              Back to directory
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell people what your product does, who it's for, and why it's great…"
                rows={4}
                className="w-full font-body text-sm bg-card border border-border rounded-lg px-3 py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-none"
              />
            </div>

            <div>
              <label className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                Features (one per line)
              </label>
              <textarea
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder={"AI-powered automation\n24/7 customer support\nNo-code builder"}
                rows={4}
                className="w-full font-body text-sm bg-card border border-border rounded-lg px-3 py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-none"
              />
            </div>

            <div>
              <label className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                Logo URL
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://yoursite.com/logo.png"
                className="w-full font-body text-sm bg-card border border-border rounded-lg px-3 py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>

            <div>
              <label className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                Screenshot URL
              </label>
              <input
                type="url"
                value={screenshotUrl}
                onChange={(e) => setScreenshotUrl(e.target.value)}
                placeholder="https://yoursite.com/screenshot.png"
                className="w-full font-body text-sm bg-card border border-border rounded-lg px-3 py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-gradient-primary text-primary-foreground font-body font-medium text-sm py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save & Publish Listing"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CheckoutSuccess;
