import AboutSection from '@/components/home/AboutSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import FinalCTA from '@/components/home/FinalCTA';
import PageRenderer from '@/components/PageRenderer';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findUnique({ where: { slug: 'about' } });
  if (!page) return { title: 'About Us' };
  return { title: page.title, description: page.metaDescription };
}

export default async function AboutPage() {
  const page = await prisma.page.findUnique({
    where: { slug: 'about' },
    include: { sections: true },
  });
  const hasCmsSections = (page?.sections.length ?? 0) > 0;

  return (
    <main>
      {hasCmsSections ? (
        // CMS-driven content
        <>
          <PageRenderer slug="about" />
        </>
      ) : (
        // Hardcoded fallback
        <>
          <div style={{ paddingTop: '80px' }}>
            <AboutSection />
            <WhyChooseUs />
          </div>
        </>
      )}
    </main>
  );
}
