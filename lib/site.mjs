// Business facts used across the site (blog, JSON-LD, sitemap). The name, booking link and social
// links come from content/business.json, which the Miloe engine keeps in step with the business's
// facts (lib/business.mjs). Change them in the engine, not here.
import { BUSINESS } from './business.mjs';

export const SITE_URL = 'https://www.heavensentbeautyspa.com';
export const BUSINESS_NAME = BUSINESS.name;
/** The booking link (Vagaro). The name is kept so older code reads the same. */
export const VAGARO_URL = BUSINESS.bookingLink;
export const INSTAGRAM_URL = BUSINESS.instagramUrl;
export const FACEBOOK_URL = BUSINESS.facebookUrl;
export const LOGO_PATH = '/images/img-0da5a4aad9.png';
/** The logo search engines read: the one the engine keeps on every channel, else the site's own file. The nav and footer keep the see-through original. */
export const LOGO_URL = BUSINESS.logo || `${SITE_URL}${LOGO_PATH}`;
export const DEFAULT_OG_IMAGE_PATH = '/images/og-default.jpg';

export function absoluteUrl(p) {
  return `${SITE_URL}${p === '/' ? '' : p}`;
}
