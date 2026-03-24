import { motion } from "framer-motion";
import unicornBg from "@/assets/unicorn-beach.png";
import BlogSection, { staticBlogPosts } from "@/components/BlogSection";
import { useDbBlogPosts } from "@/hooks/useDbBlogPosts";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import BlogTicker from "@/components/BlogTicker";
import ProductPromoBanner from "@/components/ProductPromoBanner";

const Blog = () => {
  const { posts: dbPosts } = useDbBlogPosts();
  const allPosts = [...staticBlogPosts, ...dbPosts];

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Lazy Unicorn Blog",
    "description": "Essays on autonomous companies, AI agents, and the future of work.",
    "url": "https://www.lazyunicorn.ai/blog",
    "publisher": { "@type": "Organization", "name": "Lazy Unicorn", "url": "https://www.lazyunicorn.ai" },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": allPosts.map((post, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `https://www.lazyunicorn.ai/blog/${post.slug}`,
        "name": post.title,
      })),
    },
  };

  return (
    <div className="min-h-screen text-foreground relative">
      <SEO
        title="Blog — Autonomous Capitalism, AI Agents & the Future of Work"
        description="Essays and insights on autonomous companies, AI agents, and the future of work. Learn how solo founders are building startups that run themselves."
        url="/blog"
        keywords="autonomous business blog, AI agents for business, autonomous company, solo founder blog, AI blog writing, autonomous content, self-building startup, recursive startup, AI business automation, self-growing business, AI startup tools, solo founder tools, passive income AI, autonomous SaaS, AI powered business, business that runs itself, AI company builder, autonomous marketing, AI founder tools, AI business tools 2026"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      {/* Full-bleed background */}
      <div className="fixed inset-0 z-0">
        <img src={unicornBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BlogTicker />
      </div>
      <Navbar activePage="blog" />

      {/* Content */}
      <div className="pt-32">
        <BlogSection />
      </div>

      {/* Product Promo */}
      <div className="relative z-10 px-6 md:px-12 pb-12 max-w-4xl mx-auto">
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

export default Blog;
