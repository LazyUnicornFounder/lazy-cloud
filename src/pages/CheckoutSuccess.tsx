import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const checkoutId = params.get("checkout_id");
  const tier = params.get("tier");
  const [status, setStatus] = useState<"loading" | "succeeded" | "failed">("loading");

  useEffect(() => {
    if (!checkoutId) {
      setStatus("failed");
      return;
    }

    supabase.functions
      .invoke("polar-checkout", {
        body: { action: "verify_checkout", checkout_id: checkoutId },
      })
      .then(({ data, error }) => {
        if (error || data?.status !== "succeeded") {
          setStatus("failed");
        } else {
          setStatus("succeeded");
        }
      });
  }, [checkoutId]);

  const handleContinue = () => {
    navigate(`/signup?tier=${tier || "starter"}&checkout_id=${checkoutId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-6" />
            <h1 className="text-2xl font-bold font-display mb-2">Verifying payment…</h1>
            <p className="text-muted-foreground text-sm">This will only take a moment.</p>
          </>
        )}
        {status === "succeeded" && (
          <>
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold font-display mb-2">Payment successful!</h1>
            <p className="text-muted-foreground text-sm mb-8">
              Create your account to access the {tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : ""} dashboard.
            </p>
            <Button onClick={handleContinue} className="w-full">
              Create your account
            </Button>
          </>
        )}
        {status === "failed" && (
          <>
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold font-display mb-2">Something went wrong</h1>
            <p className="text-muted-foreground text-sm mb-8">
              We couldn't verify your payment. Please contact support if you were charged.
            </p>
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to homepage
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
