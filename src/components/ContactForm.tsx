'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    // Mock submit behavior
    setIsSubmitted(true);
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              textAlign: 'left',
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(10px)',
              padding: '3rem',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s',
                }}
                className="form-input-glow"
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                Work Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@company.com"
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s',
                }}
                className="form-input-glow"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                How can we help?
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your project..."
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.95rem',
                  resize: 'none',
                  transition: 'all 0.3s',
                }}
                className="form-input-glow"
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '16px',
                borderRadius: '50px',
                background: 'var(--primary-red)',
                color: '#fff',
                fontFamily: 'var(--font-inter)',
                fontWeight: 700,
                fontSize: '1.05rem',
                border: 'none',
                cursor: 'pointer',
                marginTop: '1rem',
                boxShadow: '0 10px 20px rgba(237, 28, 36, 0.3)',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 25px rgba(237, 28, 36, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(237, 28, 36, 0.3)';
              }}
            >
              Submit Request
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(10px)',
              padding: '4rem 3rem',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 10 }}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(74, 222, 128, 0.1)',
                  border: '2px solid #4ade80',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4ade80',
                  fontSize: '2.5rem',
                }}
              >
                ✓
              </motion.div>
            </div>
            <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
              Request Received!
            </h3>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.6, margin: 0 }}>
              Thank you, <strong>{name}</strong>. Our team will review your details and reach out to you at <strong>{email}</strong> shortly.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .form-input-glow:focus {
          border-color: var(--primary-red) !important;
          box-shadow: 0 0 10px rgba(237, 28, 36, 0.25) !important;
          background: rgba(255, 255, 255, 0.08) !important;
        }
      `}</style>
    </div>
  );
}
