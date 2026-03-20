import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import unicornBg from "@/assets/unicorn-beach.png";
import { blogPosts } from "@/components/BlogSection";
import SEO from "@/components/SEO";

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

  return (
    <div className="min-h-screen text-foreground relative">
      <SEO
        title={post.title}
        description={post.excerpt}
        url={`/blog/${post.slug}`}
        type="article"
        publishedTime="2026-03-01T00:00:00Z"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt,
        "image": "https://lazyunicorn.com/og-image.png",
        "datePublished": "2026-03-01",
        "dateModified": "2026-03-01",
        "author": { "@type": "Organization", "name": "Lazy Unicorn", "url": "https://lazyunicorn.com" },
        "publisher": { "@type": "Organization", "name": "Lazy Unicorn", "url": "https://lazyunicorn.com", "logo": { "@type": "ImageObject", "url": "https://lazyunicorn.com/og-image.png" } },
        "mainEntityOfPage": { "@type": "WebPage", "@id": `https://lazyunicorn.com/blog/${post.slug}` }
      })}} />
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src={unicornBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Nav — centered, frosted pill */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
        <div className="flex items-center gap-6 bg-background/60 backdrop-blur-2xl border border-foreground/10 rounded-full px-8 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <a
            href="/"
            className="font-display text-sm font-semibold tracking-[0.15em] uppercase text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            Lazy Unicorn
          </a>
          <span className="w-px h-4 bg-foreground/20" />
          <a
            href="/#directory"
            className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/70 hover:text-primary transition-colors"
          >
            Directory
          </a>
          <Link
            to="/blog"
            className="font-body text-[11px] tracking-[0.15em] uppercase text-primary transition-colors"
          >
            Blog
          </Link>
          <a
            href="/#mission"
            className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/70 hover:text-primary transition-colors"
          >
            Mission
          </a>
          <a
            href="/#submit"
            className="font-body text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-5 py-1.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Submit
          </a>
        </div>
        <a
          href="https://x.com/SaadSahawneh"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 font-body text-[9px] tracking-[0.2em] uppercase text-foreground/50 hover:text-primary transition-colors bg-background/60 backdrop-blur-2xl border border-foreground/10 rounded-full px-4 py-1 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
        >
          Follow on 𝕏
        </a>
      </nav>

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
                  className="font-body text-base text-foreground/60 leading-relaxed"
                >
                  {paragraph}
                </motion.p>
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
