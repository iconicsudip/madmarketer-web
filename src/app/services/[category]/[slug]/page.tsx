import FinalCTA from '@/components/home/FinalCTA';
import FAQAccordion from '@/components/services/FAQAccordion';
import PageRenderer from '@/components/PageRenderer';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

export async function generateMetadata(props: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const fullSlug = `services/${params.category}/${params.slug}`;

  const page = await prisma.page.findUnique({ where: { slug: fullSlug } });

  if (page) {
    return { 
      title: page.title, 
      description: page.metaDescription,
      keywords: page.keywords ? page.keywords.split(',').map(k => k.trim()) : undefined,
      openGraph: page.ogImage ? { images: [page.ogImage] } : undefined,
    };
  }

  // Fallback metadata if CMS entry doesn't exist yet
  const title = params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return { title, description: `Enterprise-grade infrastructure built exactly for your business needs.` };
}

export default async function ServicePage(props: { params: Promise<{ category: string; slug: string }> }) {
  const params = await props.params;
  const fullSlug = `services/${params.category}/${params.slug}`;

  // Check if there's CMS content for this page
  const page = await prisma.page.findUnique({
    where: { slug: fullSlug },
    include: { sections: { orderBy: { orderIndex: 'asc' } } },
  });

  // If CMS sections exist — render them fully
  if (page && page.sections.length > 0) {
    return (
      <main>
        {page.schemaMarkup && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: page.schemaMarkup }} />
        )}
        <PageRenderer slug={fullSlug} />
      </main>
    );
  }

  // Fallback: auto-generate from slug until CMS content is added
  const title = params.slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  const category = params.category
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  return (
    <main>
      <div style={{ paddingTop: '180px', paddingBottom: '120px', color: '#fff', minHeight: '80vh' }}>
        <div className="container">
          <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '50px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '2rem' }}>
            {category}
          </span>
          <h1 style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {title}
          </h1>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '1.2rem', color: 'rgba(255,255,255,0.55)', maxWidth: '620px', marginBottom: '5rem', lineHeight: 1.7 }}>
            Enterprise-grade {category.toLowerCase()} infrastructure built exactly for your business needs.
          </p>

          {/* Prompt to add content */}
          <div style={{ background: '#0d0d0d', border: '1px dashed #2a2a2a', borderRadius: '14px', padding: '2rem', maxWidth: '600px', marginBottom: '4rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✏️</div>
            <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>
              No content added yet. Go to{' '}
              <a href={`/admin/pages`} style={{ color: '#ED1C24', textDecoration: 'none' }}>Admin → Pages</a>
              {' '}and edit the <strong style={{ color: '#888' }}>{title}</strong> page to add sections.
            </p>
          </div>

          <div style={{ maxWidth: '1024px' }}>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '2rem', fontFamily: 'var(--font-inter)', fontWeight: 600 }}>
              Frequently Asked Questions
            </h3>
            <FAQAccordion faqs={[
              { q: 'Can you customize this service?', a: 'Absolutely, everything we build is tailored exactly to your operational requirements.' },
              { q: 'How do we get started?', a: `Book a free consultation and we'll map out a custom plan for your business.` },
            ]} />
          </div>
        </div>
      </div>
    </main>
  );
}
