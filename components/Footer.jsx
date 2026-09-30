import sections from '../lib/sections.json';

const FACEBOOK_END = 'Facebook →</a>';

// Same as the nav: the Blog link is always shown.
export default function Footer() {
  let html = sections.footer;
  if (!html.includes(FACEBOOK_END)) throw new Error('Footer: link marker not found; cannot add Blog link');
  html = html.replace(FACEBOOK_END, `${FACEBOOK_END}<a href="/blog">Blog →</a>`);
  return <div className="version v4" dangerouslySetInnerHTML={{ __html: html }} />;
}
