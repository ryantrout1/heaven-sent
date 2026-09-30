// BeautySalon (LocalBusiness) structured data for the home page.
// Only facts already on the site. No openingHours: hours are "By appointment".
import { SITE_URL, BUSINESS_NAME, INSTAGRAM_URL, FACEBOOK_URL, LOGO_PATH, absoluteUrl } from './site.mjs';

export function beautySalonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: BUSINESS_NAME,
    url: SITE_URL,
    image: absoluteUrl(LOGO_PATH),
    telephone: '+1-623-215-6084',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '111 Monroe Ave STE 101',
      addressLocality: 'Buckeye',
      addressRegion: 'AZ',
      postalCode: '85326',
      addressCountry: 'US',
    },
    sameAs: [INSTAGRAM_URL, FACEBOOK_URL],
  };
}
