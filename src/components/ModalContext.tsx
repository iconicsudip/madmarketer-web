'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContactForm from '@/components/ContactForm';

type PopupType = 'section' | 'iframe';

interface ModalState {
  isOpen: boolean;
  popupType: PopupType;
  popupSectionType: string;
  popupIframeUrl: string;
}

interface ModalContextProps {
  modalState: ModalState;
  openModal: (config: Omit<ModalState, 'isOpen'>) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    popupType: 'section',
    popupSectionType: 'contact_form',
    popupIframeUrl: '',
  });

  const openModal = (config: Omit<ModalState, 'isOpen'>) => {
    setModalState({
      isOpen: true,
      ...config,
    });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    document.body.style.overflow = '';
  };

  // Ensure scroll is restored if provider unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
      <GlobalModal />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

// Internal iframe component with loading spinner
function IframeContent({ url }: { url: string }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div style={{ position: 'relative', width: '100%', height: '70vh', minHeight: '450px' }}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#0d0d0d',
              borderRadius: '16px',
              zIndex: 5,
            }}
          >
            <div className="spinner" />
          </motion.div>
        )}
      </AnimatePresence>
      <iframe
        src={url}
        width="100%"
        height="100%"
        onLoad={() => setIsLoading(false)}
        style={{
          border: 'none',
          borderRadius: '16px',
          background: 'transparent',
          display: 'block',
        }}
        title="Embedded Content"
      />
      <style>{`
        .spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255,255,255,0.05);
          border-radius: 50%;
          border-top-color: var(--primary-red);
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function GlobalModal() {
  const { modalState, closeModal } = useModal();
  const { isOpen, popupType, popupSectionType, popupIframeUrl } = modalState;

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeModal]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999999 }}>
          {/* Glassmorphic backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          />

          {/* Modal Container */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              pointerEvents: 'none',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
              style={{
                width: '100%',
                maxWidth: popupType === 'iframe' ? '1000px' : '650px',
                background: '#0a0a0a',
                border: '1px solid rgba(237, 28, 36, 0.15)',
                boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(237, 28, 36, 0.1)',
                borderRadius: '24px',
                pointerEvents: 'auto',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Subtle accent glow */}
              <div
                style={{
                  position: 'absolute',
                  top: '-150px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '300px',
                  height: '200px',
                  background: 'var(--primary-red)',
                  borderRadius: '50%',
                  filter: 'blur(100px)',
                  opacity: 0.15,
                  pointerEvents: 'none',
                }}
              />

              {/* Close Button */}
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  zIndex: 10,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'rotate(90deg)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = 'rgba(237, 28, 36, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(237, 28, 36, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'rotate(0deg)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                ✕
              </button>

              {/* Modal Body */}
              <div style={{ padding: '3.5rem 2rem 2.5rem' }}>
                {popupType === 'iframe' ? (
                  <IframeContent url={popupIframeUrl} />
                ) : popupSectionType === 'contact_form' ? (
                  <div>
                    <h2
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '2rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        color: '#fff',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Connect With Us
                    </h2>
                    <p
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '1rem',
                        color: 'rgba(255,255,255,0.5)',
                        textAlign: 'center',
                        marginBottom: '2.5rem',
                      }}
                    >
                      Book your free consultation. Let's scale your operations.
                    </p>
                    <ContactForm />
                  </div>
                ) : (
                  // Fallback if no matching section widget is configured
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#888' }}>
                    <h3>Dynamic Section Content</h3>
                    <p>Configure section type: <strong>{popupSectionType}</strong> in the page settings.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
