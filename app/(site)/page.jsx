import sections from '../lib/sections.json';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Section from '../components/Section';

export default function Home() {
  return (
    <>
      <Nav />
      <Section version="v4" html={sections.hero + sections.trust} />
      <Section version="v3" html={sections.features} />
      <Section version="v2" html={sections.services} />
      <Section version="v4" html={sections.about + sections.book + sections.gallery} />
      <Footer />
    </>
  );
}
