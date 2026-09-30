import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArticle, loadArticles, paginate, relatedArticles, PER_PAGE } from '../lib/blog.mjs';

const PNG_1x1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

function tmp() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-'));
  const content = path.join(root, 'content');
  const pub = path.join(root, 'public');
  fs.mkdirSync(content);
  fs.mkdirSync(path.join(pub, 'images', 'blog'), { recursive: true });
  fs.writeFileSync(path.join(pub, 'images', 'blog', 'pic.png'), PNG_1x1);
  return { root, content, pub };
}

function md({ slug = 'hello-world', extra = '', body = '# Hello\n\nIntro.\n\n## Part\n\n### Sub\n\nText.\n', front } = {}) {
  const fm =
    front ??
    `title: "Hello"\ndescription: "A test description."\npath: "/blog/${slug}"\ndate: 2026-09-30\n${extra}`;
  return `---\n${fm}---\n\n${body}`;
}

const opts = (t) => ({ publicDir: t.pub });

test('valid article parses; h1 from body only; h2/h3 kept', () => {
  const t = tmp();
  const a = parseArticle('hello-world.md', md(), opts(t));
  assert.equal(a.slug, 'hello-world');
  assert.equal(a.date, '2026-09-30');
  assert.equal(a.updated, null);
  assert.equal((a.html.match(/<h1/g) || []).length, 1);
  assert.match(a.html, /<h2>Part<\/h2>/);
  assert.match(a.html, /<h3>Sub<\/h3>/);
});

test('slug must equal last part of path', () => {
  const t = tmp();
  assert.throws(() => parseArticle('hello-world.md', md({ front: 'title: "H"\ndescription: "d"\npath: "/blog/other"\ndate: 2026-09-30\n' }), opts(t)), /path/i);
});

test('missing required fields fail', () => {
  const t = tmp();
  for (const f of ['title', 'description', 'path', 'date']) {
    const all = { title: 'title: "H"\n', description: 'description: "d"\n', path: 'path: "/blog/hello-world"\n', date: 'date: 2026-09-30\n' };
    delete all[f];
    assert.throws(() => parseArticle('hello-world.md', md({ front: Object.values(all).join('') }), opts(t)), new RegExp(f));
  }
});

test('bad dates fail; yaml Date objects are accepted', () => {
  const t = tmp();
  assert.throws(() => parseArticle('hello-world.md', md({ front: 'title: "H"\ndescription: "d"\npath: "/blog/hello-world"\ndate: 2026-02-30\n' }), opts(t)), /date/i);
  assert.throws(() => parseArticle('hello-world.md', md({ extra: 'updated: "09/30/2026"\n' }), opts(t)), /updated/i);
  const a = parseArticle('hello-world.md', md({ extra: 'updated: 2026-10-01\n' }), opts(t));
  assert.equal(a.updated, '2026-10-01');
});

test('slug format and reserved slugs fail', () => {
  const t = tmp();
  assert.throws(() => parseArticle('Hello-World.md', md({ slug: 'Hello-World' }), opts(t)), /slug/i);
  assert.throws(() => parseArticle('hello_world.md', md({ slug: 'hello_world' }), opts(t)), /slug/i);
  assert.throws(() => parseArticle('page.md', md({ slug: 'page' }), opts(t)), /reserved/i);
});

test('image requires imageAlt and an existing local file; dimensions are read', () => {
  const t = tmp();
  assert.throws(() => parseArticle('hello-world.md', md({ extra: 'image: "/images/blog/pic.png"\n' }), opts(t)), /imageAlt/);
  assert.throws(() => parseArticle('hello-world.md', md({ extra: 'image: "/images/blog/missing.png"\nimageAlt: "x"\n' }), opts(t)), /image/i);
  assert.throws(() => parseArticle('hello-world.md', md({ extra: 'image: "https://x.test/a.png"\nimageAlt: "x"\n' }), opts(t)), /image/i);
  const a = parseArticle('hello-world.md', md({ extra: 'image: "/images/blog/pic.png"\nimageAlt: "A pic"\n' }), opts(t));
  assert.equal(a.image, '/images/blog/pic.png');
  assert.equal(a.imageAlt, 'A pic');
  assert.equal(a.imageWidth, 1);
  assert.equal(a.imageHeight, 1);
});

test('draft: true is skipped without full validation; non-boolean draft fails', () => {
  const t = tmp();
  assert.equal(parseArticle('hello-world.md', md({ front: 'title: "H"\ndraft: true\n' }), opts(t)), null);
  assert.throws(() => parseArticle('hello-world.md', md({ extra: 'draft: maybe\n' }), opts(t)), /draft/);
  assert.ok(parseArticle('hello-world.md', md({ extra: 'draft: false\n' }), opts(t)));
});

