'use client';
import styles from './Footer.module.css';

export default function NewsletterForm() {
  return (
    <form className={styles.formGroup} onSubmit={(e) => e.preventDefault()}>
      <input type="email" placeholder="Enter your email address" required />
      <button type="submit">Subscribe</button>
    </form>
  );
}
