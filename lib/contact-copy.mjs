// Added Contact page copy. The phone, address and hours come from the business facts
// (lib/business.mjs). Parking and directions are deliberately absent until the owner supplies them.
import { BUSINESS, addressOneLine, hoursSummary } from './business.mjs';

const hours = hoursSummary();

export const CONTACT_COPY = {
  offerHeading: 'What we offer',
  offerText:
    'Heaven Sent Beauty is a spa studio in Buckeye, AZ offering customized facials, dermaplaning, brow shaping, tinting and lamination, lash lifts and tints, lash extensions with fills, and gentle waxing including lip, underarm, full arm, bikini, and Brazilian. Every service uses professional Skin Script Rx products, and every visit is one client at a time with a licensed esthetician.',
  visitHeading: 'What to expect at your first visit',
  visitIntro:
    `Every visit is by appointment, so the room is ready for you. Book online through Vagaro or call ${BUSINESS.phone}, and we will take it from there.`,
  steps: [
    { title: 'The consult', text: 'We talk through your skin and your goals before anything begins, so your treatment is built around you.' },
    { title: 'The treatment', text: 'A facial or service tailored to you, using professional, botanically-based Skin Script Rx products. One client at a time, with no rushing and no stopwatch.' },
    { title: 'Afterward', text: 'You leave with a simple way to carry your results home, and an open door whenever you are ready to return.' },
  ],
  findHeading: 'Finding the studio',
  findText:
    `Heaven Sent Beauty is at ${addressOneLine()}. ${hours ? `The studio is open ${hours}, and booking ahead is the best way to reserve your time.` : 'Hours are by appointment, so booking ahead is the best way to reserve your time.'}`,
};

export function contactWordCount() {
  const c = CONTACT_COPY;
  const text = [c.offerHeading, c.offerText, c.visitHeading, c.visitIntro, ...c.steps.flatMap((s) => [s.title, s.text]), c.findHeading, c.findText].join(' ');
  return text.split(/\s+/).filter(Boolean).length;
}
