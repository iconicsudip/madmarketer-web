export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { LayoutDashboard, FileText, Settings, Home, Briefcase, Package, BookOpen, Layout, Star, Map, LogOut, Menu } from 'lucide-react';
import AdminNavLinks from './AdminNavLinks';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.adminLayout}>
      <input type="checkbox" id="mobile-menu-toggle" className={styles.mobileMenuToggle} />
      
      <div className={styles.mobileTopBar}>
        <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>SEO Admin</h2>
        <label htmlFor="mobile-menu-toggle" className={styles.hamburger}>
          <Menu size={28} />
        </label>
      </div>

      <label htmlFor="mobile-menu-toggle" className={styles.mobileOverlay}></label>

      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>SEO Admin</h2>
        </div>
        <nav className={styles.sidebarNav}>
          <AdminNavLinks />
          <form action={async () => {
            'use server';
            const { logoutAction } = await import('@/app/actions/auth');
            await logoutAction();
          }} style={{ display: 'inline-block' }}>
            <button type="submit" className={styles.navItem} style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#ff6b6b' }}>
              <LogOut size={20} />
              Logout
            </button>
          </form>
        </nav>

      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
