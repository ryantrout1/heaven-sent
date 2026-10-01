// Which articles belong with which service page (and the reverse). Only live articles are returned,
// so a scheduled article is never linked before its date.
import { getArticles } from './blog.mjs';

// Article slug lists in reading order. Edit here to change the related links on a service page.
export const RELATED = {
  facials: ['what-to-expect-at-your-first-facial', 'prepare-for-facial-and-cost', 'what-is-dermaplaning', 'esthetician-buckeye-skin-script-rx'],
  lashes: ['lash-lift-or-lash-extensions', 'classic-hybrid-lash-extensions-fill'],
  brows: ['what-is-brow-lamination', 'brow-lamination-aftercare-guide', 'brow-shaping-and-tint-combination'],
  waxing: ['bikini-brazilian-full-body-waxing'],
};

/** Live articles for a service page, as { title, path }. */
export function relatedArticlesFor(slug, articles = getArticles()) {
  const live = new Map(articles.map((a) => [a.slug, a]));
  return (RELATED[slug] || []).filter((s) => live.has(s)).map((s) => ({ title: live.get(s).title, path: live.get(s).path }));
}
