'use client';

import { motion } from 'framer-motion';
import styles from './AboutSection.module.css';

type AboutData = {
  label?: string;
  mainHeading?: string;
  subHeading?: string;
  paragraph?: string;
};

const DEFAULTS: AboutData = {
  label: 'ABOUT MAD MARKETER',
  mainHeading: 'Discover our intelligent systems and help shape the future of your digital business. Get early access to AI infrastructure, scale your operations, and help turn these automated technologies into the growth engine you use every day.',
  subHeading: 'Life beyond the Agency',
  paragraph: 'At Mad Marketer, every system begins with a bold idea: How can AI be more operational? Our engineering team brings these ideas to life, giving your business access to our latest innovations. Some systems outgrow our labs, and with your help, we shape them into enterprise-grade infrastructure that becomes part of your everyday operations.',
};

export default function AboutSection({ data = {} }: { data?: AboutData }) {
  const d = { ...DEFAULTS, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v)) };

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
            {d.mainHeading?.split('automated technologies')[0]}
            {d.mainHeading?.includes('automated technologies') && (
              <span className={styles.highlightText}>automated technologies{d.mainHeading.split('automated technologies')[1]}</span>
            )}
            {!d.mainHeading?.includes('automated technologies') && ''}
          </h2>
        </motion.div>

        <motion.div
          className={styles.bottomContent}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className={styles.subHeading}>{d.subHeading}</h3>
          <p className={styles.paragraph}>{d.paragraph}</p>
        </motion.div>
      </div>
    </section>
  );
}
