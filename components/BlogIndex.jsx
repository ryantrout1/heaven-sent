import Nav from './Nav';
import Footer from './Footer';
import BlogCard from './BlogCard';
import { pageHref } from '../lib/blog-schema.mjs';

export const BLOG_ABOUT =
  'Our articles come from Heaven Sent Beauty, a one-client-at-a-time spa studio in Buckeye, AZ. Here you will find plain-language guides to facials and dermaplaning, brow lamination and tinting, lash lifts and lash extensions, and waxing, so you know what to expect before you book. Each guide explains how a treatment works, who it suits, and how to prepare for it and care for your skin afterward. New articles are added regularly, so check back often.';

export const BLOG_INTRO = 'Skincare and beauty notes from Heaven Sent Beauty in Buckeye, AZ.';

export default function BlogIndex({ items, page, pages }) {
  return (
    <>
      <Nav />
      <div className="version v4">
        <main className="blog-wrap">
          <header className="blog-list-head">
            <h1>Blog</h1>
            <p className="blog-intro">{BLOG_INTRO}</p>
            {page === 1 ? (
              <p className="blog-intro">
                {BLOG_ABOUT} When you are ready, see our <a href="/services">services and prices</a> or <a href="/contact">get in touch</a> to book.
              </p>
            ) : null}
          </header>
          {items.length === 0 ? (
            <p className="blog-empty">Articles coming soon</p>
          ) : (
            <div className="blog-grid">
              {items.map((a, i) => (
                <BlogCard key={a.slug} article={a} priority={page === 1 && i < 3} />
              ))}
            </div>
          )}
          {pages > 1 ? (
            <nav className="blog-pager" aria-label="Blog pages">
              {page > 1 ? <a href={pageHref(page - 1)} rel="prev">Previous</a> : null}
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) =>
                n === page ? (
                  <span key={n} aria-current="page">{n}</span>
                ) : (
                  <a key={n} href={pageHref(n)}>{n}</a>
                )
              )}
              {page < pages ? <a href={pageHref(page + 1)} rel="next">Next</a> : null}
            </nav>
          ) : null}
        </main>
      </div>
      <Footer />
    </>
  );
}
