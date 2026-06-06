'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Hero.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CTAButton from '@/components/CTAButton';
import DynamicText from '@/components/DynamicText';

// Default fallback images (one at a time, full background)
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=85",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=85",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=85",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=85",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&q=85",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1600&q=85",
];

type HeroData = {
  pillText?: string;
  pillTypography?: string;
  headline?: string;
  headlineTypography?: string;
  heading?: string;
  subheadline?: string;
  subheadlineTypography?: string;
  subheading?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  carouselImages?: string;
  ctaActionType?: string;
  ctaPopupType?: string;
  ctaPopupSectionType?: string;
  ctaPopupIframeUrl?: string;
};

const DEFAULTS: HeroData = {
  headline: 'Mad Marketer',
  subheadline: 'Create intelligent growth infrastructure for your business.',
  ctaText: 'Build Your System',
  ctaLink: '/contact',
};

const AUTOPLAY_MS = 5000;

export default function Hero({ data = {} }: { data?: HeroData }) {
  const d = { ...DEFAULTS, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v)) };

  // Resolve image list: custom uploaded → default fallback
  const images: string[] = (() => {
    try {
      const parsed = JSON.parse(d.carouselImages || '[]');
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_IMAGES;
    } catch {
      return DEFAULT_IMAGES;
    }
  })();

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((next: number, dir = 1) => {
    setDirection(dir);
    setIndex((next + images.length) % images.length);
  }, [images.length]);

  const prev = () => goTo(index - 1, -1);
  const next = useCallback(() => goTo(index + 1, 1), [index, goTo]);

  // Autoplay
  useEffect(() => {
    if (paused || images.length <= 1) return;
    const t = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, next, images.length]);

  // If a single static imageUrl is set, skip carousel
  if (d.imageUrl) {
    return (
      <section className={styles.heroSection}>
        <div className={styles.bgCarouselWrapper}>
          <div className={styles.darkOverlay} />
          <img src={d.imageUrl} alt="" className={styles.bgImg} />
        </div>
        <div className={styles.organicBlob}>
          <div className={styles.blobGlow} />
        </div>
        <div className={styles.heroTextContainer}>
          <div className={styles.heroContent}>
            {d.pillText && (
              <DynamicText 
                content={d.pillText} 
                typography={d.pillTypography} 
                defaultTag="span" 
                className={styles.pillText} 
              />
            )}
            <DynamicText 
              content={d.headline || d.heading || ''} 
              typography={d.headlineTypography} 
              defaultTag="h1" 
              className={styles.heading} 
            />
            <DynamicText 
              content={d.subheadline || d.subheading || ''} 
              typography={d.subheadlineTypography} 
              defaultTag="p" 
              className={styles.subheading} 
            />
            <CTAButton href={d.ctaLink || '#'} className={styles.ctaBtn}
              actionType={d.ctaActionType} popupType={d.ctaPopupType}
              popupSectionType={d.ctaPopupSectionType} popupIframeUrl={d.ctaPopupIframeUrl}>
              {d.ctaText}
            </CTAButton>
          </div>
        </div>
      </section>
    );
  }

  const variants = {
    enter:  (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80, scale: 1.04 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit:   (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80, scale: 0.96 }),
  };

  return (
    <section
      className={styles.heroSection}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Full-screen single-image carousel ── */}
      <div className={styles.bgCarouselWrapper}>
        <div className={styles.darkOverlay} />
        <AnimatePresence custom={direction} initial={false} mode="sync">
          <motion.img
            key={index}
            src={images[index]}
            alt=""
            className={styles.bgImg}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          />
        </AnimatePresence>
      </div>

      {/* ── Decorative blob ── */}
      <motion.div
        className={styles.organicBlob}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      >
        <div className={styles.blobGlow} />
      </motion.div>

      {/* ── Centered text above blob ── */}
      <div className={styles.heroTextContainer}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut', delay: 0.35 }}
        >
          {d.pillText && (
            <DynamicText 
              content={d.pillText} 
              typography={d.pillTypography} 
              defaultTag="span" 
              className={styles.pillText} 
            />
          )}
          <DynamicText 
            content={d.headline || d.heading || ''} 
            typography={d.headlineTypography} 
            defaultTag="h1" 
            className={styles.heading} 
          />
          <DynamicText 
            content={d.subheadline || d.subheading || ''} 
            typography={d.subheadlineTypography} 
            defaultTag="p" 
            className={styles.subheading} 
          />
          <CTAButton
            href={d.ctaLink || '#'}
            className={styles.ctaBtn}
            actionType={d.ctaActionType}
            popupType={d.ctaPopupType}
            popupSectionType={d.ctaPopupSectionType}
            popupIframeUrl={d.ctaPopupIframeUrl}
          >
            {d.ctaText}
          </CTAButton>
        </motion.div>
      </div>

      {/* ── Controls ── */}
      {images.length > 1 && (
        <div className={styles.bottomInterface}>
          {/* Prev / Next arrows */}
          <button className={styles.iconBtn} onClick={prev} aria-label="Previous">
            <ChevronLeft size={16} />
          </button>

          {/* Dots */}
          <div className={styles.dots}>
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to image ${i + 1}`}
                className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
                onClick={() => goTo(i, i > index ? 1 : -1)}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className={styles.progressBar}>
            <motion.div
              className={styles.progressFill}
              animate={{ width: `${((index + 1) / images.length) * 100}%` }}
              transition={{ duration: 0.45 }}
            />
          </div>

          <button className={styles.iconBtn} onClick={next} aria-label="Next">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </section>
  );
}
