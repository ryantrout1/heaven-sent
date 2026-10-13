// The business facts, from content/business.json. The Miloe engine writes that file from the
// business's facts every morning (and on Sync now), so the site, the Google listing and the socials
// say the same thing. Change the facts in the engine, not here. When the file is missing or cannot
// be read, the site falls back to what it said before the engine kept it (Oct 13, 2026).
import fs from 'node:fs';
import path from 'node:path';

const FALLBACK = {
  name: 'Heaven Sent Beauty',
  phone: '623-215-6084',
  phoneHref: 'tel:+16232156084',
  email: null,
  address: '111 Monroe Ave STE 101, Buckeye, AZ 85326',
  addressParts: { street: '111 Monroe Ave STE 101', city: 'Buckeye', region: 'AZ', postalCode: '85326' },
  bookingLink: 'https://www.vagaro.com/monroesalonandspa',
  hours: null,
  hoursLines: null,
  openingHours: null,
  holidayHours: [],
  shortDescription: null,
  description: null,
  services: [],
  serviceArea: null,
  facebookUrl: 'https://www.facebook.com/profile.php?id=61555368916271',
  instagramUrl: 'https://www.instagram.com/_heaven.sent.beauty_/',
  // The logo the engine keeps on every channel (its square, on white); null keeps the site's own file (lib/site.mjs).
  logo: null,
};

export function mergeBusiness(file) {
  const out = { ...FALLBACK };
  if (file && typeof file === 'object' && !Array.isArray(file)) {
    for (const key of Object.keys(FALLBACK)) {
      const v = file[key];
      if (v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0 && Array.isArray(FALLBACK[key]) && FALLBACK[key].length > 0)) out[key] = v;
    }
  }
  return out;
}

export function readBusiness(dir = process.cwd()) {
  try {
    return mergeBusiness(JSON.parse(fs.readFileSync(path.join(dir, 'content', 'business.json'), 'utf8')));
  } catch {
    return mergeBusiness(null);
  }
}

export const BUSINESS = readBusiness();

/** The street on one line and the town on the next, as the footer shows it. */
export function addressTwoLines(b = BUSINESS) {
  const p = b.addressParts;
  if (!p) return [b.address, ''];
  return [p.street, `${p.city}, ${p.region} ${String(p.postalCode).slice(0, 5)}`];
}

/** The address on one line, without a zip's last four. */
export function addressOneLine(b = BUSINESS) {
  const [a, c] = addressTwoLines(b);
  return c ? `${a}, ${c}` : a;
}

/**
 * The open days grouped, like "Tuesday to Wednesday 10:00 AM to 5:00 PM", then the closed days.
 * Null when the facts have no weekly hours.
 */
export function hoursSummary(b = BUSINESS) {
  const lines = b.hoursLines;
  if (!Array.isArray(lines) || lines.length !== 7) return null;
  const groups = [];
  for (const l of lines) {
    const last = groups[groups.length - 1];
    if (last && last.words === l.words) last.days.push(l.day);
    else groups.push({ words: l.words, days: [l.day] });
  }
  const span = (days) => (days.length === 1 ? days[0] : `${days[0]} to ${days[days.length - 1]}`);
  const open = groups.filter((g) => g.words !== 'Closed').map((g) => `${span(g.days)} ${g.words}`);
  const closed = lines.filter((l) => l.words === 'Closed').map((l) => l.day);
  const closedWords = closed.length ? [`closed ${closed.length === 1 ? closed[0] : `${closed.slice(0, -1).join(', ')} and ${closed[closed.length - 1]}`}`] : [];
  return [...open, ...closedWords].join('; ');
}

/** The hours in a sentence, or that visits are by appointment when the facts have no weekly hours. */
export function hoursWords(b = BUSINESS) {
  return hoursSummary(b) ?? 'By appointment';
}

// The values the site's markup (lib/sections.json) was written with, each swapped for the fact.
const MARKUP = [
  ['https://www.vagaro.com/monroesalonandspa', (b) => b.bookingLink],
  ['111 Monroe Ave STE 101<br/>Buckeye, AZ 85326', (b) => addressTwoLines(b).join('<br/>')],
  ['623-215-6084', (b) => b.phone],
  ['https://www.instagram.com/_heaven.sent.beauty_/', (b) => b.instagramUrl],
  ['https://www.facebook.com/profile.php?id=61555368916271', (b) => b.facebookUrl],
];

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The site's markup with the business facts put in. */
export function applyFacts(html, b = BUSINESS) {
  let out = html;
  for (const [from, to] of MARKUP) {
    const value = to(b);
    const safe = from.includes('<br/>') ? value.split('<br/>').map(escapeHtml).join('<br/>') : escapeHtml(value);
    out = out.split(from).join(safe);
  }
  return out;
}
