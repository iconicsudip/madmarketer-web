'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import CTAButton from '@/components/CTAButton';
import DynamicText from '@/components/DynamicText';

// Utility for dynamic icons
const DynamicIcon = ({ name, size = 24, color = "currentColor", className = "" }: any) => {
  if (!name) return null;
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} color={color} className={className} />;
};

export function ServiceHero({ data }: { data: Record<string, string> }) {
  const accentColor = '#ED1C24'; // Force primary red

  let icons: string[] = [];
  try { icons = JSON.parse(data.orbitIcons || '[]'); } catch { }
  if (icons.length === 0) {
    icons = ['Youtube', 'Facebook', 'Instagram', 'Linkedin', 'Twitter'];
  }

  return (
    <section style={{ position: 'relative', minHeight: '90vh', background: 'var(--dark-bg)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {/* Concentric Circles Background */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '2000px', height: '2000px', pointerEvents: 'none', zIndex: 0 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ 
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
            width: `${i * 20}%`, height: `${i * 20}%`, 
            border: '1px solid rgba(255,255,255,0.03)', borderRadius: '50%' 
          }} />
        ))}
      </div>

      {/* Orbiting Icons */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', maxWidth: '1200px', zIndex: 1, pointerEvents: 'none' }}>
        {icons.map((icon, i) => {
          const angle = (i / icons.length) * Math.PI * 2;
          const radius = 300 + (i % 2 === 0 ? 100 : 250); // Stagger distances
          const x = (Math.cos(angle) * radius).toFixed(2);
          const y = (Math.sin(angle) * radius).toFixed(2);
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 1 }}
              style={{
                position: 'absolute',
                top: `calc(50% + ${y}px)`,
                left: `calc(50% + ${x}px)`,
                width: '60px', height: '60px',
                background: '#151515',
                border: '1px solid #2a2a2a',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}
            >
              <DynamicIcon name={icon} size={24} color={accentColor} />
            </motion.div>
          );
        })}
      </div>

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px', padding: '0 2rem' }}>
        {data.pillText && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1.2rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
            👋 <DynamicText content={data.pillText} typography={data.pillTypography} defaultTag="span" />
          </motion.div>
        )}
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <DynamicText 
            content={data.headline || 'Amplifying your online presence'} 
            typography={data.headlineTypography} 
            defaultTag="h1" 
            defaultStyle={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.5rem' }} 
          />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <DynamicText 
            content={data.subtext || 'Amet convallis tempus lobortis dui. Nec dapibus pharetra ipsum commodo tristique viverra.'} 
            typography={data.subtextTypography} 
            defaultTag="p" 
            defaultStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }} 
          />
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '500px', margin: '0 auto' }}>
          <input 
            type="email" 
            placeholder="Your e-mail" 
            style={{ flex: '1 1 200px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '16px 20px', borderRadius: '12px', fontSize: '1rem', outline: 'none' }} 
          />
          <button type="button" style={{ background: 'var(--primary-red)', color: '#fff', padding: '16px 36px', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', border: 'none', cursor: 'pointer', transition: 'box-shadow 0.2s', boxShadow: '0 10px 20px rgba(237, 28, 36, 0.4)' }}>
            {data.buttonText || 'Subscribe'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

export function ServiceTestimonials({ data }: { data: Record<string, string> }) {
  const accentColor = '#ED1C24';
  let testimonials: any[] = [];
  try { testimonials = JSON.parse(data.testimonials || '[]'); } catch { }

  const baseItems = testimonials.length > 0 ? testimonials : [
    {name: "Drew Cano", role: "CEO @ Cloud", text: "Dolor nam mattis ut maecenas tincidunt molestie ut mauris commodo. Ultrices nisl sed orci at. Amet aenean pellentesque.", avatar: ""},
    {name: "Jessica Jones", role: "CEO @ Chain", text: "Vitae volutpat nullam ut ut sed sit ac elementum. Gravida velit integer cum fusce faucibus mattis mi.", avatar: ""},
    {name: "Idris Elba", role: "CEO @ Flash", text: "Amet metus ipsum diam odio odio massa. Mauris enim ullamcorper elementum eu quisque a posuere elementum.", avatar: ""}
  ];

  const duplicated = [...baseItems, ...baseItems, ...baseItems, ...baseItems];

  return (
    <section style={{ padding: '8rem 0', background: 'var(--dark-bg)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '300px', background: accentColor, filter: 'blur(250px)', opacity: 0.1, pointerEvents: 'none', zIndex: 0 }} />

      <div className="container" style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative', zIndex: 1 }}>
        {data.pillText && (
          <div style={{ display: 'inline-block', border: `1px solid ${accentColor}40`, background: `${accentColor}15`, color: accentColor, padding: '0.4rem 1.2rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', boxShadow: `0 0 20px ${accentColor}20` }}>
            <DynamicText content={data.pillText} typography={data.pillTypography} defaultTag="span" />
          </div>
        )}
        <DynamicText 
          content={data.heading || "What they're saying.."} 
          typography={data.headingTypography} 
          defaultTag="h2" 
          defaultStyle={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em' }} 
        />
      </div>

      <style>{`
        @keyframes infiniteScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-wrapper {
          width: 100%;
          overflow: hidden;
          position: relative;
          z-index: 1;
          padding: 1rem 0;
        }
        .marquee-wrapper::before, .marquee-wrapper::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 150px;
          z-index: 2;
          pointer-events: none;
        }
        .marquee-wrapper::before {
          left: 0;
          background: linear-gradient(to right, var(--dark-bg), transparent);
        }
        .marquee-wrapper::after {
          right: 0;
          background: linear-gradient(to left, var(--dark-bg), transparent);
        }
        .marquee-container {
          display: flex;
          gap: 2rem;
          width: fit-content;
          animation: infiniteScroll 40s linear infinite;
          padding: 0 1rem;
        }
        .marquee-container:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="marquee-wrapper">
        <div className="marquee-container">
          {duplicated.map((t, i) => (
            <div key={i} style={{ flex: '0 0 400px', background: 'rgba(25,25,25,0.4)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2.5rem', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <div style={{ position: 'absolute', top: '2.5rem', right: '2.5rem', color: accentColor, opacity: 0.3 }}>
                <DynamicIcon name="Quote" size={40} />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#2a2a2a', overflow: 'hidden', border: `2px solid ${accentColor}40` }}>
                  {t.avatar ? <img src={t.avatar} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{t.name?.charAt(0)}</div>}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{t.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{t.role}</div>
                </div>
              </div>

              <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, fontSize: '1.1rem', margin: 0 }}>
                "{t.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceGrid({ data }: { data: Record<string, string> }) {
  const accentColor = '#ED1C24';
  let services: any[] = [];
  try { services = JSON.parse(data.services || '[]'); } catch { }

  return (
    <section style={{ padding: '8rem 0', background: 'var(--dark-bg)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      {/* Floating Ambient Balls */}
      <div style={{ position: 'absolute', top: '20%', left: '5%', width: '300px', height: '300px', background: accentColor, borderRadius: '50%', filter: 'blur(150px)', opacity: 0.15, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', background: accentColor, borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1, pointerEvents: 'none', zIndex: 0 }} />

      <div className="container" style={{ textAlign: 'center', marginBottom: '5rem', position: 'relative', zIndex: 1 }}>
        {data.pillText && (
          <div style={{ display: 'inline-block', border: `1px solid ${accentColor}40`, background: `${accentColor}15`, color: accentColor, padding: '0.4rem 1.2rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
            <DynamicText content={data.pillText} typography={data.pillTypography} defaultTag="span" />
          </div>
        )}
        <DynamicText 
          content={data.heading || 'We offer a wide range of services'} 
          typography={data.headingTypography} 
          defaultTag="h2" 
          defaultStyle={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', maxWidth: '800px', margin: '0 auto', color: '#fff' }} 
        />
      </div>

      <style>{`
        .service-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 3rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
      `}</style>
      
      <div className="service-grid" style={{ position: 'relative', zIndex: 1 }}>
        {services.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ textAlign: 'center', background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '70px', height: '70px', background: '#1a1a1a', border: `1px solid ${accentColor}40`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: `0 0 30px ${accentColor}20`, color: accentColor }}>
              <DynamicIcon name={s.icon || 'Star'} size={30} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>{s.title}</h3>
            <p style={{ color: '#aaa', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function ServiceTeamContact({ data }: { data: Record<string, string> }) {
  const accentColor = '#ED1C24';
  let stats: any[] = [];
  try { stats = JSON.parse(data.stats || '[]'); } catch { }

  return (
    <section style={{ background: 'var(--dark-bg)', paddingTop: '4rem', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glowing orb */}
      <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '60vw', height: '300px', background: accentColor, borderRadius: '50%', filter: 'blur(200px)', opacity: 0.1, pointerEvents: 'none', zIndex: 0 }} />

      <div className="container" style={{ textAlign: 'center', paddingBottom: '6rem', position: 'relative', zIndex: 1 }}>
        {data.teamPill && (
          <div style={{ color: accentColor, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '1rem' }}>
            <DynamicText content={data.teamPill} typography={data.teamPillTypography} defaultTag="span" />
          </div>
        )}
        <DynamicText 
          content={data.teamHeading || 'Our team consists of experts passionate about helping you succeed.'} 
          typography={data.teamHeadingTypography} 
          defaultTag="h2" 
          defaultStyle={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', maxWidth: '800px', margin: '0 auto 2rem', color: '#fff' }} 
        />
        
        {/* Avatars & Subtext */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex' }}>
            {['1', '2', '3'].map((_, i) => (
              <div key={i} style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#222', border: '3px solid var(--dark-bg)', marginLeft: i === 0 ? 0 : '-20px', overflow: 'hidden' }}>
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Team${i}&backgroundColor=${accentColor.replace('#','')}`} alt="Team member" style={{ width: '100%', height: '100%' }} />
              </div>
            ))}
          </div>
          <p style={{ color: '#aaa', maxWidth: '400px', textAlign: 'left', margin: 0, lineHeight: 1.6 }}>
            {data.teamSubtext || 'We are a dedicated team providing enterprise infrastructure.'}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '4rem', flexWrap: 'wrap' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: '#111', borderRadius: '24px', padding: '3rem 2rem', flex: '1 1 250px', border: '1px solid #222', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>{s.number}</div>
              <div style={{ color: '#888', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Massive CTA */}
      <div style={{ padding: '0 2rem 6rem' }}>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '32px', padding: '8rem 2rem', textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden', maxWidth: '1400px', margin: '0 auto', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }}>
          {/* Internal glowing orb */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: accentColor, borderRadius: '50%', filter: 'blur(250px)', opacity: 0.25, pointerEvents: 'none', zIndex: 0 }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <DynamicText 
              content={data.ctaHeading || 'Contact us today for a free consultation'} 
              typography={data.ctaHeadingTypography} 
              defaultTag="h2" 
              defaultStyle={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.03em', maxWidth: '800px', margin: '0 auto 1.5rem' }} 
            />
            <DynamicText 
              content={data.ctaSubtext || 'Take the first step towards building your ultimate operational infrastructure.'} 
              typography={data.ctaSubtextTypography} 
              defaultTag="p" 
              defaultStyle={{ fontSize: '1.2rem', color: '#aaa', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }} 
            />
            <CTAButton
              href={data.ctaLink || '/contact'}
              style={{ display: 'inline-block', background: 'var(--primary-red)', color: '#fff', padding: '16px 44px', borderRadius: '50px', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none', boxShadow: '0 15px 30px rgba(237, 28, 36, 0.4)', transition: 'transform 0.2s, box-shadow 0.2s' }}
              actionType={data.ctaActionType}
              popupType={data.ctaPopupType}
              popupSectionType={data.ctaPopupSectionType}
              popupIframeUrl={data.ctaPopupIframeUrl}
            >
              {data.ctaButtonText || 'Contact us'}
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
