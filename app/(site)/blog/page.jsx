import BlogIndex, { BLOG_INTRO } from '../../../components/BlogIndex';
import { getArticles, paginate } from '../../../lib/blog.mjs';
import { absoluteUrl } from '../../../lib/site.mjs';

export const metadata = {
  title: { absolute: 'Blog | Skincare and Beauty Articles | Heaven Sent Beauty' },
  description: `${BLOG_INTRO} Read on for facials, brows, lashes and waxing from a quiet spa studio.`,
  alternates: { canonical: absoluteUrl('/blog') },
};

export default function BlogPage() {
  const { items, page, pages } = paginate(getArticles(), 1);
  return <BlogIndex items={items} page={page} pages={pages} />;
}
