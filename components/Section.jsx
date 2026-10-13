import { applyFacts } from '../lib/business.mjs';

// The site's markup with the business facts put in (lib/business.mjs).
export default function Section({ version = 'v4', html }) {
  return (
    <div className={`version ${version}`} dangerouslySetInnerHTML={{ __html: applyFacts(html) }} />
  );
}
