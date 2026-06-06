'use client';

import { motion } from 'framer-motion';
import styles from './AboutSection.module.css';

type AboutData = {
  label?: string;
  heading?: string;
  mainHeading?: string; // fallback
  subHeading?: string;
  description?: string;
  paragraph?: string; // fallback
  stats?: string;
  ctaText?: string;
  ctaLink?: string;
};

const DEFAULTS: AboutData = {
  label: 'ABOUT MAD MARKETER',
  heading: 'Discover our intelligent systems and help shape the future of your digital business. Get early access to AI infrastructure, scale your operations, and help turn these automated technologies into the growth engine you use every day.',
  subHeading: 'Life beyond the Agency',
  description: 'At Mad Marketer, every system begins with a bold idea: How can AI be more operational? Our engineering team brings these ideas to life, giving your business access to our latest innovations. Some systems outgrow our labs, and with your help, we shape them into enterprise-grade infrastructure that becomes part of your everyday operations.',
  stats: '[]'
};

export default function AboutSection({ data = {} }: { data?: AboutData }) {
  const d = { ...DEFAULTS, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v)) };
  
  const finalHeading = d.heading || d.mainHeading || '';
  const finalDescription = d.description || d.paragraph || '';

  let parsedStats = [];
  try {
    if (d.stats) parsedStats = typeof d.stats === 'string' ? JSON.parse(d.stats) : d.stats;
  } catch {}

  return (
    <section className={styles.aboutSection}>
      <div className={styles.massiveBlob}></div>
      <div className="container">
        <motion.div
          className={styles.topContent}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className={styles.label}>{d.label}</span>
          <h2 className={styles.mainHeading}>
            {finalHeading?.split('automated technologies')[0]}
            {finalHeading?.includes('automated technologies') && (
              <span className={styles.highlightText}>automated technologies{finalHeading.split('automated technologies')[1]}</span>
            )}
            {!finalHeading?.includes('automated technologies') && ''}
          </h2>
        </motion.div>

        <motion.div
          className={styles.bottomContent}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div style={{ flex: 1 }}>
            {d.subHeading && <h3 className={styles.subHeading}>{d.subHeading}</h3>}
            <p className={styles.paragraph}>{finalDescription}</p>
            {d.ctaText && (
              <a href={d.ctaLink || '#'} style={{ display: 'inline-block', marginTop: '2rem', padding: '1rem 2.5rem', background: 'var(--primary-red)', color: '#fff', textDecoration: 'none', borderRadius: '50px', fontWeight: 600 }}>
                {d.ctaText}
              </a>
            )}
          </div>
          
          {parsedStats.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '2rem', width: '100%', marginTop: '3rem' }}>
              {parsedStats.map((stat: any, idx: number) => (
                <div key={idx} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-red)', marginBottom: '0.25rem' }}>{stat.number}</div>
                  <div style={{ color: '#888', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
