import { getArticles } from '../lib/blog.mjs';
import { buildSitemapEntries } from '../lib/blog-feed.mjs';

export default function sitemap() {
  return buildSitemapEntries(getArticles());
}
