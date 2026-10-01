import sections from '../../../lib/sections.json';
import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import Section from '../../../components/Section';
import ServicesEnhancer from '../../../components/ServicesEnhancer';
import { pageMetadata } from '../../../lib/page-meta.mjs';
import { jsonLdString } from '../../../lib/blog-schema.mjs';
import { servicesJsonLd, breadcrumbJsonLd } from '../../../lib/seo-schema.mjs';

export const metadata = pageMetadata('services');

export default function Services() {
  return (
    <>
      <Nav />
      <Section version="v4" html={sections.servicesFull} />
      <ServicesEnhancer />
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(servicesJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd('Services', '/services')) }} />
    </>
  );
}
