import Script from 'next/script';
import Reveal from './Reveal';
import GalleryScroller from './GalleryScroller';
import HeroRotator from './HeroRotator';

// Google Analytics (property "Heaven Sent Beauty", web stream G-P5JPW00M8K). Loaded once here, so every page has it.
const GA_ID = 'G-P5JPW00M8K';

// Shared <html>/<body> for every root layout. `head` lets a layout add elements
// (for example JSON-LD) directly into <head>.
export default function SiteShell({ head = null, children }) {
  return (
    <html lang="en">
      {head ? <head>{head}</head> : null}
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
