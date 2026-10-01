// Reads the Services page markup (lib/sections.json) into plain data, so prices live in one place.
import fs from 'node:fs';
import path from 'node:path';

const decode = (t) => t.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&ldquo;|&rdquo;/g, '"').replace(/&#39;|&rsquo;/g, "'").trim();
const strip = (t) => decode(t.replace(/<[^>]+>/g, ''));

/** Reads the Services page markup into [{ category, items: [{ name, description, price }] }]. */
function servicesHtml() {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'lib', 'sections.json'), 'utf8')).servicesFull;
}

export function parseServices(html = servicesHtml()) {
  const cats = [];
  const catRe = /<div class="svc-cat" id="[^"]*">([\s\S]*?)(?=<div class="svc-cat" id=|<\/section>|$)/g;
  for (const m of html.matchAll(catRe)) {
    const block = m[1];
    const h2 = block.match(/<h2>([\s\S]*?)<\/h2>/);
    if (!h2) continue;
    const items = [];
    for (const r of block.matchAll(/<div class="svc-name">([\s\S]*?)<\/div><div class="svc-desc">([\s\S]*?)<\/div>(?:<\/div>)?(?:<div class="svc-price">([\s\S]*?)<\/div>)?/g)) {
      const price = r[3] ? strip(r[3]).match(/^\$(\d+(?:\.\d{2})?)$/) : null;
      const duration = r[1].match(/<span>([\s\S]*?)<\/span>/);
      items.push({ name: strip(r[1].replace(/<span>[\s\S]*?<\/span>/, '')), duration: duration ? strip(duration[1]) : null, description: strip(r[2]), price: price ? price[1] : null });
    }
    if (items.length) cats.push({ category: strip(h2[1]), items });
  }
  return cats;
}
