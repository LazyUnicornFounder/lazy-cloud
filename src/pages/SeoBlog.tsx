import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import SEO from "@/components/SEO";
import ProductPromoBanner from "@/components/ProductPromoBanner";

const SeoBlog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("seo_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="SEO Blog — Autonomous SEO Articles" description="SEO-optimised articles published autonomously by Lazy SEO. Each post targets a keyword gap and is designed to climb Google search rankings." />
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">SEO Blog</h1>
          <p className="text-muted-foreground">Autonomously written, SEO-optimised articles.</p>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading posts…</p>
        ) : posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet. The first one publishes soon.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/seo-blog/${post.slug}`}
                className="block bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors space-y-2"
              >
                <h2 className="text-xl font-semibold">{post.title}</h2>
                {post.excerpt && <p className="text-muted-foreground text-sm">{post.excerpt}</p>}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {post.target_keyword && <Badge variant="secondary" className="text-sm">{post.target_keyword}</Badge>}
                  <span>{format(new Date(post.published_at), "MMM d, yyyy")}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-12">
          <ProductPromoBanner excludeProduct="seo" glass={false} />
        </div>
      </div>
    </div>
  );
};

export default SeoBlog;
