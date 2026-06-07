import sections from '../lib/sections.json';
export default function Nav() {
  return <div className="version v4" dangerouslySetInnerHTML={{ __html: sections.nav }} />;
}
