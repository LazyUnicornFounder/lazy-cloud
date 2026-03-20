import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import unicornBg from "@/assets/unicorn-beach.png";
import { blogPosts } from "@/components/BlogSection";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import BlogTicker from "@/components/BlogTicker";

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen text-foreground relative">
        <div className="fixed inset-0 z-0">
          <img src={unicornBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 pt-32 px-8 md:px-12">
          <div className="max-w-2xl bg-background/60 backdrop-blur-2xl rounded-3xl px-8 py-10 border border-foreground/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
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
        modifiedTime="2026-03-20T00:00:00Z"
        keywords={`${post.title}, autonomous companies, AI agents, autonomous capitalism, Lazy Unicorn`}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt,
        "image": ogImageUrl,
        "datePublished": "2026-03-01",
        "dateModified": "2026-03-20",
        "author": { "@type": "Organization", "name": "Lazy Unicorn", "url": "https://www.lazyunicorn.ai" },
        "publisher": { "@type": "Organization", "name": "Lazy Unicorn", "url": "https://www.lazyunicorn.ai", "logo": { "@type": "ImageObject", "url": "https://www.lazyunicorn.ai/og-image.png" } },
        "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.lazyunicorn.ai/blog/${post.slug}` },
        "wordCount": post.content.join(" ").split(/\s+/).length,
        "articleSection": "Technology",
        "inLanguage": "en-US"
      })}} />
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src={unicornBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="fixed top-0 left-0 right-0 z-50">
        <BlogTicker />
      </div>
      <Navbar activePage="blog" />

      {/* Article */}
      <div className="relative z-10 pt-32 px-8 md:px-12 pb-16">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-background/60 backdrop-blur-2xl rounded-3xl px-8 py-10 border border-foreground/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
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
              {post.content.map((paragraph, j) => (
                <motion.p
                  key={j}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: j * 0.04 }}
                  className="font-body text-base text-foreground/60 leading-relaxed [&_a]:text-primary [&_a]:underline [&_a]:hover:opacity-80 [&_a]:transition-opacity"
                  dangerouslySetInnerHTML={{ __html: paragraph }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-8 md:px-12 py-8 border-t border-foreground/10">
        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/50">
          Lazy Unicorn © 2026
        </span>
      </footer>
    </div>
  );
};

export default BlogPost;
