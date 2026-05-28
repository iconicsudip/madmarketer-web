'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, Variants, useInView, useMotionValue, useSpring } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

// Utility for dynamic icons
const DynamicIcon = ({ name, size = 24, color = "currentColor", className = "" }: any) => {
  if (!name) return null;
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} color={color} className={className} />;
};

// Spotlight Hover Wrapper
const SpotlightCard = ({ children, className = "", style = {} }: any) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
    >
      <div
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          left: 0, top: 0, right: 0, bottom: 0,
          opacity,
          transition: 'opacity 0.3s ease',
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(237,28,36,0.1), transparent 40%)`,
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
};

// Animated Number Counter
const AnimatedCounter = ({ value }: { value: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Extract number and suffix/prefix
  const match = value.match(/^([^0-9]*)([0-9.,]+)([^0-9]*)$/);
  if (!match) return <span>{value}</span>;

  const [, prefix, numStr, suffix] = match;
  const numValue = parseFloat(numStr.replace(/,/g, ''));
  const hasComma = numStr.includes(',');
  const isDecimal = numStr.includes('.');

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100, mass: 1 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (isInView) {
      motionValue.set(numValue);
    }
  }, [isInView, numValue, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      let formatted: string | number = latest;
      if (isDecimal) {
        formatted = latest.toFixed(1);
      } else {
        formatted = Math.floor(latest).toString();
      }

      if (hasComma) {
        // Add commas back
        formatted = formatted.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

      setDisplay(formatted.toString());
    });
  }, [springValue, hasComma, isDecimal]);

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
};

// Generic stagger container variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

export function ProductHeroSection({ data }: { data: Record<string, string> }) {
  const bg = 'radial-gradient(circle at center, rgba(237,28,36,0.05) 0%, var(--dark-bg) 100%)';
  
  return (
    <section style={{ background: bg, minHeight: '90vh', padding: '10rem 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>

      {/* Ambient Orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', background: 'var(--primary-red)', opacity: 0.1, filter: 'blur(150px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '30%', right: '5%', width: '500px', height: '500px', background: 'var(--primary-red)', opacity: 0.05, filter: 'blur(200px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }} />

      {/* Radar Circles */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '2000px', height: '2000px', pointerEvents: 'none', zIndex: 0 }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: `${i * 15}%`, height: `${i * 15}%`, border: '1px solid rgba(255,255,255,0.03)', borderRadius: '50%' }} />
        ))}
      </div>

      <motion.div
        className="container"
        style={{ position: 'relative', zIndex: 2, padding: '4rem 1rem' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {data.pillText && (
          <motion.div variants={itemVariants} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 1.2rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.15)', marginBottom: '2rem' }}>
            👋 {data.pillText}
          </motion.div>
        )}
        
        {data.headline && (
          <motion.h1 variants={itemVariants} style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, maxWidth: '800px', margin: '0 auto 1.5rem' }}>
            {data.headline}
          </motion.h1>
        )}
        
        <motion.p variants={itemVariants} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
          Experience the future of brand communications. Connect, verify, and start sending rich interactive messages that convert.
        </motion.p>

        <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', maxWidth: '500px', margin: '0 auto 4rem', flexWrap: 'wrap' }}>
          <input 
            type="email" 
            placeholder="Your e-mail" 
            style={{ flex: '1 1 200px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '16px 20px', borderRadius: '12px', fontSize: '1rem', outline: 'none' }} 
          />
          {data.primaryCtaText && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ flex: '0 0 auto' }}>
              <Link href={(data.primaryCtaLink && data.primaryCtaLink !== '#') ? data.primaryCtaLink : '/contact'} style={{ background: 'var(--primary-red)', color: '#fff', padding: '16px 36px', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'box-shadow 0.2s', boxShadow: '0 10px 20px rgba(237,28,36,0.3)' }}>
                {data.primaryCtaText}
              </Link>
            </motion.div>
          )}
        </motion.div>

        {data.heroImage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}
          >
            <img src={data.heroImage} alt="Dashboard Preview" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

export function ProductSplitFeaturesSection({ data }: { data: Record<string, string> }) {
  let features: { title: string; desc: string; image?: string; icon?: string }[] = [];
  try { features = JSON.parse(data.features || '[]'); } catch { }

  const [activeIdx, setActiveIdx] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    if (features.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length, isHovered]);

  const activeImage = features[activeIdx]?.image || data.image;

  return (
    <section style={{ padding: '4rem 0', background: 'var(--dark-bg)', color: '#fff' }}>
      <motion.div
        className="container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        {data.pillText && (
          <motion.div variants={itemVariants} style={{ display: 'inline-block', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            {data.pillText}
          </motion.div>
        )}
        {data.heading && <motion.h2 variants={itemVariants} style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{data.heading}</motion.h2>}
      </motion.div>

      <style>{`
        .split-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
        }
        @media (min-width: 992px) {
          .split-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
      <div className="container split-grid">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ width: '100%' }}
        >
          {activeImage && (
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              style={{ background: '#111', padding: '1.5rem', borderRadius: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #222' }}
            >
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                src={activeImage} alt="Feature" style={{ width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', borderRadius: '16px' }}
              />
            </motion.div>
          )}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', paddingLeft: '24px' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* The vertical tracking line */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#222', borderRadius: '4px' }}>
              <motion.div
                animate={{ top: `${(activeIdx / features.length) * 100}%`, height: `${100 / features.length}%` }}
                initial={false}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ position: 'absolute', left: 0, right: 0, background: 'var(--primary-red)', borderRadius: '4px' }}
              />
            </div>

            {features.map((f: any, idx: number) => {
              const isActive = idx === activeIdx;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  onClick={() => setActiveIdx(idx)}
                  whileHover={{ scale: 1.02, x: 10 }}
                  style={{
                    background: isActive ? 'rgba(237,28,36,0.1)' : '#151515',
                    border: isActive ? '1px solid rgba(237,28,36,0.3)' : '1px solid #2a2a2a',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                >
                  {f.icon && (
                    <div style={{ color: isActive ? 'var(--primary-red)' : '#fff', marginBottom: '0.75rem' }}>
                      <DynamicIcon name={f.icon} size={24} />
                    </div>
                  )}
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: isActive ? 'var(--primary-red)' : '#fff' }}>{f.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function ProductBentoGridSection({ data }: { data: Record<string, string> }) {
  let cards: { title: string; desc: string; image?: string; icon?: string; colSpan?: number; rowSpan?: number }[] = [];
  try { cards = JSON.parse(data.cards || '[]'); } catch { }

  return (
    <section style={{ padding: '8rem 0', background: 'var(--dark-bg)', color: '#fff', position: 'relative' }}>
      {/* Ambient Orb */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', background: 'var(--primary-red)', opacity: 0.03, filter: 'blur(200px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }} />

      <motion.div
        className="container"
        style={{ position: 'relative', zIndex: 2 }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          {data.pillText && (
            <motion.div variants={itemVariants} style={{ display: 'inline-block', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
              {data.pillText} →
            </motion.div>
          )}
          {data.heading && <motion.h2 variants={itemVariants} style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{data.heading}</motion.h2>}
        </div>

        <style>{`
          .bento-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .bento-card {
            grid-column: 1 / -1;
          }
          @media (min-width: 768px) {
            .bento-grid {
              grid-template-columns: repeat(12, 1fr);
            }
            .bento-card {
              grid-column: span var(--col-span, 4);
            }
          }
        `}</style>
        <div className="bento-grid">
          {cards.map((card: any, idx: number) => (
            <motion.div
              key={idx}
              className="bento-card"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              style={{ '--col-span': card.colSpan || 4, gridRow: card.rowSpan ? `span ${card.rowSpan}` : 'auto' } as React.CSSProperties}
            >
              <SpotlightCard
                style={{
                  background: ['#1a1a1a', '#151515', 'rgba(237,28,36,0.05)'][idx % 3],
                  border: '1px solid',
                  borderColor: (idx % 3 === 2) ? 'rgba(237,28,36,0.2)' : '#2a2a2a',
                  padding: '3rem',
                  borderRadius: '32px',
                  cursor: 'pointer',
                  height: '100%',
                  boxShadow: (idx % 3 === 2) ? 'inset 0 0 40px rgba(237,28,36,0.02)' : 'none'
                }}
              >
                {card.icon && !card.image && (
                  <div style={{
                    background: (idx % 3 === 2) ? 'rgba(237,28,36,0.1)' : 'rgba(255,255,255,0.05)',
                    boxShadow: (idx % 3 === 2) ? '0 0 20px rgba(237,28,36,0.2)' : '0 0 15px rgba(255,255,255,0.03)',
                    width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem',
                    color: (idx % 3 === 2) ? 'var(--primary-red)' : '#fff'
                  }}>
                    <DynamicIcon name={card.icon} size={32} />
                  </div>
                )}
                {card.image && (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                    <img src={card.image} alt={card.title} style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderRadius: '16px' }} />
                  </div>
                )}
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                  ...((idx % 3 === 2) ? {
                    background: 'linear-gradient(90deg, #fff, var(--primary-red))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  } : {})
                }}>
                  {card.title.match(/[0-9]/) ? <AnimatedCounter value={card.title} /> : card.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0, marginTop: 'auto' }}>{card.desc}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export function ProductProcessSection({ data }: { data: Record<string, string> }) {
  let steps: { title: string; desc: string; image?: string }[] = [];
  try { steps = JSON.parse(data.steps || '[]'); } catch { }

  return (
    <section style={{ padding: '8rem 0', background: 'var(--dark-bg)', color: '#fff' }}>
      <motion.div
        className="container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          {data.pillText && (
            <motion.div variants={itemVariants} style={{ display: 'inline-block', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              {data.pillText}
            </motion.div>
          )}
          {data.heading && <motion.h2 variants={itemVariants} style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{data.heading}</motion.h2>}
        </div>

        <style>{`
          .process-row {
            display: flex;
            gap: 2rem;
            position: relative;
          }
          .process-content {
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            gap: 2rem;
            align-items: center;
          }
          .process-line {
            position: absolute;
            left: 24px;
            top: 24px;
            bottom: 24px;
            width: 2px;
            background: #333;
          }
          @media (max-width: 768px) {
            .process-row {
              flex-direction: column;
              gap: 1rem;
            }
            .process-line {
              display: none;
            }
          }
        `}</style>

        <div style={{ maxWidth: '1024px', margin: '0 auto', position: 'relative' }}>
          {/* Vertical Line */}
          <div className="process-line" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="process-row"
              style={{ marginBottom: idx === steps.length - 1 ? 0 : '4rem' }}
            >
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', zIndex: 2, flexShrink: 0, border: '4px solid var(--dark-bg)' }}>
                {idx + 1}
              </div>
              <div className="process-content" style={{ background: '#151515', padding: '2.5rem', borderRadius: '24px', border: '1px solid #2a2a2a' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{step.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontSize: '1.05rem', margin: 0 }}>{step.desc}</p>
                </div>
                {step.image && (
                  <div style={{ flex: '1 1 200px', maxWidth: '300px', height: '180px', borderRadius: '16px', overflow: 'hidden' }}>
                    <img src={step.image} alt={step.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export function ProductFaqSection({ data }: { data: Record<string, string> }) {
  let faqs: { q: string; a: string }[] = [];
  try { faqs = JSON.parse(data.faqs || '[]'); } catch { }

  const [openIdx, setOpenIdx] = React.useState<number | null>(0);

  return (
    <section style={{ padding: '8rem 0', background: 'var(--dark-bg)', color: '#fff' }}>
      <motion.div
        className="container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={{ maxWidth: '1024px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          {data.pillText && (
            <motion.div variants={itemVariants} style={{ display: 'inline-block', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              {data.pillText}
            </motion.div>
          )}
          {data.heading && <motion.h2 variants={itemVariants} style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{data.heading}</motion.h2>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                style={{ background: isOpen ? '#1a1a1a' : '#111', border: isOpen ? '1px solid rgba(237,28,36,0.3)' : '1px solid #2a2a2a', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s' }}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
                >
                  {faq.q}
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>▼</motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <p style={{ padding: '0 2rem 1.5rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

export function ProductReviewsSection({ data }: { data: Record<string, string> }) {
  let reviews: { user: string; text: string; role?: string; stars?: number }[] = [];
  try { reviews = JSON.parse(data.reviews || '[]'); } catch { }

  // Distribute reviews into 3 columns
  const col1 = reviews.filter((_, i) => i % 3 === 0);
  const col2 = reviews.filter((_, i) => i % 3 === 1);
  const col3 = reviews.filter((_, i) => i % 3 === 2);

  // Duplicate for seamless infinite scrolling
  const multiply = (arr: any[]) => [...arr, ...arr, ...arr, ...arr];
  const scrollCol1 = multiply(col1.length ? col1 : reviews);
  const scrollCol2 = multiply(col2.length ? col2 : reviews);
  const scrollCol3 = multiply(col3.length ? col3 : reviews);

  const ReviewCard = ({ review }: { review: any }) => (
    <div style={{ background: '#151515', border: '1px solid #2a2a2a', padding: '2.5rem', borderRadius: '24px', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', color: '#ffd700' }}>
        {Array.from({ length: review.stars || 5 }).map((_, i) => <DynamicIcon key={i} name="Star" size={18} />)}
      </div>
      <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem', color: '#fff' }}>"{review.text}"</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-red), #ff4d4d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>
          {review.user?.charAt(0) || 'U'}
        </div>
        <div>
          <div style={{ fontWeight: 700 }}>{review.user}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{review.role || 'Customer'}</div>
        </div>
      </div>
    </div>
  );

  return (
    <section style={{ padding: '8rem 0', background: 'var(--dark-bg)', color: '#fff', overflow: 'hidden' }}>
      <div className="container" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        {data.pillText && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: 'inline-block', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            {data.pillText}
          </motion.div>
        )}
        {data.heading && <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{data.heading}</motion.h2>}
      </div>

      {/* Infinite scrolling vertical columns */}
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', height: '600px', overflow: 'hidden', position: 'relative' }}>

          {/* Top and Bottom Fade Gradients */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(to bottom, var(--dark-bg), transparent)', zIndex: 10, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(to top, var(--dark-bg), transparent)', zIndex: 10, pointerEvents: 'none' }} />

          {/* Column 1 - Scrolls Up */}
          <motion.div
            animate={{ y: ['0%', '-50%'] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {scrollCol1.map((review, idx) => <ReviewCard key={`c1-${idx}`} review={review} />)}
          </motion.div>

          {/* Column 2 - Scrolls Down */}
          <motion.div
            animate={{ y: ['-50%', '0%'] }}
            transition={{ ease: "linear", duration: 35, repeat: Infinity }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {scrollCol2.map((review, idx) => <ReviewCard key={`c2-${idx}`} review={review} />)}
          </motion.div>

          {/* Column 3 - Scrolls Up */}
          <motion.div
            animate={{ y: ['0%', '-50%'] }}
            transition={{ ease: "linear", duration: 25, repeat: Infinity }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {scrollCol3.map((review, idx) => <ReviewCard key={`c3-${idx}`} review={review} />)}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export function ProductIntegrationsSection({ data }: { data: Record<string, string> }) {
  let logos: string[] = [];
  try { logos = JSON.parse(data.logos || '[]'); } catch { }

  return (
    <section style={{ padding: '8rem 0', background: 'var(--dark-bg)', color: '#fff', overflow: 'hidden' }}>
      <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '120%', paddingTop: '60%', background: 'radial-gradient(ellipse at bottom, rgba(237,28,36,0.15) 0%, var(--dark-bg) 70%)', borderRadius: '50% 50% 0 0 / 100% 100% 0 0', zIndex: 0 }}
        />

        <motion.div
          style={{ position: 'relative', zIndex: 2, padding: '4rem 0' }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {data.pillText && (
            <motion.div variants={itemVariants} style={{ display: 'inline-block', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
              {data.pillText}
            </motion.div>
          )}
          {data.heading && <motion.h2 variants={itemVariants} style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>{data.heading}</motion.h2>}
          {data.subtext && <motion.p variants={itemVariants} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>{data.subtext}</motion.p>}

          {data.ctaText && (
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
              <Link href={(data.ctaLink && data.ctaLink !== '#') ? data.ctaLink : '/contact'} style={{ display: 'inline-flex', background: 'var(--primary-red)', color: '#fff', padding: '14px 32px', borderRadius: '50px', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', alignItems: 'center', gap: '0.5rem' }}>
                {data.ctaText} →
              </Link>
            </motion.div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginTop: '4rem' }}>
            {logos.map((logo, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.1, rotate: [-2, 2, 0] }}
                style={{ width: '80px', height: '80px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '50%', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}
              >
                <img src={logo} alt="Integration" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function ProductPricingSection({ data }: { data: Record<string, string> }) {
  const [tiers, setTiers] = React.useState<{ name: string; price: string; yearlyPrice?: string; desc?: string; features: string[] }[]>([]);
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (data.pricingSource === 'api' && data.pricingApiEndpoint) {
      setLoading(true);
      setError('');
      fetch(data.pricingApiEndpoint + '?cb=' + Date.now())
        .then(res => {
          if (!res.ok) throw new Error(`API returned status ${res.status}`);
          return res.json();
        })
        .then(apiData => {
          // Resolve data path if provided
          let extractedData = apiData;
          if (data.pricingApiDataPath) {
            const keys = data.pricingApiDataPath.split('.');
            for (const key of keys) {
              if (extractedData[key]) {
                extractedData = extractedData[key];
              } else {
                break;
              }
            }
          }

          if (Array.isArray(extractedData)) {
            // Map keys based on CMS mapping configuration
            const nameKey = data.pricingApiNameKey || 'name';
            const priceKey = data.pricingApiPriceKey || 'price';
            const yearlyPriceKey = data.pricingApiYearlyPriceKey || 'yearlyPrice';
            const featuresKey = data.pricingApiFeaturesKey || 'features';
            const descKey = data.pricingApiDescKey || 'description';

            const mappedTiers = extractedData.map((item: any) => {
              let parsedFeatures: string[] = [];
              const rawFeatures = item[featuresKey];
              if (Array.isArray(rawFeatures)) {
                parsedFeatures = rawFeatures;
              } else if (typeof rawFeatures === 'string') {
                parsedFeatures = rawFeatures.split(',').map((f: string) => f.trim()).filter((f: string) => f);
              }

              // Fallback: if no features array/string was found, try to build one from specific payloads
              if (parsedFeatures.length === 0) {
                // MadRCS
                if (item.min_credits !== undefined) parsedFeatures.push(`Min. Credits: ${Number(item.min_credits).toLocaleString()}`);
                if (item.ios_rate_extra !== undefined) parsedFeatures.push(`iOS Extra Rate: ${item.ios_rate_extra}`);
                if (item.use_ios_surcharge !== undefined) parsedFeatures.push(item.use_ios_surcharge ? 'Applies iOS Surcharge' : 'No iOS Surcharge');
                
                // DoConnect
                if (item.subUsersLimit !== undefined) parsedFeatures.push(`Up to ${item.subUsersLimit} Sub Users`);
                if (item.linksLimit !== undefined) parsedFeatures.push(`Up to ${item.linksLimit} Links`);
                if (item.leadCaptureEnabled !== undefined) parsedFeatures.push(item.leadCaptureEnabled ? 'Lead Capture Enabled' : 'No Lead Capture');
              }

              // Format price gracefully if it's a raw number
              let priceVal = item[priceKey];
              if (priceVal === undefined) priceVal = '0';
              if (typeof priceVal === 'number' || (typeof priceVal === 'string' && !isNaN(Number(priceVal)) && priceVal.trim() !== '')) {
                const num = Number(priceVal);
                if (num % 1 !== 0) {
                  priceVal = `Rs ${num.toFixed(2)}`;
                } else {
                  priceVal = `Rs ${num.toLocaleString('en-IN')}`;
                }
              }

              let yearlyPriceVal = item[yearlyPriceKey];
              if (yearlyPriceVal !== undefined) {
                if (typeof yearlyPriceVal === 'number' || (typeof yearlyPriceVal === 'string' && !isNaN(Number(yearlyPriceVal)) && yearlyPriceVal.trim() !== '')) {
                  const num = Number(yearlyPriceVal);
                  if (num % 1 !== 0) {
                    yearlyPriceVal = `Rs ${num.toFixed(2)}`;
                  } else {
                    yearlyPriceVal = `Rs ${num.toLocaleString('en-IN')}`;
                  }
                }
              }

              return {
                name: item[nameKey] || 'Unknown Plan',
                price: String(priceVal),
                yearlyPrice: yearlyPriceVal ? String(yearlyPriceVal) : undefined,
                desc: item[descKey] || '',
                features: parsedFeatures
              };
            });
            setTiers(mappedTiers);
          } else {
            throw new Error('Invalid pricing data format: expected an array');
          }
        })
        .catch(err => {
          console.error('Pricing API Error:', err);
          setError(`Error loading pricing data: ${err.message}. Please check console.`);
        })
        .finally(() => setLoading(false));
    } else {
      try {
        setTiers(JSON.parse(data.pricing || '[]'));
      } catch {
        setTiers([]);
      }
    }
  }, [
    data.pricingSource,
    data.pricingApiEndpoint,
    data.pricing,
    data.pricingApiDataPath,
    data.pricingApiNameKey,
    data.pricingApiPriceKey,
    data.pricingApiFeaturesKey
  ]);

  return (
    <section style={{ padding: '8rem 0', background: 'var(--dark-bg)', color: '#fff' }}>
      <motion.div
        className="container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          {data.pillText && (
            <motion.div variants={itemVariants} style={{ display: 'inline-block', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              {data.pillText}
            </motion.div>
          )}
          {data.heading && <motion.h2 variants={itemVariants} style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>{data.heading}</motion.h2>}
          {data.subtext && <motion.p variants={itemVariants} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>{data.subtext}</motion.p>}
        </div>

        {tiers.some(t => t.yearlyPrice) && !loading && !error && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
            <div style={{ background: '#111', padding: '0.35rem', borderRadius: '50px', border: '1px solid #333', display: 'inline-flex' }}>
              <button 
                onClick={() => setBillingCycle('monthly')}
                style={{ padding: '0.6rem 2rem', borderRadius: '50px', border: 'none', background: billingCycle === 'monthly' ? '#222' : 'transparent', color: billingCycle === 'monthly' ? '#fff' : '#888', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.95rem' }}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('yearly')}
                style={{ padding: '0.6rem 2rem', borderRadius: '50px', border: 'none', background: billingCycle === 'yearly' ? '#222' : 'transparent', color: billingCycle === 'yearly' ? '#fff' : '#888', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.95rem' }}
              >
                Yearly
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'rgba(255,255,255,0.7)' }}>Loading pricing...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--primary-red)' }}>{error}</div>
        ) : tiers.length === 0 ? (
          <div style={{ color: '#888', padding: '2rem', textAlign: 'center' }}>
            No pricing plans configured. Check CMS API configuration or seed data.
            <br />
            <small>Source: {data.pricingSource}, Endpoint: {data.pricingApiEndpoint}</small>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {tiers.map((tier, idx) => {
              const pillColors = [
                { bg: 'rgba(139, 92, 246, 0.15)', text: '#A78BFA' }, // Purple
                { bg: 'rgba(148, 163, 184, 0.15)', text: '#CBD5E1' }, // Slate
                { bg: 'rgba(245, 158, 11, 0.15)', text: '#FCD34D' }, // Orange
                { bg: 'rgba(6, 182, 212, 0.15)', text: '#67E8F9' }, // Cyan
              ];
              const c = pillColors[idx % pillColors.length];

              // Parse price safely
              let currency = '';
              const activePrice = billingCycle === 'yearly' && tier.yearlyPrice ? tier.yearlyPrice : tier.price;
              let amount = activePrice;
              if (activePrice.startsWith('Rs ')) {
                currency = 'Rs';
                amount = activePrice.replace('Rs ', '');
              } else if (activePrice.startsWith('Rs. ')) {
                currency = 'Rs';
                amount = activePrice.replace('Rs. ', '');
              } else if (activePrice.startsWith('$')) {
                currency = 'Rs';
                amount = activePrice.replace('$', '');
              }
              
              const activeUnit = billingCycle === 'yearly' && tier.yearlyPrice ? (data.priceUnitYearly || '/yr') : (data.priceUnit || '/mo');

              return (
                <div
                  key={idx}
                  style={{ background: '#111', border: '1px solid #222', padding: '3rem 2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <div style={{ background: c.bg, color: c.text, padding: '0.4rem 1.2rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2rem' }}>
                    {tier.name}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{currency}</span>
                    <span style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff' }}>{amount}</span>
                    <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{activeUnit}</span>
                  </div>

                  <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', marginBottom: '3rem', textAlign: 'center', lineHeight: '1.5' }}>
                    {tier.desc || 'Tailored for your business scale'}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', marginBottom: '3rem', marginTop: 'auto' }}>
                    {tier.features?.map((f: string, fIdx: number) => (
                      <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.95rem', fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>
                        <DynamicIcon name="Check" size={20} color="#10B981" className="flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/contact" style={{ display: 'block', width: '100%', textDecoration: 'none' }}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ width: '100%', background: '#fff', color: '#000', padding: '16px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', textAlign: 'center' }}
                    >
                      Select Plan
                    </motion.div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </section>
  );
}
