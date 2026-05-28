'use client';

import { motion } from 'framer-motion';
import styles from './PortfolioSection.module.css';
import { ArrowUpRight } from 'lucide-react';

type Stat = { value: string; label: string };

type PortfolioItem = {
  id: string;
  client: string;
  title: string;
  image: string;
  stats?: string | null; // JSON string of Stat[]
};

function parseStats(raw?: string | null): Stat[] {
  try { return raw ? JSON.parse(raw) : []; } catch { return []; }
}

export default function PortfolioSection({ items }: { items: PortfolioItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className={styles.portfolioSection}>
      <div className="container">
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
            We have empowered growing and large-scale enterprises with future-ready mobile apps, CRMs, and automated platforms.
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

        <div className={styles.cardsContainer}>
          {items.map((item, index) => {
            const stats = parseStats(item.stats);
            return (
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
                    {stats.map((stat, i) => (
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
