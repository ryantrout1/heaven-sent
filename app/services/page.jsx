import sections from '../../lib/sections.json';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import Section from '../../components/Section';

export const metadata = { title: 'Services · Heaven Sent Beauty' };

export default function Services() {
  return (
    <>
      <Nav />
      <Section version="v4" html={sections.servicesFull} />
      <Footer />
    </>
  );
}
