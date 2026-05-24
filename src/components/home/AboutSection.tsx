'use client';

import { motion } from 'framer-motion';
import styles from './AboutSection.module.css';

export default function AboutSection() {
  return (
    <section className={styles.aboutSection}>
      {/* Massive Brand Blob on the right */}
      <div className={styles.massiveBlob}></div>

      <div className="container">
        <motion.div 
          className={styles.topContent}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className={styles.label}>ABOUT MAD MARKETER</span>
          <h2 className={styles.mainHeading}>
            Discover our intelligent systems and help shape the future of your digital business. 
            Get early access to AI infrastructure, scale your operations, and help turn these 
            <span className={styles.highlightText}> automated technologies into the growth engine you use every day.</span>
          </h2>
        </motion.div>

        <motion.div 
          className={styles.bottomContent}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className={styles.subHeading}>Life beyond the Agency</h3>
          <p className={styles.paragraph}>
            At Mad Marketer, every system begins with a bold idea: How can AI be more operational? 
            Our engineering team brings these ideas to life, giving your business access to our 
            latest innovations. Some systems outgrow our labs, and with your help, we shape them 
            into enterprise-grade infrastructure that becomes part of your everyday operations.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
