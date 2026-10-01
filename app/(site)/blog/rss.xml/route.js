import { getArticles } from '../../../../lib/blog.mjs';
import { buildRss } from '../../../../lib/blog-feed.mjs';

export const dynamic = 'force-static';
// Hourly refresh, so a scheduled article joins the feed on its date.
export const revalidate = 3600;

export function GET() {
  return new Response(buildRss(getArticles()), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
