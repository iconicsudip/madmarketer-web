'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createService, deleteService, updateService } from '@/app/actions/cms';
import ImageUploader from '@/components/ImageUploader';

type Service = {
  id: string;
  title: string;
  category: string;
  slug: string;
  desc: string;
  image: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
  ogImage?: string | null;
  schemaMarkup?: string | null;
};

type Page = {
  id: string;
  title: string;
  slug: string;
};

const inp: React.CSSProperties = {
  width: '100%',
  padding: '0.7rem 0.9rem',
  background: '#0a0a0a',
  border: '1px solid #2a2a2a',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '0.88rem',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  marginBottom: '0.85rem',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.3rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#666',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const EMPTY = {
  title: '', category: '', slug: '', desc: '', image: '',
  metaTitle: '', metaDescription: '', keywords: '', ogImage: '', schemaMarkup: '',
};

export default function ServicesEditor({
  initialServices,
  pages,
}: {
  initialServices: Service[];
  pages: Page[];
}) {
  const [services, setServices] = useState(initialServices);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  const [form, setForm] = useState(EMPTY);
  const set = (key: keyof typeof EMPTY, val: string) => setForm(f => ({ ...f, [key]: val }));

  function handleEdit(s: Service) {
    setEditingId(s.id);
    setForm({
      title: s.title,
      category: s.category,
      slug: s.slug,
      desc: s.desc,
      image: s.image,
      metaTitle: s.metaTitle || '',
      metaDescription: s.metaDescription || '',
      keywords: s.keywords || '',
      ogImage: s.ogImage || '',
      schemaMarkup: s.schemaMarkup || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
  }

  function handleSubmit() {
    const { title, category, slug, desc, image } = form;
    if (!title || !category || !slug || !desc || !image) return;

    startTransition(async () => {
      const data = { ...form };
      if (editingId) {
        await updateService(editingId, data);
        setServices(prev => prev.map(s => s.id === editingId ? { ...s, ...data } : s));
      } else {
        await createService(data);
      }
      handleCancelEdit();
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this service?')) return;
    startTransition(async () => {
      await deleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
      router.refresh();
    });
  }

  const canSubmit = !isPending && !!form.title && !!form.category && !!form.slug && !!form.desc && !!form.image;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, background: 'linear-gradient(135deg,#fff,#888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Manage Services
          </h1>
          <p style={{ color: '#555', margin: '0.4rem 0 0', fontSize: '0.9rem' }}>
            {services.length} service{services.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── Form ── */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '14px', padding: '1.5rem' }}>
          <h2 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700 }}>
            ⚙️ {editingId ? 'Edit Service' : 'Add New Service'}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

            {/* Title + Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input style={inp} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Website Development" />
              </div>
              <div>
                <label style={labelStyle}>Category *</label>
                <input style={inp} value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Development" />
              </div>
            </div>

            {/* Page Link */}
            <div>
              <label style={labelStyle}>Page Link *</label>
              <select
                style={{ ...inp, appearance: 'auto', cursor: 'pointer' }}
                value={form.slug}
                onChange={e => set('slug', e.target.value)}
              >
                <option value="">Select a Page...</option>
                {pages.map(p => (
                  <option key={p.id} value={`/${p.slug}`}>{p.title} (/{p.slug})</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description *</label>
              <textarea
                style={{ ...inp, resize: 'vertical', lineHeight: 1.5 }}
                rows={3}
                value={form.desc}
                onChange={e => set('desc', e.target.value)}
                placeholder="Short service description"
              />
            </div>

            {/* Service Image */}
            <ImageUploader
              label="Service Image *"
              value={form.image}
              onChange={url => set('image', url)}
            />

            {/* SEO Section */}
            <div style={{ padding: '1rem', background: '#111', borderRadius: '8px', border: '1px dashed #333' }}>
              <h3 style={{ fontSize: '0.85rem', margin: '0 0 1rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEO & Meta</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.85rem' }}>
                <div>
                  <label style={labelStyle}>Meta Title</label>
                  <input style={inp} value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} placeholder="SEO Title" />
                </div>
                <div>
                  <label style={labelStyle}>Keywords</label>
                  <input style={inp} value={form.keywords} onChange={e => set('keywords', e.target.value)} placeholder="marketing, tools…" />
                </div>
              </div>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={labelStyle}>Meta Description</label>
                <textarea
                  style={{ ...inp, resize: 'vertical', lineHeight: 1.5 }}
                  rows={2}
                  value={form.metaDescription}
                  onChange={e => set('metaDescription', e.target.value)}
                  placeholder="SEO Description"
                />
              </div>
              <ImageUploader
                label="Social Share Image (OG)"
                value={form.ogImage}
                onChange={url => set('ogImage', url)}
                compact
              />
              <div style={{ marginTop: '0.85rem' }}>
                <label style={labelStyle}>Schema Markup (JSON-LD)</label>
                <textarea
                  style={{ ...inp, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem' }}
                  rows={4}
                  value={form.schemaMarkup}
                  onChange={e => set('schemaMarkup', e.target.value)}
                  placeholder='{ "@context": "https://schema.org"... }'
                />
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg,#ED1C24,#c01019)',
                  color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '8px',
                  cursor: canSubmit ? 'pointer' : 'default',
                  fontWeight: 700, fontSize: '0.9rem',
                  boxShadow: '0 4px 16px rgba(237,28,36,.25)',
                  opacity: canSubmit ? 1 : 0.6,
                }}
              >
                {isPending
                  ? (editingId ? 'Saving…' : 'Adding…')
                  : (editingId ? '💾 Save Changes' : '+ Add Service')}
              </button>

              {editingId && (
                <button
                  onClick={handleCancelEdit}
                  disabled={isPending}
                  style={{
                    background: 'transparent', border: '1px solid #444', color: '#ccc',
                    padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer',
                    fontWeight: 600, fontSize: '0.9rem',
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── List ── */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '14px', padding: '1.25rem', position: 'sticky', top: '1rem' }}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '0.85rem', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Existing Services
          </h2>

          {services.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#444' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚙️</div>
              <div>No services yet</div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '70vh', overflowY: 'auto' }}>
            {services.map(s => (
              <div
                key={s.id}
                style={{
                  background: editingId === s.id ? '#1a1a0a' : '#111',
                  border: `1px solid ${editingId === s.id ? '#ED1C24' : '#1a1a1a'}`,
                  borderRadius: '10px', padding: '0.85rem',
                  display: 'flex', gap: '0.75rem', alignItems: 'center',
                  transition: 'border-color 0.2s',
                }}
              >
                {s.image && (
                  <img
                    src={s.image} alt={s.title}
                    style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#555', marginTop: '2px' }}>{s.category}</div>
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(s)}
                      style={{
                        background: editingId === s.id ? '#ED1C241a' : 'transparent',
                        border: `1px solid ${editingId === s.id ? '#ED1C24' : '#333'}`,
                        color: editingId === s.id ? '#ED1C24' : '#ccc',
                        borderRadius: '4px', padding: '2px 8px',
                        cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600,
                      }}
                    >
                      {editingId === s.id ? '✏️ Editing' : 'Edit'}
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      style={{
                        background: 'transparent', border: '1px solid #2a1515',
                        color: '#ED1C24', borderRadius: '4px', padding: '2px 8px',
                        cursor: 'pointer', fontSize: '0.7rem',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
