import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import PagesGrid from './PagesGrid';

function getGroupKey(slug: string): string {
  if (['', 'about', 'portfolio', 'blog', 'contact'].includes(slug)) return 'Main Navigation';
  if (slug.startsWith('services/development'))  return 'Services · Development';
  if (slug.startsWith('services/marketing'))    return 'Services · Marketing';
  if (slug.startsWith('services/marketplace'))  return 'Services · Marketplace';
  if (slug.startsWith('services/tools'))        return 'Services · Tools';
  if (slug.startsWith('services/plugins'))      return 'Services · Plugins';
  return 'Other Pages';
}

const GROUP_ORDER = [
  'Main Navigation',
  'Services · Development',
  'Services · Marketing',
  'Services · Marketplace',
  'Services · Tools',
  'Services · Plugins',
  'Other Pages',
];

export default async function AdminPages() {
  const pages = await prisma.page.findMany({
    orderBy: { createdAt: 'asc' },
    include: { sections: true },
  });

  // Build ordered groups
  const groups: Record<string, typeof pages> = Object.fromEntries(GROUP_ORDER.map(g => [g, []]));
  for (const page of pages) {
    groups[getGroupKey(page.slug)].push(page);
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, background: 'linear-gradient(135deg, #fff 0%, #888 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Manage Pages
          </h1>
          <p style={{ color: '#666', margin: '0.4rem 0 0', fontSize: '0.9rem' }}>
            {pages.length} pages · organized by navigation section
          </p>
        </div>
        <Link
          href="/admin/pages/new"
          style={{ background: 'linear-gradient(135deg, #ED1C24, #c01019)', color: '#fff', padding: '0.65rem 1.5rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 20px rgba(237,28,36,0.3)' }}
        >
          + New Page
        </Link>
      </div>

      {pages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#555' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No pages yet</p>
          <Link href="/admin/pages/new" style={{ color: '#ED1C24', textDecoration: 'none' }}>Create your first page →</Link>
        </div>
      ) : (
        <PagesGrid groups={groups} />
      )}
    </div>
  );
}
