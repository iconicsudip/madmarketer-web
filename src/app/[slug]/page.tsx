import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import PageRenderer from '@/components/PageRenderer';
import FinalCTA from '@/components/home/FinalCTA';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) return { title: 'Not Found' };

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription,
    keywords: page.keywords ? page.keywords.split(',').map(k => k.trim()) : undefined,
    openGraph: page.ogImage ? { images: [page.ogImage] } : undefined,
  };
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;

  const page = await prisma.page.findUnique({
    where: { slug },
    include: { sections: { orderBy: { orderIndex: 'asc' } } },
  });

  if (!page) notFound();

  // If CMS sections exist — render them
  if (page.sections.length > 0) {
    return (
      <main>
        {page.schemaMarkup && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: page.schemaMarkup }} />
        )}
        <PageRenderer slug={slug} />
      </main>
    );
  }

  // Fallback: show title + hint if no sections yet
  return (
    <main>
      {page.schemaMarkup && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: page.schemaMarkup }} />
      )}
      <div style={{ paddingTop: '160px', paddingBottom: '100px', backgroundColor: '#0a0a0a', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '1024px' }}>
          <Link href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2rem' }}>
            ← Back to Home
          </Link>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            {page.title}
          </h1>
          {page.metaDescription && (
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '3rem' }}>
              {page.metaDescription}
            </p>
          )}
          {page.content && (
            <div style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontSize: '1.05rem' }}
              dangerouslySetInnerHTML={{ __html: page.content }} />
          )}
          {!page.content && (
            <div style={{ background: '#0d0d0d', border: '1px dashed #2a2a2a', borderRadius: '14px', padding: '2rem', color: '#555' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✏️</div>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                No content yet.{' '}
                <a href="/admin/pages" style={{ color: '#ED1C24', textDecoration: 'none' }}>
                  Add sections in the admin →
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
      <FinalCTA />
    </main>
  );
}
