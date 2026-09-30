import '../globals.css';
import SiteShell from '../../components/SiteShell';
import { SITE_URL } from '../../lib/site.mjs';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Heaven Sent Beauty · Buckeye, AZ',
  description: 'Skincare, facials, and beauty treatments tuned to your skin, your goals, and the way you want to feel walking out the door.',
};

export default function SiteLayout({ children }) {
  return <SiteShell>{children}</SiteShell>;
}
