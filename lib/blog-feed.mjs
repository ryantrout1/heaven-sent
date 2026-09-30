// Pure builders for sitemap entries and the RSS feed. No I/O.
import { SITE_URL, BUSINESS_NAME, absoluteUrl } from './site.mjs';
import { paginate, PER_PAGE } from './blog.mjs';

export const STATIC_PAGES = ['/', '/services', '/about', '/contact'];
const RSS_LIMIT = 50;

const lastmod = (a) => a.updated || a.date;
const urlFor = (p) => (p === '/' ? `${SITE_URL}/` : absoluteUrl(p));

/** Every page plus every published article. Static pages carry no lastmod (we have no real date for them). */
export function buildSitemapEntries(articles) {
  const entries = STATIC_PAGES.map((p) => ({ url: urlFor(p) }));
  if (articles.length === 0) return entries; // no /blog until the first article exists
  const newest = (items) => items.map(lastmod).sort().at(-1);
  entries.push({ url: urlFor('/blog'), lastModified: newest(articles) });
  const { pages } = paginate(articles, 1, PER_PAGE);
  for (let n = 2; n <= pages; n++) {
    entries.push({ url: urlFor(`/blog/page/${n}`), lastModified: newest(paginate(articles, n, PER_PAGE).items) });
  }
  for (const a of articles) entries.push({ url: urlFor(a.path), lastModified: lastmod(a) });
  return entries;
}

export function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Dates are day-only, so publish at noon GMT to keep the same calendar day in every time zone.
function rfc822(iso) {
  return new Date(`${iso}T12:00:00Z`).toUTCString();
}

export function buildRss(articles, description = `Skincare and beauty notes from ${BUSINESS_NAME} in Buckeye, AZ.`) {
  const items = articles.slice(0, RSS_LIMIT).map((a) => {
    const url = absoluteUrl(a.path);
    return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(a.date)}</pubDate>
      <description>${escapeXml(a.description)}</description>
    </item>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${BUSINESS_NAME} Blog`)}</title>
    <link>${absoluteUrl('/blog')}</link>
    <description>${escapeXml(description)}</description>
    <language>en-us</language>
    <atom:link href="${absoluteUrl('/blog/rss.xml')}" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>
`;
}
