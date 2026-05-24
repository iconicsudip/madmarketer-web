import { prisma } from '@/lib/prisma';
import styles from './admin.module.css';

export default async function AdminDashboard() {
  const pagesCount = await prisma.page.count();

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Dashboard Overview</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div style={{ padding: '2rem', backgroundColor: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>Total Pages Published</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: '600' }}>{pagesCount}</p>
        </div>
        <div style={{ padding: '2rem', backgroundColor: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>SEO Health</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: '600', color: '#34a853' }}>Good</p>
        </div>
      </div>
    </div>
  );
}
