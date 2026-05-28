'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { updatePageSection } from '@/app/actions/cms'; // Assuming we can use this or similar
import Link from 'next/link';

type SectionDef = {
  id: string;
  label: string;
  icon: string;
  description: string;
  color: string;
  managedExternally?: { label: string; href: string };
  fields?: { key: string; label: string; type: 'text' | 'textarea'; placeholder?: string }[];
};

const SECTIONS: SectionDef[] = [
  {
    id: 'hero', label: 'Hero Banner', icon: '🏆', color: '#ED1C24',
    description: 'Main headline, subtext, and CTA button.',
    fields: [
      { key: 'heading',    label: 'Main Heading',     type: 'text',     placeholder: 'Mad Marketer' },
      { key: 'subheading', label: 'Sub-heading',      type: 'textarea', placeholder: 'Create intelligent growth infrastructure for your business.' },
      { key: 'ctaText',    label: 'CTA Button Text',  type: 'text',     placeholder: 'Build Your System' },
      { key: 'ctaLink',    label: 'CTA Button Link',  type: 'text',     placeholder: '/contact' },
    ],
  },
  {
    id: 'about', label: 'About Section', icon: '🧠', color: '#8b5cf6',
    description: 'Brand story section below the hero.',
    fields: [
      { key: 'label',       label: 'Label (uppercase)',  type: 'text',     placeholder: 'ABOUT MAD MARKETER' },
      { key: 'mainHeading', label: 'Main Heading',       type: 'text',     placeholder: 'We turn chaos into...' },
      { key: 'bodyText',    label: 'Body Text',          type: 'textarea', placeholder: 'Stop treating your website...' },
      { key: 'ctaText',     label: 'CTA Text',           type: 'text',     placeholder: 'Learn More' },
      { key: 'ctaLink',     label: 'CTA Link',           type: 'text',     placeholder: '/about' },
    ],
  },
  {
    id: 'services', label: 'Services Ecosystem', icon: '⚡', color: '#3b82f6',
    description: 'Your main service offerings grid.',
    managedExternally: { label: 'Manage Services', href: '/admin/services' }
  },
  {
    id: 'products', label: 'Our Products', icon: '📦', color: '#10b981',
    description: 'Showcase your internal products and platforms.',
    managedExternally: { label: 'Manage Products', href: '/admin/products' }
  },
  {
    id: 'process', label: 'Process Roadmap', icon: '🛤️', color: '#f59e0b',
    description: 'Step-by-step methodology section.',
    fields: [
      { key: 'heading',   label: 'Section Heading', type: 'text',     placeholder: 'How We Work' },
      { key: 'step1Text', label: 'Step 1 Text',     type: 'textarea', placeholder: '' },
      { key: 'step2Text', label: 'Step 2 Text',     type: 'textarea', placeholder: '' },
      { key: 'step3Text', label: 'Step 3 Text',     type: 'textarea', placeholder: '' },
    ]
  },
  {
    id: 'portfolio', label: 'Portfolio Reel', icon: '🖼️', color: '#ec4899',
    description: 'Highlight past case studies and work.',
    managedExternally: { label: 'Manage Portfolio', href: '/admin/portfolio' }
  },
  {
    id: 'reviews', label: 'Client Reviews', icon: '⭐️', color: '#eab308',
    description: 'Testimonials and social proof.',
    managedExternally: { label: 'Manage Reviews', href: '/admin/reviews' }
  },
  {
    id: 'blogs', label: 'Latest Insights', icon: '📝', color: '#14b8a6',
    description: 'Dynamic grid of recent blog posts.',
    managedExternally: { label: 'Manage Blogs', href: '/admin/blogs' }
  },
];

function SectionCard({ section, initialData, isFirst }: { section: SectionDef, initialData: any, isFirst: boolean }) {
  const [fields, setFields] = useState<Record<string, string>>(initialData);
  const [isExpanded, setIsExpanded] = useState(isFirst);
  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (key: string, value: string) => {
    const newFields = { ...fields, [key]: value };
    setFields(newFields);
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      startTransition(async () => {
        // Need to hit the backend API to save homepage section data.
        // Assuming there is an action or API route. For now we just mock or call the real one if it exists.
        await fetch(`/api/admin/homepage-sections`, {
          method: 'POST',
          body: JSON.stringify({ id: section.id, data: newFields })
        }).catch(() => {});
      });
    }, 1000);
  };

  const fieldInput: React.CSSProperties = {
    width: '100%', padding: '0.7rem 0.9rem', background: '#0a0a0a', border: '1px solid #2a2a2a',
    borderRadius: '8px', color: '#fff', fontSize: '0.9rem', fontFamily: 'inherit', boxSizing: 'border-box'
  };

  return (
    <div style={{ background: '#151515', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden' }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ padding: '0.75rem 1.25rem', background: '#1a1a1a', borderBottom: isExpanded ? '1px solid #2a2a2a' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem', opacity: isExpanded ? 1 : 0.7 }}>{section.icon}</span>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: isExpanded ? '#fff' : '#ccc' }}>{section.label}</h4>
          <span style={{ color: '#555', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
            {isExpanded ? '▲' : '▼'}
          </span>
        </div>
        {isPending && <span style={{ fontSize: '0.8rem', color: '#888' }}>Saving...</span>}
      </div>

      {isExpanded && (
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {section.fields?.map(field => (
            <div key={field.key}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: '#888' }}>{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea value={fields[field.key] || ''} onChange={e => handleChange(field.key, e.target.value)} placeholder={field.placeholder} rows={3} style={{ ...fieldInput, resize: 'vertical', lineHeight: 1.5 }} />
              ) : (
                <input type="text" value={fields[field.key] || ''} onChange={e => handleChange(field.key, e.target.value)} placeholder={field.placeholder} style={fieldInput} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomeContentSections({ allData }: { allData: Record<string, any> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Homepage Layout</h2>
        <p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem', color: '#666' }}>
          Configure the sections of your homepage. Some sections are managed via external data modules.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {SECTIONS.map((section, i) => (
          <div key={section.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              <div style={{ width: '2px', height: '12px', borderRadius: '1px', background: section.color }} />
              <span style={{ fontSize: '0.65rem', color: '#3a3a3a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Section {i + 1}
              </span>
            </div>

            {section.managedExternally ? (
              <div style={{ border: '1px solid #1a1a1a', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#111' }}>
                <span style={{ fontSize: '1.25rem' }}>{section.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{section.label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#555' }}>{section.description}</div>
                </div>
                <Link href={section.managedExternally.href}
                  style={{ background: section.color + '18', border: `1px solid ${section.color}44`, color: section.color, borderRadius: '7px', padding: '0.35rem 0.9rem', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {section.managedExternally.label}
                </Link>
              </div>
            ) : (
              <SectionCard section={section} initialData={allData[section.id] || {}} isFirst={i === 0} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
