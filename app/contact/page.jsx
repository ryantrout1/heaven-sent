import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

export const metadata = { title: 'Contact · Heaven Sent Beauty' };

const wrap = { maxWidth: 720, margin: '0 auto', padding: '140px 6vw 120px', textAlign: 'center' };
const eyebrow = { fontFamily: "'Jost', sans-serif", letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: 13, color: 'var(--rose-deep)' };
const h1 = { fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: 'clamp(40px, 6vw, 64px)', color: 'var(--ink)', margin: '18px 0 28px', lineHeight: 1.05 };
const lead = { fontFamily: "'Cormorant Garamond', serif", fontSize: 21, color: 'var(--coffee)', lineHeight: 1.7, marginBottom: 48 };
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 28, marginBottom: 52, textAlign: 'left' };
const label = { fontFamily: "'Jost', sans-serif", letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 11, color: 'var(--mocha)', marginBottom: 8 };
const val = { fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: 'var(--ink)', lineHeight: 1.5 };
const cta = { display: 'inline-block', fontFamily: "'Jost', sans-serif", letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 13, color: 'var(--cream)', background: 'var(--coffee)', padding: '18px 44px', borderRadius: 999, textDecoration: 'none' };

export default function Contact() {
  return (
    <>
      <Nav />
      <div className="version v4">
        <section style={{ background: 'var(--cream)' }}>
          <div style={wrap}>
            <div style={eyebrow}>Get in touch</div>
            <h1>Come say <em style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: 'var(--rose-deep)' }}>hello</em>.</h1>
            <p style={lead}>Questions about a treatment, or want to find the right fit for your skin? Reach out — or book directly and we&apos;ll take it from there.</p>
            <div style={grid}>
              <div><div style={label}>Studio</div><div style={val}>Buckeye, Arizona{/* TODO: full address */}</div></div>
              <div><div style={label}>Hours</div><div style={val}>By appointment{/* TODO: hours */}</div></div>
              <div><div style={label}>Phone</div><div style={val}>(000) 000-0000{/* TODO */}</div></div>
              <div><div style={label}>Email</div><div style={val}>hello@heavensent.com{/* TODO */}</div></div>
            </div>
            <a href="#book" style={cta}>Book an Appointment</a>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
