import { notFound } from 'next/navigation';

// Any URL no other route matches lands here so the 404 renders inside the (site) layout
// (site CSS and analytics), as it did when the whole site shared one root layout.
// Rendered on request; only unknown URLs ever reach it.
export const dynamic = 'force-dynamic';
export default function Missing() {
  notFound();
}
