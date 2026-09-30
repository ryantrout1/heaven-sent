import test from 'node:test';
import assert from 'node:assert/strict';
import { optimizeBodyImages } from '../lib/blog-html.mjs';

const local = '<p>x</p><img src="/images/blog/a b.jpg" alt="A pic" width="600" height="483"><p>y</p>';

test('local raster images get lazy loading and the optimizer srcset (modern formats)', () => {
  const out = optimizeBodyImages(local);
  assert.match(out, /loading="lazy"/);
  assert.match(out, /decoding="async"/);
  assert.match(out, /src="\/_next\/image\?url=%2Fimages%2Fblog%2Fa%20b\.jpg&amp;w=1080&amp;q=75"/);
  assert.match(out, /srcset="[^"]*%2Fimages%2Fblog%2Fa%20b\.jpg&amp;w=640&amp;q=75 640w[^"]*1080w"/);
  assert.match(out, /sizes="\(max-width: 800px\) 100vw, 760px"/);
  assert.match(out, /alt="A pic"/);
  assert.match(out, /width="600"/);
  assert.match(out, /height="483"/);
  assert.match(out, /^<p>x<\/p><img /);
  assert.match(out, /<p>y<\/p>$/);
});

test('external and svg/gif images only gain lazy loading', () => {
  for (const src of ['https://cdn.test/a.jpg', '/images/logo.svg', '/images/anim.gif']) {
    const out = optimizeBodyImages(`<img src="${src}" alt="x" width="10" height="10">`);
    assert.match(out, new RegExp(`src="${src.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}"`));
    assert.match(out, /loading="lazy"/);
    assert.doesNotMatch(out, /srcset/);
  }
});

test('no duplicate loading attribute and html without images is unchanged', () => {
  const out = optimizeBodyImages('<img src="/images/a.png" alt="x" width="1" height="1" loading="lazy">');
  assert.equal((out.match(/loading=/g) || []).length, 1);
  assert.equal(optimizeBodyImages('<p>no images</p>'), '<p>no images</p>');
});
