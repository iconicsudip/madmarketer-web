import { getPortfolioProjects, createPortfolioProject, deletePortfolioProject } from '@/app/actions/cms';

export default async function PortfolioAdmin() {
  const projects = await getPortfolioProjects();

  async function handleAdd(formData: FormData) {
    'use server';
    await createPortfolioProject({
      client: formData.get('client') as string,
      title: formData.get('title') as string,
      image: formData.get('image') as string,
      stats: formData.get('stats') as string,
      metaTitle: formData.get('metaTitle') as string,
      metaDescription: formData.get('metaDescription') as string,
      keywords: formData.get('keywords') as string,
      ogImage: formData.get('ogImage') as string,
    });
  }

  async function handleDelete(formData: FormData) {
    'use server';
    await deletePortfolioProject(formData.get('id') as string);
  }

  const inputStyle = { width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Manage Portfolio</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ background: '#111', padding: '2rem', borderRadius: '8px', border: '1px solid #333' }}>
          <h2 style={{ marginBottom: '1rem' }}>Add New Project</h2>
          <form action={handleAdd}>
            <input name="client" placeholder="Client Name" required style={inputStyle} />
            <input name="title" placeholder="Project Title/Description" required style={inputStyle} />
            <input name="image" placeholder="Image URL" required style={inputStyle} />
            <textarea name="stats" placeholder='JSON Stats e.g. [{"value":"44%","label":"Faster"}]' style={{...inputStyle, height: '80px', fontFamily: 'monospace'}} />
            
            <h3 style={{ margin: '1rem 0 0.5rem', fontSize: '1rem', color: '#888' }}>SEO Meta</h3>
            <input name="metaTitle" placeholder="SEO Title" style={inputStyle} />
            <textarea name="metaDescription" placeholder="SEO Description" style={{...inputStyle, height: '60px'}} />
            <input name="keywords" placeholder="SEO Keywords (comma separated)" style={inputStyle} />
            <input name="ogImage" placeholder="Social Share Image URL" style={inputStyle} />

            <button type="submit" style={{ background: '#ED1C24', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>Add Project</button>
          </form>
        </div>

        <div>
          <h2 style={{ marginBottom: '1rem' }}>Existing Projects ({projects.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {projects.map(p => (
              <div key={p.id} style={{ background: '#111', padding: '1rem', borderRadius: '8px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><strong>{p.client}</strong></div>
                <form action={handleDelete}>
                  <input type="hidden" name="id" value={p.id} />
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
