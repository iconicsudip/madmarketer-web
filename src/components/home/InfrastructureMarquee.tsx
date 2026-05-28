'use client';

import { 
  SiWoocommerce, SiWhatsapp, SiGoogleads, SiTiktok, 
  SiStripe, SiOpenai, SiShopify, SiMeta, SiHubspot, SiZapier 
} from 'react-icons/si';
import styles from './InfrastructureMarquee.module.css';

const ICON_MAP: Record<string, { icon: any; color: string }> = {
  'woocommerce': { icon: SiWoocommerce, color: '#96588a' },
  'whatsapp': { icon: SiWhatsapp, color: '#25D366' },
  'google ads': { icon: SiGoogleads, color: '#F4B400' },
  'tiktok': { icon: SiTiktok, color: '#ff0050' },
  'stripe': { icon: SiStripe, color: '#635BFF' },
  'openai': { icon: SiOpenai, color: '#10a37f' },
  'shopify': { icon: SiShopify, color: '#95BF47' },
  'meta': { icon: SiMeta, color: '#0668E1' },
  'hubspot': { icon: SiHubspot, color: '#ff7a59' },
  'zapier': { icon: SiZapier, color: '#ff4a00' },
};

const DEFAULT_COMPANIES = [
  { name: 'WooCommerce', ...ICON_MAP['woocommerce'] },
  { name: 'WhatsApp', ...ICON_MAP['whatsapp'] },
  { name: 'Google Ads', ...ICON_MAP['google ads'] },
  { name: 'TikTok', ...ICON_MAP['tiktok'] },
  { name: 'Stripe', ...ICON_MAP['stripe'] },
  { name: 'OpenAI', ...ICON_MAP['openai'] },
  { name: 'Shopify', ...ICON_MAP['shopify'] },
  { name: 'Meta', ...ICON_MAP['meta'] },
];

type MarqueeData = { items?: string; label?: string };

export default function InfrastructureMarquee({ data = {} }: { data?: MarqueeData }) {
  const label = data.label || 'CONNECTED WITH MODERN BUSINESS INFRASTRUCTURE';

  // Parse custom items if provided
  let marqueeItems = DEFAULT_COMPANIES;
  
  if (data.items) {
    let parsed: string[] = [];
    try {
      parsed = JSON.parse(data.items);
    } catch {
      // Fallback if user types comma-separated string instead of JSON array
      parsed = data.items.split(',').map(s => s.trim()).filter(Boolean);
    }
    
    if (parsed.length > 0) {
      marqueeItems = parsed.map(name => {
        const lowerName = name.toLowerCase();
        const mapped = ICON_MAP[lowerName];
        return {
          name,
          icon: mapped?.icon || null,
          color: mapped?.color || '#ffffff'
        };
      });
    }
  }

  // Duplicate for seamless marquee effect
  const displayItems = [...marqueeItems, ...marqueeItems];

  return (
    <section className={styles.marqueeSection}>
      <p className={styles.label}>{label}</p>

      <div className={styles.marqueeContainer}>
        <div className={styles.fadeLeft}></div>
        <div className={styles.fadeRight}></div>

        <div className={styles.marqueeTrack}>
          {displayItems.map((company, index) => {
            const Icon = company.icon;
            return (
              <div key={index} className={styles.logoCard}>
                {Icon && (
                  <div className={styles.iconWrapper} style={{ color: company.color }}>
                    <Icon className={styles.logoSvg} />
                  </div>
                )}
                <span className={styles.fallbackText}>{company.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
