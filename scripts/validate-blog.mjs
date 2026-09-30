// Runs before every build (npm run build -> prebuild). Fails the build on any invalid article.
import { loadArticles } from '../lib/blog.mjs';

try {
  const list = loadArticles();
  console.log(`[blog] ${list.length} published article(s) validated`);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
