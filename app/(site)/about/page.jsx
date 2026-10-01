import sections from '../../../lib/sections.json';
import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import Section from '../../../components/Section';
import { pageMetadata } from '../../../lib/page-meta.mjs';
import { jsonLdString } from '../../../lib/blog-schema.mjs';
import { founderJsonLd, breadcrumbJsonLd } from '../../../lib/seo-schema.mjs';

export const metadata = pageMetadata('about');

export default function About() {
  return (
    <>
      <Nav />
      <Section version="v4" html={sections.aboutFull + sections.book} />
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(founderJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd('About', '/about')) }} />
    </>
  );
}
