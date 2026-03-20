import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
  publishedTime?: string;
  keywords?: string;
}

const SITE_NAME = "Lazy Unicorn";
const DEFAULT_TITLE = "Lazy Unicorn — Never Have To Work Again";
const DEFAULT_DESCRIPTION = "The definitive directory of AI-powered autonomous companies that let you start, run, and scale businesses while you sleep.";
const DEFAULT_IMAGE = "https://lazyunicorn.com/og-image.png";
const BASE_URL = "https://lazyunicorn.com";
const DEFAULT_KEYWORDS = "autonomous companies, AI business, passive income, autonomous capitalism, AI agents, self-running business, Lazy Unicorn, startup directory";

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  url,
  image = DEFAULT_IMAGE,
  type = "website",
  publishedTime,
  keywords = DEFAULT_KEYWORDS,
}: SEOProps) => {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE;
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  const imageAlt = title ? `${title} — ${SITE_NAME}` : "Lazy Unicorn — Never have to work again. The Autonomous Company Directory.";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
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
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === "article" && <meta property="article:publisher" content={BASE_URL} />}
    </Helmet>
  );
};

export default SEO;
