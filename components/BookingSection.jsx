import { VAGARO_URL } from '../lib/site.mjs';

// Reuses the site's existing "book" block styling and wording.
export default function BookingSection() {
  return (
    <section className="book-block" aria-labelledby="blog-book-h">
      <div className="book-inner">
        <h2 id="blog-book-h">Your glow is <em>waiting.</em></h2>
        <p>Book your first visit and let&apos;s design a treatment around your skin, your goals, and the way you actually want to feel walking out the door.</p>
        <div className="book-actions">
          <a href={VAGARO_URL} target="_blank" rel="noopener noreferrer">Book Your Appointment</a>
          <a href="/services" className="book-secondary">View Services</a>
        </div>
      </div>
    </section>
  );
}
