import Script from 'next/script';
import './globals.css';
import Reveal from '../components/Reveal';
import GalleryScroller from '../components/GalleryScroller';
import HeroRotator from '../components/HeroRotator';

export const metadata = {
  title: 'Heaven Sent Beauty · Buckeye, AZ',
  description: 'Skincare, facials, and beauty treatments tuned to your skin, your goals, and the way you want to feel walking out the door.',
};

// Google Analytics (property "Heaven Sent Beauty", web stream G-P5JPW00M8K). Loaded once here, so every page has it.
const GA_ID = 'G-P5JPW00M8K';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <script dangerouslySetInnerHTML={{ __html: "try{document.documentElement.classList.add('js')}catch(e){}" }} />
        {children}
        <Reveal />
        <GalleryScroller />
        <HeroRotator />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
      </body>
    </html>
  );
}
