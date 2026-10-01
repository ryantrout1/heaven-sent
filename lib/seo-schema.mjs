// Structured data for the main pages. Every fact comes from the site's own content
// (lib/site.mjs, lib/local-business.mjs, lib/sections.json), so schema cannot drift from the page.
import fs from 'node:fs';
import path from 'node:path';
import { SITE_URL, BUSINESS_NAME, absoluteUrl } from './site.mjs';

export const BUSINESS_ID = `${SITE_URL}/#business`;

const decode = (t) => t.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&ldquo;|&rdquo;/g, '"').replace(/&#39;|&rsquo;/g, "'").trim();
const strip = (t) => decode(t.replace(/<[^>]+>/g, ''));

/** Reads the Services page markup into [{ category, items: [{ name, description, price }] }]. */
function servicesHtml() {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'lib', 'sections.json'), 'utf8')).servicesFull;
}

export function parseServices(html = servicesHtml()) {
  const cats = [];
  const catRe = /<div class="svc-cat" id="[^"]*">([\s\S]*?)(?=<div class="svc-cat" id=|<\/section>|$)/g;
  for (const m of html.matchAll(catRe)) {
    const block = m[1];
    const h2 = block.match(/<h2>([\s\S]*?)<\/h2>/);
    if (!h2) continue;
    const items = [];
    for (const r of block.matchAll(/<div class="svc-name">([\s\S]*?)<\/div><div class="svc-desc">([\s\S]*?)<\/div>(?:<\/div>)?(?:<div class="svc-price">([\s\S]*?)<\/div>)?/g)) {
      const price = r[3] ? strip(r[3]).match(/^\$(\d+(?:\.\d{2})?)$/) : null;
      items.push({ name: strip(r[1]), description: strip(r[2]), price: price ? price[1] : null });
    }
    if (items.length) cats.push({ category: strip(h2[1]), items });
  }
  return cats;
}

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
