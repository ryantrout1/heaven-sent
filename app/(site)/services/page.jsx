import sections from '../../../lib/sections.json';
import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import Section from '../../../components/Section';
import ServicesEnhancer from '../../../components/ServicesEnhancer';
import { pageMetadata } from '../../../lib/page-meta.mjs';

export const metadata = pageMetadata('services');

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
