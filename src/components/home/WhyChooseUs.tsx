'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './WhyChooseUs.module.css';
import { ShieldCheck, Cpu, HeartHandshake, Lightbulb, RefreshCw, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  {
    id: 1,
    title: 'Expertise',
    desc: 'We leverage over 15 years of experience to deliver high-quality, tailored solutions for every client.',
    color: '#FFD700',
    icon: <Award size={24} color="#000" />
  },
  {
    id: 2,
    title: 'Custom Solutions',
    desc: 'Each solution is personalized, ensuring that your business gets the exact tools it needs to succeed.',
    color: '#7c4dff',
    icon: <Cpu size={24} color="#fff" />
  },
  {
    id: 3,
    title: 'Customer-Focused',
    desc: 'We prioritize your satisfaction and aim to exceed your expectations in every project we take on.',
    color: '#ff4081',
    icon: <HeartHandshake size={24} color="#fff" />
  },
  {
    id: 4,
    title: 'Innovation',
    desc: 'We stay ahead of the curve, implementing the latest technologies to keep your business on the cutting edge.',
    color: '#2979ff',
    icon: <Lightbulb size={24} color="#fff" />
  },
  {
    id: 5,
    title: 'Flexibility',
    desc: 'We understand that businesses change, and we offer solutions that can adapt to your evolving needs.',
    color: '#00e676',
    icon: <RefreshCw size={24} color="#000" />
  },
  {
    id: 6,
    title: 'Quality Commitment',
    desc: 'We are committed to delivering solutions that meet the highest standards of quality, ensuring long-term success.',
    color: '#ff3d00',
    icon: <ShieldCheck size={24} color="#fff" />
  }
];

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const cards = gsap.utils.toArray(`.${styles.cardWrapper}`);

    cards.forEach((card: any, i) => {
      // Alternate animation direction based on side
      const isLeft = i % 2 === 0;
      const xOffset = isLeft ? -50 : 50;
      const targetRotation = isLeft ? -4 : 4; // Target tilted state

      gsap.fromTo(card,
        {
          opacity: 0,
          x: xOffset,
          y: 50,
          rotation: 0 // Start flat
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: targetRotation, // Animate into the tilt!
          duration: 0.8,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
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
          <p className={styles.description}>
            Here's why businesses choose us to handle their digital and infrastructure needs:
          </p>
        </div>

        <div className={styles.timeline}>
          {/* Central curving dashed line simulation using SVG */}
          <div className={styles.svgLineWrapper}>
            <svg viewBox="0 0 100 1000" preserveAspectRatio="none" className={styles.dashedCurve}>
              <path
                d="M 50 0 
                    C 10 150, 90 250, 50 333
                    C 10 450, 90 550, 50 666
                    C 10 750, 90 850, 50 1000"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="2"
                strokeDasharray="10 10"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          {reasons.map((reason, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={reason.id}
                className={`${styles.cardWrapper} ${isLeft ? styles.leftCard : styles.rightCard}`}
              >
                <div className={styles.card}>

                  {/* Floating colored orb icon */}
                  <div
                    className={styles.orb}
                    style={{
                      backgroundColor: reason.color,
                      boxShadow: `0 10px 30px ${reason.color}66`
                    }}
                  >
                    {reason.icon}
                  </div>

                  <h3 className={styles.cardTitle}>{reason.title}</h3>
                  <p className={styles.cardDesc}>{reason.desc}</p>

                  {/* Subtle colored glow behind card text */}
                  <div
                    className={styles.cardGlow}
                    style={{ background: `linear-gradient(to top right, transparent, ${reason.color}11)` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
