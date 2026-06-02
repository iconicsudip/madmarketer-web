'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './FinalCTA.module.css';
import CTAButton from '@/components/CTAButton';

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
            <CTAButton
              href={data?.primaryBtnLink || '/contact'}
              className="btn btn-primary"
              style={{ padding: '20px 40px', fontSize: '1.25rem' }}
              actionType={data?.primaryBtnActionType}
              popupType={data?.primaryBtnPopupType}
              popupSectionType={data?.primaryBtnPopupSectionType}
              popupIframeUrl={data?.primaryBtnPopupIframeUrl}
            >
              {data?.primaryBtnText || 'Start Consultation'}
            </CTAButton>
            <CTAButton
              href={data?.secondaryBtnLink || '/contact'}
              className="btn btn-secondary"
              style={{ padding: '20px 40px', fontSize: '1.25rem' }}
              actionType={data?.secondaryBtnActionType}
              popupType={data?.secondaryBtnPopupType}
              popupSectionType={data?.secondaryBtnPopupSectionType}
              popupIframeUrl={data?.secondaryBtnPopupIframeUrl}
            >
              {data?.secondaryBtnText || 'Build Your System'}
            </CTAButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
