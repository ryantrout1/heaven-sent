import '../globals.css';
import SiteShell from '../../components/SiteShell';
import FontLinks from '../../components/FontLinks';
import { SITE_URL } from '../../lib/site.mjs';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  // Bing Webmaster Tools site ownership (msvalidate.01).
  verification: { other: { 'msvalidate.01': '0D943468C18944FF4F5E947928108EA3' } },
  title: 'Heaven Sent Beauty · Buckeye, AZ',
  description: 'Skincare, facials, and beauty treatments tuned to your skin, your goals, and the way you want to feel walking out the door.',
};

export default function SiteLayout({ children }) {
  return <SiteShell head={<FontLinks />}>{children}</SiteShell>;
}
