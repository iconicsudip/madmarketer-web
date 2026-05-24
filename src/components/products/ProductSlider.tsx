'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ProductSlider.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductSlider({ product }: { product: any }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = product.sliderImages || [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section className={styles.sliderSection}>
      <div className={styles.sliderContainer}>
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={images[currentSlide]}
            alt={`${product.title} interface`}
            className={styles.slideImage}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>
        
        <div className={styles.overlay}></div>

        <div className={styles.content}>
          <div className="container">
            <motion.div 
              className={styles.textWrap}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className={styles.pill}>{product.category}</span>
              <h1 className={styles.title}>{product.title}</h1>
              <p className={styles.description}>{product.description}</p>
              
              <div className={styles.actions}>
                <button className={styles.ctaPrimary}>Get a Demo</button>
                <button className={styles.ctaSecondary}>View Documentation</button>
              </div>
            </motion.div>
          </div>
        </div>

        <div className={styles.controls}>
          <button className={styles.iconBtn} onClick={prevSlide}><ChevronLeft size={20} /></button>
          <div className={styles.dots}>
            {images.map((_: any, i: number) => (
              <span 
                key={i} 
                className={`${styles.dot} ${i === currentSlide ? styles.dotActive : ''}`}
                onClick={() => setCurrentSlide(i)}
              />
            ))}
          </div>
          <button className={styles.iconBtn} onClick={nextSlide}><ChevronRight size={20} /></button>
        </div>
      </div>
    </section>
  );
}
