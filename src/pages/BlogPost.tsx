import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { staticBlogPosts } from "@/components/BlogSection";
import { useDbBlogPosts } from "@/hooks/useDbBlogPosts";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import BlogAudioPlayer from "@/components/BlogAudioPlayer";

const BlogPost = () => {
  const { slug } = useParams();
  const { posts: dbPosts, loading } = useDbBlogPosts();
  const allPosts = [...staticBlogPosts, ...dbPosts];
  const post = allPosts.find((p) => p.slug === slug);

  if (loading && !post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar activePage="blog" />
      <main>
        <div className="pt-32 px-4 sm:px-8 md:px-12 pb-20">
          <div className="max-w-2xl border border-border bg-card px-8 py-10 animate-pulse space-y-4">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-8 w-3/4 bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-2/3 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="pt-32 px-8 md:px-12">
          <div className="max-w-2xl border border-border bg-card px-8 py-10">
            <p className="font-display text-2xl font-bold text-foreground">Post not found.</p>
            <Link to="/blog" className="font-body text-foreground/50 mt-4 inline-block hover:text-foreground transition-colors">
              ← Back to blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const ogImageUrl = `https://www.lazyunicorn.ai/og/${post.slug}.png`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={post.title}
        description={post.excerpt}
        url={`/blog/${post.slug}`}
        image={ogImageUrl}
        type="article"
        publishedTime="2026-03-01T00:00:00Z"
        modifiedTime="2026-03-21T00:00:00Z"
        keywords={`${post.title}, autonomous companies, AI agents, autonomous capitalism, Lazy Unicorn`}
        author="Saad Sahawneh"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
        speakable={["h1", "article"]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt,
        "image": ogImageUrl,
        "datePublished": "2026-03-01",
        "dateModified": "2026-03-21",
        "author": { "@type": "Person", "name": "Saad Sahawneh", "url": "https://x.com/SaadSahawneh" },
        "publisher": { "@type": "Organization", "name": "Lazy Unicorn", "url": "https://www.lazyunicorn.ai" },
        "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.lazyunicorn.ai/blog/${post.slug}` },
        "wordCount": post.content.join(" ").split(/\s+/).length,
        "isAccessibleForFree": true
      })}} />

      <Navbar activePage="blog" />

      <div className="pt-32 px-4 sm:px-8 md:px-12 pb-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="border border-border bg-card px-8 py-10"
          >
            <Link to="/blog" className="font-body text-[13px] tracking-[0.2em] uppercase text-foreground/55 hover:text-foreground transition-colors mb-6 inline-block">
              ← Back to blog
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="font-body text-[13px] tracking-[0.2em] uppercase text-foreground/50 font-semibold">{post.date}</span>
              <span className="w-1 h-1 bg-foreground/35" />
              <span className="font-body text-[13px] tracking-[0.2em] uppercase text-foreground/55">{post.readTime}</span>
            </div>

            <h1 className="font-display text-2xl md:text-4xl font-extrabold text-foreground leading-tight mb-8">{post.title}</h1>

            {slug && <BlogAudioPlayer postSlug={slug} />}

            <div className="space-y-5">
              {post.content.map((paragraph, j) => {
                const cleaned = paragraph
                  .replace(/^#{1,3}\s+(.+)$/g, '<strong>$1</strong>')
                  .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2">$1</a>')
                  .replace(/#\w+/g, "")
                  .replace(/\s{2,}/g, " ")
                  .trim();
                if (!cleaned) return null;
                return (
                  <motion.p
                    key={j}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: j * 0.04 }}
                    className="font-body text-base text-foreground/50 leading-relaxed [&_a]:text-foreground [&_a]:underline [&_a]:hover:opacity-80 [&_a]:transition-opacity"
                    dangerouslySetInnerHTML={{ __html: cleaned }}
                  />
                );
              })}
            </div>

            <div className="mt-16 pt-8 border-t border-border space-y-4 text-sm text-foreground/65 leading-relaxed">
              <p>
                <a href="https://lazyunicorn.ai" className="text-foreground underline hover:opacity-80 font-semibold">Lazy Unicorn</a> builds autonomous growth tools for Lovable.
              </p>
              <p className="font-semibold text-foreground">One prompt installs everything. Your site grows while you build.</p>
            </div>
          </motion.div>
        </div>
      </div>

      <footer className="px-8 md:px-12 py-8 border-t border-border">
        <span className="font-body text-[13px] tracking-[0.2em] uppercase text-foreground/55">Lazy Unicorn © 2026</span>
      </footer>
      </main>
    </div>
  );
};

export default BlogPost;
