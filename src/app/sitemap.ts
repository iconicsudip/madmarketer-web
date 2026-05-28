import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://madmarketer.net';

  const [pages, services, products, blogs, portfolio, settings] = await Promise.all([
    prisma.page.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.service.findMany({ select: { slug: true, category: true, updatedAt: true } }),
    prisma.product.findMany({ select: { id: true, link: true, updatedAt: true } }),
    prisma.blogPost.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.portfolioProject.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.siteSettings.findUnique({ where: { id: 'default' } })
  ]);

  const sitemapUrls: MetadataRoute.Sitemap = [];

  // 1. Pages
  for (const page of pages) {
    sitemapUrls.push({
      url: `${baseUrl}${page.slug ? `/${page.slug}` : ''}`,
      lastModified: page.updatedAt,
      changeFrequency: 'weekly',
      priority: page.slug === '' ? 1.0 : 0.8,
    });
  }

  // 2. Services
  for (const service of services) {
    const categorySlug = service.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    sitemapUrls.push({
      url: `${baseUrl}/services/${categorySlug}/${service.slug}`,
      lastModified: service.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // 3. Products
  // Assuming products link out, but if they have internal pages, add them here.
  // For now, only adding if link starts with /
  for (const product of products) {
    if (product.link && product.link.startsWith('/')) {
      sitemapUrls.push({
        url: `${baseUrl}${product.link}`,
        lastModified: product.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  // 4. Blogs
  for (const blog of blogs) {
    sitemapUrls.push({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt,
      changeFrequency: 'daily',
      priority: 0.7,
    });
  }

  // 5. Portfolio
  for (const item of portfolio) {
    if (item.slug) {
      sitemapUrls.push({
        url: `${baseUrl}/portfolio/${item.slug}`,
        lastModified: item.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  // 6. Custom Manual URLs from Settings
  if (settings?.customSitemapUrls) {
    const urls = settings.customSitemapUrls.split('\n').map(u => u.trim()).filter(Boolean);
    for (const url of urls) {
      sitemapUrls.push({
        url: url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
      });
    }
  }

  if (settings?.overrideSitemap) {
    return sitemapUrls.filter(u => settings.customSitemapUrls?.includes(u.url.replace(baseUrl, '')) || settings.customSitemapUrls?.includes(u.url));
  }

  return sitemapUrls;
}
