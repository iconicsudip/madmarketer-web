'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import styles from './FAQAccordion.module.css';

export default function FAQAccordion({ faqs, title = "Questions You Might Have In Mind" }: { faqs: { q: string; a: string }[], title?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.accordionWrap}>
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className={`${styles.faqItem} ${isOpen ? styles.active : ''}`}>
              <button 
                className={styles.faqButton} 
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <span className={styles.question}>{faq.q}</span>
                <div className={styles.iconWrap}>
                  {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </div>
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className={styles.answerWrap}
                  >
                    <div className={styles.answerInner}>
                      <p className={styles.answer}>{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
