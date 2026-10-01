import Image from 'next/image';
import { notFound } from 'next/navigation';
import Nav from '../../../../components/Nav';
import Footer from '../../../../components/Footer';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import BookingSection from '../../../../components/BookingSection';
import BlogCard from '../../../../components/BlogCard';
import { getArticles, relatedArticles } from '../../../../lib/blog.mjs';
import { optimizeBodyImages } from '../../../../lib/blog-html.mjs';
import { BUSINESS_NAME, absoluteUrl } from '../../../../lib/site.mjs';
import { articleImage, breadcrumbItems, formatDate, RSS_TYPES } from '../../../../lib/blog-schema.mjs';

// Rendered on each request, so a scheduled article appears the moment its date arrives
// in Arizona; until then, like any unknown slug, it is a real 404, never a 200.
export const dynamic = 'force-dynamic';

export function generateMetadata({ params }) {
  const a = getArticles().find((x) => x.slug === params.slug);
  if (!a) return {};
  const img = articleImage(a);
  const url = absoluteUrl(a.path);
  const shownTitle = a.seoTitle || a.title;
  const shownDescription = a.seoDescription || a.description;
  return {
    title: { absolute: `${shownTitle} | ${BUSINESS_NAME}` },
    description: shownDescription,
    alternates: { canonical: url, types: RSS_TYPES },
    openGraph: {
      type: 'article',
      title: shownTitle,
      description: shownDescription,
      url,
      siteName: BUSINESS_NAME,
      publishedTime: a.date,
      modifiedTime: a.updated || a.date,
      authors: [BUSINESS_NAME],
      images: [{ url: img.url, width: img.width, height: img.height, alt: img.alt }],
    },
    twitter: { card: 'summary_large_image', title: shownTitle, description: shownDescription, images: [img.url] },
  };
}

export default function ArticlePage({ params }) {
  const all = getArticles();
  const a = all.find((x) => x.slug === params.slug);
  if (!a) notFound();
  const related = relatedArticles(all, a.slug);
  // The body's own "# heading" is the page's only h1; split after it to place the byline and image.
  const cut = a.html.indexOf('</h1>') + 5;
  const head = a.html.slice(0, cut);
  const rest = optimizeBodyImages(a.html.slice(cut));
  return (
    <>
      <Nav />
      <div className="version v4">
        <main className="blog-wrap blog-wrap-article">
          <Breadcrumbs items={breadcrumbItems(a)} />
          <article className="blog-article">
            <header>
              <div className="blog-body" dangerouslySetInnerHTML={{ __html: head }} />
              <p className="blog-meta">
                By {BUSINESS_NAME} · <time dateTime={a.date}>Published {formatDate(a.date)}</time>
                {a.updated ? <> · <time dateTime={a.updated}>Updated {formatDate(a.updated)}</time></> : null}
              </p>
              {a.image ? (
                <Image
                  className="blog-hero"
                  src={a.image}
                  alt={a.imageAlt}
                  width={a.imageWidth}
                  height={a.imageHeight}
                  sizes="(max-width: 800px) 100vw, 760px"
                  priority
                />
              ) : null}
            </header>
            <div className="blog-body" dangerouslySetInnerHTML={{ __html: rest }} />
          </article>
        </main>
        <BookingSection />
        {related.length > 0 ? (
          <aside className="blog-wrap blog-related" aria-labelledby="blog-related-h">
            <h2 id="blog-related-h">Related articles</h2>
            <div className="blog-grid">
              {related.map((r) => (
                <BlogCard key={r.slug} article={r} />
              ))}
            </div>
          </aside>
        ) : null}
      </div>
      <Footer />
    </>
  );
}
