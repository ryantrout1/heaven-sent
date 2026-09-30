import sections from '../../../lib/sections.json';
import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import Section from '../../../components/Section';
import { PAGE_META } from '../../../lib/page-meta.mjs';

export const metadata = { title: PAGE_META.about.title, description: PAGE_META.about.description };

export default function About() {
  return (
    <>
      <Nav />
      <Section version="v4" html={sections.aboutFull + sections.book} />
      <Footer />
    </>
  );
}
