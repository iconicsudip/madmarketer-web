'use client';

import { motion } from 'framer-motion';
import styles from './FinalCTA.module.css';

export default function FinalCTA() {
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
          <h2 className={styles.heading}>READY TO BUILD THE FUTURE?</h2>
          <p className={styles.subheading}>
            Transform your business into an intelligent automated growth ecosystem.
            Stop managing chaos and start scaling with precision.
          </p>
          <div className={styles.actions}>
            <button className="btn btn-primary" style={{ padding: '20px 40px', fontSize: '1.25rem' }}>Start AI Consultation</button>
            <button className="btn btn-secondary" style={{ padding: '20px 40px', fontSize: '1.25rem' }}>Build Your System</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
