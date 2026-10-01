import sections from '../../../lib/sections.json';
import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import Section from '../../../components/Section';
import { pageMetadata } from '../../../lib/page-meta.mjs';

export const metadata = pageMetadata('about');

export default function About() {
  return (
    <>
      <Nav />
      <Section version="v4" html={sections.aboutFull + sections.book} />
      <Footer />
    </>
  );
}
