import { motion } from "framer-motion";
import BlogSection, { staticBlogPosts } from "@/components/BlogSection";
import { useDbBlogPosts } from "@/hooks/useDbBlogPosts";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";

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
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Blog — AI Agents & Autonomous Business"
        description="Essays on autonomous capitalism, AI-powered business agents, and the future of work. Written by the founder of a company that builds itself."
        url="/blog"
        keywords="autonomous business blog, AI agents for business, autonomous company, solo founder blog"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <Navbar activePage="blog" />

      <main className="pt-32">
        <BlogSection />
      </main>

      <footer className="px-8 md:px-12 py-8 border-t border-border">
        <span className="font-body text-[13px] tracking-[0.2em] uppercase text-foreground/55">
          Lazy Unicorn © 2026
        </span>
      </footer>
    </div>
  );
};

export default Blog;
