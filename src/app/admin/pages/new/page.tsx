'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../admin.module.css';
import Link from 'next/link';

export default function NewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      metaDescription: formData.get('metaDescription'),
      content: formData.get('content'),
    };

    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/admin/pages');
        router.refresh();
      } else {
        const err = await res.json();
        alert('Error: ' + err.message);
      }
    } catch (error) {
      alert('Failed to save page');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Create New Page</h1>
        <Link href="/admin/pages" className="btn" style={{ border: '1px solid var(--card-border)' }}>Cancel</Link>
      </div>
      
      <div style={{ backgroundColor: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--card-border)', maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Page Title</label>
            <input type="text" name="title" required className={styles.input} placeholder="e.g. Next.js SEO Guide" />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>URL Slug</label>
            <input type="text" name="slug" required className={styles.input} placeholder="e.g. nextjs-seo-guide" />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Meta Description</label>
            <input type="text" name="metaDescription" required className={styles.input} placeholder="Brief summary for search engines" />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Content (HTML Supported)</label>
            <textarea name="content" required className={styles.textarea} placeholder="<h2>Introduction</h2><p>Write your content here...</p>" />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Publish Page'}
          </button>
        </form>
      </div>
    </div>
  );
}
