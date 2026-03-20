import { motion } from "framer-motion";
import unicornBg from "@/assets/unicorn-beach.png";
import BlogSection, { blogPosts } from "@/components/BlogSection";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import BlogTicker from "@/components/BlogTicker";

const Blog = () => {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Lazy Unicorn Blog",
    "description": "Essays on autonomous companies, AI agents, and the future of work.",
    "url": "https://www.lazyunicorn.ai/blog",
    "publisher": { "@type": "Organization", "name": "Lazy Unicorn", "url": "https://www.lazyunicorn.ai" },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": blogPosts.map((post, i) => ({
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
        title="Blog"
        description="Essays on autonomous companies, AI agents, and the future of work. Accelerate the future of autonomous capitalism."
        url="/blog"
        keywords="autonomous companies blog, AI agents essays, autonomous capitalism, startup insights, AI business articles"
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

      <div className="fixed top-0 left-0 right-0 z-50">
        <BlogTicker />
      </div>
      <Navbar activePage="blog" />

      {/* Content */}
      <div className="pt-32">
        <BlogSection />
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

export default Blog;
