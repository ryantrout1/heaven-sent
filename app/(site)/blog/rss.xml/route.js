import { getArticles } from '../../../../lib/blog.mjs';
import { buildRss } from '../../../../lib/blog-feed.mjs';

export const dynamic = 'force-static';

export function GET() {
  return new Response(buildRss(getArticles()), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