test('body must start with an h1 and contain exactly one', () => {
  const t = tmp();
  assert.throws(() => parseArticle('hello-world.md', md({ body: 'Intro first.\n\n# Late\n' }), opts(t)), /h1/i);
  assert.throws(() => parseArticle('hello-world.md', md({ body: '# One\n\ntext\n\n# Two\n' }), opts(t)), /h1/i);
});

test('trailing ld+json is extracted out of the body and parsed; invalid JSON fails', () => {
  const t = tmp();
  const ld = '{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[]}';
  const a = parseArticle('hello-world.md', md({ body: `# Hello\n\ntext\n\n<script type="application/ld+json">${ld}</script>\n` }), opts(t));
  assert.equal(a.jsonLd.length, 1);
  assert.equal(a.jsonLd[0]['@type'], 'FAQPage');
  assert.doesNotMatch(a.html, /ld\+json/);
  assert.doesNotMatch(a.html, /<script/);
  assert.throws(() => parseArticle('hello-world.md', md({ body: '# Hello\n\n<script type="application/ld+json">{oops}</script>\n' }), opts(t)), /json/i);
});

test('body <img> needs width and height', () => {
  const t = tmp();
  assert.throws(() => parseArticle('hello-world.md', md({ body: '# Hello\n\n<img src="/images/blog/pic.png" alt="x">\n' }), opts(t)), /width|height/i);
  assert.throws(() => parseArticle('hello-world.md', md({ body: '# Hello\n\n![x](/images/blog/pic.png)\n' }), opts(t)), /width|height/i);
  assert.ok(parseArticle('hello-world.md', md({ body: '# Hello\n\n<img src="/images/blog/pic.png" alt="x" width="1" height="1">\n' }), opts(t)));
});

test('loadArticles: missing dir is empty; dotfiles ignored, stray files fail; drafts excluded; newest first', () => {
  const t = tmp();
  assert.deepEqual(loadArticles({ dir: path.join(t.root, 'nope'), publicDir: t.pub }), []);
  fs.writeFileSync(path.join(t.content, '.gitkeep'), '');
  assert.deepEqual(loadArticles({ dir: t.content, publicDir: t.pub }), []);
  fs.writeFileSync(path.join(t.content, 'notes.txt'), 'x');
  assert.throws(() => loadArticles({ dir: t.content, publicDir: t.pub }), /unexpected file/);
  fs.unlinkSync(path.join(t.content, 'notes.txt'));
  const put = (slug, date, extra = '') =>
    fs.writeFileSync(path.join(t.content, `${slug}.md`), md({ slug, front: `title: "${slug}"\ndescription: "d"\npath: "/blog/${slug}"\ndate: ${date}\n${extra}` }));
  put('old-one', '2026-01-01');
  put('new-one', '2026-09-01');
  put('same-day-b', '2026-05-05');
  put('same-day-a', '2026-05-05');
  put('secret-one', '2026-12-01', 'draft: true\n');
  const list = loadArticles({ dir: t.content, publicDir: t.pub });
  assert.deepEqual(list.map((a) => a.slug), ['new-one', 'same-day-a', 'same-day-b', 'old-one']);
});

const fake = (n) => Array.from({ length: n }, (_, i) => ({ slug: `a-${i}`, date: `2026-01-${String(30 - i).padStart(2, '0')}` }));

test('paginate: 12 per page, empty still one page', () => {
  assert.equal(PER_PAGE, 12);
  assert.deepEqual(paginate([], 1), { items: [], page: 1, pages: 1 });
  assert.equal(paginate(fake(12), 1).pages, 1);
  assert.equal(paginate(fake(13), 1).pages, 2);
  const p2 = paginate(fake(30), 2);
  assert.equal(p2.items.length, 12);
  assert.equal(p2.items[0].slug, 'a-12');
  assert.equal(paginate(fake(30), 3).items.length, 6);
  assert.equal(paginate(fake(30), 4), null);
  assert.equal(paginate(fake(30), 0), null);
});

test('relatedArticles: newest first, excludes current, max 3', () => {
  const list = fake(6);
  assert.deepEqual(relatedArticles(list, 'a-0').map((a) => a.slug), ['a-1', 'a-2', 'a-3']);
  assert.deepEqual(relatedArticles(list, 'a-2').map((a) => a.slug), ['a-0', 'a-1', 'a-3']);
  assert.deepEqual(relatedArticles(fake(2), 'a-0').map((a) => a.slug), ['a-1']);
  assert.deepEqual(relatedArticles(fake(1), 'a-0'), []);
});
