// Blog content pipeline. Server and build time only; never imported by client code.
// Articles are markdown files: content/blog/<slug>.md (front matter + body).
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import { marked } from 'marked';
import { imageSize } from 'image-size';

export const PER_PAGE = 12;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RESERVED_SLUGS = new Set(['page', 'rss']);
// JSON_SCHEMA keeps dates as plain strings. The default schema turns 2026-02-30 into a
// real Date (rolled to March 2), which would publish the wrong day without any error.
const MATTER_OPTS = { engines: { yaml: (s) => yaml.safeLoad(s, { schema: yaml.JSON_SCHEMA }) } };
const LD_RE = /<script\s+type=["']application\/ld\+json["']\s*>([\s\S]*?)<\/script>/gi;

export class BlogError extends Error {
  constructor(file, message) {
    super(`[blog] ${file}: ${message}`);
    this.name = 'BlogError';
  }
}

export function defaultContentDir() {
  return process.env.BLOG_CONTENT_DIR || path.join(process.cwd(), 'content', 'blog');
}
export function defaultPublicDir() {
  return path.join(process.cwd(), 'public');
}

// Optional string: search-result title or description when the on-page ones are too long.
function optString(fm, key, fileName) {
  const v = fm[key];
  if (v === undefined || v === null || v === '') return null;
  if (typeof v !== 'string' || !v.trim()) throw new BlogError(fileName, `${key} must be a non-empty string when set`);
  return v.trim();
}

function reqString(fm, key, file) {
  const v = fm[key];
  if (typeof v !== 'string' || !v.trim()) throw new BlogError(file, `front matter "${key}" is required`);
  return v.trim();
}

// YAML turns an unquoted 2026-09-30 into a Date at UTC midnight; accept both forms.
function normalizeDate(v, key, file, required) {
  if (v === undefined || v === null || v === '') {
    if (required) throw new BlogError(file, `front matter "${key}" is required (YYYY-MM-DD)`);
    return null;
  }
  let s = v;
  if (v instanceof Date) s = Number.isNaN(v.getTime()) ? '' : v.toISOString().slice(0, 10);
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new BlogError(file, `"${key}" must be YYYY-MM-DD`);
  const d = new Date(`${s}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s) throw new BlogError(file, `"${key}" is not a real date: ${s}`);
  return s;
}

function readDraft(fm, file) {
  const v = fm.draft;
  if (v === undefined || v === null || v === false) return false;
  if (v === true) return true;
  throw new BlogError(file, `"draft" must be true or false`);
}

function extractJsonLd(body, file) {
  const blocks = [];
  const stripped = body.replace(LD_RE, (_, json) => {
    try {
      blocks.push(JSON.parse(json));
    } catch (e) {
      throw new BlogError(file, `invalid JSON in ld+json block: ${e.message}`);
    }
    return '';
  });
  return { body: stripped.trim(), jsonLd: blocks };
}

/**
 * Parse and validate one article file.
 * Returns the article, or null when draft: true (drafts are not validated further).
 * Throws BlogError on any contract violation, which fails the build.
 */
export function parseArticle(fileName, raw, { publicDir = defaultPublicDir() } = {}) {
  const slug = fileName.replace(/\.md$/, '');
  let parsed;
  try {
    parsed = matter(raw, MATTER_OPTS);
  } catch (e) {
    throw new BlogError(fileName, `front matter could not be parsed: ${e.message}`);
  }
  const fm = parsed.data || {};

  if (readDraft(fm, fileName)) return null;

  if (!SLUG_RE.test(slug)) throw new BlogError(fileName, `slug "${slug}" must be lowercase letters, digits and hyphens`);
  if (RESERVED_SLUGS.has(slug)) throw new BlogError(fileName, `slug "${slug}" is reserved`);

  const title = reqString(fm, 'title', fileName);
  const description = reqString(fm, 'description', fileName);
  const seoTitle = optString(fm, 'seoTitle', fileName);
  const seoDescription = optString(fm, 'seoDescription', fileName);
  const p = reqString(fm, 'path', fileName);
  const m = /^\/blog\/([^/]+)$/.exec(p);
  if (!m) throw new BlogError(fileName, `path "${p}" must look like /blog/<slug>`);
  if (m[1] !== slug) throw new BlogError(fileName, `path "${p}" does not match file slug "${slug}"`);

  const date = normalizeDate(fm.date, 'date', fileName, true);
  const updated = normalizeDate(fm.updated, 'updated', fileName, false);

  let image = null;
  let imageAlt = null;
  let imageWidth = null;
  let imageHeight = null;
  if (fm.image !== undefined && fm.image !== null && fm.image !== '') {
    if (typeof fm.image !== 'string' || !fm.image.startsWith('/') || fm.image.startsWith('//')) {
      throw new BlogError(fileName, `image must be a local path under public/ such as /images/blog/x.jpg`);
    }
    if (typeof fm.imageAlt !== 'string' || !fm.imageAlt.trim()) {
      throw new BlogError(fileName, `imageAlt is required whenever image is set`);
    }
    const file = path.join(publicDir, fm.image);
    if (!path.resolve(file).startsWith(path.resolve(publicDir) + path.sep) || !fs.existsSync(file)) {
      throw new BlogError(fileName, `image file not found in public/: ${fm.image}`);
    }
    let dim;
    try {
      dim = imageSize(fs.readFileSync(file));
    } catch (e) {
      throw new BlogError(fileName, `image dimensions could not be read: ${e.message}`);
    }
    if (!dim.width || !dim.height) throw new BlogError(fileName, `image has no readable dimensions: ${fm.image}`);
    image = fm.image;
    imageAlt = fm.imageAlt.trim();
    imageWidth = dim.width;
    imageHeight = dim.height;
  }

  const { body, jsonLd } = extractJsonLd(parsed.content, fileName);
  if (!/^#\s+\S/.test(body)) throw new BlogError(fileName, `body must start with an "# heading" (the page's only h1)`);

  const html = marked.parse(body, { async: false, gfm: true });
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) throw new BlogError(fileName, `body must contain exactly one h1, found ${h1s}`);
  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    if (!/\swidth=["']?\d+/i.test(tag) || !/\sheight=["']?\d+/i.test(tag)) {
      throw new BlogError(fileName, `body image needs explicit width and height (use an <img width height> tag): ${tag}`);
    }
  }

  return { slug, title, description, seoTitle, seoDescription, path: p, date, updated, image, imageAlt, imageWidth, imageHeight, html, jsonLd };
}

export function sortArticles(list) {
  return [...list].sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : a.date < b.date ? 1 : -1));
}

