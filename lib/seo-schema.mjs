// Structured data for the main pages. Every fact comes from the site's own content
// (lib/site.mjs, lib/local-business.mjs, lib/sections.json), so schema cannot drift from the page.
import { parseServices } from './services-data.mjs';
import { SERVICE_PAGES, servicePageModel } from './service-pages.mjs';
import { SITE_URL, BUSINESS_NAME, absoluteUrl } from './site.mjs';

export { parseServices };
export const BUSINESS_ID = `${SITE_URL}/#business`;

export function servicesJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    '@id': BUSINESS_ID,
    name: BUSINESS_NAME,
    url: SITE_URL,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: parseServices().map(({ category, items }) => ({
        '@type': 'OfferCatalog',
        name: category,
        itemListElement: items.map((i) => ({
          '@type': 'Offer',
          ...(i.price ? { price: i.price, priceCurrency: 'USD' } : {}),
          itemOffered: { '@type': 'Service', name: i.name, description: i.description },
        })),
      })),
    },
  };
}

export function websiteJsonLd() {
  return { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: BUSINESS_NAME, url: SITE_URL, publisher: { '@id': BUSINESS_ID } };
}

export function founderJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/about#founder`,
    name: 'Jayslyn Tramp',
    jobTitle: 'Founder and licensed esthetician',
    image: absoluteUrl('/images/about-jayslyn.jpg'),
    url: absoluteUrl('/about'),
    worksFor: { '@id': BUSINESS_ID },
  };
}

export function breadcrumbJsonLd(pageName, path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: pageName, item: absoluteUrl(path) },
    ],
  };
}

export function serviceBreadcrumbJsonLd(pageName, pagePath) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Services', item: absoluteUrl('/services') },
      { '@type': 'ListItem', position: 3, name: pageName, item: absoluteUrl(pagePath) },
    ],
  };
}

/** FAQPage schema built from the exact questions and answers shown on the page. */
export function faqJsonLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

/** The business with an offer catalog of just this page's services. */
export function servicePageJsonLd(slug) {
  const m = servicePageModel(slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    '@id': BUSINESS_ID,
    name: BUSINESS_NAME,
    url: SITE_URL,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: m.h1,
      url: absoluteUrl(SERVICE_PAGES[slug].path),
      itemListElement: m.items.map((i) => ({
        '@type': 'Offer',
        price: i.price,
        priceCurrency: 'USD',
        itemOffered: { '@type': 'Service', name: i.name, description: i.description },
      })),
    },
  };
}
