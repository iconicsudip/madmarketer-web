import { getSiteSettings, updateSiteSettings } from '@/app/actions/cms';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import SitemapClientForm from './SitemapClientForm';

export default async function SitemapAdmin() {
  const settings = await getSiteSettings();

  // Fetch the live sitemap preview data
  const [pages, services, products, blogs, portfolio] = await Promise.all([
    prisma.page.findMany({ select: { slug: true } }),
    prisma.service.findMany({ select: { slug: true } }),
    prisma.product.findMany({ select: { id: true, link: true } }),
    prisma.blogPost.findMany({ select: { slug: true } }),
    prisma.portfolioProject.findMany({ select: { slug: true } })
  ]);

  const liveUrls = [
    { type: 'Core Page', slug: '/' },
    ...pages.map(p => ({ type: 'Page', slug: `/${p.slug}` })),
    ...services.map(s => ({ type: 'Service', slug: `/${s.slug}` })),
    ...products.map(p => ({ type: 'Product', slug: `/product/${p.link || p.id}` })),
    ...blogs.map(b => ({ type: 'Blog', slug: `/blog/${b.slug}` })),
    ...portfolio.map(p => ({ type: 'Portfolio', slug: `/portfolio/${p.slug}` })),
  ];

  const defaultRobotsTxt = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/`;

  async function handleSave(formData: FormData) {
    'use server';
    await updateSiteSettings({
      siteName: settings?.siteName || '',
      defaultMetaTitle: settings?.defaultMetaTitle || '',
      defaultMetaDesc: settings?.defaultMetaDesc || '',
      ogImage: settings?.ogImage || '',
      googleAnalyticsId: settings?.googleAnalyticsId || '',
      customScripts: settings?.customScripts || '',
      customSitemapUrls: formData.get('customSitemapUrls') as string,
      overrideSitemap: formData.get('overrideSitemap') === 'true',
      customRobotsTxt: formData.get('customRobotsTxt') as string,
    });
  }

  const inputStyle = { width: '100%', padding: '0.75rem', marginBottom: '1.5rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Sitemap & Robots.txt</h1>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Left Column: Editor */}
        <div style={{ flex: '1 1 600px', background: '#111', padding: '2rem', borderRadius: '8px', border: '1px solid #333' }}>
          <form action={handleSave}>
            <SitemapClientForm settings={settings} liveUrls={liveUrls} defaultRobotsTxt={defaultRobotsTxt} />
          </form>
        </div>

        {/* Right Column: Live Preview */}
        <div style={{ flex: '1 1 300px', background: '#1a1a1a', padding: '2rem', borderRadius: '8px', border: '1px solid #333', maxHeight: '80vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #333' }}>
            <h3 style={{ margin: 0 }}>Auto-Generated URLs</h3>
            <Link href="/sitemap.xml" target="_blank" style={{ color: '#ED1C24', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', textDecoration: 'none' }}>
              View XML <ExternalLink size={14} />
            </Link>
          </div>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>
            These {liveUrls.length} URLs are currently being automatically injected into your sitemap.xml.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {liveUrls.map((url, i) => (
              <li key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid #222', fontSize: '0.85rem' }}>
                <span style={{ color: '#ED1C24', marginRight: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold' }}>[{url.type}]</span>
                <span style={{ color: '#ccc', fontFamily: 'monospace' }}>{url.slug}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
