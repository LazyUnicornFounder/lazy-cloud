import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";

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
        <Link to="/#directory" className="font-body text-foreground/50 hover:text-foreground text-sm transition-colors">← Back to directory</Link>
      </div>
    );
  }

  const features = (company.features as string[]) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
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

      <Navbar activePage="home" />

      <main className="relative z-10 pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
        <Link
          to="/#directory"
          className="inline-flex items-center gap-1.5 font-body text-[11px] tracking-[0.15em] uppercase text-foreground/40 hover:text-foreground transition-colors mb-8"
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
          <div className="border border-border bg-card px-8 py-10">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {company.logo_url && (
                <img
                  src={company.logo_url}
                  alt={`${company.name} logo`}
                  className="w-20 h-20 object-cover shrink-0 border border-border"
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
                  className="inline-flex items-center gap-1.5 mt-4 font-body text-[11px] tracking-[0.15em] uppercase bg-foreground text-background px-6 py-2.5 font-semibold hover:opacity-90 transition-opacity"
                >
                  Visit website <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>

          {/* Screenshot */}
          {company.screenshot_url && (
            <div className="overflow-hidden border border-border">
              <img
                src={company.screenshot_url}
                alt={`${company.name} screenshot`}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          {company.description && (
            <div className="border border-border bg-card px-8 py-10">
              <h2 className="font-display text-xl font-bold mb-4 text-foreground/80">About</h2>
              <p className="font-body text-foreground/50 leading-relaxed whitespace-pre-line">
                {company.description}
              </p>
            </div>
          )}

          {/* Features */}
          {features.length > 0 && (
            <div className="border border-border bg-card px-8 py-10">
              <h2 className="font-display text-xl font-bold mb-4 text-foreground/80">Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check size={16} className="text-foreground/40 mt-0.5 shrink-0" />
                    <span className="font-body text-foreground/50 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default CompanyDetail;