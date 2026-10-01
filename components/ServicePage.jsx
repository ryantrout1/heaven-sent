import { SERVICE_SLUGS, SERVICE_PAGES } from '../lib/service-pages.mjs';
import { PAGE_META } from '../lib/page-meta.mjs';
import { VAGARO_URL } from '../lib/site.mjs';

const LABEL = { facials: 'Facials', lashes: 'Lashes', brows: 'Brows', waxing: 'Waxing' };

// One service page: intro, services with prices, what to expect, FAQs, related reading, other services.
// `model` comes from servicePageModel(); `related` is a list of { title, path } for related articles.
export default function ServicePage({ model, related = [] }) {
  const others = SERVICE_SLUGS.filter((s) => s !== model.slug);
  return (
    <div className="version v4">
      <main className="svc sp">
        <div className="svc-intro">
          <div className="sp-crumbs" role="navigation" aria-label="Breadcrumb">
            <a href="/">Home</a> <span aria-hidden="true">/</span> <a href="/services">Services</a> <span aria-hidden="true">/</span> <span aria-current="page">{LABEL[model.slug]}</span>
          </div>
          <div className="svc-eyebrow">Heaven Sent Beauty</div>
          <h1>{model.h1}</h1>
          {model.intro.map((t) => <p key={t}>{t}</p>)}
          <a className="svc-cta" href={VAGARO_URL} target="_blank" rel="noopener noreferrer">Book {LABEL[model.slug].toLowerCase()}</a>
        </div>

        <section className="svc-cat sp-block" aria-labelledby="sp-menu">
          <h2 id="sp-menu">Services and prices</h2>
          {model.items.map((i) => (
            <div className="svc-row" key={i.name}>
              <div className="svc-meat">
                <div className="svc-name">{i.name}{i.duration ? <span>{i.duration}</span> : null}</div>
                <div className="svc-desc">{i.description}</div>
              </div>
              <div className="svc-price">${i.price}</div>
            </div>
          ))}
        </section>

        <section className="svc-cat sp-block" aria-labelledby="sp-expect">
          <h2 id="sp-expect">What to expect</h2>
          <p className="sp-text">{model.expect}</p>
        </section>

        <section className="svc-cat sp-block" aria-labelledby="sp-faq">
          <h2 id="sp-faq">Questions, answered</h2>
          <div className="sp-faq">
            {model.faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="svc-cat sp-block" aria-labelledby="sp-related">
            <h2 id="sp-related">Related reading</h2>
            <ul className="sp-links">
              {related.map((r) => <li key={r.path}><a href={r.path}>{r.title}</a></li>)}
            </ul>
          </section>
        )}

        <section className="svc-cat sp-block" aria-labelledby="sp-more">
          <h2 id="sp-more">More services</h2>
          <ul className="sp-links">
            {others.map((s) => <li key={s}><a href={SERVICE_PAGES[s].path}>{SERVICE_PAGES[s].h1}</a></li>)}
            <li><a href="/services">Every service, package and add-on</a></li>
          </ul>
          <a className="svc-cta" href={VAGARO_URL} target="_blank" rel="noopener noreferrer">Book an appointment</a>
        </section>
        <div className="svc-foot">Hours are by appointment. Call 623-215-6084 or book online. 111 Monroe Ave STE 101, Buckeye, AZ 85326.</div>
      </main>
    </div>
  );
}
