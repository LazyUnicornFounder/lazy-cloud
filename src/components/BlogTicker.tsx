import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { staticBlogPosts } from "@/components/BlogSection";
import { useDbBlogPosts } from "@/hooks/useDbBlogPosts";

const BlogTicker = () => {
  const { posts: dbPosts } = useDbBlogPosts();
  const allPosts = [...staticBlogPosts, ...dbPosts];
  // Duplicate posts for seamless infinite scroll
  const items = [...allPosts, ...allPosts];

  if (allPosts.length === 0) return null;

  return (
    <div className="w-full overflow-hidden bg-transparent backdrop-blur-xl border-t border-b border-primary/20 shadow-[0_-4px_20px_rgba(0,0,0,0.3),0_0_20px_rgba(var(--primary-rgb),0.08)]">
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
            {post.thumbnail ? (
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-10 h-10 rounded-lg object-cover border border-foreground/10 group-hover:border-primary/50 transition-colors"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-foreground/10" />
            )}
            <span className="font-body text-xs font-medium tracking-wide text-foreground/60 group-hover:text-primary transition-colors whitespace-nowrap max-w-[220px] truncate">
              {post.title}
            </span>
            <span className="w-px h-4 bg-foreground/10 shrink-0" />
          </Link>
        ))}
      </motion.div>
    </div>
  );
};

export default BlogTicker;
