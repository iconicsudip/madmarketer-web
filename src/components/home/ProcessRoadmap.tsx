'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './ProcessRoadmap.module.css';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: '01',
    title: 'Discovery & Strategy',
    desc: 'Our app consulting team analyzes business goals, target users, market trends, and technical needs to craft a clear strategy and roadmap.'
  },
  {
    num: '02',
    title: 'Design & Prototyping',
    desc: 'Our expert UI/UX design team creates engaging interfaces, wireframes, and prototypes for smooth navigation and brand experience.'
  },
  {
    num: '03',
    title: 'App Development',
    desc: 'We build bespoke mobile apps using the selected tech stack and modern technologies like AI, and align features with platform standards.'
  },
  {
    num: '04',
    title: 'Testing & QA',
    desc: 'Our quality assurance team monitors performance, security, device compatibility, and user journeys to identify issues before release.'
  },
  {
    num: '05',
    title: 'Deployment & Launch',
    desc: 'We handle app store submissions, configurations, and release processes while meeting platform guidelines and launch requirements.'
  },
  {
    num: '06',
    title: 'Post-Launch Support',
    desc: 'Our support services cover updates, monitoring, feature improvements, and technical assistance based on user feedback.'
  }
];

export default function ProcessRoadmap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    if (!pathRef.current || !containerRef.current) return;

    // Get total length of the SVG path for drawing animation
    const pathLength = pathRef.current.getTotalLength();
    
    // Set initial dash array and offset to hide the line
    gsap.set(pathRef.current, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    // Create a master timeline linked to scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",     // Start drawing when section hits center of screen
        end: "bottom center",    // Finish drawing when section bottom hits center
        scrub: 1,                // Smooth scrubbing
      }
    });

    // Animate the line drawing
    tl.to(pathRef.current, {
      strokeDashoffset: 0,
      ease: "none",
    }, 0);

    // Stagger the card reveals based on timeline progress
    const cards = gsap.utils.toArray(`.${styles.card}`);
    cards.forEach((card, i) => {
      // Reveal each card evenly across the timeline duration (0 to 1 progress)
      // Card 1 at 0%, Card 2 at 20%, etc.
      const startTime = i * (1 / (cards.length - 1));
      
      tl.fromTo(card as Element, 
        { 
          y: 50, 
          opacity: 0,
          scale: 0.9,
          boxShadow: '0px 0px 0px rgba(237, 28, 36, 0)'
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          boxShadow: '0px 0px 40px rgba(237, 28, 36, 0.15)',
          duration: 0.1, 
          ease: "back.out(1.7)"
        }, 
        startTime // insert into timeline at specific calculated time
      );
    });

  }, { scope: containerRef });

  return (
    <section className={styles.roadmapSection} ref={containerRef}>
      <div className="container">
        
        <div className={styles.header}>
          <h2 className={styles.heading}>
            Our Streamlined Custom Application<br/>
            <span className={styles.redText}>Development Process From Idea To Launch</span>
          </h2>
          <p className={styles.description}>
            At Mad Marketer, we adopt a structured end-to-end mobile app dev roadmap created specifically to meet your business needs while developing an app. Among the top app developing companies in the US, our developers manage the complete lifecycle, from the discovery phase and intuitive UX/UI designs to deployment. This transparent, collaborative process ensures shorter time-to-market, predictable delivery, and high-performance AI-powered apps built with business goals in mind to maximize ROI.
          </p>
        </div>

        <div className={styles.roadmapGrid}>
          
          {/* Connecting SVG Path running behind cards */}
          <div className={styles.svgContainer}>
            <svg 
              ref={svgRef}
              className={styles.connectingLine} 
              viewBox="0 0 1000 600" 
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Complex path weaving through the 6 grid cells */}
              <path 
                ref={pathRef}
                d="M 166 100 
                   L 500 100 
                   L 500 250 
                   L 833 250 
                   L 833 400 
                   L 500 400 
                   L 500 550 
                   L 166 550" 
                fill="none" 
                stroke="var(--primary-red)" 
                strokeWidth="4" 
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path 
                d="M 166 100 
                   L 500 100 
                   L 500 250 
                   L 833 250 
                   L 833 400 
                   L 500 400 
                   L 500 550 
                   L 166 550" 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.05)" 
                strokeWidth="4" 
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ zIndex: -1, position: 'absolute' }}
              />
            </svg>
          </div>

          {/* Cards */}
          {steps.map((step, i) => (
            <div key={i} className={`${styles.cardWrapper} ${styles[`cardPos${i+1}`]}`}>
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
