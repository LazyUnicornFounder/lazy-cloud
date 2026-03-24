import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import unicornBg from "@/assets/unicorn-beach.png";
import { staticBlogPosts } from "@/components/BlogSection";
import { useDbBlogPosts } from "@/hooks/useDbBlogPosts";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import BlogTicker from "@/components/BlogTicker";
import ProductPromoBanner from "@/components/ProductPromoBanner";

const BlogPost = () => {
  const { slug } = useParams();
  const { posts: dbPosts } = useDbBlogPosts();
  const allPosts = [...staticBlogPosts, ...dbPosts];
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen text-foreground relative">
        <div className="fixed inset-0 z-0">
          <img src={unicornBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 pt-32 px-8 md:px-12">
          <div className="max-w-2xl bg-transparent backdrop-blur-xl rounded-3xl px-8 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]">
            <p className="font-display text-2xl font-bold text-foreground">Post not found.</p>
            <Link to="/blog" className="font-body text-primary mt-4 inline-block hover:underline">
              ← Back to blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const ogImageUrl = `https://www.lazyunicorn.ai/og/${post.slug}.png`;

  return (
    <div className="min-h-screen text-foreground relative">
      <SEO
        title={post.title}
        description={post.excerpt}
        url={`/blog/${post.slug}`}
        image={ogImageUrl}
        type="article"
        publishedTime="2026-03-01T00:00:00Z"
        modifiedTime="2026-03-21T00:00:00Z"
        keywords={`${post.title}, autonomous companies, AI agents, autonomous capitalism, Lazy Unicorn, solo founder, self-building startup`}
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
        "author": {
          "@type": "Person",
          "name": "Saad Sahawneh",
          "url": "https://x.com/SaadSahawneh",
          "sameAs": ["https://x.com/SaadSahawneh", "https://www.linkedin.com/in/saadsahawneh"]
        },
        "publisher": {
          "@type": "Organization",
          "name": "Lazy Unicorn",
          "url": "https://www.lazyunicorn.ai",
          "logo": { "@type": "ImageObject", "url": "https://www.lazyunicorn.ai/og-image.png", "width": 1200, "height": 630 }
        },
        "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.lazyunicorn.ai/blog/${post.slug}` },
        "wordCount": post.content.join(" ").split(/\s+/).length,
        "articleSection": "Technology",
        "inLanguage": "en-US",
        "keywords": `${post.title}, autonomous companies, AI agents, autonomous capitalism`,
        "isAccessibleForFree": true
      })}} />
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src={unicornBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BlogTicker />
      </div>
      <Navbar activePage="blog" />

      {/* Article */}
      <div className="relative z-10 pt-32 px-4 sm:px-8 md:px-12 pb-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-transparent backdrop-blur-xl rounded-3xl px-8 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]"
          >
            <Link
              to="/blog"
              className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/40 hover:text-primary transition-colors mb-6 inline-block"
            >
              ← Back to blog
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="font-body text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">
                {post.date}
              </span>
              <span className="w-1 h-1 rounded-full bg-foreground/20" />
              <span className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/40">
                {post.readTime}
              </span>
            </div>

            <h1 className="font-display text-2xl md:text-4xl font-extrabold text-foreground leading-tight mb-8">
              {post.title}
            </h1>

            <div className="space-y-5">
              {post.content.map((paragraph, j) => {
                // Convert markdown to HTML: headers, links, and strip hashtags
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
                    className="font-body text-base text-foreground/60 leading-relaxed [&_a]:text-primary [&_a]:underline [&_a]:hover:opacity-80 [&_a]:transition-opacity"
                    dangerouslySetInnerHTML={{ __html: cleaned }}
                  />
                );
              })}
            </div>

            {/* Promo footer */}
            <div className="mt-16 pt-8 border-t border-foreground/10 space-y-4 text-sm text-foreground/50 leading-relaxed">
              <p>
                <a href="https://lazyunicorn.ai" className="text-primary underline hover:opacity-80 font-semibold">Lazy Unicorn</a> builds autonomous growth tools for{" "}
                <a href="https://lovable.dev" className="text-primary underline hover:opacity-80">Lovable</a>. Drop a prompt into your existing Lovable project and your site starts publishing, ranking, and compounding — without you touching anything after setup.
              </p>
              <p>
                <a href="https://lazyunicorn.ai/lazy-blogger" className="text-primary underline hover:opacity-80">Lazy Blogger</a> publishes SEO and GEO-optimized blog posts continuously.{" "}
                <a href="https://lazyunicorn.ai/lazy-seo" className="text-primary underline hover:opacity-80">Lazy SEO</a> discovers the keywords your site should rank for and writes the articles to capture them.{" "}
                <a href="https://lazyunicorn.ai/lazy-geo" className="text-primary underline hover:opacity-80">Lazy GEO</a> publishes content structured to be cited by ChatGPT, Claude, and Perplexity when people ask questions in your niche. All three run as edge functions inside your existing Lovable project, on your existing Supabase database, at your existing domain.
              </p>
              <p className="font-semibold text-foreground">
                One prompt installs everything. Your site grows while you build.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Product Promo */}
      <div className="relative z-10 px-4 sm:px-8 md:px-12 pb-12 max-w-2xl">
        <ProductPromoBanner />
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-8 md:px-12 py-8 pb-20 border-t border-foreground/10">
        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/50">
          Lazy Unicorn © 2026
        </span>
      </footer>
    </div>
  );
};

export default BlogPost;
