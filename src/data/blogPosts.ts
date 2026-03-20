export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  thumbnail: string;
  excerpt: string;
  content: string[];
  ogImage?: string;
}
