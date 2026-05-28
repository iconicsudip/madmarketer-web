import Link from 'next/link';
import { LayoutDashboard, FileText, Settings, Home, Briefcase, Package, BookOpen, Layout, Star, Map, LogOut } from 'lucide-react';
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
          <Link href="/admin/blogs" className={styles.navItem}>
            <BookOpen size={20} />
            Blogs
          </Link>
          <Link href="/admin/portfolio" className={styles.navItem}>
            <Layout size={20} />
            Portfolio
          </Link>
          <Link href="/admin/reviews" className={styles.navItem}>
            <Star size={20} />
            Reviews
          </Link>
          <Link href="/admin/services" className={styles.navItem}>
            <Briefcase size={20} />
            Services
          </Link>
          <Link href="/admin/products" className={styles.navItem}>
            <Package size={20} />
            Products
          </Link>
          <Link href="/admin/settings" className={styles.navItem}>
            <Settings size={20} />
            Global SEO
          </Link>
          <Link href="/admin/sitemap" className={styles.navItem}>
            <Map size={20} />
            Sitemap & Robots
          </Link>
          <Link href="/" className={styles.navItem}>
            <Home size={20} />
            Public Site
          </Link>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <form action={async () => {
            'use server';
            const { logoutAction } = await import('@/app/actions/auth');
            await logoutAction();
          }}>
            <button type="submit" className={styles.navItem} style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#ff6b6b' }}>
              <LogOut size={20} />
              Logout
            </button>
          </form>
        </div>

      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
