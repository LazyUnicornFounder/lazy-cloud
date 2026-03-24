import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { staticBlogPosts } from "@/components/BlogSection";
import { useDbBlogPosts } from "@/hooks/useDbBlogPosts";
import unicornBg from "@/assets/unicorn-beach.png";

const BlogTicker = () => {
  const { posts: dbPosts } = useDbBlogPosts();
  const allPosts = [...dbPosts, ...staticBlogPosts];
  const items = [...allPosts, ...allPosts];

  if (allPosts.length === 0) return null;

  return (
    <div className="w-full overflow-hidden" style={{ borderTop: "1px solid rgba(240,234,214,0.08)", borderBottom: "1px solid rgba(240,234,214,0.08)" }}>
      <motion.div
        className="flex gap-6 py-3 px-4"
        animate={{ x: [0, -(allPosts.length * 280)] }}
        transition={{
          x: {
            duration: allPosts.length * 6,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {items.map((post, i) => (
          <Link
            key={`${post.slug}-${i}`}
            to={`/blog/${post.slug}`}
            className="flex items-center gap-3 shrink-0 group"
          >
            <img
              src={post.thumbnail || unicornBg}
              alt={post.title}
              className="w-8 h-8 rounded object-cover"
              style={{ border: "1px solid rgba(240,234,214,0.1)" }}
            />
            <span
              className="font-body text-[11px] tracking-wide whitespace-nowrap max-w-[220px] truncate transition-opacity"
              style={{ color: "#f0ead6", opacity: 0.4 }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.4")}
            >
              {post.title}
            </span>
            <span className="w-px h-4 shrink-0" style={{ backgroundColor: "rgba(240,234,214,0.08)" }} />
          </Link>
        ))}
      </motion.div>
    </div>
  );
};

export default BlogTicker;
