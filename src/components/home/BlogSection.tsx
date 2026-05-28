'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './BlogSection.module.css';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  image: string;
  date?: string | null;
  excerpt?: string | null;
};

export default function BlogSection({ posts, showAll = false }: { posts: BlogPost[], showAll?: boolean }) {
  if (posts.length === 0) return null;

  const displayPosts = showAll ? posts : posts.slice(0, 3);

  return (
    <section className={styles.blogSection}>
      <div className="container">
        {!showAll && (
          <div className={styles.header}>
            <h2 className={styles.heading}>Latest Insights</h2>
            <Link href="/blog" className={styles.viewAllBtn}>Read the Blog</Link>
          </div>
        )}

        <div className={styles.grid}>
          {displayPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              className={styles.blogCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                <div className={styles.imageWrapper}>
                  <img src={post.image} alt={post.title} className={styles.image} />
                </div>
                <div className={styles.content}>
                  <div className={styles.meta}>
                    <span className={styles.category}>{post.category}</span>
                    {post.date && <span className={styles.date}>{post.date}</span>}
                  </div>
                  <h3 className={styles.title}>{post.title}</h3>
                  {post.excerpt && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: 1.5 }}>{post.excerpt}</p>}
                  <span className={styles.readMore}>Read Article &rarr;</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
