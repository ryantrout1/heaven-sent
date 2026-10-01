// Per-page title and meta description for the main pages and the four service pages.
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
  facials: {
    title: 'Facials in Buckeye, AZ | Heaven Sent Beauty',
    description:
      'Customized, hydrating, acne, anti-aging and dermaplaning facials in Buckeye, AZ with Skin Script Rx products. One client at a time. See prices and book.',
  },
  lashes: {
    title: 'Lash Extensions in Buckeye, AZ | Heaven Sent Beauty',
    description:
      'Classic, hybrid and volume lash extensions, fills, lash lifts and lash tints in Buckeye, AZ with a licensed esthetician, one client at a time. Book online.',
  },
  brows: {
    title: 'Brow Lamination in Buckeye, AZ | Heaven Sent Beauty',
    description:
      'Brow lamination, brow shaping and brow tint in Buckeye, AZ with a licensed esthetician. Fuller, fluffier brows, one client at a time. See prices and book.',
  },
  waxing: {
    title: 'Waxing Services in Buckeye, AZ | Heaven Sent Beauty',
    description:
      'Gentle lip, underarm, full arm, bikini and Brazilian waxing in Buckeye, AZ. One client at a time with a licensed esthetician, never rushed. See prices.',
  },
};

// Full metadata for a main page: title, description, canonical URL, and social tags.
import { BUSINESS_NAME, DEFAULT_OG_IMAGE_PATH, absoluteUrl } from './site.mjs';

const PAGE_PATH = { home: '/', about: '/about', contact: '/contact', services: '/services', facials: '/services/facials', lashes: '/services/lashes', brows: '/services/brows', waxing: '/services/waxing' };

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
