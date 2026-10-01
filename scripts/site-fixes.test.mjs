import fsSync from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { PAGE_META } from '../lib/page-meta.mjs';
import { CONTACT_COPY, contactWordCount } from '../lib/contact-copy.mjs';
import { beautySalonJsonLd } from '../lib/local-business.mjs';
import { jsonLdString } from '../lib/blog-schema.mjs';
import { SITE_URL, INSTAGRAM_URL, FACEBOOK_URL } from '../lib/site.mjs';

const pages = ['home', 'about', 'contact', 'services'];

test('every page has a description of 140 to 160 characters, all different', () => {
  const seen = new Set();
  for (const p of pages) {
    const d = PAGE_META[p].description;
    assert.ok(d.length >= 140 && d.length <= 160, `${p} description is ${d.length} chars`);
    assert.ok(!seen.has(d), `${p} description duplicates another page`);
    seen.add(d);
  }
});

test('About, Contact and Services titles are 50 to 60 characters with Buckeye AZ and the business name', () => {
  const seen = new Set();
  for (const p of ['about', 'contact', 'services']) {
    const t = PAGE_META[p].title;
    assert.ok(t.length >= 50 && t.length <= 60, `${p} title is ${t.length} chars: ${t}`);
    assert.match(t, /Buckeye AZ/);
    assert.ok(t.endsWith('Heaven Sent Beauty'), `${p} title should end with the business name`);
    assert.ok(!seen.has(t));
    seen.add(t);
  }
});

test('descriptions and titles contain no em dashes', () => {
  for (const p of pages) {
    assert.doesNotMatch(PAGE_META[p].description, /—/);
    assert.doesNotMatch(PAGE_META[p].title || '', /—/);
  }
});

test('BeautySalon JSON-LD has the required fields and nothing invented', () => {
  const ld = beautySalonJsonLd();
  assert.equal(ld['@context'], 'https://schema.org');
  assert.equal(ld['@type'], 'BeautySalon');
  assert.equal(ld.name, 'Heaven Sent Beauty');
  assert.equal(ld.url, SITE_URL);
  assert.deepEqual(ld.address, {
    '@type': 'PostalAddress',
    streetAddress: '111 Monroe Ave STE 101',
    addressLocality: 'Buckeye',
    addressRegion: 'AZ',
    postalCode: '85326',
    addressCountry: 'US',
  });
  assert.equal(ld.telephone.replace(/\D/g, '').slice(-10), '6232156084');
  assert.deepEqual(ld.sameAs, [INSTAGRAM_URL, FACEBOOK_URL]);
  for (const bad of ['openingHours', 'openingHoursSpecification', 'priceRange', 'aggregateRating', 'review', 'geo']) {
    assert.ok(!(bad in ld), `${bad} must not be present`);
  }
});

test('BeautySalon JSON-LD serializes safely for a script tag', () => {
  const s = jsonLdString(beautySalonJsonLd());
  assert.doesNotMatch(s, /</);
  assert.equal(JSON.parse(s)['@type'], 'BeautySalon');
});

test('Contact copy covers By appointment and the first visit, with enough words, and no parking claim', () => {
  const all = JSON.stringify(CONTACT_COPY);
  assert.match(all, /By appointment/i);
  assert.match(all, /first visit/i);
  assert.doesNotMatch(all, /parking/i);
  assert.doesNotMatch(all, /—/);
  assert.ok(contactWordCount() >= 110, `only ${contactWordCount()} added words`);
});

test('every main page has a canonical URL on the www host and matching social tags', async () => {
  const { pageMetadata } = await import('../lib/page-meta.mjs');
  const paths = { home: '/', about: '/about', contact: '/contact', services: '/services' };
  for (const [k, p] of Object.entries(paths)) {
    const m = pageMetadata(k);
    const url = p === '/' ? SITE_URL : `${SITE_URL}${p}`;
    assert.equal(m.alternates.canonical, url);
    assert.equal(m.openGraph.url, url);
    assert.equal(m.openGraph.title, m.title);
    assert.equal(m.twitter.card, 'summary_large_image');
    assert.match(m.openGraph.images[0].url, /^https:\/\/www\.heavensentbeautyspa\.com\/images\/og-default\.jpg$/);
  }
});

test('service schema is built from the Services page: every price on the page appears, none invented', async () => {
  const { parseServices, servicesJsonLd, BUSINESS_ID } = await import('../lib/seo-schema.mjs');
  const fs = await import('node:fs');
  const html = JSON.parse(fs.readFileSync('lib/sections.json', 'utf8')).servicesFull;
  const onPage = [...html.matchAll(/class="svc-price">\$(\d+)</g)].map((m) => m[1]);
  const cats = parseServices();
  const parsed = cats.flatMap((c) => c.items.map((i) => i.price)).filter(Boolean);
  assert.deepEqual(parsed, onPage);
  assert.equal(servicesJsonLd()['@id'], BUSINESS_ID);
  assert.equal(beautySalonJsonLd()['@id'], BUSINESS_ID);
});