/** All published (non-draft) articles, newest first. Throws on any invalid non-draft file. */
export function loadArticles({ dir = defaultContentDir(), publicDir = defaultPublicDir() } = {}) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const name of fs.readdirSync(dir).sort()) {
    if (name.startsWith('.')) continue; // .gitkeep and similar
    // Anything else that is not <slug>.md would be dropped silently, so fail loudly instead.
    if (!name.endsWith('.md')) throw new BlogError(name, 'unexpected file in content/blog; articles must be <slug>.md');
    const a = parseArticle(name, fs.readFileSync(path.join(dir, name), 'utf8'), { publicDir });
    if (a) out.push(a);
  }
  return sortArticles(out);
}

/** Page n (1-based) of a newest-first list. null when out of range. Empty list is one empty page. */
export function paginate(list, page, perPage = PER_PAGE) {
  const pages = Math.max(1, Math.ceil(list.length / perPage));
  if (!Number.isInteger(page) || page < 1 || page > pages) return null;
  return { items: list.slice((page - 1) * perPage, page * perPage), page, pages };
}

/** Up to `max` other articles, newest first. */
export function relatedArticles(list, slug, max = 3) {
  return sortArticles(list.filter((a) => a.slug !== slug)).slice(0, max);
}

/** Today's date (YYYY-MM-DD) in Buckeye, Arizona: UTC-7 all year, no daylight saving. */
export function arizonaToday(now = new Date()) {
  return new Date(now.getTime() - 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** An article is live from its date on, in Arizona time, and never before. */
export function isLive(article, now = new Date()) {
  return article.date <= arizonaToday(now);
}

/** Only the live articles, newest first. */
export function liveArticles(list, now = new Date()) {
  return sortArticles(list.filter((a) => isLive(a, now)));
}

let cache;
/** Every valid article, scheduled ones included; one read per build worker. */
export function getAllArticles() {
  if (!cache) cache = loadArticles();
  return cache;
}

/**
 * The articles visitors can see now: those dated today or earlier. Pages that
 * call this refresh hourly (revalidate), so a scheduled article appears on its
 * date without a new deploy.
 */
export function getArticles(now = new Date()) {
  return liveArticles(getAllArticles(), now);
}
