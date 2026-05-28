import PageRenderer from '@/components/PageRenderer';
import {
  getServices, getProducts, getBlogPosts,
  getTestimonials, getPortfolioProjects
} from '@/app/actions/cms';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findUnique({ where: { slug: '' } });
  if (!page) return { title: 'Mad Marketer' };
  
  return { 
    title: page.title, 
    description: page.metaDescription,
    keywords: page.keywords || undefined,
    openGraph: page.ogImage ? { images: [page.ogImage] } : undefined,
  };
}

export default async function Home() {
  const [services, products, blogs, reviews, portfolio] = await Promise.all([
    getServices(),
    getProducts(),
    getBlogPosts(),
    getTestimonials(),
    getPortfolioProjects(),
  ]);

  const page = await prisma.page.findUnique({ where: { slug: '' } });

  return (
    <main>
      {page?.schemaMarkup && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: page.schemaMarkup }} />
      )}
      <PageRenderer 
        slug="" 
        collections={{ services, products, blogs, reviews, portfolio }} 
      />
    </main>
  );
}
