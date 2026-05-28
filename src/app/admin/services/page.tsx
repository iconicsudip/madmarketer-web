import { getServices, createService, deleteService } from '@/app/actions/cms';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export default async function ServicesAdmin() {
  const services = await getServices();
  const pages = await prisma.page.findMany({ orderBy: { title: 'asc' } });

  async function handleAdd(formData: FormData) {
    'use server';
    await createService({
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      slug: formData.get('slug') as string,
      desc: formData.get('desc') as string,
      image: formData.get('image') as string,
      metaTitle: formData.get('metaTitle') as string,
      metaDescription: formData.get('metaDescription') as string,
      keywords: formData.get('keywords') as string,
      ogImage: formData.get('ogImage') as string,
      schemaMarkup: formData.get('schemaMarkup') as string,
    });
  }

  async function handleDelete(formData: FormData) {
    'use server';
    await deleteService(formData.get('id') as string);
  }

  const inputStyle = { width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Manage Services</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Add Form */}
        <div style={{ background: '#111', padding: '2rem', borderRadius: '8px', border: '1px solid #333' }}>
          <h2 style={{ marginBottom: '1rem' }}>Add New Service</h2>
          <form action={handleAdd}>
            <input name="title" placeholder="Service Title (e.g. Website Development)" required style={inputStyle} />
            <input name="category" placeholder="Category (e.g. Development)" required style={inputStyle} />
            <select name="slug" required style={{...inputStyle, appearance: 'auto'}}>
              <option value="">Select a Page to Link...</option>
              {pages.map(p => (
                <option key={p.id} value={`/${p.slug}`}>
                  {p.title} (/{p.slug})
                </option>
              ))}
            </select>
            <textarea name="desc" placeholder="Short description" required style={{...inputStyle, height: '100px'}} />
            <input name="image" placeholder="Image URL (Unsplash)" required style={inputStyle} />
            
            <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem', fontSize: '1rem', color: '#ED1C24' }}>SEO Settings</h3>
            <input name="metaTitle" placeholder="Meta Title" style={inputStyle} />
            <textarea name="metaDescription" placeholder="Meta Description" style={{...inputStyle, height: '80px'}} />
            <input name="keywords" placeholder="Keywords (comma separated)" style={inputStyle} />
            <input name="ogImage" placeholder="Social Share Image URL" style={inputStyle} />
            <textarea name="schemaMarkup" placeholder='Schema Markup JSON-LD (e.g. { "@context": "https://schema.org"... })' style={{...inputStyle, height: '100px', fontFamily: 'monospace', fontSize: '0.8rem'}} />
            
            <button type="submit" style={{ background: '#ED1C24', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer' }}>Add Service</button>
          </form>
        </div>

        {/* List */}
        <div>
          <h2 style={{ marginBottom: '1rem' }}>Existing Services ({services.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {services.map(s => (
              <div key={s.id} style={{ background: '#111', padding: '1rem', borderRadius: '8px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{s.title}</strong> <span style={{ color: '#888', fontSize: '0.8rem' }}>({s.category})</span>
                </div>
                <form action={handleDelete}>
                  <input type="hidden" name="id" value={s.id} />
                  <button type="submit" style={{ background: 'transparent', color: '#ED1C24', border: '1px solid #ED1C24', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
