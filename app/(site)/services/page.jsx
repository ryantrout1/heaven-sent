import sections from '../../../lib/sections.json';
import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import Section from '../../../components/Section';
import ServicesEnhancer from '../../../components/ServicesEnhancer';
import { PAGE_META } from '../../../lib/page-meta.mjs';

export const metadata = { title: PAGE_META.services.title, description: PAGE_META.services.description };

export default function Services() {
  return (
    <>
      <Nav />
      <Section version="v4" html={sections.servicesFull} />
      <ServicesEnhancer />
      <Footer />
    </>
  );
}
