import { prisma } from '@/lib/prisma';
import styles from '../admin.module.css';
import Link from 'next/link';

export default async function AdminPages() {
  const pages = await prisma.page.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Manage Pages</h1>
        <Link href="/admin/pages/new" className="btn btn-primary">
          Create New Page
        </Link>
      </div>

      <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map(page => (
              <tr key={page.id}>
                <td style={{ fontWeight: 500 }}>{page.title}</td>
                <td style={{ color: 'var(--text-muted)' }}>/{page.slug}</td>
                <td style={{ color: 'var(--text-muted)' }}>{page.createdAt.toLocaleDateString()}</td>
                <td>
                  <Link href={`/${page.slug}`} target="_blank" style={{ color: 'var(--primary)', marginRight: '1rem' }}>View</Link>
                  <Link href={`/admin/pages/${page.id}/edit`} style={{ color: 'var(--text-muted)' }}>Edit</Link>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No pages found. Create your first SEO page!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
