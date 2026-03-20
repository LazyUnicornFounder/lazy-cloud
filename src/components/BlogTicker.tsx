import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { blogPosts } from "@/components/BlogSection";

const BlogTicker = () => {
  // Duplicate posts for seamless infinite scroll
  const items = [...blogPosts, ...blogPosts];

  return (
    <div className="w-full overflow-hidden bg-background/40 backdrop-blur-xl border-t border-b border-foreground/10">
      <motion.div
        className="flex gap-6 py-3 px-4"
        animate={{ x: [0, -(blogPosts.length * 280)] }}
        transition={{
          x: {
            duration: blogPosts.length * 6,
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
              src={post.thumbnail}
              alt={post.title}
              className="w-10 h-10 rounded-lg object-cover border border-foreground/10 group-hover:border-primary/50 transition-colors"
            />
            <span className="font-body text-[11px] tracking-wide text-foreground/60 group-hover:text-primary transition-colors whitespace-nowrap max-w-[220px] truncate">
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
