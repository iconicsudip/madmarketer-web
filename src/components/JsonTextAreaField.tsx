'use client';

import { useState } from 'react';
import { Code } from 'lucide-react';

interface Props {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  exampleData?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function JsonTextAreaField({ name, defaultValue = '', placeholder, exampleData, className, style }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [showModal, setShowModal] = useState(false);

  let prettyJson = exampleData || '';
  try {
    if (exampleData) prettyJson = JSON.stringify(JSON.parse(exampleData), null, 2);
  } catch {}

  const [modalValue, setModalValue] = useState('');

  const handleOpenModal = () => {
    let initialValue = value || prettyJson;
    try {
      if (value) initialValue = JSON.stringify(JSON.parse(value), null, 2);
    } catch {}
    setModalValue(initialValue);
    setShowModal(true);
  };

  const handleFormat = () => {
    try {
      if (!modalValue.trim()) return;
      const parsed = JSON.parse(modalValue);
      setModalValue(JSON.stringify(parsed, null, 2));
    } catch {
      // Ignore errors silently on blur
    }
  };

  return (
    <>
      <div className="input-group" style={{ position: 'relative' }}>
        <Code size={18} className="input-icon" style={{ top: '16px' }} />
        {exampleData && (
          <button
            type="button"
            onClick={handleOpenModal}
            style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(237,28,36,0.1)', color: '#ED1C24', border: '1px solid rgba(237,28,36,0.2)', borderRadius: '4px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em', zIndex: 10 }}
          >
            Edit / View JSON
          </button>
        )}
        <textarea
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={className}
          style={style}
        />
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '12px', width: '100%', maxWidth: '700px', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Advanced JSON Editor
              <button type="button" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </h3>
            <textarea 
              value={modalValue}
              onChange={(e) => setModalValue(e.target.value)}
              onBlur={handleFormat}
              style={{ width: '100%', minHeight: '350px', background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '1rem', overflowX: 'auto', color: '#4ade80', fontSize: '0.85rem', fontFamily: 'monospace', margin: '0 0 1.5rem', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" onClick={() => {
                try {
                  setModalValue(JSON.stringify(JSON.parse(modalValue), null, 2));
                } catch {
                  alert('Invalid JSON! Please fix formatting errors.');
                }
              }} style={{ background: 'transparent', border: '1px solid #4ade8055', color: '#4ade80', borderRadius: '6px', padding: '0.6rem 1.2rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Format JSON</button>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: 'transparent', border: '1px solid #333', color: '#ccc', borderRadius: '6px', padding: '0.6rem 1.2rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Cancel</button>
              <button type="button" onClick={() => { setValue(modalValue); setShowModal(false); }} style={{ background: 'linear-gradient(135deg,#ED1C24,#c01019)', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.6rem 1.2rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Code size={16} /> Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
