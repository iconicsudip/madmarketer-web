import { createPage } from '@/app/actions/cms';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function NewPageAdmin() {
  async function handleSubmit(formData: FormData) {
    'use server';
    await createPage({
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      metaDescription: formData.get('metaDescription') as string,
      content: formData.get('content') as string,
    });
    redirect('/admin/pages');
  }

  const inputStyle = { width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' };

  return (
    <div style={{ maxWidth: '1024px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/pages" style={{ color: '#888', textDecoration: 'none' }}>&larr; Back</Link>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Create New Page</h1>
      </div>

      <div style={{ background: '#111', padding: '2rem', borderRadius: '8px', border: '1px solid #333' }}>
        <form action={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Page Title</label>
          <input name="title" placeholder="e.g. About Us" required style={inputStyle} />

          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>URL Slug</label>
          <input name="slug" placeholder="e.g. about" required style={inputStyle} />

          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Meta Description (SEO)</label>
          <textarea name="metaDescription" placeholder="Brief description for search engines" style={{ ...inputStyle, height: '80px' }} />

          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Page Content (HTML/Markdown)</label>
          <textarea name="content" placeholder="Full page content..." style={{ ...inputStyle, height: '300px', fontFamily: 'monospace' }} />

          <button type="submit" style={{ background: '#ED1C24', color: '#fff', border: 'none', padding: '0.75rem 2rem', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1rem', marginTop: '1rem' }}>
            Publish Page
          </button>
        </form>
      </div>
    </div>
  );
}
