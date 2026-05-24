'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './ServicesEcosystem.module.css';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const allServices = [
  // DEVELOPMENT
  { id: 1, title: "Website Development", category: "Development", slug: "/services/development", desc: "Custom-coded, high-performance websites built to maximize conversion and speed.", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop" },
  { id: 2, title: "App Development", category: "Development", slug: "/services/development", desc: "End-to-end mobile application engineering for modern, scalable businesses.", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop" },
  { id: 3, title: "Android App Development", category: "Development", slug: "/services/development", desc: "Native Android applications optimized for the massive Google Play ecosystem.", image: "https://images.unsplash.com/photo-1607252656733-fd7458bc97dc?q=80&w=600&auto=format&fit=crop" },
  { id: 4, title: "iOS App Development", category: "Development", slug: "/services/development", desc: "Premium iOS applications engineered with flawless Apple ecosystem integration.", image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=600&auto=format&fit=crop" },
  { id: 5, title: "Custom Tools Development", category: "Development", slug: "/services/development", desc: "Bespoke internal software designed to automate your specific operational workflows.", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop" },
  { id: 6, title: "E-commerce Development", category: "Development", slug: "/services/development", desc: "Scalable online stores engineered with advanced conversion rate optimization.", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop" },
  { id: 7, title: "Shopify Development", category: "Development", slug: "/services/development", desc: "Custom Shopify themes, apps, and headless commerce architectures.", image: "https://images.unsplash.com/photo-1664261439535-f09bce0ca613?q=80&w=600&auto=format&fit=crop" },
  { id: 8, title: "WordPress / WooCommerce", category: "Development", slug: "/services/development", desc: "Flexible, SEO-optimized WordPress setups with powerful WooCommerce backends.", image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=600&auto=format&fit=crop" },
  // MARKETING
  { id: 9, title: "Digital Marketing", category: "Marketing", slug: "/services/marketing", desc: "Data-driven, omnichannel marketing strategies to aggressively scale acquisition.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop" },
  { id: 10, title: "SEO", category: "Marketing", slug: "/services/marketing", desc: "Deep technical and content SEO to dominate your industry's search rankings.", image: "https://images.unsplash.com/photo-1572177812156-58036aae439c?q=80&w=600&auto=format&fit=crop" },
  { id: 11, title: "Social Media", category: "Marketing", slug: "/services/marketing", desc: "Engaging organic and paid social campaigns that build cult-like brand loyalty.", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop" },
  { id: 12, title: "Google Ads", category: "Marketing", slug: "/services/marketing", desc: "High-ROI paid search and display campaigns optimized relentlessly by AI algorithms.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop" },
  // TOOLS
  { id: 19, title: "WhatsApp Marketing", category: "Tools", slug: "/services/Tools", desc: "Direct-to-consumer conversational marketing pipelines via the official WhatsApp API.", image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=600&auto=format&fit=crop" },
  { id: 20, title: "Chatbot Development", category: "Tools", slug: "/services/Tools", desc: "Intelligent AI chatbots trained on your data to automate customer support 24/7.", image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=600&auto=format&fit=crop" },
];

const filters = ["All", "Development", "Marketing", "Tools"];

export default function ServicesEcosystem() {
  const [activeFilter, setActiveFilter] = useState("All");
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const filteredServices = activeFilter === "All" 
    ? allServices 
    : allServices.filter(s => s.category === activeFilter);

  useGSAP(() => {
    // Kill old triggers before refreshing
    ScrollTrigger.getAll().forEach(t => t.kill());

    if (!containerRef.current || !trackRef.current) return;

    // CRUCIAL: Reset the track position when filter changes
    gsap.set(trackRef.current, { clearProps: "x" });

    // Calculate how far to scroll the track
    const trackWidth = trackRef.current.scrollWidth;
    const viewportWidth = window.innerWidth;
    
    // If the track is smaller than the viewport, don't pin/scroll
    if (trackWidth <= viewportWidth) {
      // Ensure it's centered by applying a class or style later
      return;
    }

    const scrollDistance = trackWidth - viewportWidth + 100; // Extra padding

    gsap.to(trackRef.current, {
      x: -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        pin: true,
        scrub: 1, // Smooth scrubbing
        invalidateOnRefresh: true,
      }
    });

  }, { dependencies: [activeFilter], scope: containerRef });

  return (
    <section className={styles.servicesSection} ref={containerRef}>
      
      <div className={styles.header}>
        <h2 className={styles.heading}>Our Core Infrastructure</h2>
        <div className={styles.filters}>
          {filters.map(f => (
            <button 
              key={f} 
              className={`${styles.filterBtn} ${activeFilter === f ? styles.activeFilter : ''}`}
              onClick={() => {
                setActiveFilter(f);
                window.scrollTo({ top: containerRef.current?.offsetTop, behavior: 'smooth' });
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.carouselContainer}>
        <div 
          className={styles.carouselTrack} 
          ref={trackRef}
          style={{ 
            justifyContent: filteredServices.length <= 4 ? 'center' : 'flex-start',
            width: filteredServices.length <= 4 ? '100%' : 'max-content'
          }}
        >
          {filteredServices.map((service, index) => {
            // Create a fanned out look: alternate slight rotations and Y offsets
            const rotate = index % 2 === 0 ? 3 : -3;
            const yOffset = index % 2 === 0 ? 20 : -10;

            return (
              <div 
                key={service.id} 
                className={styles.cardWrapper}
                style={{
                  transform: `rotate(${rotate}deg) translateY(${yOffset}px)`
                }}
              >
                <div className={styles.card}>
                  <div className={styles.cardGlow}></div> {/* The "cool stuff" dynamic glow */}
                  <div className={styles.cardTop}>
                    <img src={service.image} alt={service.title} className={styles.cardImage} />
                    <div className={styles.imageOverlay}></div>
                    <div className={styles.badge}>{service.category}</div>
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.serviceTitle}>{service.title}</h3>
                    <p className={styles.serviceDesc}>{service.desc}</p>
                    
                    <Link href={service.slug} className={styles.exploreBtn}>
                      Explore &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
    </section>
  );
}
