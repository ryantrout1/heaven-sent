import sections from '../lib/sections.json';
import { getArticles } from '../lib/blog.mjs';

const CONTACT_LI = '<li><a href="/contact">Contact</a></li>';

// The Blog link only appears once at least one published article exists.
export default function Nav() {
  let html = sections.nav;
  if (getArticles().length > 0) {
    if (!html.includes(CONTACT_LI)) throw new Error('Nav: contact link marker not found; cannot add Blog link');
    html = html.replace(CONTACT_LI, `<li><a href="/blog">Blog</a></li>${CONTACT_LI}`);
  }
  return <div className="version v4" dangerouslySetInnerHTML={{ __html: html }} />;
}
