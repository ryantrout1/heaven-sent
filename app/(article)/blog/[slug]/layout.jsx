import '../../../globals.css';
import SiteShell from '../../../../components/SiteShell';
import FontLinks from '../../../../components/FontLinks';
import { getArticles } from '../../../../lib/blog.mjs';
import { SITE_URL } from '../../../../lib/site.mjs';
import { articleJsonLd, breadcrumbJsonLd, jsonLdString } from '../../../../lib/blog-schema.mjs';

export const metadata = { metadataBase: new URL(SITE_URL) };

// Own root layout so structured data (including the article's FAQ block) lands in <head>.
export default function ArticleLayout({ children, params }) {
  const article = getArticles().find((a) => a.slug === params.slug);
  const blocks = article ? [articleJsonLd(article), breadcrumbJsonLd(article), ...article.jsonLd] : [];
  const head = (
    <>
      <FontLinks />
      {blocks.map((b, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(b) }} />)}
    </>
  );
  return <SiteShell head={head}>{children}</SiteShell>;
}
