import { getPortfolioProjects, createPortfolioProject, deletePortfolioProject, updatePortfolioProject } from '@/app/actions/cms';
import { Plus, Trash2, Layout, Image as ImageIcon, Code, Type, Tags, Globe, Edit2, X } from 'lucide-react';
import Link from 'next/link';
import ImageUploaderField from '@/components/ImageUploaderField';
import JsonTextAreaField from '@/components/JsonTextAreaField';

export default async function PortfolioAdmin({ searchParams }: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const projects = await getPortfolioProjects();
  const params = searchParams ? await searchParams : {};
  const editingId = params?.edit ? String(params.edit) : null;
  const editingProject = editingId ? projects.find(p => p.id === editingId) : null;

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

  async function handleUpdate(formData: FormData) {
    'use server';
    if (!editingId) return;
    await updatePortfolioProject(editingId, {
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

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', color: '#fff', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--primary-red), #900)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(237,28,36,0.3)' }}>
          <Layout size={28} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', background: 'linear-gradient(to right, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Manage Portfolio
          </h1>
          <p style={{ color: '#888', margin: '0.4rem 0 0 0', fontSize: '1rem' }}>Create, update, and organize your featured projects.</p>
        </div>
      </header>

      <style>{`
        .admin-input {
          width: 100%;
          padding: 14px 16px;
          padding-left: 46px;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          border-radius: 12px;
          font-family: inherit;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }
        .admin-input:focus {
          outline: none;
          border-color: var(--primary-red);
          box-shadow: 0 0 0 3px rgba(237,28,36,0.15);
          background: rgba(0,0,0,0.6);
        }
        .admin-input::placeholder {
          color: rgba(255,255,255,0.3);
        }
        .input-group {
          position: relative;
          margin-bottom: 1.25rem;
        }
        .input-icon {
          position: absolute;
          left: 16px;
          top: 14px;
          color: rgba(255,255,255,0.4);
          pointer-events: none;
        }
        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, var(--primary-red), #b01017);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 8px 20px rgba(237,28,36,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(237,28,36,0.4);
        }
        .submit-btn:active {
          transform: translateY(0);
        }
        .project-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s ease;
        }
        .project-card:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.1);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .delete-btn {
          background: rgba(237,28,36,0.1);
          color: var(--primary-red);
          border: 1px solid transparent;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .delete-btn:hover {
          background: rgba(237,28,36,0.2);
          border-color: rgba(237,28,36,0.3);
        }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1.2fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: FORM */}
        <div style={{ background: 'rgba(20,20,20,0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(237,28,36,0.1)', color: 'var(--primary-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {editingProject ? <Edit2 size={20} /> : <Plus size={20} />}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h2>
            {editingProject && (
              <Link href="/admin/portfolio" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#888', textDecoration: 'none', fontSize: '0.9rem' }}>
                <X size={16} /> Cancel
              </Link>
            )}
          </div>
          
          <form key={editingProject?.id || 'new'} action={editingProject ? handleUpdate : handleAdd}>
            <div className="input-group">
              <Type size={18} className="input-icon" />
              <input name="client" defaultValue={editingProject?.client || ''} placeholder="Client Name" required className="admin-input" />
            </div>
            
            <div className="input-group">
              <Type size={18} className="input-icon" />
              <input name="title" defaultValue={editingProject?.title || ''} placeholder="Project Title or Description" required className="admin-input" />
            </div>
            
            <div style={{ marginBottom: '0.25rem' }}>
              <ImageUploaderField name="image" defaultValue={editingProject?.image || ''} label="Project Image (Required)" compact />
            </div>
            
            <JsonTextAreaField
              name="stats"
              defaultValue={editingProject?.stats || ''}
              placeholder='JSON Stats e.g. [{"value":"44%","label":"Faster"}]'
              exampleData='[{"value":"44%","label":"Faster"},{"value":"10x","label":"ROI"}]'
              className="admin-input"
              style={{ height: '100px', resize: 'vertical', paddingTop: '14px', fontFamily: 'monospace' }}
            />
            
            <div style={{ margin: '2.5rem 0 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', color: 'var(--primary-red)', margin: '0 0 1.25rem 0', fontWeight: 600 }}>
                <Globe size={18} />
                SEO Metadata
              </h3>
              
              <div className="input-group">
                <Tags size={18} className="input-icon" />
                <input name="metaTitle" defaultValue={editingProject?.metaTitle || ''} placeholder="SEO Title" className="admin-input" />
              </div>
              
              <div className="input-group">
                <Type size={18} className="input-icon" style={{ top: '16px' }} />
                <textarea name="metaDescription" defaultValue={editingProject?.metaDescription || ''} placeholder="SEO Description" className="admin-input" style={{ height: '80px', resize: 'vertical', paddingTop: '14px' }} />
              </div>
              
              <div className="input-group">
                <Tags size={18} className="input-icon" />
                <input name="keywords" defaultValue={editingProject?.keywords || ''} placeholder="Keywords (comma separated)" className="admin-input" />
              </div>
              
              <div style={{ marginBottom: '0.25rem' }}>
                <ImageUploaderField name="ogImage" defaultValue={editingProject?.ogImage || ''} label="Social Share Image (OG)" compact />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              {editingProject ? <Edit2 size={20} /> : <Plus size={20} />}
              {editingProject ? 'Update Project' : 'Publish Project'}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: PROJECT LIST */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Existing Projects</h2>
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600 }}>
              {projects.length} Total
            </span>
          </div>
          
          {projects.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <Layout size={48} color="rgba(255,255,255,0.2)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: '#888', margin: 0, fontSize: '1.1rem' }}>No projects found. Add your first one!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {projects.map(p => (
                <div key={p.id} className="project-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#222', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {p.image ? (
                        <img src={p.image} alt={p.client} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                          <ImageIcon size={24} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 600 }}>{p.client}</h4>
                      <p style={{ margin: 0, color: '#777', fontSize: '0.9rem' }}>{p.title || 'No description'}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/admin/portfolio?edit=${p.id}`} className="edit-btn" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid transparent', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>
                      <Edit2 size={16} />
                      Edit
                    </Link>
                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="delete-btn">
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
