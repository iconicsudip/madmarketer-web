import { updatePage, getPageWithSections, deletePage, getAllHomepageSections } from '@/app/actions/cms';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import SectionBuilder from './SectionBuilder';

async function handleSubmit(formData: FormData) {
  'use server';
  const id = formData.get('pageId') as string;
  await updatePage(id, {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    metaTitle: formData.get('metaTitle') as string,
    metaDescription: formData.get('metaDescription') as string,
    keywords: formData.get('keywords') as string,
    ogImage: formData.get('ogImage') as string,
    schemaMarkup: formData.get('schemaMarkup') as string,
  });
}

async function handleDelete(formData: FormData) {
  'use server';
  const id = formData.get('pageId') as string;
  await deletePage(id);
  redirect('/admin/pages');
}

export default async function EditPageAdmin({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await getPageWithSections(id);
  if (!page) notFound();

  // Detect page type to show the right content editor
  const isHomePage = page.slug === '' || page.slug === '/' || page.slug === 'home';

  // Fetch homepage sections only if this is the home page
  const homeSections = isHomePage ? await getAllHomepageSections() : {};

  // Determine the public URL for "View Live"
  const liveUrl = isHomePage ? '/' : `/${page.slug}`;

  const input: React.CSSProperties = {
    width: '100%', padding: '0.7rem 0.9rem',
    background: '#0a0a0a', border: '1px solid #2a2a2a',
    borderRadius: '8px', color: '#fff', fontSize: '0.9rem',
    fontFamily: 'inherit', boxSizing: 'border-box',
  };

  return (
    <div>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem', fontSize: '0.85rem', color: '#555' }}>
        <Link href="/admin/pages" style={{ color: '#666', textDecoration: 'none' }}>← Pages</Link>
        <span>/</span>
        <span style={{ color: '#999' }}>{page.title}</span>
        <span>/</span>
        <span style={{ color: '#ED1C24', fontWeight: 600 }}>Edit</span>
        <div style={{ marginLeft: 'auto' }}>
          <Link href={liveUrl} target="_blank"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#0f1f0f', border: '1px solid #1a4a1a', color: '#4ade80', borderRadius: '20px', padding: '0.3rem 0.9rem', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>
            <span style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 6px #4ade80', display: 'inline-block' }} />
            View Live ↗
          </Link>
        </div>
      </div>

      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>{page.title}</h1>
        <code style={{ fontSize: '0.78rem', color: '#555', background: '#111', padding: '2px 8px', borderRadius: '4px', marginTop: '0.4rem', display: 'inline-block' }}>
          /{isHomePage ? '(home)' : page.slug}
        </code>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>

        {/* LEFT: Content editor */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '14px', padding: '1.75rem' }}>
          <SectionBuilder pageId={page.id} initialSections={page.sections} />
        </div>

        {/* RIGHT: Settings panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* SEO Settings */}
          <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '14px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.1rem' }}>⚙️</span>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Page Settings</h2>
            </div>
            <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="hidden" name="pageId" value={page.id} />
              <div>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.78rem', fontWeight: 600, color: '#777', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Page Title</label>
                <input name="title" defaultValue={page.title} required style={input} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.78rem', fontWeight: 600, color: '#777', textTransform: 'uppercase', letterSpacing: '0.04em' }}>URL Slug</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#555', fontSize: '0.85rem', pointerEvents: 'none' }}>/</span>
                  <input name="slug" defaultValue={page.slug} required={!isHomePage} readOnly={isHomePage} style={{ ...input, paddingLeft: '1.3rem', ...(isHomePage ? { color: '#888', background: '#111', cursor: 'not-allowed' } : {}) }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.78rem', fontWeight: 600, color: '#777', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Meta Title <span style={{ color: '#ED1C24', fontSize: '0.7rem', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>SEO</span>
                </label>
                <input name="metaTitle" defaultValue={page.metaTitle || ''} placeholder={page.title} style={input} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.78rem', fontWeight: 600, color: '#777', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Meta Description <span style={{ color: '#ED1C24', fontSize: '0.7rem', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>SEO</span>
                </label>
                <textarea name="metaDescription" defaultValue={page.metaDescription || ''} rows={3}
                  style={{ ...input, resize: 'vertical', lineHeight: 1.5 }} />
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.72rem', color: '#444' }}>Aim for 150–160 characters</p>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.78rem', fontWeight: 600, color: '#777', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Keywords <span style={{ color: '#ED1C24', fontSize: '0.7rem', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>SEO</span>
                </label>
                <input name="keywords" defaultValue={page.keywords || ''} placeholder="e.g. automation, CRM, marketing" style={input} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.78rem', fontWeight: 600, color: '#777', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Social Share Image URL <span style={{ color: '#ED1C24', fontSize: '0.7rem', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>SEO</span>
                </label>
                <input name="ogImage" defaultValue={page.ogImage || ''} placeholder="https://..." style={input} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.78rem', fontWeight: 600, color: '#777', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Schema Markup (JSON-LD) <span style={{ color: '#ED1C24', fontSize: '0.7rem', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>SEO</span>
                </label>
                <textarea name="schemaMarkup" defaultValue={page.schemaMarkup || ''} placeholder='{ "@context": "https://schema.org", "@type": "WebPage" ... }' rows={4} style={{ ...input, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem' }} />
              </div>
              <button type="submit"
                style={{ width: '100%', background: 'linear-gradient(135deg,#ED1C24,#c01019)', color: '#fff', border: 'none', padding: '0.7rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 16px rgba(237,28,36,0.25)', marginTop: '0.25rem' }}>
                Save Settings
              </button>
            </form>
          </div>

          {/* Page Info */}
          <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '14px', padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '0.85rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Page Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { label: 'Sections', value: isHomePage ? '10 homepage sections' : `${page.sections.length}`, color: '#fff' },
                { label: 'Created', value: page.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), color: '#999' },
                { label: 'Updated', value: page.updatedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), color: '#999' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: '#555' }}>{row.label}</span>
                  <span style={{ color: row.color, fontWeight: 600 }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: '#555' }}>Status</span>
                <span style={{ color: '#4ade80', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '5px', height: '5px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 4px #4ade80', display: 'inline-block' }} />
                  Published
                </span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div style={{ background: '#0d0d0d', border: '1px solid #2a1a1a', borderRadius: '14px', padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', fontWeight: 600, color: '#ED1C2480', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Danger Zone</h3>
            <form action={handleDelete}>
              <input type="hidden" name="pageId" value={page.id} />
              <button type="submit"
                style={{ width: '100%', background: 'transparent', border: '1px solid #3a1a1a', color: '#ED1C24', borderRadius: '8px', padding: '0.6rem', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
                🗑 Delete This Page
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
