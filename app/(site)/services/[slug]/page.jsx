import { notFound } from 'next/navigation';
import Nav from '../../../../components/Nav';
import Footer from '../../../../components/Footer';
import ServicePage from '../../../../components/ServicePage';
import { SERVICE_SLUGS, servicePageModel } from '../../../../lib/service-pages.mjs';
import { relatedArticlesFor } from '../../../../lib/related.mjs';
import { pageMetadata } from '../../../../lib/page-meta.mjs';
import { jsonLdString } from '../../../../lib/blog-schema.mjs';
import { faqJsonLd, servicePageJsonLd, serviceBreadcrumbJsonLd } from '../../../../lib/seo-schema.mjs';

export const dynamicParams = false;
// Related articles follow the blog's publish dates, so refresh hourly like the blog index.
export const revalidate = 3600;

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  if (!SERVICE_SLUGS.includes(params.slug)) return {};
  return pageMetadata(params.slug);
}

export default function ServiceRoute({ params }) {
  const model = servicePageModel(params.slug);
  if (!model) notFound();
  return (
    <>
      <Nav />
      <ServicePage model={model} related={relatedArticlesFor(params.slug)} />
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(servicePageJsonLd(params.slug)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(faqJsonLd(model.faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(serviceBreadcrumbJsonLd(model.h1, model.path)) }} />
    </>
  );
}
