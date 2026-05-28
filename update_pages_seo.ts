import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const pageSEOMap: Record<string, { title: string, desc: string, keywords: string, ogImage: string, type: string }> = {
  'about': {
    title: 'About Us | Madmarketer - Enterprise Digital Solutions',
    desc: 'Learn about Madmarketer, the premier enterprise automation and digital infrastructure company building next-generation AI and growth solutions for modern brands.',
    keywords: 'about Madmarketer, enterprise automation company, AI consulting, digital transformation team',
    ogImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200&h=630',
    type: 'AboutPage'
  },
  'portfolio': {
    title: 'Our Portfolio | Case Studies & Enterprise Solutions | Madmarketer',
    desc: 'Explore Madmarketer\'s portfolio of successful enterprise deployments, AI integrations, custom digital infrastructure, and comprehensive growth campaigns.',
    keywords: 'Madmarketer portfolio, case studies, enterprise solutions, digital transformation examples, successful automation projects',
    ogImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=630',
    type: 'CollectionPage'
  },
  'blog': {
    title: 'Insights & Blog | Enterprise AI, Marketing & Tech | Madmarketer',
    desc: 'Read the latest insights from Madmarketer experts on artificial intelligence, enterprise automation, cutting-edge marketing strategies, and digital infrastructure.',
    keywords: 'Madmarketer blog, AI insights, enterprise marketing blog, automation tech news, digital infrastructure tips',
    ogImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200&h=630',
    type: 'Blog'
  },
  'contact': {
    title: 'Contact Us | Partner with Madmarketer',
    desc: 'Get in touch with Madmarketer to discuss enterprise automation, AI consulting, and robust digital infrastructure solutions for your business.',
    keywords: 'contact Madmarketer, hire AI consultants, enterprise automation agency contact',
    ogImage: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&q=80&w=1200&h=630',
    type: 'ContactPage'
  }
};

async function updatePageSEO() {
  console.log('Starting Pages SEO Enrichment...');

  const pages = await prisma.page.findMany();
  let updated = 0;

  for (const page of pages) {
    if (page.slug === '' || page.slug.includes('tools/')) continue; // Handled previously or skipped

    let seoData = pageSEOMap[page.slug];

    // If it's a specific service page that wasn't hardcoded above
    if (!seoData && page.slug.startsWith('services/')) {
      const parts = page.slug.split('/');
      const name = parts[parts.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const category = parts[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      seoData = {
        title: `${name} | ${category} Services | Madmarketer`,
        desc: `Discover our premium ${name} services. At Madmarketer, we leverage advanced technologies to deliver scalable, intelligent solutions for your enterprise.`,
        keywords: `${name.toLowerCase()} services, enterprise ${name.toLowerCase()}, madmarketer ${category.toLowerCase()}`,
        ogImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200&h=630', // Tech/Data theme
        type: 'WebPage'
      };
    }

    if (seoData) {
      const schemaMarkup = JSON.stringify({
        "@context": "https://schema.org",
        "@type": seoData.type,
        "name": seoData.title,
        "description": seoData.desc,
        "publisher": {
          "@type": "Organization",
          "name": "Madmarketer"
        }
      }, null, 2);

      await prisma.page.update({
        where: { id: page.id },
        data: {
          metaTitle: seoData.title,
          metaDescription: seoData.desc,
          keywords: seoData.keywords,
          ogImage: seoData.ogImage,
          schemaMarkup: schemaMarkup
        }
      });
      console.log(`✅ Updated Page SEO: ${page.slug}`);
      updated++;
    }
  }

  console.log(`\n🎉 Page SEO Enrichment Complete! Updated ${updated} pages.`);
}

updatePageSEO()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
