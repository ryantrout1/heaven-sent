// Pure builders for blog structured data and display helpers. No I/O.
import { SITE_URL, BUSINESS_NAME, LOGO_PATH, DEFAULT_OG_IMAGE_PATH, absoluteUrl } from './site.mjs';

export const OG_DEFAULT = { path: DEFAULT_OG_IMAGE_PATH, width: 1200, height: 630 };

/** "2026-09-30" -> "September 30, 2026", independent of server time zone. */
export function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(Date.UTC(y, m - 1, d)));
}

export function articleImage(article) {
  if (article.image) {
    return { url: absoluteUrl(article.image), width: article.imageWidth, height: article.imageHeight, alt: article.imageAlt };
  }
  return { url: absoluteUrl(OG_DEFAULT.path), width: OG_DEFAULT.width, height: OG_DEFAULT.height, alt: BUSINESS_NAME };
}

export function articleJsonLd(article) {
  const url = absoluteUrl(article.path);
  const org = { '@type': 'Organization', name: BUSINESS_NAME, url: SITE_URL };
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: [articleImage(article).url],
    datePublished: article.date,
    dateModified: article.updated || article.date,
    author: org,
    publisher: { ...org, logo: { '@type': 'ImageObject', url: absoluteUrl(LOGO_PATH) } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}

export function breadcrumbItems(article) {
  return [
    { name: 'Home', url: `${SITE_URL}/`, href: '/' },
    { name: 'Blog', url: absoluteUrl('/blog'), href: '/blog' },
    { name: article.title, url: absoluteUrl(article.path), href: article.path },
  ];
}

export function breadcrumbJsonLd(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems(article).map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: b.url })),
  };
}

/** Serialize for an inline <script>. Escapes "<" so article text can never close the tag. */
export function jsonLdString(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

export function pageHref(n) {
  return n === 1 ? '/blog' : `/blog/page/${n}`;
}

/** <link rel="alternate" type="application/rss+xml"> for the head (resolved against metadataBase). */
export const RSS_TYPES = { 'application/rss+xml': [{ url: '/blog/rss.xml', title: `${BUSINESS_NAME} Blog` }] };
