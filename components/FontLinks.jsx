// Fonts load from link tags (parallel with the page CSS, not chained behind a CSS @import),
// with early connections to Google Fonts. Only the families the live pages use.
// Shared by every root layout, because each one renders its own <head>.
const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Italiana&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Inter:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&family=Jost:wght@300;400;500&display=swap';

export default function FontLinks() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={FONTS_URL} />
    </>
  );
}
