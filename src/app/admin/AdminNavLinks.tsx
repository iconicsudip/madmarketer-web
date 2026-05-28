'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, Home, Briefcase, Package, BookOpen, Layout, Star, Map } from 'lucide-react';
import styles from './admin.module.css';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pages', label: 'Pages', icon: FileText },
  { href: '/admin/blogs', label: 'Blogs', icon: BookOpen },
  { href: '/admin/portfolio', label: 'Portfolio', icon: Layout },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/settings', label: 'Global SEO', icon: Settings },
  { href: '/admin/sitemap', label: 'Sitemap & Robots', icon: Map },
  { href: '/', label: 'Public Site', icon: Home },
];

export default function AdminNavLinks() {
  const pathname = usePathname();

  return (
    <>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        // Strict exact match for /admin and / to prevent them from always being active
        // For others, we can do startsWith to highlight parent folders
        const isActive = href === '/admin' || href === '/' 
          ? pathname === href
          : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
          >
            <Icon size={20} />
            {label}
          </Link>
        );
      })}
    </>
  );
}
