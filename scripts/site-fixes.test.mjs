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
  for (const k of ['gallery', 'aboutFull']) {
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
