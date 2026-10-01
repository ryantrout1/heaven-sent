/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { formats: ['image/avif', 'image/webp'] },
  experimental: {
    // Blog pages refresh hourly on the server (scheduled articles), and read the
    // article files and their images when they do: ship those files with them.
    outputFileTracingIncludes: {
      '/blog': ['./content/blog/**/*', './public/images/**/*'],
      '/blog/[slug]': ['./content/blog/**/*', './public/images/**/*'],
      '/blog/page/[n]': ['./content/blog/**/*', './public/images/**/*'],
      '/blog/rss.xml': ['./content/blog/**/*', './public/images/**/*'],
      '/sitemap.xml': ['./content/blog/**/*', './public/images/**/*'],
    },
  },
};
export default nextConfig;
