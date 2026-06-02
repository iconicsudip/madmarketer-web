'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';
import CTAButton from '@/components/CTAButton';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '#' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const megaMenuCategories = [
    {
      title: 'Development',
      basePath: '/services/development',
      links: [
        { name: 'Website Development', slug: 'website-development' },
        { name: 'App Development', slug: 'app-development' },
        { name: 'Android App Development', slug: 'android-app-development' },
        { name: 'iOS App Development', slug: 'ios-app-development' },
        { name: 'Custom TOOLS Development', slug: 'custom-tools-development' },
        { name: 'E-commerce Development', slug: 'ecommerce-development' },
        { name: 'Shopify Development', slug: 'shopify-development' },
        { name: 'WordPress / WooCommerce', slug: 'wordpress-woocommerce-development' },
      ]
    },
    {
      title: 'Marketing',
      basePath: '/services/marketing',
      links: [
        { name: 'Digital Marketing', slug: 'digital-marketing' },
        { name: 'SEO', slug: 'seo' },
        { name: 'Social Media Marketing', slug: 'social-media-marketing' },
        { name: 'Email Marketing', slug: 'email-marketing' },
        { name: 'Paid Ads', slug: 'paid-ads' },
        { name: 'Google Ads', slug: 'google-ads' },
        { name: 'TikTok Marketing', slug: 'tiktok-marketing' },
      ]
    },
    {
      title: 'Marketplace',
      basePath: '/services/marketplace',
      links: [
        { name: 'Amazon Listing', slug: 'amazon-listing' },
        { name: 'Etsy Listing', slug: 'etsy-listing' },
        { name: 'Marketplace Management', slug: 'marketplace-management' },
      ]
    },
    {
      title: 'Tools',
      basePath: '/services/tools',
      links: [
        { name: 'DoConnect', slug: 'doconnect' },
        { name: 'MadRCS', slug: 'madrcs' },
      ]
    },
    {
      title: 'Plugins',
      basePath: '/services/plugins',
      links: [
        { name: 'Multi Listing Tools', slug: 'multi-listing-tools' },
        { name: 'WhatsApp Multi Number', slug: 'whatsapp-multi-number' },
      ]
    }
  ];

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logoLink}>
            <img src="/logo.png" alt="Mad Marketer" className={styles.logoImage} />
          </Link>
        </div>

        <div className={styles.navLinks}>
          {navItems.map((item) => (
            <div key={item.name} className={styles.navItemWrapper}>
              {item.path === '#' ? (
                <span className={`${styles.navLink} ${styles.navLinkCursor}`}>
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className={`${styles.navLink} ${pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path)) ? styles.active : ''}`}
                >
                  {item.name}
                </Link>
              )}

              {/* Products Dropdown */}
              {item.name === 'Products' && (
                <div className={styles.dropdownContent}>
                  <Link href="/services">All Services</Link>
                  <Link href="/products">All Products</Link>
                  <Link href="/services/tools/doconnect">DoConnect OS</Link>
                  <Link href="/services/tools/madrcs">MadRCS</Link>
                </div>
              )}

              {/* Mega Menu Dropdown for Services */}
              {item.name === 'Services' && (
                <div className={styles.megaMenu}>
                  <div className={styles.megaMenuInner}>
                    <div className={styles.megaHeader}>
                      <h3>OUR SERVICES</h3>
                      <p>Explore the comprehensive suite of tools and systems we use to scale your business.</p>
                    </div>
                    <div className={styles.megaGrid}>
                      {megaMenuCategories.map((cat, idx) => (
                        <div key={idx} className={styles.megaCategory}>
                          <h4 className={styles.megaCategoryTitle}>{cat.title}</h4>
                          <ul className={styles.megaCategoryList}>
                            {cat.links.map(link => (
                              <li key={link.slug}>
                                <Link href={`${cat.basePath}/${link.slug}`} className={styles.megaSubLink}>
                                  {link.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.ctaContainer}>
          <CTAButton href="/contact" className={styles.ctaButton}>
            Start Consultation
          </CTAButton>

          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`${styles.mobileDrawer} ${mobileMenuOpen ? styles.mobileDrawerOpen : ''}`}>
        <div className={styles.mobileDrawerInner}>
          {navItems.map((item) => (
            <div key={item.name} className={styles.mobileNavItem}>
              {item.path === '#' ? (
                <span className={styles.mobileNavLink}>{item.name}</span>
              ) : (
                <Link
                  href={item.path}
                  className={styles.mobileNavLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )}

              {/* Simplified Mobile Mega Menu */}
              {item.name === 'Services' && (
                <div className={styles.mobileSubMenu}>
                  {megaMenuCategories.map((cat, idx) => (
                    <div key={idx} className={styles.mobileCategory}>
                      <h4 className={styles.mobileCategoryTitle}>{cat.title}</h4>
                      <ul className={styles.mobileCategoryList}>
                        {cat.links.map(link => (
                          <li key={link.slug}>
                            <Link
                              href={`${cat.basePath}/${link.slug}`}
                              className={styles.mobileSubLink}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <CTAButton
            href="/contact"
            className={styles.mobileCtaButton}
            onClick={() => setMobileMenuOpen(false)}
          >
            Start Consultation
          </CTAButton>
        </div>
      </div>
    </header>
  );
}
