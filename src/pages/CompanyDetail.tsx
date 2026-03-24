import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import BlogTicker from "@/components/BlogTicker";
import unicornBg from "@/assets/unicorn-beach.png";
import ProductPromoBanner from "@/components/ProductPromoBanner";

const CompanyDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: company, isLoading } = useQuery({
    queryKey: ["company", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("slug", slug)
        .eq("is_paid", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="font-display text-2xl font-bold text-foreground">Company not found</p>
        <Link to="/" className="font-body text-primary hover:underline text-sm">← Back to directory</Link>
      </div>
    );
  }

  const features = (company.features as string[]) || [];

  return (
    <div className="min-h-screen text-foreground relative">
      <SEO
        title={`${company.name} — AI Tool for Autonomous Startups`}
        description={company.description || company.tagline}
        url={`/company/${company.slug}`}
        keywords={`${company.name}, autonomous startup tools, AI business tools, Lazy Unicorn directory`}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Directory", url: "/#directory" },
          { name: company.name, url: `/company/${company.slug}` },
        ]}
      />

      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src={unicornBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BlogTicker />
      </div>

      <Navbar activePage="home" />

      <main className="relative z-10 pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
        <Link
          to="/#directory"
          className="inline-flex items-center gap-1.5 font-body text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to directory
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="bg-transparent backdrop-blur-xl rounded-3xl px-8 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {company.logo_url && (
                <img
                  src={company.logo_url}
                  alt={`${company.name} logo`}
                  className="w-20 h-20 rounded-2xl object-cover border border-primary/20 shrink-0"
                />
              )}
              <div className="flex-1">
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                  {company.name}
                </h1>
                <p className="font-body text-lg text-foreground/50 mt-2">
                  {company.tagline}
                </p>
                <a
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 font-body text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
                >
                  Visit website <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>

          {/* Screenshot */}
          {company.screenshot_url && (
            <div className="rounded-3xl overflow-hidden border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]">
              <img
                src={company.screenshot_url}
                alt={`${company.name} screenshot`}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          {company.description && (
            <div className="bg-transparent backdrop-blur-xl rounded-3xl px-8 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]">
              <h2 className="font-display text-xl font-bold mb-4 text-foreground/80">About</h2>
              <p className="font-body text-foreground/70 leading-relaxed whitespace-pre-line">
                {company.description}
              </p>
            </div>
          )}

          {/* Features */}
          {features.length > 0 && (
            <div className="bg-transparent backdrop-blur-xl rounded-3xl px-8 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]">
              <h2 className="font-display text-xl font-bold mb-4 text-foreground/80">Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check size={16} className="text-primary mt-0.5 shrink-0" />
                    <span className="font-body text-foreground/70 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* Product Promo */}
        <div className="mt-10">
          <ProductPromoBanner />
        </div>
      </main>
    </div>
  );
};

export default CompanyDetail;