test('every gallery and about photo is a real img with alt text; no background-image photos remain', () => {
  const fs = require_fs();
  const s = JSON.parse(fs.readFileSync('lib/sections.json', 'utf8'));
  for (const k of ['gallery', 'aboutFull', 'about']) {
    assert.doesNotMatch(s[k], /background-image/, `${k} still has a CSS background photo`);
    for (const t of s[k].match(/<img[^>]*>/g) || []) assert.match(t, /alt="[^"]{12,}"/, `missing alt: ${t.slice(0, 80)}`);
  }
});

test('heading levels never skip on About or Home sections', () => {
  const fs = require_fs();
  const s = JSON.parse(fs.readFileSync('lib/sections.json', 'utf8'));
  const seq = (html) => (html.match(/<h([1-6])[ >]/g) || []).map((x) => Number(x[2]));
  for (const parts of [['hero', 'trust', 'features', 'services', 'about', 'book', 'gallery'], ['aboutFull', 'book']]) {
    let prev = 0;
    for (const lvl of parts.flatMap((p) => seq(s[p]))) {
      assert.ok(lvl <= prev + 1, `heading jumps from h${prev} to h${lvl}`);
      prev = lvl;
    }
  }
});

function require_fs() {
  return globalThis.__fs ?? (globalThis.__fs = fsSync);
}

test('roadmap keywords appear in the visible copy of the Services and home pages', () => {
  const s = JSON.parse(fsSync.readFileSync('lib/sections.json', 'utf8'));
  const text = (...k) => k.map((x) => s[x]).join(' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').toLowerCase();
  const svc = text('servicesFull');
  for (const t of ['brow shaping', 'acne facial', 'anti-aging facial', 'back facial', 'brow lamination', 'brow tint', 'classic lash extensions', 'classic lash fill', 'customized facial', 'dermaplaning facial', 'express facial', 'fire and ice facial', 'golden honey hydrating facial', 'hybrid lash extensions', 'hydrating facial', 'lash lift', 'lash tint', 'ultimate firming facial'])
    assert.ok(svc.includes(t), `Services page is missing "${t}"`);
  const home = text('hero', 'trust', 'features', 'services', 'about', 'book', 'gallery');
  for (const t of ['bikini wax', 'brazilian wax', 'eyebrow waxing', 'heaven sent beauty spa', 'lash lift and tint', 'lip wax', 'spa in buckeye, az', 'full body waxing'])
    assert.ok(home.includes(t), `Home page is missing "${t}"`);
});

test('every article has a search title of 60 characters or fewer and a description of 160 or fewer', async () => {
  const { getAllArticles } = await import('../lib/blog.mjs');
  const { BUSINESS_NAME } = await import('../lib/site.mjs');
  for (const a of getAllArticles()) {
    const t = `${a.seoTitle || a.title} | ${BUSINESS_NAME}`;
    const d = a.seoDescription || a.description;
    assert.ok(t.length <= 60, `${a.slug} title is ${t.length}: ${t}`);
    assert.ok(d.length <= 160, `${a.slug} description is ${d.length}`);
  }
});

test('Contact page has a services paragraph for search', async () => {
  const { CONTACT_COPY } = await import('../lib/contact-copy.mjs');
  assert.ok(CONTACT_COPY.offerText.split(/\s+/).length >= 40);
});

// ---- Phase 1: speed and accessibility ----
const luminance = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

test('brand text colors meet 4.5:1 contrast on every cream background', () => {
  const css = fsSync.readFileSync('app/globals.css', 'utf8');
  const tok = (n) => css.match(new RegExp(`--${n}:\\s*(#[0-9a-fA-F]{6})`))[1];
  for (const fg of ['mocha', 'rose-deep'])
    for (const bg of ['cream', 'cream-2'])
      assert.ok(contrast(tok(fg), tok(bg)) >= 4.5, `--${fg} on --${bg} is ${contrast(tok(fg), tok(bg)).toFixed(2)}`);
  assert.ok(contrast(tok('cream'), tok('rose-deep')) >= 4.5, 'cream text on a rose-deep button');
});

test('footer has no skipped heading levels and both logos carry width and height', () => {
  const s = JSON.parse(fsSync.readFileSync('lib/sections.json', 'utf8'));
  assert.ok(!/<h[4-6]/.test(s.footer), 'footer must not use h4-h6 (they skip heading levels)');
  for (const k of ['nav', 'footer']) {
    for (const img of s[k].match(/<img[^>]*logo|<img[^>]*img-0da5a4aad9[^>]*>/g) || [])
      assert.match(img, /width="\d+"/, `${k} logo needs width`);
  }
});

test('fonts load from link tags, not a CSS @import, and only the families in use', () => {
  const css = fsSync.readFileSync('app/globals.css', 'utf8');
  assert.ok(!/@import url\(/.test(css), 'remove the @import font chain');
  const links = fsSync.readFileSync('components/FontLinks.jsx', 'utf8');
  assert.match(links, /rel="preconnect"/);
  assert.match(links, /fonts\.googleapis\.com\/css2/);
  assert.ok(!/Lato|DM\+Serif/.test(links), 'unused families removed');
  for (const f of ['app/(site)/layout.jsx', 'app/(article)/blog/[slug]/layout.jsx'])
    assert.match(fsSync.readFileSync(f, 'utf8'), /<FontLinks \/>/, `${f} must include the font links`);
});
