import { getArticles } from '../lib/blog.mjs';
import { buildSitemapEntries } from '../lib/blog-feed.mjs';

// Hourly refresh, so a scheduled article joins the sitemap on its date.
export const revalidate = 3600;

export default function sitemap() {
  return buildSitemapEntries(getArticles());
}
