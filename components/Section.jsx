export default function Section({ version = 'v4', html }) {
  return (
    <div className={`version ${version}`} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
