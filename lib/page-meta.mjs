// Per-page title and meta description for the four original pages.
// Each description is unique and 140 to 160 characters; titles for About, Contact and
// Services are 50 to 60 characters. Wording uses only facts already on the site.
export const PAGE_META = {
  home: {
    title: 'Heaven Sent Beauty · Buckeye, AZ',
    description:
      'Customized facials, brow and lash artistry, and gentle waxing in a quiet Buckeye, AZ studio. One client at a time with a licensed esthetician.',
  },
  about: {
    title: 'About Your Esthetician in Buckeye AZ | Heaven Sent Beauty',
    description:
      'Meet Jayslyn Tramp, licensed esthetician and founder of Heaven Sent Beauty in Buckeye, AZ. Slow, personal skincare with one client at a time, never rushed.',
  },
  contact: {
    title: 'Contact Our Spa Studio in Buckeye AZ | Heaven Sent Beauty',
    description:
      'Contact Heaven Sent Beauty at 111 Monroe Ave STE 101, Buckeye, AZ. Hours are by appointment. Call 623-215-6084 or book online through Vagaro.',
  },
  services: {
    title: 'Facials, Lashes, Waxing in Buckeye AZ | Heaven Sent Beauty',
    description:
      'Explore facials, brow and lash services, waxing and packages at Heaven Sent Beauty in Buckeye, AZ, all using professional Skin Script Rx products.',
  },
};

// Full metadata for a main page: title, description, canonical URL, and social tags.
import { BUSINESS_NAME, DEFAULT_OG_IMAGE_PATH, absoluteUrl } from './site.mjs';

const PAGE_PATH = { home: '/', about: '/about', contact: '/contact', services: '/services' };

export function pageMetadata(key) {
  const { title, description } = PAGE_META[key];
  const url = absoluteUrl(PAGE_PATH[key]);
  const image = { url: absoluteUrl(DEFAULT_OG_IMAGE_PATH), width: 1200, height: 630, alt: BUSINESS_NAME };
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'website', title, description, url, siteName: BUSINESS_NAME, images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  };
}
