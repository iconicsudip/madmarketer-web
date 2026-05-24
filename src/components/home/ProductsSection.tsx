'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import styles from './ProductsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: 'madrcs',
    title: 'MADRCS',
    description: 'Next-generation rich communication services. Engage your customers with interactive, app-like experiences directly in their native messaging app.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    pill: 'Business Portal',
    link: '/products/madrcs',
    glowColor: 'rgba(237, 28, 36, 0.4)' // Red glow
  },
  {
    id: 'doconnect',
    title: 'DOCONNECT',
    description: 'Unified AI Business Command Center. Centralize your CRM, WhatsApp API, chatbots, and automation pipelines in one powerful OS.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    pill: 'Operating System',
    link: '/products/doconnect',
    glowColor: 'rgba(255, 255, 255, 0.15)' // Subtle white glow
  }
];

// Extracted Card component to manage individual 3D hover states
function ProductCard({ product }: { product: typeof products[0] }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the mouse movement
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  // Map mouse position to rotation angles (max 10 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate percentage from center (-0.5 to 0.5)
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    // Snap back to center
    x.set(0);
    y.set(0);
  };

  return (
    <div className={`${styles.productCardWrapper} productCardWrapper`}>
      <motion.div 
        className={styles.productCard}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          boxShadow: `0 0 0 1px rgba(255,255,255,0.05)`
        }}
        whileHover={{
          boxShadow: `0 20px 50px ${product.glowColor}, 0 0 0 1px rgba(255,255,255,0.15)`,
          scale: 1.02
        }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.cardImageContainer} style={{ transform: "translateZ(30px)" }}>
          <div className={styles.pill}>{product.pill}</div>
          <img 
            src={product.image} 
            alt={product.title} 
            className={styles.productImg}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>

        <div className={styles.cardContent} style={{ transform: "translateZ(40px)" }}>
          <h3 className={styles.productTitle}>{product.title}</h3>
          <p className={styles.productDesc}>{product.description}</p>
          
          <div className={styles.cardActions} style={{ transform: "translateZ(20px)" }}>
            <Link href={product.link} className={styles.learnMoreBtn}>
              Learn More
            </Link>
            <Link href="/contact" className={styles.demoBtn}>
              Get Demo
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProductsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const wrappers = gsap.utils.toArray('.productCardWrapper');
    
    // Unfold from center: Left card slides left, Right card slides right
    gsap.fromTo(wrappers, 
      { 
        x: (i) => i === 0 ? 100 : -100, 
        opacity: 0, 
        scale: 0.9 
      },
      { 
        x: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 1.2, 
        ease: "power3.out", 
        stagger: 0.1,
        scrollTrigger: { 
          trigger: containerRef.current, 
          start: "top 70%",
        } 
      }
    );

  }, { scope: containerRef });

  return (
    <section className={styles.productsSection} ref={containerRef}>
      <div className="container">
        
        {/* Intentionally removing massive heading here since the user's screenshot focuses entirely on the vast cards */}

        <div className={styles.cardsContainer} style={{ perspective: "1500px" }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
      </div>
    </section>
  );
}
