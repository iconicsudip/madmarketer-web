'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './BlogSection.module.css';

const blogPosts = [
  {
    id: 1,
    title: 'The Future of AI in Enterprise Automation',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    date: 'Oct 12, 2026'
  },
  {
    id: 2,
    title: 'Why WhatsApp is the New Storefront',
    category: 'Marketing',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    date: 'Oct 08, 2026'
  },
  {
    id: 3,
    title: 'Architecting Scalable CMS Systems',
    category: 'Engineering',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    date: 'Sep 29, 2026'
  }
];

export default function BlogSection() {
  return (
    <section className={styles.blogSection}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.heading}>Latest Insights</h2>
          <Link href="/blog" className={styles.viewAllBtn}>Read the Blog</Link>
        </div>

        <div className={styles.grid}>
          {blogPosts.map((post, idx) => {
            const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return (
              <motion.div 
                key={post.id}
                className={styles.blogCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <Link href={`/blog/${slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                  <div className={styles.imageWrapper}>
                    <img src={post.image} alt={post.title} className={styles.image} />
                  </div>
                  <div className={styles.content}>
                    <div className={styles.meta}>
                      <span className={styles.category}>{post.category}</span>
                      <span className={styles.date}>{post.date}</span>
                    </div>
                    <h3 className={styles.title}>{post.title}</h3>
                    <span className={styles.readMore}>Read Article &rarr;</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
