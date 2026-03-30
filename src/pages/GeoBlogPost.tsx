import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import SEO from "@/components/SEO";
import { ArrowLeft } from "lucide-react";
import ProductPromoBanner from "@/components/ProductPromoBanner";

const GeoBlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase.from("geo_posts").select("*").eq("slug", slug).eq("status", "published").single();
      if (data) setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (!post) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Post not found.</div>;

  const renderMarkdown = (md: string) => {
    return md
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-8 mb-3">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
      .replace(/^/, '<p class="mb-4 leading-relaxed">')
      .concat('</p>');
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SEO title={`${post.title} | LazyUnicorn.ai`} description={post.excerpt || post.title} />
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <Link to="/geo" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to AI Answers
        </Link>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {post.target_query && <Badge variant="secondary">{post.target_query}</Badge>}
            <span>{format(new Date(post.published_at), "MMMM d, yyyy")}</span>
          </div>
        </div>
        <article className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
        <div className="border-t border-border pt-6 mt-8 text-sm text-muted-foreground">
          🦄 Optimised by{" "}
          <a href="https://lazyunicorn.ai/lazy-geo" className="text-primary underline hover:text-primary/80">Lazy GEO</a>
          {" "}— autonomous GEO for Lovable sites. Discover more at{" "}
          <a href="https://lazyunicorn.ai" className="text-primary underline hover:text-primary/80">LazyUnicorn.ai</a>
        </div>

        <div className="mt-16 pt-8 border-t border-border space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            <a href="https://lazyunicorn.ai" className="text-primary underline hover:text-primary/80 font-semibold">LazyUnicorn</a> builds autonomous growth tools for{" "}
            <a href="https://lovable.dev" className="text-primary underline hover:text-primary/80">Lovable</a>. Drop a prompt into your existing Lovable project and your site starts publishing, ranking, and compounding — without you touching anything after setup.
          </p>
          <p>
            <a href="https://lazyunicorn.ai/lazy-blogger" className="text-primary underline hover:text-primary/80">Lazy Blogger</a> publishes SEO and GEO-optimized blog posts continuously.{" "}
            <a href="https://lazyunicorn.ai/lazy-seo" className="text-primary underline hover:text-primary/80">Lazy SEO</a> discovers the keywords your site should rank for and writes the articles to capture them.{" "}
            <a href="https://lazyunicorn.ai/lazy-geo" className="text-primary underline hover:text-primary/80">Lazy GEO</a> publishes content structured to be cited by ChatGPT, Claude, and Perplexity when people ask questions in your niche. All three run as edge functions inside your existing Lovable project, on your existing Supabase database, at your existing domain.
          </p>
          <p className="font-medium text-foreground">
            One prompt installs everything. Your site grows while you build.
          </p>
        </div>

        <div className="mt-10">
          <ProductPromoBanner excludeProduct="geo" glass={false} />
        </div>
      </div>
    </main>
  );
};

export default GeoBlogPost;
