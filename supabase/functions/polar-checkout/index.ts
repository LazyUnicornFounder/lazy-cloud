import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const POLAR_ACCESS_TOKEN = Deno.env.get("POLAR_ACCESS_TOKEN");
    if (!POLAR_ACCESS_TOKEN) {
      throw new Error("POLAR_ACCESS_TOKEN is not configured");
    }

    const { action, submission_id, checkout_id, product_data } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (action === "create_checkout") {
      // First, get or create the Polar product (cached in app_config)
      let productId: string | null = null;
      const { data: config } = await supabase
        .from("app_config")
        .select("value")
        .eq("key", "polar_product_id")
        .maybeSingle();

      if (config?.value) {
        productId = config.value;
      } else {
        // Create the product on Polar
        const productRes = await fetch("https://api.polar.sh/v1/products/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${POLAR_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Paid Listing",
            description:
              "Get a dedicated product page on Lazy Unicorn with rich details, features, and screenshots. $5/month.",
            recurring_interval: "month",
            prices: [
              {
                type: "fixed",
                amount_type: "fixed",
                price_amount: 500,
                price_currency: "usd",
                recurring_interval: "month",
              },
            ],
          }),
        });

        if (!productRes.ok) {
          const err = await productRes.text();
          throw new Error(`Failed to create Polar product: ${err}`);
        }

        const product = await productRes.json();
        productId = product.id;

        // Cache product ID
        await supabase
          .from("app_config")
          .upsert({ key: "polar_product_id", value: productId! });
      }

      // Determine success URL base
      const origin = req.headers.get("origin") || "https://auto-directory-showcase.lovable.app";

      // Create checkout session
      const checkoutRes = await fetch("https://api.polar.sh/v1/checkouts/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${POLAR_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: [productId],
          success_url: `${origin}/checkout/success?checkout_id={CHECKOUT_ID}&submission_id=${submission_id}`,
          metadata: { submission_id },
        }),
      });

      if (!checkoutRes.ok) {
        const err = await checkoutRes.text();
        throw new Error(`Failed to create checkout: ${err}`);
      }

      const checkout = await checkoutRes.json();

      return new Response(
        JSON.stringify({ url: checkout.url }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify_checkout") {
      const checkoutRes = await fetch(
        `https://api.polar.sh/v1/checkouts/${checkout_id}`,
        {
          headers: { Authorization: `Bearer ${POLAR_ACCESS_TOKEN}` },
        }
      );

      if (!checkoutRes.ok) {
        throw new Error("Failed to verify checkout");
      }

      const checkout = await checkoutRes.json();

      if (checkout.status === "succeeded" && submission_id) {
        // Mark submission as paid
        await supabase
          .from("submissions")
          .update({
            is_paid: true,
            polar_customer_id: checkout.customer_id || null,
            polar_subscription_id: checkout.subscription_id || null,
          })
          .eq("slug", submission_id);
      }

      return new Response(
        JSON.stringify({ status: checkout.status, submission_id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "update_listing") {
      // Update submission with rich product data
      if (!submission_id || !product_data) {
        throw new Error("submission_id and product_data are required");
      }

      const { description, features, logo_url, screenshot_url } = product_data;

      await supabase
        .from("submissions")
        .update({
          description: description || null,
          features: features || [],
          logo_url: logo_url || null,
          screenshot_url: screenshot_url || null,
        })
        .eq("slug", submission_id);

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error("Invalid action");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("polar-checkout error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
