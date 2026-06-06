'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './WhyChooseUs.module.css';
import { ShieldCheck, Cpu, HeartHandshake, Lightbulb, RefreshCw, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ICONS = [Award, Cpu, HeartHandshake, Lightbulb, RefreshCw, ShieldCheck];
const COLORS = ['#FFD700', '#7c4dff', '#ff4081', '#2979ff', '#00e676', '#ff3d00'];

const DEFAULTS = {
  heading: 'Why Choose Mad Marketer?',
  description: `Here's why businesses choose us to handle their digital and infrastructure needs:`,
  r1Title: 'Expertise',          r1Desc: 'We leverage over 15 years of experience to deliver high-quality, tailored solutions for every client.',
  r2Title: 'Custom Solutions',   r2Desc: 'Each solution is personalized, ensuring that your business gets the exact tools it needs to succeed.',
  r3Title: 'Customer-Focused',   r3Desc: 'We prioritize your satisfaction and aim to exceed your expectations in every project we take on.',
  r4Title: 'Innovation',         r4Desc: 'We stay ahead of the curve, implementing the latest technologies to keep your business on the cutting edge.',
  r5Title: 'Flexibility',        r5Desc: 'We understand that businesses change, and we offer solutions that can adapt to your evolving needs.',
  r6Title: 'Quality Commitment', r6Desc: 'We are committed to delivering solutions that meet the highest standards of quality, ensuring long-term success.',
};

type WhyData = Partial<typeof DEFAULTS>;

export default function WhyChooseUs({ data = {} }: { data?: WhyData }) {
  const d = { ...DEFAULTS, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v)) };
  const sectionRef = useRef<HTMLDivElement>(null);

  let parsedFeatures = [];
  try {
    if (d.features) {
      parsedFeatures = typeof d.features === 'string' ? JSON.parse(d.features) : d.features;
    }
  } catch {}

  const reasons = parsedFeatures.length > 0 
    ? parsedFeatures.map((f: any) => ({
        title: f.title || '',
        desc: f.desc || ''
      }))
    : [
        { title: d.r1Title, desc: d.r1Desc },
        { title: d.r2Title, desc: d.r2Desc },
        { title: d.r3Title, desc: d.r3Desc },
        { title: d.r4Title, desc: d.r4Desc },
        { title: d.r5Title, desc: d.r5Desc },
        { title: d.r6Title, desc: d.r6Desc },
      ];

  useGSAP(() => {
    if (!sectionRef.current) return;
    const cards = gsap.utils.toArray(`.${styles.cardWrapper}`);
    cards.forEach((card: any, i) => {
      const isLeft = i % 2 === 0;
      gsap.fromTo(card,
        { opacity: 0, x: isLeft ? -50 : 50, y: 50, rotation: 0 },
        { opacity: 1, x: 0, y: 0, rotation: isLeft ? -4 : 4, duration: 0.8, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none reverse' }
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <section className={styles.whySection} ref={sectionRef}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.heading}>
            Why <span className={styles.italicRed}>Choose</span> Mad Marketer?
          </h2>
          {d.heading !== DEFAULTS.heading && (
            <h2 className={styles.heading} style={{ display: 'none' }}>{d.heading}</h2>
          )}
          <p className={styles.description}>{d.description}</p>
        </div>

        <div className={styles.timeline}>
          <div className={styles.svgLineWrapper}>
            <svg viewBox="0 0 100 1000" preserveAspectRatio="none" className={styles.dashedCurve}>
              <path d="M 50 0 C 10 150, 90 250, 50 333 C 10 450, 90 550, 50 666 C 10 750, 90 850, 50 1000"
                fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="10 10" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>

          {reasons.map((reason, index) => {
            const Icon = ICONS[index];
            const color = COLORS[index];
            const isLeft = index % 2 === 0;
            return (
              <div key={index} className={`${styles.cardWrapper} ${isLeft ? styles.leftCard : styles.rightCard}`}>
                <div className={styles.card}>
                  <div className={styles.orb} style={{ backgroundColor: color, boxShadow: `0 10px 30px ${color}66` }}>
                    <Icon size={24} color={['#FFD700', '#00e676'].includes(color) ? '#000' : '#fff'} />
                  </div>
                  <h3 className={styles.cardTitle}>{reason.title}</h3>
                  <p className={styles.cardDesc}>{reason.desc}</p>
                  <div className={styles.cardGlow} style={{ background: `linear-gradient(to top right, transparent, ${color}11)` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
