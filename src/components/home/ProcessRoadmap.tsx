'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './ProcessRoadmap.module.css';

gsap.registerPlugin(ScrollTrigger);

const DEFAULTS = {
  heading: 'Our Streamlined Custom Application Development Process From Idea To Launch',
  description: 'At Mad Marketer, we adopt a structured end-to-end mobile app dev roadmap created specifically to meet your business needs while developing an app.',
  s1Title: 'Discovery & Strategy',   s1Desc: 'Our app consulting team analyzes business goals, target users, market trends, and technical needs to craft a clear strategy and roadmap.',
  s2Title: 'Design & Prototyping',   s2Desc: 'Our expert UI/UX design team creates engaging interfaces, wireframes, and prototypes for smooth navigation and brand experience.',
  s3Title: 'App Development',        s3Desc: 'We build bespoke mobile apps using the selected tech stack and modern technologies like AI, and align features with platform standards.',
  s4Title: 'Testing & QA',           s4Desc: 'Our quality assurance team monitors performance, security, device compatibility, and user journeys to identify issues before release.',
  s5Title: 'Deployment & Launch',    s5Desc: 'We handle app store submissions, configurations, and release processes while meeting platform guidelines and launch requirements.',
  s6Title: 'Post-Launch Support',    s6Desc: 'Our support services cover updates, monitoring, feature improvements, and technical assistance based on user feedback.',
};

type ProcessData = Partial<typeof DEFAULTS>;

export default function ProcessRoadmap({ data = {} }: { data?: ProcessData }) {
  const d = { ...DEFAULTS, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v)) };
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  let parsedSteps = [];
  try {
    if (d.steps) {
      parsedSteps = typeof d.steps === 'string' ? JSON.parse(d.steps) : d.steps;
    }
  } catch {}

  const steps = parsedSteps.length > 0 
    ? parsedSteps.map((s: any, i: number) => ({
        num: String(i + 1).padStart(2, '0'),
        title: s.title || '',
        desc: s.desc || ''
      }))
    : [
        { num: '01', title: d.s1Title, desc: d.s1Desc },
        { num: '02', title: d.s2Title, desc: d.s2Desc },
        { num: '03', title: d.s3Title, desc: d.s3Desc },
        { num: '04', title: d.s4Title, desc: d.s4Desc },
        { num: '05', title: d.s5Title, desc: d.s5Desc },
        { num: '06', title: d.s6Title, desc: d.s6Desc },
      ];

  useGSAP(() => {
    if (!pathRef.current || !containerRef.current) return;
    const pathLength = pathRef.current.getTotalLength();
    gsap.set(pathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: containerRef.current, start: 'top center', end: 'bottom center', scrub: 1 }
    });
    tl.to(pathRef.current, { strokeDashoffset: 0, ease: 'none' }, 0);
    const cards = gsap.utils.toArray(`.${styles.card}`);
    cards.forEach((card, i) => {
      tl.fromTo(card as Element,
        { y: 50, opacity: 0, scale: 0.9, boxShadow: '0px 0px 0px rgba(237, 28, 36, 0)' },
        { y: 0, opacity: 1, scale: 1, boxShadow: '0px 0px 40px rgba(237, 28, 36, 0.15)', duration: 0.1, ease: 'back.out(1.7)' },
        i * (1 / (cards.length - 1))
      );
    });
  }, { scope: containerRef });

  return (
    <section className={styles.roadmapSection} ref={containerRef}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.heading}>
            {d.heading?.split('From Idea To Launch')[0]}
            {d.heading?.includes('From Idea To Launch') && (
              <span className={styles.redText}>From Idea To Launch</span>
            )}
            {!d.heading?.includes('From Idea To Launch') && ''}
          </h2>
          <p className={styles.description}>{d.description}</p>
        </div>

        <div className={styles.roadmapGrid}>
          <div className={styles.svgContainer}>
            <svg ref={undefined} className={styles.connectingLine} viewBox="0 0 1000 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path ref={pathRef}
                d="M 166 100 L 500 100 L 500 250 L 833 250 L 833 400 L 500 400 L 500 550 L 166 550"
                fill="none" stroke="var(--primary-red)" strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 166 100 L 500 100 L 500 250 L 833 250 L 833 400 L 500 400 L 500 550 L 166 550"
                fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {steps.map((step, i) => (
            <div key={i} className={`${styles.cardWrapper} ${styles[`cardPos${i + 1}`]}`}>
              <div className={styles.card}>
                <div className={styles.numberBadge}>{step.num}</div>
                <h3 className={styles.cardTitle}>{step.title}</h3>
                <p className={styles.cardDesc}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
