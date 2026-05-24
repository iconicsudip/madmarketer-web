'use client';

import { SiWoocommerce, SiWhatsapp, SiGoogleads, SiTiktok, SiStripe, SiOpenai, SiShopify, SiMeta } from 'react-icons/si';
import styles from './InfrastructureMarquee.module.css';

const companies = [
  { name: 'WooCommerce', icon: SiWoocommerce, color: '#96588a' },
  { name: 'WhatsApp', icon: SiWhatsapp, color: '#25D366' },
  { name: 'Google Ads', icon: SiGoogleads, color: '#F4B400' },
  { name: 'TikTok', icon: SiTiktok, color: '#ff0050' },
  { name: 'Stripe', icon: SiStripe, color: '#635BFF' },
  { name: 'OpenAI', icon: SiOpenai, color: '#10a37f' },
  { name: 'Shopify', icon: SiShopify, color: '#95BF47' },
  { name: 'Meta', icon: SiMeta, color: '#0668E1' },
];

export default function InfrastructureMarquee() {
  // Double the array for seamless infinite scrolling
  const marqueeItems = [...companies, ...companies];

  return (
    <section className={styles.marqueeSection}>
      <p className={styles.label}>CONNECTED WITH MODERN BUSINESS INFRASTRUCTURE</p>
      
      <div className={styles.marqueeContainer}>
        {/* Left/Right fade overlays for smooth blend */}
        <div className={styles.fadeLeft}></div>
        <div className={styles.fadeRight}></div>

        <div className={styles.marqueeTrack}>
          {marqueeItems.map((company, index) => {
            const Icon = company.icon;
            return (
              <div key={index} className={styles.logoCard}>
                <div className={styles.iconWrapper} style={{ color: company.color }}>
                  <Icon className={styles.logoSvg} />
                </div>
                <span className={styles.fallbackText}>{company.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
