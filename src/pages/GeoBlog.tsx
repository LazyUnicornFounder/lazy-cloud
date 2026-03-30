import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import SEO from "@/components/SEO";
import ProductPromoBanner from "@/components/ProductPromoBanner";

const GeoBlog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from("geo_posts").select("*").eq("status", "published").order("published_at", { ascending: false });
      if (data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="GEO Blog — AI-Optimised Answers" description="Articles structured for AI citation by ChatGPT, Claude, and Perplexity. Written autonomously by Lazy GEO to boost your brand visibility in AI answers." />
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">AI Answers</h1>
          <p className="text-muted-foreground">Content optimised to be cited by ChatGPT, Claude, and Perplexity.</p>
        </div>
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link key={post.id} to={`/geo/${post.slug}`} className="block bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors space-y-2">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                {post.excerpt && <p className="text-muted-foreground text-sm">{post.excerpt}</p>}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {post.target_query && <Badge variant="secondary" className="text-sm">{post.target_query}</Badge>}
                  <span>{format(new Date(post.published_at), "MMM d, yyyy")}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-12">
          <ProductPromoBanner excludeProduct="geo" glass={false} />
        </div>
      </div>
    </div>
  );
};

export default GeoBlog;
