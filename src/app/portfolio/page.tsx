import PortfolioSection from '@/components/home/PortfolioSection';
import FinalCTA from '@/components/home/FinalCTA';
import PageRenderer from '@/components/PageRenderer';
import { getPortfolioProjects } from '@/app/actions/cms';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findUnique({ where: { slug: 'portfolio' } });
  if (!page) return { title: 'Portfolio' };
  return { title: page.title, description: page.metaDescription };
}

export default async function PortfolioPage() {
  const items = await getPortfolioProjects();

  const page = await prisma.page.findUnique({
    where: { slug: 'portfolio' },
    include: { sections: true },
  });
  const hasCmsSections = (page?.sections.length ?? 0) > 0;
  const hasWidget = page?.sections.some(s => s.type === 'widget' && s.content.includes('portfolio_grid'));

  const PortfolioGridWidget = (
    <div style={{ paddingBottom: '100px', backgroundColor: 'var(--dark-bg)' }}>
      <PortfolioSection items={items} />
      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '8rem 2rem', color: '#555' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</div>
          <p style={{ fontSize: '1.1rem' }}>No portfolio items yet.</p>
          <a href="/admin/portfolio" style={{ color: '#ED1C24', textDecoration: 'none', fontSize: '0.9rem' }}>
            Add projects in Admin →
          </a>
        </div>
      )}
    </div>
  );

  return (
    <main>
      {/* Dynamic CMS Sections first */}
      <PageRenderer slug="portfolio" />

      {/* Fallback Header */}
      {!hasCmsSections && (
        <div style={{ paddingTop: '160px', paddingBottom: '60px', textAlign: 'center', backgroundColor: 'var(--dark-bg)' }}>
          <div className="container">
            <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '50px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem', color: '#ED1C24' }}>
              Our Work
            </span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
              Portfolio & Case Studies
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.55)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              Explore how we've helped enterprises scale their operations, automate workflows, and drive unprecedented revenue growth.
            </p>
          </div>
        </div>
      )}

      {/* Portfolio Grid */}
      {!hasWidget && PortfolioGridWidget}

      <PageRenderer slug="portfolio" widgets={{ portfolio_grid: PortfolioGridWidget }} />
    </main>
  );
}
