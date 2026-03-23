import { Helmet } from "react-helmet-async";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
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
  faq?: FAQItem[];
  speakable?: string[];
}

const SITE_NAME = "Lazy Unicorn";
const DEFAULT_TITLE = "Lazy Unicorn — The Solo Founder's Guide to Building an Autonomous Unicorn";
const DEFAULT_DESCRIPTION = "The solo founder's guide to building an autonomous unicorn. Discover AI tools and resources to build a startup that builds itself.";
const DEFAULT_IMAGE = "https://www.lazyunicorn.ai/og-image.png";
const BASE_URL = "https://www.lazyunicorn.ai";
const DEFAULT_KEYWORDS = "autonomous business, autonomous company, self-building startup, solo founder, one person business, AI agents for business, autonomous unicorn, build a business with AI, run a business with AI, no code business, AI startup tools, solo founder tools, passive income AI, autonomous SaaS, self-running business, AI business automation, one person startup, solo founder unicorn, build without a team, AI powered business, autonomous company tools, no employee startup, AI operations, business that runs itself, solo entrepreneur AI, autonomous business software, vibe coding business, Lovable startup, build on Lovable, autonomous content, AI blog writing, self-growing business, recursive startup, passive business income, AI company builder, solo CEO, no code startup, AI team replacement, autonomous marketing, AI outbound, business automation tools, solo founder stack, AI founder tools, replace your team with AI, one founder company, AI business tools 2026, autonomous business platform, self-operating business, AI employees";
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
  author = "Saad Sahawneh",
  faq,
  speakable,
}: SEOProps) => {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE;
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  const imageAlt = title
    ? `${title} — ${SITE_NAME}`
    : "Lazy Unicorn — The solo founder's guide to building an autonomous unicorn";
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

  const faqJsonLd = faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  const speakableJsonLd = speakable?.length
    ? {
        "@context": "https://schema.org",
        "@type": "WebPage",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: speakable,
        },
        url: fullUrl,
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
      {type === "article" && <meta property="article:tag" content="autonomous companies" />}
      {type === "article" && <meta property="article:tag" content="AI startups" />}
      {type === "article" && <meta property="article:tag" content="solo founder" />}

      {breadcrumbJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      )}
      {faqJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(faqJsonLd)}
        </script>
      )}
      {speakableJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(speakableJsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
