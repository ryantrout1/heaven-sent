import sections from '../lib/sections.json';
import { getArticles } from '../lib/blog.mjs';

const FACEBOOK_END = 'Facebook →</a>';

// Same rule as the nav: the Blog link appears once an article exists.
export default function Footer() {
  let html = sections.footer;
  if (getArticles().length > 0) {
    if (!html.includes(FACEBOOK_END)) throw new Error('Footer: link marker not found; cannot add Blog link');
    html = html.replace(FACEBOOK_END, `${FACEBOOK_END}<a href="/blog">Blog →</a>`);
  }
  return <div className="version v4" dangerouslySetInnerHTML={{ __html: html }} />;
}
