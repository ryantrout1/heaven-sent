import Image from 'next/image';
import { formatDate } from '../lib/blog-schema.mjs';

export default function BlogCard({ article, priority = false }) {
  return (
    <article className="blog-card">
      {article.image ? (
        <a href={article.path} className="blog-card-img" tabIndex={-1}>
          <Image
            src={article.image}
            alt={article.imageAlt}
            width={article.imageWidth}
            height={article.imageHeight}
            sizes="(max-width: 700px) 100vw, 340px"
            priority={priority}
            loading={priority ? undefined : 'lazy'}
          />
        </a>
      ) : null}
      <div className="blog-card-body">
        <time dateTime={article.date}>{formatDate(article.date)}</time>
        <h2><a href={article.path}>{article.title}</a></h2>
        <p>{article.description}</p>
      </div>
    </article>
  );
}
