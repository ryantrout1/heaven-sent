import sections from '../lib/sections.json';
export default function Footer() {
  return <div className="version v4" dangerouslySetInnerHTML={{ __html: sections.footer }} />;
}
