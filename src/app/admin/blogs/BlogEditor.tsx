'use client';

import dynamic from 'next/dynamic';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createBlogPost, deleteBlogPost, updateBlogPost } from '@/app/actions/cms';
import ImageUploader from '@/components/ImageUploader';

// Lazy-load the markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

type Blog = {
  id: string;
  title: string;
  slug: string;
  category: string;
  image: string;
  excerpt?: string | null;
  date?: string | null;
  content?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  tags?: string | null;
  keywords?: string | null;
  ogImage?: string | null;
  schemaMarkup?: string | null;
};

const inp: React.CSSProperties = {
  width: '100%', padding: '0.7rem 0.9rem', background: '#0a0a0a',
  border: '1px solid #2a2a2a', borderRadius: '8px', color: '#fff',
  fontSize: '0.88rem', fontFamily: 'inherit', boxSizing: 'border-box',
};

export default function BlogEditor({ initialBlogs }: { initialBlogs: Blog[] }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [date, setDate] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [tags, setTags] = useState('');
  const [keywords, setKeywords] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [schemaMarkup, setSchemaMarkup] = useState('');
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  function autoSlug(val: string) {
    return val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!editingId) setSlug(autoSlug(val));
  }

  function handleSubmit() {
    if (!title || !slug || !category || !image) return;
    startTransition(async () => {
      const data = { title, slug, category, image, date, excerpt, content, metaTitle, metaDescription, tags, keywords, ogImage, schemaMarkup };
      if (editingId) {
        await updateBlogPost(editingId, data);
        setBlogs(prev => prev.map(b => b.id === editingId ? { ...b, ...data } : b));
      } else {
        await createBlogPost(data);
        // Note: the new post won't appear instantly in state with the correct ID without a refresh,
        // but router.refresh() handles the UI sync.
      }
      handleCancelEdit();
      router.refresh();
    });
  }

  function handleEdit(b: Blog) {
    setEditingId(b.id);
    setTitle(b.title);
    setSlug(b.slug);
    setCategory(b.category);
    setImage(b.image);
    setDate(b.date || '');
    setExcerpt(b.excerpt || '');
    setContent(b.content || '');
    setMetaTitle(b.metaTitle || '');
    setMetaDescription(b.metaDescription || '');
    setTags(b.tags || '');
    setKeywords(b.keywords || '');
    setOgImage(b.ogImage || '');
    setSchemaMarkup(b.schemaMarkup || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setTitle(''); setSlug(''); setCategory(''); setImage('');
    setDate(''); setExcerpt(''); setContent('');
    setMetaTitle(''); setMetaDescription(''); setTags('');
    setKeywords(''); setOgImage(''); setSchemaMarkup('');
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this post?')) return;
    startTransition(async () => {
      await deleteBlogPost(id);
      setBlogs(prev => prev.filter(b => b.id !== id));
      router.refresh();
    });
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, background: 'linear-gradient(135deg,#fff,#888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Blog Manager
          </h1>
          <p style={{ color: '#555', margin: '0.4rem 0 0', fontSize: '0.9rem' }}>{blogs.length} post{blogs.length !== 1 ? 's' : ''} published</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem', alignItems: 'start' }}>

        {/* LEFT: Editor */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '14px', padding: '1.5rem' }}>
          <h2 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ✍️ {editingId ? 'Edit Post' : 'New Blog Post'}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Title *</label>
                <input style={inp} value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Post title" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>URL Slug *</label>
                <input style={inp} value={slug} onChange={e => setSlug(e.target.value)} placeholder="auto-generated-from-title" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Category *</label>
                <input style={inp} value={category} onChange={e => setCategory(e.target.value)} placeholder="Technology, Marketing…" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Date</label>
                <input style={inp} value={date} onChange={e => setDate(e.target.value)} placeholder="Oct 12, 2026" />
              </div>
            </div>

            <div>
              <ImageUploader
                label="Cover Image *"
                value={image}
                onChange={setImage}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Excerpt</label>
              <textarea style={{ ...inp, resize: 'vertical', lineHeight: 1.5 }} rows={2} value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short preview text shown on blog listing…" />
            </div>

            <div style={{ padding: '1rem', background: '#111', borderRadius: '8px', border: '1px dashed #333' }}>
              <h3 style={{ fontSize: '0.85rem', margin: '0 0 1rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEO & Meta</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Meta Title</label>
                  <input style={inp} value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="SEO Title" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tags (comma separated)</label>
                  <input style={inp} value={tags} onChange={e => setTags(e.target.value)} placeholder="AI, SaaS, Automation" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Keywords</label>
                  <input style={inp} value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="marketing, tools, etc" />
                </div>
                <div>
                  <ImageUploader
                    label="Social Share Image (OG)"
                    value={ogImage}
                    onChange={setOgImage}
                    compact
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Schema Markup (JSON-LD)</label>
                  <textarea style={{ ...inp, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem' }} rows={4} value={schemaMarkup} onChange={e => setSchemaMarkup(e.target.value)} placeholder='{ "@context": "https://schema.org"... }' />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Meta Description</label>
                <textarea style={{ ...inp, resize: 'vertical', lineHeight: 1.5 }} rows={2} value={metaDescription} onChange={e => setMetaDescription(e.target.value)} placeholder="SEO Description" />
              </div>
            </div>

            {/* Rich text editor */}
            <div data-color-mode="dark">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Full Content (Markdown)
              </label>
              <MDEditor
                value={content}
                onChange={val => setContent(val || '')}
                height={400}
                preview="live"
                style={{ background: '#080808', borderRadius: '8px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={handleSubmit}
                disabled={isPending || !title || !slug || !category || !image}
                style={{ flex: 1, background: 'linear-gradient(135deg,#ED1C24,#c01019)', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '8px', cursor: isPending ? 'default' : 'pointer', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 16px rgba(237,28,36,.25)', opacity: isPending ? 0.7 : 1 }}
              >
                {isPending ? (editingId ? 'Saving…' : 'Publishing…') : (editingId ? '💾 Save Changes' : '🚀 Publish Post')}
              </button>
              
              {editingId && (
                <button
                  onClick={handleCancelEdit}
                  disabled={isPending}
                  style={{ background: 'transparent', border: '1px solid #444', color: '#ccc', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Posts list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'sticky', top: '1rem' }}>
          <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '14px', padding: '1.25rem' }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: '0.85rem', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Published Posts
            </h2>
            {blogs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#444' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
                <div>No posts yet</div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '70vh', overflowY: 'auto' }}>
              {blogs.map(b => (
                <div key={b.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '0.85rem', display: 'flex', gap: '0.75rem' }}>
                  {b.image && (
                    <img src={b.image} alt={b.title} style={{ width: '52px', height: '52px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                    <div style={{ fontSize: '0.72rem', color: '#555', marginTop: '2px' }}>{b.category} · {b.date || '—'}</div>
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                      <a href={`/blog/${b.slug}`} target="_blank"
                        style={{ background: '#0a1a0a', border: '1px solid #1a3a1a', color: '#4ade80', borderRadius: '4px', padding: '2px 8px', textDecoration: 'none', fontSize: '0.7rem' }}>
                        View ↗
                      </a>
                      <button onClick={() => handleEdit(b)}
                        style={{ background: 'transparent', border: '1px solid #333', color: '#ccc', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '0.7rem' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(b.id)}
                        style={{ background: 'transparent', border: '1px solid #2a1515', color: '#ED1C24', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '0.7rem' }}>
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
    </div>
  );
}
