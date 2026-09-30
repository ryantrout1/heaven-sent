// Single source of truth for business facts used by new code (blog, JSON-LD, sitemap).
// Every value here already appears on the live site; do not add facts that are not on it.
export const SITE_URL = 'https://www.heavensentbeautyspa.com';
export const BUSINESS_NAME = 'Heaven Sent Beauty';
export const VAGARO_URL = 'https://www.vagaro.com/monroesalonandspa';
export const INSTAGRAM_URL = 'https://www.instagram.com/_heaven.sent.beauty_/';
export const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61555368916271';
export const LOGO_PATH = '/images/img-0da5a4aad9.png';
export const DEFAULT_OG_IMAGE_PATH = '/images/og-default.jpg';

export function absoluteUrl(p) {
  return `${SITE_URL}${p === '/' ? '' : p}`;
}
