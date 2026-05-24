'use client';

import { motion } from 'framer-motion';
import styles from './ProductDetails.module.css';
import { Layers, Activity, Lock, Settings } from 'lucide-react';

export default function ProductDetails({ product }: { product: any }) {
  const features = product.features || [
    { icon: <Layers size={24} />, title: 'Seamless Integration', desc: 'Connects natively with your existing CRM and CMS platforms.' },
    { icon: <Activity size={24} />, title: 'Real-time Analytics', desc: 'Monitor your operations and traffic with sub-second latency.' },
    { icon: <Lock size={24} />, title: 'End-to-End Encryption', desc: 'Your data is secured with state-of-the-art encryption protocols.' },
    { icon: <Settings size={24} />, title: 'Total Customization', desc: 'Tailor the interface and automated pipelines to fit your brand.' },
  ];

  return (
    <section className={styles.detailsSection}>
      <div className="container">
        
        <div className={styles.splitLayout}>
          <motion.div 
            className={styles.leftCol}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.heading}>The Ultimate Toolkit</h2>
            <p className={styles.description}>
              Explore the advanced features and capabilities engineered to scale your operations effortlessly.
            </p>
          </motion.div>
          
          <div className={styles.rightCol}>
            {features.map((feat: any, idx: number) => (
              <motion.div 
                key={idx} 
                className={styles.featureBox}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className={styles.iconWrap}>{feat.icon}</div>
                <h3 className={styles.featTitle}>{feat.title}</h3>
                <p className={styles.featDesc}>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
