import { Helmet } from "react-helmet-async";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string;
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  author?: string;
}

const SITE_NAME = "Lazy Unicorn";
const DEFAULT_TITLE = "Lazy Unicorn — Never Have To Work Again";
const DEFAULT_DESCRIPTION = "The definitive directory of AI-powered autonomous companies that let you start, run, and scale businesses while you sleep.";
const DEFAULT_IMAGE = "https://www.lazyunicorn.ai/og-image.png";
const BASE_URL = "https://www.lazyunicorn.ai";
const DEFAULT_KEYWORDS = "autonomous companies, AI business, passive income, autonomous capitalism, AI agents, self-running business, Lazy Unicorn, startup directory";
const TWITTER_HANDLE = "@SaadSahawneh";

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  url,
  image = DEFAULT_IMAGE,
  type = "website",
  publishedTime,
  modifiedTime,
  keywords = DEFAULT_KEYWORDS,
  noindex = false,
  breadcrumbs,
  author = "Lazy Unicorn",
}: SEOProps) => {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE;
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  const imageAlt = title ? `${title} — ${SITE_NAME}` : "Lazy Unicorn — Never have to work again. The Autonomous Company Directory.";
  const robotsContent = noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  const breadcrumbJsonLd = breadcrumbs
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: `${BASE_URL}${item.url}`,
        })),
      }
    : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robotsContent} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {type === "article" && <meta property="article:publisher" content={BASE_URL} />}
      {type === "article" && <meta property="article:author" content={author} />}
      {type === "article" && <meta property="article:section" content="Technology" />}

      {breadcrumbJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
