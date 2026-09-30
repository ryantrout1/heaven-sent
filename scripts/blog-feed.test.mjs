import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSitemapEntries, buildRss, escapeXml, STATIC_PAGES } from '../lib/blog-feed.mjs';

const art = (i, extra = {}) => ({
  slug: `post-${i}`,
  title: `Post ${i}`,
  description: `Description ${i}`,
  path: `/blog/post-${i}`,
  date: `2026-09-${String(i).padStart(2, '0')}`,
  updated: null,
  ...extra,
});
// newest first, as loadArticles returns them
const list = (n) => Array.from({ length: n }, (_, k) => art(n - k));

test('sitemap with no articles lists only the site pages, without lastmod, and no /blog', () => {
  const e = buildSitemapEntries([]);
  assert.deepEqual(e.map((x) => x.url), [
    'https://www.heavensentbeautyspa.com/',
    'https://www.heavensentbeautyspa.com/services',
    'https://www.heavensentbeautyspa.com/about',
    'https://www.heavensentbeautyspa.com/contact',
  ]);
  assert.ok(e.every((x) => x.lastModified === undefined));
  assert.deepEqual(STATIC_PAGES, ['/', '/services', '/about', '/contact']);
});

test('sitemap lists /blog and every article with lastmod from updated, else date', () => {
  const a = list(3);
  a[0] = { ...a[0], updated: '2026-10-05' };
  const e = buildSitemapEntries(a);
  const by = Object.fromEntries(e.map((x) => [x.url, x.lastModified]));
  assert.equal(by['https://www.heavensentbeautyspa.com/blog/post-3'], '2026-10-05');
  assert.equal(by['https://www.heavensentbeautyspa.com/blog/post-2'], '2026-09-02');
  assert.equal(by['https://www.heavensentbeautyspa.com/blog/post-1'], '2026-09-01');
  assert.ok('https://www.heavensentbeautyspa.com/blog' in by);
  assert.equal(by['https://www.heavensentbeautyspa.com/blog'], '2026-10-05');
});

test('sitemap includes /blog/page/N only beyond 12 articles; urls are unique, absolute, no trailing slash', () => {
  assert.ok(!buildSitemapEntries(list(12)).some((x) => x.url.includes('/blog/page/')));
  const e = buildSitemapEntries(list(30));
  assert.ok(e.some((x) => x.url.endsWith('/blog/page/2')));
  assert.ok(e.some((x) => x.url.endsWith('/blog/page/3')));
  assert.ok(!e.some((x) => x.url.endsWith('/blog/page/1')));
  const urls = e.map((x) => x.url);
  assert.equal(new Set(urls).size, urls.length);
  for (const u of urls) {
    assert.match(u, /^https:\/\/www\.heavensentbeautyspa\.com/);
    if (u !== 'https://www.heavensentbeautyspa.com/') assert.ok(!u.endsWith('/'));
  }
});

test('escapeXml handles the five special characters', () => {
  assert.equal(escapeXml(`a & b < c > d " e '`), 'a &amp; b &lt; c &gt; d &quot; e &apos;');
});

test('RSS is valid-shaped, newest first, escaped, with atom self link', () => {
  const a = list(3);
  a[0] = { ...a[0], title: 'Fish & Chips <b>' };
  const x = buildRss(a);
  assert.match(x, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(x, /<rss version="2\.0" xmlns:atom="http:\/\/www\.w3\.org\/2005\/Atom">/);
  assert.match(x, /<atom:link href="https:\/\/www\.heavensentbeautyspa\.com\/blog\/rss\.xml" rel="self" type="application\/rss\+xml"\/>/);
  assert.match(x, /<title>Fish &amp; Chips &lt;b&gt;<\/title>/);
  assert.equal((x.match(/<item>/g) || []).length, 3);
  assert.ok(x.indexOf('/blog/post-3') < x.indexOf('/blog/post-2'));
  assert.match(x, /<guid isPermaLink="true">https:\/\/www\.heavensentbeautyspa\.com\/blog\/post-3<\/guid>/);
  assert.match(x, /<pubDate>Wed, 03 Sep 2026 12:00:00 GMT<\/pubDate>/);
  assert.match(x, /<description>Description 3<\/description>/);
});

test('RSS with no articles is an empty channel; capped at 50 items', () => {
  assert.equal((buildRss([]).match(/<item>/g) || []).length, 0);
  assert.equal((buildRss(list(60)).match(/<item>/g) || []).length, 50);
});
