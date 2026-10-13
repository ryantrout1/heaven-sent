// BeautySalon (LocalBusiness) structured data for the home page, from the business facts
// (lib/business.mjs). Opening hours are given only when the facts have weekly hours.
import { BUSINESS } from './business.mjs';
import { SITE_URL, BUSINESS_NAME, INSTAGRAM_URL, FACEBOOK_URL, LOGO_PATH, absoluteUrl } from './site.mjs';

const DAY_URL = (day) => `https://schema.org/${day}`;

export function beautySalonJsonLd(b = BUSINESS) {
  const p = b.addressParts;
  const hours = Array.isArray(b.openingHours) && b.openingHours.length
    ? { openingHoursSpecification: b.openingHours.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: DAY_URL(h.dayOfWeek), opens: h.opens, closes: h.closes })) }
    : {};
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    '@id': `${SITE_URL}/#business`,
    name: BUSINESS_NAME,
    url: SITE_URL,
    image: absoluteUrl(LOGO_PATH),
    telephone: b.phoneHref.replace(/^tel:/, ''),
    address: {
      '@type': 'PostalAddress',
      streetAddress: p.street,
      addressLocality: p.city,
      addressRegion: p.region,
      postalCode: String(p.postalCode).slice(0, 5),
      addressCountry: 'US',
    },
    ...hours,
    sameAs: [INSTAGRAM_URL, FACEBOOK_URL],
  };
}
