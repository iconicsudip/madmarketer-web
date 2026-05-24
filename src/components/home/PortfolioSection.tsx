'use client';

import { motion } from 'framer-motion';
import styles from './PortfolioSection.module.css';
import { ArrowUpRight } from 'lucide-react';

const portfolioItems = [
  {
    id: 1,
    client: 'Leva Healthcare',
    title: 'Healthcare platform connecting patients, clinics, and pharmacies with AI automation tools.',
    stats: [
      { value: '44%', label: 'Faster Reporting' },
      { value: '31%', label: 'Lower Overhead' }
    ],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    client: 'Nexus Trading',
    title: 'AI-driven trading app with real-time insights and institutional-grade market analysis.',
    stats: [
      { value: '2.5x', label: 'Trade Volume' },
      { value: '99.9%', label: 'Uptime' }
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    client: 'EcoStore Global',
    title: 'Scalable e-commerce infrastructure with dynamic pricing and custom CRM integration.',
    stats: [
      { value: '180%', label: 'Sales Growth' },
      { value: '40%', label: 'Cart Retention' }
    ],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
  }
];

export default function PortfolioSection() {
  return (
    <section className={styles.portfolioSection}>
      <div className="container">
        
        {/* Top Content */}
        <div className={styles.header}>
          <motion.h2 
            className={styles.heading}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.redText}>Custom Application</span>
            <br />Creation Solutions In Action
          </motion.h2>
          
          <motion.p 
            className={styles.description}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            We have empowered growing and large-scale enterprises with future-ready mobile apps, CRMs, and automated platforms. Real success delivered.
          </motion.p>
          
          <motion.button 
            className={styles.ctaBtn}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Build Your App <ArrowUpRight size={18} />
          </motion.button>
        </div>

        {/* Center Stacking Cards */}
        <div className={styles.cardsContainer}>
          {portfolioItems.map((item, index) => (
            <div 
              key={item.id} 
              className={styles.card}
              style={{ '--index': index } as React.CSSProperties}
            >
              <div className={styles.cardHeader}>
                <h3 className={styles.clientName}>{item.client}</h3>
                <p className={styles.cardTitle}>{item.title}</p>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.statsWrap}>
                  {item.stats.map((stat, i) => (
                    <div key={i} className={styles.statBox}>
                      <h4>{stat.value}</h4>
                      <span>{stat.label}</span>
                    </div>
                  ))}
                  
                  <button className={styles.caseStudyBtn}>
                    View Case Study <ArrowUpRight size={16} />
                  </button>
                </div>
                
                <div className={styles.imageWrap}>
                  <img src={item.image} alt={item.client} className={styles.mockupImage} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
