'use client';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footerWrap}>
      <div className="container">
        
        {/* Newsletter Card */}
        <div className={styles.newsletterCard}>
          <div className={styles.newsletterText}>
            <h2>Get the Latest Updates</h2>
            <p>No spam. Just helpful AI writing insights, straight to you.</p>
          </div>
          <div className={styles.newsletterFormWrap}>
            <form className={styles.formGroup} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit">Subscribe</button>
            </form>
            <p className={styles.disclaimer}>By subscribing you agree to with our Privacy Policy</p>
          </div>
        </div>

        {/* Footer Links Content */}
        <div className={styles.footerContent}>
          <div className={styles.brandCol}>
            <img src="/logo.png" alt="Mad Marketer" className={styles.footerLogo} />
            <p className={styles.brandDesc}>
              Automatically generate blog articles, website copy, landing pages & digital ads for your business in seconds.
            </p>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialIcon}><span className={styles.srOnly}>Facebook</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
              <a href="#" className={styles.socialIcon}><span className={styles.srOnly}>Pinterest</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></a>
              <a href="#" className={styles.socialIcon}><span className={styles.srOnly}>Instagram</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
              <a href="#" className={styles.socialIcon}><span className={styles.srOnly}>Dribbble</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path></svg></a>
            </div>
          </div>
          <div className={styles.linkGroup}>
            <h4>Product</h4>
            <a href="#">Blockchain</a>
            <a href="#">Career</a>
            <a href="#">Ai App</a>
            <a href="#">Shop</a>
            <a href="#">Checkout</a>
          </div>
          <div className={styles.linkGroup}>
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Features</a>
            <a href="#">Services</a>
            <a href="#">Pricing</a>
            <a href="#">Faqs</a>
          </div>
          <div className={styles.linkGroup}>
            <h4>Support</h4>
            <a href="#">Faqs</a>
            <a href="#">Pricing Plan</a>
            <a href="#">Features</a>
            <a href="#">Our Team</a>
            <a href="#">Team Details</a>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Mad Marketer. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
