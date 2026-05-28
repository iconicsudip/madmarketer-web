import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [pagesCount, blogsCount, portfolioCount, reviewsCount, servicesCount, productsCount, sectionsCount] = await Promise.all([
    prisma.page.count(),
    prisma.blogPost.count(),
    prisma.portfolioProject.count(),
    prisma.testimonial.count(),
    prisma.service.count(),
    prisma.product.count(),
    prisma.pageSection.count(),
  ]);

  const recentBlogs = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' }, take: 3 });
  const recentPortfolio = await prisma.portfolioProject.findMany({ orderBy: { createdAt: 'desc' }, take: 3 });
  const recentReviews = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' }, take: 3 });

  const stats = [
    { label: 'Pages',      value: pagesCount,     icon: '📄', href: '/admin/pages',     color: '#3b82f6' },
    { label: 'Sections',   value: sectionsCount,   icon: '🧩', href: '/admin/pages',     color: '#8b5cf6' },
    { label: 'Blog Posts', value: blogsCount,      icon: '✍️', href: '/admin/blogs',     color: '#f59e0b' },
    { label: 'Portfolio',  value: portfolioCount,  icon: '🖼️', href: '/admin/portfolio', color: '#10b981' },
    { label: 'Reviews',    value: reviewsCount,    icon: '⭐', href: '/admin/reviews',   color: '#f59e0b' },
    { label: 'Services',   value: servicesCount,   icon: '⚙️', href: '/admin/services',  color: '#06b6d4' },
    { label: 'Products',   value: productsCount,   icon: '📦', href: '/admin/products',  color: '#ec4899' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, background: 'linear-gradient(135deg, #fff 0%, #888 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Dashboard
        </h1>
        <p style={{ color: '#555', margin: '0.4rem 0 0', fontSize: '0.9rem' }}>All content managed here flows live to the public site.</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {stats.map(s => (
          <Link key={s.label} href={s.href} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: '#0d0d0d', border: `1px solid ${s.color}22`, borderRadius: '12px', padding: '1.25rem', transition: 'border-color 0.2s, transform 0.15s', cursor: 'pointer' }}
              onMouseEnter={undefined}
            >
              <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: '#666', marginTop: '0.3rem', fontWeight: 500 }}>{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

        {/* Recent Blog Posts */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ✍️ Recent Blog Posts
            </h2>
            <Link href="/admin/blogs" style={{ color: '#ED1C24', textDecoration: 'none', fontSize: '0.78rem' }}>Manage →</Link>
          </div>
          {recentBlogs.length === 0 ? (
            <p style={{ color: '#444', fontSize: '0.85rem', margin: 0 }}>No posts yet. <Link href="/admin/blogs" style={{ color: '#ED1C24', textDecoration: 'none' }}>Add one →</Link></p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentBlogs.map(b => (
                <div key={b.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  {b.image && <img src={b.image} alt={b.title} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} />}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                    <div style={{ fontSize: '0.72rem', color: '#555' }}>{b.category} · {b.date || 'No date'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Portfolio */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🖼️ Portfolio Projects
            </h2>
            <Link href="/admin/portfolio" style={{ color: '#ED1C24', textDecoration: 'none', fontSize: '0.78rem' }}>Manage →</Link>
          </div>
          {recentPortfolio.length === 0 ? (
            <p style={{ color: '#444', fontSize: '0.85rem', margin: 0 }}>No projects yet. <Link href="/admin/portfolio" style={{ color: '#ED1C24', textDecoration: 'none' }}>Add one →</Link></p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentPortfolio.map(p => (
                <div key={p.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  {p.image && <img src={p.image} alt={p.client} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} />}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.client}</div>
                    <div style={{ fontSize: '0.72rem', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reviews */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ⭐ Recent Reviews
            </h2>
            <Link href="/admin/reviews" style={{ color: '#ED1C24', textDecoration: 'none', fontSize: '0.78rem' }}>Manage →</Link>
          </div>
          {recentReviews.length === 0 ? (
            <p style={{ color: '#444', fontSize: '0.85rem', margin: 0 }}>No reviews yet. <Link href="/admin/reviews" style={{ color: '#ED1C24', textDecoration: 'none' }}>Add one →</Link></p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentReviews.map(r => (
                <div key={r.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{r.name}</span>
                    <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>{'★'.repeat(r.rating)}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#555', marginBottom: '0.4rem' }}>{r.role} · {r.company}</div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Quick actions */}
      <div style={{ marginTop: '2rem', background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '1.5rem' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {[
            { label: '+ New Page',        href: '/admin/pages/new' },
            { label: '+ New Blog Post',   href: '/admin/blogs' },
            { label: '+ Portfolio Item',  href: '/admin/portfolio' },
            { label: '+ Review',          href: '/admin/reviews' },
            { label: '↗ View Site',       href: '/', target: '_blank' },
          ].map(a => (
            <Link key={a.label} href={a.href} target={a.target}
              style={{ background: '#111', border: '1px solid #2a2a2a', color: '#ccc', borderRadius: '8px', padding: '0.5rem 1rem', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
