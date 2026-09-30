export default function Breadcrumbs({ items }) {
  return (
    <nav className="blog-crumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((b, i) => (
          <li key={b.href}>
            {i < items.length - 1 ? <a href={b.href}>{b.name}</a> : <span aria-current="page">{b.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
