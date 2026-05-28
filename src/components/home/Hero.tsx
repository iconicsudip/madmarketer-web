'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Hero.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slide1Images = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
  "https://images.unsplash.com/photo-1531297172867-11d24177eedc?w=800&q=80",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
];

const slide2Images = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
  "https://images.unsplash.com/photo-1488229297570-58520851e868?w=800&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
  "https://images.unsplash.com/photo-1531297172867-11d24177eedc?w=800&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
];

const slides = [slide1Images, slide2Images];

type HeroData = {
  headline?: string;
  heading?: string;
  subheadline?: string;
  subheading?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
};

const DEFAULTS: HeroData = {
  headline: 'Mad Marketer',
  subheadline: 'Create intelligent growth infrastructure for your business.',
  ctaText: 'Build Your System',
  ctaLink: '/contact',
};

export default function Hero({ data = {} }: { data?: HeroData }) {
  const d = { ...DEFAULTS, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v)) };
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className={styles.bgCarouselWrapper}>
        <div className={styles.darkOverlay}></div>
        {d.imageUrl ? (
          <img src={d.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, filter: 'brightness(0.7) contrast(1.2)' }} />
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={currentSlide}
              className={styles.imageGrid}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            >
              {slides[currentSlide].map((src, i) => (
                <div key={i} className={styles.gridImgWrapper}>
                  <img src={src} alt="" className={styles.gridImg} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className={styles.centerBlobContainer}>
        <motion.div
          className={styles.organicBlob}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <div className={styles.blobGlow}></div>
          <div className={styles.heroContent}>
            <h1 className={styles.heading}>{d.headline || d.heading}</h1>
            <p className={styles.subheading}>{d.subheadline || d.subheading}</p>
            <a href={d.ctaLink} className={styles.ctaBtn}>{d.ctaText}</a>
          </div>
        </motion.div>
      </div>

      {!d.imageUrl && (
        <div className={styles.bottomInterface}>
          <div className={styles.carouselControls}>
            <button className={styles.iconBtn} onClick={() => setCurrentSlide(p => (p - 1 + slides.length) % slides.length)}>
              <ChevronLeft size={16} />
            </button>
            <div className={styles.progressBar}>
              <motion.div className={styles.progressFill} animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }} transition={{ duration: 0.5 }} />
            </div>
            <div className={styles.dots}>
              {slides.map((_, i) => (
                <span key={i} className={`${styles.dot} ${i === currentSlide ? styles.dotActive : ''}`} onClick={() => setCurrentSlide(i)} />
              ))}
            </div>
            <button className={styles.iconBtn} onClick={() => setCurrentSlide(p => (p + 1) % slides.length)}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
