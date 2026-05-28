'use client';

import styles from './ReviewsSection.module.css';
import { Star } from 'lucide-react';

type Review = {
  id: string;
  company: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
};

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.companyWrap}>
        <span className={styles.companyName}>{review.company}</span>
      </div>
      <p className={styles.content}>&ldquo;{review.content}&rdquo;</p>
      <div className={styles.stars}>
        {[...Array(Math.min(review.rating, 5))].map((_, i) => (
          <Star key={i} size={15} fill="currentColor" stroke="none" />
        ))}
      </div>
      <hr className={styles.divider} />
      <div className={styles.author}>
        {review.avatar ? (
          <img src={review.avatar} alt={review.name} className={styles.avatar} />
        ) : (
          <div className={styles.avatar} style={{ background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
            👤
          </div>
        )}
        <div className={styles.authorInfo}>
          <h4 className={styles.authorName}>{review.name}</h4>
          <p className={styles.authorRole}>{review.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  // Split reviews into two rows; duplicate each row for seamless loop
  const midpoint = Math.ceil(reviews.length / 2);
  const row1 = reviews.slice(0, midpoint);
  const row2 = reviews.slice(midpoint);

  // Need at least 2 items per row for a good loop; pad if needed
  const paddedRow1 = row1.length >= 2 ? row1 : [...row1, ...row1];
  const paddedRow2 = row2.length >= 2 ? row2 : [...row2, ...(row1.length ? row1 : row2)];

  return (
    <section className={styles.reviewsSection}>
      <div className={styles.bgBlob}></div>

      <div className="container" style={{ position: 'relative', zIndex: 10, marginBottom: '5rem' }}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Success stories from<br />happy customers.</h2>
          <p className={styles.subheading}>
            Welcome to Mad Marketer, the ultimate SaaS solution designed to streamline your workflows and drive efficiency.
          </p>
        </div>
      </div>

      {/* Row 1 — scrolls left */}
      <div className={styles.marqueeContainer}>
        <div className={styles.fadeLeft}></div>
        <div className={styles.fadeRight}></div>
        <div className={styles.marqueeTrack}>
          {[...paddedRow1, ...paddedRow1].map((review, idx) => (
            <ReviewCard key={`r1-${idx}`} review={review} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right (reverse) */}
      {paddedRow2.length > 0 && (
        <div className={styles.marqueeContainer} style={{ marginTop: '1.5rem' }}>
          <div className={styles.fadeLeft}></div>
          <div className={styles.fadeRight}></div>
          <div className={`${styles.marqueeTrack} ${styles.marqueeTrackReverse}`}>
            {[...paddedRow2, ...paddedRow2].map((review, idx) => (
              <ReviewCard key={`r2-${idx}`} review={review} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
