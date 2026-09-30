import test from 'node:test';
import assert from 'node:assert/strict';
import { articleJsonLd, breadcrumbJsonLd, articleImage, jsonLdString, formatDate, pageHref } from '../lib/blog-schema.mjs';

const base = { slug: 'hydrafacial-buckeye', title: 'Hydrafacial in Buckeye', description: 'Desc.', path: '/blog/hydrafacial-buckeye', date: '2026-09-30', updated: null, image: null };

test('Article JSON-LD has the required fields and absolute URLs', () => {
  const j = articleJsonLd(base);
  assert.equal(j['@type'], 'Article');
  assert.equal(j.headline, 'Hydrafacial in Buckeye');
  assert.equal(j.description, 'Desc.');
  assert.equal(j.datePublished, '2026-09-30');
  assert.equal(j.dateModified, '2026-09-30');
  assert.equal(j.author.name, 'Heaven Sent Beauty');
  assert.equal(j.publisher.name, 'Heaven Sent Beauty');
  assert.match(j.publisher.logo.url, /^https:\/\/www\.heavensentbeautyspa\.com\/images\//);
  assert.equal(j.mainEntityOfPage['@id'], 'https://www.heavensentbeautyspa.com/blog/hydrafacial-buckeye');
  assert.deepEqual(j.image, ['https://www.heavensentbeautyspa.com/images/og-default.jpg']);
});

test('dateModified uses updated; own image is used when set', () => {
  const j = articleJsonLd({ ...base, updated: '2026-10-02', image: '/images/blog/x.jpg', imageAlt: 'x', imageWidth: 800, imageHeight: 500 });
  assert.equal(j.dateModified, '2026-10-02');
  assert.deepEqual(j.image, ['https://www.heavensentbeautyspa.com/images/blog/x.jpg']);
  assert.deepEqual(articleImage({ ...base, image: '/images/blog/x.jpg', imageAlt: 'x', imageWidth: 800, imageHeight: 500 }), { url: 'https://www.heavensentbeautyspa.com/images/blog/x.jpg', width: 800, height: 500, alt: 'x' });
  assert.deepEqual(articleImage(base), { url: 'https://www.heavensentbeautyspa.com/images/og-default.jpg', width: 1200, height: 630, alt: 'Heaven Sent Beauty' });
});

test('BreadcrumbList is Home > Blog > article with positions 1..3', () => {
  const j = breadcrumbJsonLd(base);
  assert.equal(j['@type'], 'BreadcrumbList');
  assert.deepEqual(j.itemListElement.map((i) => [i.position, i.name, i.item]), [
    [1, 'Home', 'https://www.heavensentbeautyspa.com/'],
    [2, 'Blog', 'https://www.heavensentbeautyspa.com/blog'],
    [3, 'Hydrafacial in Buckeye', 'https://www.heavensentbeautyspa.com/blog/hydrafacial-buckeye'],
  ]);
});

test('jsonLdString escapes < so text cannot close the script tag', () => {
  const s = jsonLdString({ a: '</script><b>' });
  assert.ok(!s.includes('<'));
  assert.equal(JSON.parse(s).a, '</script><b>');
});

test('formatDate is time zone independent; pageHref', () => {
  assert.equal(formatDate('2026-09-30'), 'September 30, 2026');
  assert.equal(formatDate('2026-01-01'), 'January 1, 2026');
  assert.equal(pageHref(1), '/blog');
  assert.equal(pageHref(3), '/blog/page/3');
});
