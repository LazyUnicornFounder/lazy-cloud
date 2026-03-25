import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { BlogPost } from "@/data/blogPosts";
import unicornBg from "@/assets/unicorn-beach.png";

export interface DbBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  read_time: string;
  thumbnail: string | null;
  status: string;
  created_at: string;
  published_at: string | null;
}

function dbToFrontend(db: DbBlogPost): BlogPost {
  const date = db.published_at || db.created_at;
  const d = new Date(date);
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return {
    slug: db.slug,
    title: db.title,
    date: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
    readTime: db.read_time,
    thumbnail: unicornBg,
    excerpt: db.excerpt,
    content: db.content,
  };
}

export function useDbBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (!error && data) {
        setPosts(data.map(dbToFrontend));
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return { posts, loading };
}
