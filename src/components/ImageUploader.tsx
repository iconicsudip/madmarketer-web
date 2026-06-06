'use client';

import { useRef, useState, useCallback, DragEvent } from 'react';

interface ImageUploaderProps {
  /** Current image URL value */
  value: string;
  /** Called when the URL changes (either from upload or manual input) */
  onChange: (url: string) => void;
  /** Optional label shown above the uploader */
  label?: string;
  /** If true, show the text-input box as a fallback */
  showUrlInput?: boolean;
  /** Compact mode hides the drop zone and only shows a small button */
  compact?: boolean;
}

export default function ImageUploader({
  value,
  onChange,
  label,
  showUrlInput = true,
  compact = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);
      try {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        onChange(data.url);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    // Reset so same file can be re-selected
    e.target.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.3rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.7rem 0.9rem',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.88rem',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  if (compact) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {label && <label style={labelStyle}>{label}</label>}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {showUrlInput && (
            <input
              style={{ ...inputStyle, flex: 1, minWidth: 0 }}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://..."
            />
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{
              background: uploading ? '#333' : 'linear-gradient(135deg,#ED1C24,#c01019)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: uploading ? 'default' : 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            {uploading ? (
              <>
                <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> Uploading…
              </>
            ) : (
              <>📁 Upload</>
            )}
          </button>
        </div>
        {error && <div style={{ color: '#ED1C24', fontSize: '0.75rem' }}>⚠ {error}</div>}
        {value && (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={value}
              alt="preview"
              style={{ height: '80px', maxWidth: '200px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #2a2a2a' }}
            />
            <button
              type="button"
              onClick={() => onChange('')}
              style={{
                position: 'absolute', top: '4px', right: '4px',
                background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff',
                borderRadius: '50%', width: '20px', height: '20px',
                cursor: 'pointer', fontSize: '0.6rem', lineHeight: 1, padding: 0,
              }}
            >
              ✕
            </button>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {label && <label style={labelStyle}>{label}</label>}

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? '#ED1C24' : uploading ? '#555' : '#2a2a2a'}`,
          borderRadius: '10px',
          padding: '1.25rem',
          textAlign: 'center',
          cursor: uploading ? 'default' : 'pointer',
          background: dragging ? 'rgba(237,28,36,0.06)' : '#0a0a0a',
          transition: 'all 0.2s',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {uploading ? (
          <div style={{ color: '#888', fontSize: '0.85rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</div>
            <div>Uploading…</div>
          </div>
        ) : value ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={value}
              alt="preview"
              style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'cover', borderRadius: '6px', display: 'block' }}
            />
            <div style={{ color: '#888', fontSize: '0.75rem', marginTop: '0.5rem' }}>Click or drop to replace</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: dragging ? 1 : 0.6 }}>
              {dragging ? '📥' : '🖼️'}
            </div>
            <div style={{ color: '#888', fontSize: '0.85rem', fontWeight: 500 }}>
              {dragging ? 'Drop image here' : 'Click or drag & drop to upload'}
            </div>
            <div style={{ color: '#555', fontSize: '0.72rem', marginTop: '0.25rem' }}>
              PNG, JPG, WEBP, GIF, SVG · max 10 MB
            </div>
          </div>
        )}
      </div>

      {showUrlInput && (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ color: '#555', fontSize: '0.75rem', flexShrink: 0 }}>or URL:</span>
          <input
            style={{ ...inputStyle, flex: 1 }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              style={{ background: 'transparent', border: '1px solid #333', color: '#999', borderRadius: '6px', padding: '0.4rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              ✕
            </button>
          )}
        </div>
      )}

      {error && <div style={{ color: '#ED1C24', fontSize: '0.75rem' }}>⚠ {error}</div>}

      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
