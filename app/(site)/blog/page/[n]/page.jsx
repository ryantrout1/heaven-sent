import { notFound } from 'next/navigation';
import BlogIndex, { BLOG_INTRO } from '../../../../../components/BlogIndex';
import { getArticles, paginate } from '../../../../../lib/blog.mjs';
import { absoluteUrl } from '../../../../../lib/site.mjs';
import { pageHref, RSS_TYPES } from '../../../../../lib/blog-schema.mjs';

// Only pages 2..N exist; page 1 is /blog itself.
export const dynamicParams = false;

export function generateStaticParams() {
  const { pages } = paginate(getArticles(), 1);
  return Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({ n: String(i + 2) }));
}

export function generateMetadata({ params }) {
  const n = Number(params.n);
  return {
    title: { absolute: `Blog, Page ${n} | Heaven Sent Beauty` },
    description: `${BLOG_INTRO} Page ${n} of the article list.`,
    alternates: { canonical: absoluteUrl(pageHref(n)), types: RSS_TYPES },
  };
}

export default function BlogPageN({ params }) {
  const data = /^\d+$/.test(params.n) ? paginate(getArticles(), Number(params.n)) : null;
  if (!data || data.page < 2) notFound();
  return <BlogIndex items={data.items} page={data.page} pages={data.pages} />;
}
