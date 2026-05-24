import Link from 'next/link';
import { LayoutDashboard, FileText, Settings, Home } from 'lucide-react';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>SEO Admin</h2>
        </div>
        <nav className={styles.sidebarNav}>
          <Link href="/admin" className={styles.navItem}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/admin/pages" className={styles.navItem}>
            <FileText size={20} />
            Pages
          </Link>
          <Link href="/" className={styles.navItem}>
            <Home size={20} />
            Public Site
          </Link>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
