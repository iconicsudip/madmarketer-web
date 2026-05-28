'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deletePage, duplicatePage } from '@/app/actions/cms';

type PageSection = { id: string };

type Page = {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  sections: PageSection[];
};

type BadgeInfo = { label: string; color: string };

const NAV_SLUGS: Record<string, BadgeInfo> = {
  '':          { label: 'Navbar · Home',       color: '#3b82f6' },
  'about':     { label: 'Navbar · About',      color: '#8b5cf6' },
  'portfolio': { label: 'Navbar · Portfolio',  color: '#10b981' },
  'blog':      { label: 'Navbar · Blog',       color: '#f59e0b' },
  'contact':   { label: 'Navbar · Contact',    color: '#ef4444' },
};

function getNavBadge(slug: string): BadgeInfo {
  if (NAV_SLUGS[slug]) return NAV_SLUGS[slug];
  if (slug.startsWith('services/development')) return { label: 'Services · Development', color: '#06b6d4' };
  if (slug.startsWith('services/marketing'))   return { label: 'Services · Marketing',   color: '#f59e0b' };
  if (slug.startsWith('services/marketplace')) return { label: 'Services · Marketplace', color: '#10b981' };
  if (slug.startsWith('services/tools'))       return { label: 'Services · Tools',        color: '#8b5cf6' };
  if (slug.startsWith('services/plugins'))     return { label: 'Services · Plugins',      color: '#ec4899' };
  return { label: 'Standalone Page', color: '#6b7280' };
}

function PageCard({ page }: { page: Page }) {
  const badge = getNavBadge(page.slug);
  const sectionCount = page.sections.length;
  const hasContent = !!page.content || sectionCount > 0;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${page.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deletePage(page.id);
      router.refresh();
    });
  }

  function handleDuplicate() {
    if (!confirm(`Duplicate "${page.title}"?`)) return;
    startTransition(async () => {
      await duplicatePage(page.id);
      router.refresh();
    });
  }

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, #111 0%, #0d0d0d 100%)',
        border: '1px solid #1f1f1f',
        borderRadius: '12px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s, transform 0.15s',
        opacity: isPending ? 0.5 : 1,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = badge.color + '55';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#1f1f1f';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Glow orb */}
      <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '80px', height: '80px', background: badge.color, opacity: 0.06, borderRadius: '50%', filter: 'blur(20px)', pointerEvents: 'none' }} />

      {/* Badge + status dot */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ background: badge.color + '20', border: `1px solid ${badge.color}40`, color: badge.color, borderRadius: '20px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.02em' }}>
          {badge.label}
        </span>
        <span title={hasContent ? 'Has content' : 'Empty page'} style={{ width: '7px', height: '7px', borderRadius: '50%', background: hasContent ? '#10b981' : '#444', boxShadow: hasContent ? '0 0 6px #10b981' : 'none' }} />
      </div>

      {/* Title & slug */}
      <div>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{page.title}</h3>
        <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#555', fontFamily: 'monospace' }}>
          /{page.slug || '(home)'}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: '#555' }}>
        <span>◈ {sectionCount} {sectionCount === 1 ? 'section' : 'sections'}</span>
        <span>·</span>
        <span>{page.updatedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>

      {/* Meta description */}
      {page.metaDescription && (
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#555', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {page.metaDescription}
        </p>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #1a1a1a' }}>
        <Link
          href={`/admin/pages/${page.id}/edit`}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: '#0d1a2e', border: `1px solid ${badge.color}30`, color: '#e2e8f0', borderRadius: '8px', padding: '0.5rem 0.75rem', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = badge.color; e.currentTarget.style.background = badge.color + '22'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = badge.color + '30'; e.currentTarget.style.background = '#0d1a2e'; }}
        >
          ✏️ Edit Page
        </Link>

        <Link
          href={`/${page.slug}`}
          target="_blank"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', background: '#0a0a0a', border: '1px solid #2a2a2a', color: '#888', borderRadius: '8px', padding: '0.5rem 0.75rem', textDecoration: 'none', fontSize: '0.82rem', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#555'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#2a2a2a'; }}
          title="View Live"
        >
          ↗
        </Link>

        <button
          onClick={handleDuplicate}
          disabled={isPending}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', border: '1px solid #2a2a2a', color: '#3b82f6', borderRadius: '8px', padding: '0.5rem 0.65rem', cursor: isPending ? 'default' : 'pointer', fontSize: '0.82rem', transition: 'all 0.2s' }}
          onMouseEnter={e => { if (!isPending) { e.currentTarget.style.background = '#3b82f615'; e.currentTarget.style.borderColor = '#3b82f660'; } }}
          onMouseLeave={e => { e.currentTarget.style.background = '#0a0a0a'; e.currentTarget.style.borderColor = '#2a2a2a'; }}
          title="Duplicate Page"
        >
          {isPending ? '⏳' : '📋'}
        </button>

        <button
          onClick={handleDelete}
          disabled={isPending}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', border: '1px solid #2a1a1a', color: '#ED1C24', borderRadius: '8px', padding: '0.5rem 0.65rem', cursor: isPending ? 'default' : 'pointer', fontSize: '0.82rem', transition: 'all 0.2s' }}
          onMouseEnter={e => { if (!isPending) { e.currentTarget.style.background = '#ED1C2415'; e.currentTarget.style.borderColor = '#ED1C2460'; } }}
          onMouseLeave={e => { e.currentTarget.style.background = '#0a0a0a'; e.currentTarget.style.borderColor = '#2a1a1a'; }}
          title="Delete Page"
        >
          {isPending ? '⏳' : '🗑'}
        </button>
      </div>
    </div>
  );
}

type Groups = Record<string, Page[]>;

export default function PagesGrid({ groups }: { groups: Groups }) {
  return (
    <div>
      {Object.entries(groups).map(([groupName, groupPages]) => {
        if (groupPages.length === 0) return null;
        const sampleBadge = getNavBadge(groupPages[0].slug);
        return (
          <div key={groupName} style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '3px', height: '18px', borderRadius: '2px', background: sampleBadge.color }} />
              <h2 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#888' }}>
                {groupName}
              </h2>
              <span style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '20px', padding: '1px 8px', fontSize: '0.75rem', color: '#666' }}>
                {groupPages.length}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {groupPages.map(page => (
                <PageCard key={page.id} page={page} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
