import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import { pageMetadata } from '../../../lib/page-meta.mjs';
import { jsonLdString } from '../../../lib/blog-schema.mjs';
import { breadcrumbJsonLd } from '../../../lib/seo-schema.mjs';
import { CONTACT_COPY } from '../../../lib/contact-copy.mjs';

export const metadata = pageMetadata('contact');

const wrap = { maxWidth: 720, margin: '0 auto', padding: '140px 6vw 120px', textAlign: 'center' };
const eyebrow = { fontFamily: "'Jost', sans-serif", letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: 13, color: 'var(--rose-deep)' };
const h1 = { fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: 'clamp(40px, 6vw, 64px)', color: 'var(--ink)', margin: '18px 0 28px', lineHeight: 1.05 };
const lead = { fontFamily: "'Cormorant Garamond', serif", fontSize: 21, color: 'var(--coffee)', lineHeight: 1.7, marginBottom: 48 };
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 28, marginBottom: 52, textAlign: 'left' };
const label = { fontFamily: "'Jost', sans-serif", letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 11, color: 'var(--mocha)', marginBottom: 8 };
const val = { fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: 'var(--ink)', lineHeight: 1.5 };
const h2s = { fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: 'clamp(26px, 3.6vw, 34px)', color: 'var(--ink)', margin: '0 0 16px', lineHeight: 1.15 };
const body = { fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: 'var(--coffee)', lineHeight: 1.7, margin: '0 0 20px' };
const step = { fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: 'var(--coffee)', lineHeight: 1.6, margin: '0 0 14px', textAlign: 'left' };
const block = { margin: '0 0 48px' };
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
              <div><div style={label}>Studio</div><div style={val}>111 Monroe Ave STE 101, Buckeye, AZ 85326</div></div>
              <div><div style={label}>Hours</div><div style={val}>By appointment</div></div>
              <div><div style={label}>Phone</div><div style={val}>623-215-6084</div></div>
            </div>
            <div style={{ ...block, textAlign: 'left' }}>
              <h2 style={h2s}>{CONTACT_COPY.visitHeading}</h2>
              <p style={body}>{CONTACT_COPY.visitIntro}</p>
              {CONTACT_COPY.steps.map((s) => (
                <p key={s.title} style={step}><strong style={{ fontWeight: 600, color: 'var(--ink)' }}>{s.title}.</strong> {s.text}</p>
              ))}
            </div>
            <div style={{ ...block, textAlign: 'left' }}>
              <h2 style={h2s}>{CONTACT_COPY.findHeading}</h2>
              <p style={{ ...body, margin: 0 }}>{CONTACT_COPY.findText}</p>
            </div>
            <a href="https://www.vagaro.com/monroesalonandspa" target="_blank" rel="noopener noreferrer" style={cta}>Book an Appointment</a>
          </div>
        </section>
      </div>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd('Contact', '/contact')) }} />
    </>
  );
}
