'use client';

import { useEffect, useState } from 'react';
import styles from './GlobalBackground.module.css';

export default function GlobalBackground() {
  const [bubbles, setBubbles] = useState<any[]>([]);

  useEffect(() => {
    // Generate random bubbles only on the client to avoid hydration mismatch
    const generatedBubbles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 200 + 100, // 100px to 300px
      left: Math.random() * 100, // 0% to 100%
      animationDuration: Math.random() * 25 + 15, // 15s to 40s
      animationDelay: Math.random() * -20, // Negative delay to start immediately
    }));
    setBubbles(generatedBubbles);
  }, []);

  return (
    <div className={styles.globalBg}>
      <div className={styles.gridOverlay}></div>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={styles.bubble}
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            animationDuration: `${bubble.animationDuration}s`,
            animationDelay: `${bubble.animationDelay}s`
          }}
        />
      ))}
    </div>
  );
}
