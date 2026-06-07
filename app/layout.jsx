import './globals.css';

export const metadata = {
  title: 'Heaven Sent Beauty · Buckeye, AZ',
  description: 'Skincare, facials, and beauty treatments tuned to your skin, your goals, and the way you want to feel walking out the door.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
