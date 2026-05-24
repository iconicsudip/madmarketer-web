'use client';

import { motion } from 'framer-motion';
import styles from './ReviewsSection.module.css';
import { Star, Hexagon, CircleDashed, BookOpen } from 'lucide-react';

const reviews = [
  {
    id: 1,
    company: 'Wager',
    Logo: Hexagon,
    name: 'Emma Johnson',
    role: 'Senior Wealth Manager',
    content: "Mad Marketer has completely transformed how we manage our operations. The automation features saved us countless hours, allowing our team to focus on what truly matters.",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
  },
  {
    id: 2,
    company: 'Unicoin',
    Logo: CircleDashed,
    name: 'Kane Willamson',
    role: 'Senior Wealth Manager',
    content: "Mad Marketer has revolutionized our operations management. The automation features have saved us countless hours, allowing our team to concentrate on what truly matters.",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
  },
  {
    id: 3,
    company: 'BookStore',
    Logo: BookOpen,
    name: 'Taylor Swift',
    role: 'Senior Wealth Manager',
    content: "Mad Marketer has completely revolutionized our operations management. The automation features have saved us countless hours, enabling our team to focus on what truly matters.",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
  }
];

export default function ReviewsSection() {
  return (
    <section className={styles.reviewsSection}>
      <div className={styles.bgBlob}></div>
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        
        <div className={styles.header}>
          <h2 className={styles.heading}>Success stories from<br/>happy customers.</h2>
          <p className={styles.subheading}>
            Welcome to Mad Marketer, the ultimate SaaS solution designed to streamline your workflows and drive efficiency.
          </p>
        </div>

        <div className={styles.reviewsGrid}>
          {reviews.map((review, idx) => {
            const LogoIcon = review.Logo;
            return (
              <motion.div 
                key={review.id}
                className={`${styles.reviewCard} ${styles[`card${idx}`]}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                <div className={styles.companyWrap}>
                  <LogoIcon size={24} className={styles.companyIcon} />
                  <span className={styles.companyName}>{review.company}</span>
                </div>
                
                <p className={styles.content}>"{review.content}"</p>
                
                <div className={styles.stars}>
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" stroke="none" />
                  ))}
                </div>
                
                <hr className={styles.divider} />
                
                <div className={styles.author}>
                  <img src={review.avatar} alt={review.name} className={styles.avatar} />
                  <div className={styles.authorInfo}>
                    <h4 className={styles.authorName}>{review.name}</h4>
                    <p className={styles.authorRole}>{review.role}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}
