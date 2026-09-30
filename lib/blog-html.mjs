// Post-processes article body HTML so images below the top lazy load and use the same
// image optimizer (AVIF/WebP) as next/image. Pure string work; no I/O.
const WIDTHS = [640, 750, 828, 1080]; // all are in Next's default deviceSizes
const SIZES = '(max-width: 800px) 100vw, 760px';
const ATTR_RE = /([^\s"'<>\/=]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'>]+))?/g;
const OPTIMIZABLE = /\.(jpe?g|png|webp|avif)(\?.*)?$/i;

// Values from marked/HTML are already entity-encoded, so only escape a bare & or quote.
const esc = (s) => s.replace(/&(?!(?:amp|lt|gt|quot|#\d+);)/g, '&amp;').replace(/"/g, '&quot;');
const unquote = (v) => (v == null ? '' : v.replace(/^["']|["']$/g, ''));
const optimizerUrl = (src, w) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;

function rewriteTag(tag) {
  const attrs = [];
  for (const m of tag.slice(4, -1).replace(/\/\s*$/, '').matchAll(ATTR_RE)) {
    attrs.push([m[1], m[2] === undefined ? null : unquote(m[2])]);
  }
  const get = (n) => attrs.find(([k]) => k.toLowerCase() === n)?.[1];
  const src = get('src') || '';
  const skip = new Set(['src', 'srcset', 'sizes', 'loading', 'decoding']);
  const kept = attrs.filter(([k]) => !skip.has(k.toLowerCase()));
  const optimize = src.startsWith('/') && !src.startsWith('//') && OPTIMIZABLE.test(src);
  const out = kept.map(([k, v]) => (v === null ? k : `${k}="${esc(v)}"`));
  if (optimize) {
    out.push(`src="${esc(optimizerUrl(src, WIDTHS[WIDTHS.length - 1]))}"`);
    out.push(`srcset="${WIDTHS.map((w) => `${esc(optimizerUrl(src, w))} ${w}w`).join(', ')}"`);
    out.push(`sizes="${SIZES}"`);
  } else {
    out.push(`src="${esc(src)}"`);
  }
  out.push('loading="lazy"', 'decoding="async"');
  return `<img ${out.join(' ')}>`;
}

export function optimizeBodyImages(html) {
  return html.replace(/<img\b[^>]*>/gi, rewriteTag);
}
