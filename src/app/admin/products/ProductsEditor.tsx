'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, deleteProduct, updateProduct } from '@/app/actions/cms';
import ImageUploader from '@/components/ImageUploader';

type Product = {
  id: string;
  title: string;
  description: string;
  image: string;
  pill: string;
  link: string;
  glowColor: string | null;
  schemaMarkup?: string | null;
};

type Page = {
  id: string;
  title: string;
  slug: string;
};

const inputStyle = { width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' };

export default function ProductsEditor({ initialProducts, pages }: { initialProducts: Product[], pages: Page[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [pill, setPill] = useState('');
  const [link, setLink] = useState('');
  const [glowColor, setGlowColor] = useState('');
  const [schemaMarkup, setSchemaMarkup] = useState('');
  
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description || !image || !pill || !link) return;
    
    startTransition(async () => {
      const data = { title, description, image, pill, link, glowColor, schemaMarkup };
      if (editingId) {
        await updateProduct(editingId, data);
        setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...data } : p));
      } else {
        await createProduct(data);
      }
      handleCancelEdit();
      router.refresh();
    });
  }

  function handleEdit(p: Product) {
    setEditingId(p.id);
    setTitle(p.title);
    setDescription(p.description);
    setImage(p.image);
    setPill(p.pill);
    setLink(p.link);
    setGlowColor(p.glowColor || '');
    setSchemaMarkup(p.schemaMarkup || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setImage('');
    setPill('');
    setLink('');
    setGlowColor('');
    setSchemaMarkup('');
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    startTransition(async () => {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      router.refresh();
    });
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Manage Products</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ background: '#111', padding: '2rem', borderRadius: '8px', border: '1px solid #333' }}>
          <h2 style={{ marginBottom: '1rem' }}>
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit}>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Product Title (e.g. MADRCS)" required style={inputStyle} />
            <input value={pill} onChange={e => setPill(e.target.value)} placeholder="Pill Badge (e.g. Business Portal)" required style={inputStyle} />
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description" required style={{...inputStyle, height: '100px'}} />
            <ImageUploader
              label="Product Image *"
              value={image}
              onChange={setImage}
            />
            
            <select value={link} onChange={e => setLink(e.target.value)} required style={{...inputStyle, appearance: 'auto'}}>
              <option value="">Select a Page to Link...</option>
              {pages.map(p => (
                <option key={p.id} value={`/${p.slug}`}>
                  {p.title} (/{p.slug})
                </option>
              ))}
            </select>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Glow Color (Hex)</label>
              <input style={inputStyle} value={glowColor} onChange={e => setGlowColor(e.target.value)} placeholder="#FF0000" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Schema Markup (JSON-LD)</label>
              <textarea style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem' }} rows={4} value={schemaMarkup} onChange={e => setSchemaMarkup(e.target.value)} placeholder='{ "@context": "https://schema.org"... }' />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="submit" disabled={isPending} style={{ flex: 1, background: '#ED1C24', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: isPending ? 'default' : 'pointer', opacity: isPending ? 0.7 : 1 }}>
                {isPending ? (editingId ? 'Saving...' : 'Adding...') : (editingId ? 'Save Changes' : 'Add Product')}
              </button>
              
              {editingId && (
                <button type="button" onClick={handleCancelEdit} disabled={isPending} style={{ background: 'transparent', color: '#ccc', border: '1px solid #444', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <h2 style={{ marginBottom: '1rem' }}>Existing Products ({products.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {products.map(p => (
              <div key={p.id} style={{ background: '#111', padding: '1rem', borderRadius: '8px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><strong>{p.title}</strong></div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(p)} style={{ background: 'transparent', color: '#ccc', border: '1px solid #444', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={{ background: 'transparent', color: '#ED1C24', border: '1px solid #ED1C24', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
