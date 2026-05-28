'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createTestimonial, updateTestimonial, deleteTestimonial } from '@/app/actions/cms';

type Testimonial = {
  id: string;
  company: string;
  logoName: string | null;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
};

const STAR_OPTIONS = [5, 4, 3, 2, 1];

const inputStyle = {
  width: '100%', padding: '0.7rem 0.9rem',
  background: '#0a0a0a', border: '1px solid #2a2a2a',
  borderRadius: '8px', color: '#fff', fontSize: '0.9rem',
  fontFamily: 'inherit', boxSizing: 'border-box' as const,
  marginBottom: '0.85rem',
};

export default function ReviewsEditor({ initialReviews }: { initialReviews: Testimonial[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    avatar: '',
    logoName: '',
    content: '',
    rating: 5,
  });

  const router = useRouter();

  function handleEdit(r: Testimonial) {
    setEditingId(r.id);
    setFormData({
      name: r.name,
      role: r.role,
      company: r.company,
      avatar: r.avatar || '',
      logoName: r.logoName || '',
      content: r.content,
      rating: r.rating,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFormData({
      name: '', role: '', company: '', avatar: '', logoName: '', content: '', rating: 5
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    startTransition(async () => {
      await deleteTestimonial(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      router.refresh();
    });
  }

  function handleSubmit() {
    if (!formData.name || !formData.role || !formData.company || !formData.content) return;
    
    startTransition(async () => {
      if (editingId) {
        await updateTestimonial(editingId, formData);
        setReviews(prev => prev.map(r => r.id === editingId ? { ...r, ...formData } : r));
      } else {
        await createTestimonial(formData);
      }
      handleCancelEdit();
      router.refresh();
    });
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, background: 'linear-gradient(135deg, #fff 0%, #888 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Manage Reviews
          </h1>
          <p style={{ color: '#666', margin: '0.4rem 0 0', fontSize: '0.9rem' }}>
            {reviews.length} testimonial{reviews.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Add/Edit form */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '14px', padding: '1.5rem', position: 'sticky', top: '2rem' }}>
          <h2 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⭐</span> {editingId ? 'Edit Review' : 'Add Review'}
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <input name="name" placeholder="Client Name *" required style={inputStyle} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <input name="role" placeholder="Job Title / Role *" required style={inputStyle} value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
            <input name="company" placeholder="Company Name *" required style={inputStyle} value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
            <input name="avatar" placeholder="Avatar Image URL" style={inputStyle} value={formData.avatar} onChange={e => setFormData({ ...formData, avatar: e.target.value })} />
            <input name="logoName" placeholder="Logo icon name (optional)" style={inputStyle} value={formData.logoName} onChange={e => setFormData({ ...formData, logoName: e.target.value })} />
            
            <textarea name="content" placeholder="Review content *" required rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
            
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.78rem', fontWeight: 600, color: '#777', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Rating</label>
              <select name="rating" style={{ ...inputStyle, marginBottom: 0 }} value={formData.rating} onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })}>
                {STAR_OPTIONS.map(n => (
                  <option key={n} value={n}>{'★'.repeat(n)} {n} Star{n !== 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleSubmit} disabled={isPending || !formData.name || !formData.role || !formData.company || !formData.content}
                style={{ flex: 1, background: 'linear-gradient(135deg, #ED1C24, #c01019)', color: '#fff', border: 'none', padding: '0.7rem', borderRadius: '8px', cursor: (isPending || !formData.name) ? 'default' : 'pointer', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 16px rgba(237,28,36,0.25)', opacity: (isPending || !formData.name) ? 0.7 : 1 }}>
                {isPending ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Review')}
              </button>
              
              {editingId && (
                <button onClick={handleCancelEdit} disabled={isPending}
                  style={{ background: 'transparent', border: '1px solid #444', color: '#ccc', padding: '0.7rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reviews list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#0d0d0d', border: '2px dashed #222', borderRadius: '14px', color: '#555' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💬</div>
              <div>No reviews yet. Add your first testimonial!</div>
            </div>
          )}
          {reviews.map(r => (
            <div key={r.id} style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              {/* Avatar */}
              {r.avatar ? (
                <img src={r.avatar} alt={r.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #333' }} />
              ) : (
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#1a1a1a', border: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                  👤
                </div>
              )}
              
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{r.name}</span>
                    <span style={{ color: '#666', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{r.role} · {r.company}</span>
                  </div>
                  <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#888', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {r.content}
                </p>
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(r)}
                    style={{ background: '#1a1a1a', border: '1px solid #333', color: '#ccc', borderRadius: '4px', padding: '0.2rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(r.id)}
                    style={{ background: 'transparent', border: '1px solid #2a1515', color: '#ED1C24', borderRadius: '4px', padding: '0.2rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
