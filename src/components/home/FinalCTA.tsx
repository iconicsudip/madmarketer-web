'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './FinalCTA.module.css';

export default function FinalCTA({ data }: { data?: Record<string, string> }) {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ambientGlow}></div>
      <div className={styles.particles}></div>

      <div className={`container ${styles.ctaContainer}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.heading}>{data?.heading || 'READY TO BUILD THE FUTURE?'}</h2>
          <p className={styles.subheading}>
            {data?.subheading || 'Transform your business into an intelligent automated growth ecosystem. Stop managing chaos and start scaling with precision.'}
          </p>
          <div className={styles.actions}>
            <Link href={data?.primaryBtnLink || '/contact'} className="btn btn-primary" style={{ padding: '20px 40px', fontSize: '1.25rem' }}>
              {data?.primaryBtnText || 'Start Consultation'}
            </Link>
            <Link href={data?.secondaryBtnLink || '/contact'} className="btn btn-secondary" style={{ padding: '20px 40px', fontSize: '1.25rem' }}>
              {data?.secondaryBtnText || 'Build Your System'}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
