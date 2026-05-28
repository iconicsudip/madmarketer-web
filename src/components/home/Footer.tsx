import styles from './Footer.module.css';
import NewsletterForm from './NewsletterForm';
import { getSiteSettings } from '@/app/actions/cms';

export default async function Footer() {
  const settings = await getSiteSettings();
  let menus: { title: string, links: { label: string, url: string }[] }[] = [];
  try {
    if (settings?.footerMenus) {
      menus = JSON.parse(settings.footerMenus);
    }
  } catch (e) {
    // Ignore invalid JSON
  }

  // Default menu if none configured
  if (menus.length === 0) {
    menus = [
      {
        title: "Company",
        links: [
          { label: "About", url: "/about" },
          { label: "Services", url: "/services" },
          { label: "Products", url: "/products" },
          { label: "DoConnect OS", url: "/doconnect" },
          { label: "Sitemap", url: "/sitemap.xml" }
        ]
      }
    ];
  }

  return (
    <footer className={styles.footerWrap}>
      <div className="container">
        
        {/* Newsletter Card */}
        <div className={styles.newsletterCard}>
          <div className={styles.newsletterText}>
            <h2>{settings?.footerNewsletterTitle || "Get the Latest Updates"}</h2>
            <p>{settings?.footerNewsletterDesc || "No spam. Just helpful AI writing insights, straight to you."}</p>
          </div>
          <div className={styles.newsletterFormWrap}>
            <NewsletterForm />
            <p className={styles.disclaimer}>By subscribing you agree to with our <a href="/privacy-policy" style={{color: 'inherit', textDecoration: 'underline'}}>Privacy Policy</a></p>
          </div>
        </div>

        {/* Footer Links Content */}
        <div className={styles.footerContent}>
          <div className={styles.brandCol}>
            <img src="/logo.png" alt="Mad Marketer" className={styles.footerLogo} />
            <p className={styles.brandDesc}>
              {settings?.footerBrandDesc || "Automatically generate blog articles, website copy, landing pages & digital ads for your business in seconds."}
            </p>
            <div className={styles.socialIcons}>
              {settings?.socialFacebook && <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><span className={styles.srOnly}>Facebook</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>}
              {settings?.socialInstagram && <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><span className={styles.srOnly}>Instagram</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>}
              {settings?.socialTwitter && <a href={settings.socialTwitter} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><span className={styles.srOnly}>Twitter</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>}
              {settings?.socialLinkedIn && <a href={settings.socialLinkedIn} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><span className={styles.srOnly}>LinkedIn</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>}
              {settings?.socialYoutube && <a href={settings.socialYoutube} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><span className={styles.srOnly}>YouTube</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>}
              
              {(!settings?.socialFacebook && !settings?.socialInstagram && !settings?.socialTwitter && !settings?.socialLinkedIn && !settings?.socialYoutube) && (
                <>
                  <a href="#" className={styles.socialIcon}><span className={styles.srOnly}>Facebook</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                  <a href="#" className={styles.socialIcon}><span className={styles.srOnly}>Instagram</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                </>
              )}
            </div>
          </div>
          
          {menus.map((menu, i) => (
            <div key={i} className={styles.linkGroup}>
              <h4>{menu.title}</h4>
              {menu.links.map((link, j) => (
                <a key={j} href={link.url}>{link.label}</a>
              ))}
            </div>
          ))}
        </div>
        
        <div className={styles.footerBottom}>
          <p>{settings?.footerCopyright || `© ${new Date().getFullYear()} Mad Marketer. All rights reserved.`}</p>
          <div className={styles.policyLinks} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem', justifyContent: 'center' }}>
            <a href="/privacy-policy" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</a>
            <a href="/terms-and-conditions" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem' }}>Terms & Conditions</a>
            <a href="/refund-policy" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem' }}>Refund Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
