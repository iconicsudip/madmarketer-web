import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const homeSEO = {
  metaTitle: 'Madmarketer | Enterprise AI & Automation Infrastructure',
  metaDescription: 'Madmarketer provides cutting-edge enterprise automation, AI integrations, intelligent CRM solutions, and digital infrastructure to scale your business with precision.',
  keywords: 'AI automation, enterprise infrastructure, intelligent CRM, business automation, AI consulting, digital transformation, Madmarketer, SaaS development, cloud infrastructure',
  schemaMarkup: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Madmarketer",
    "url": "https://madmarketer.com",
    "logo": "https://madmarketer.com/logo.png",
    "description": "Enterprise AI & Automation Infrastructure company.",
    "sameAs": [
      "https://twitter.com/madmarketer",
      "https://linkedin.com/company/madmarketer"
    ]
  }, null, 2)
};

async function updateSEO() {
  console.log('Starting SEO Content Enrichment...');

  // 1. Update Home Page
  const home = await prisma.page.findUnique({ where: { slug: '' } });
  if (home) {
    await prisma.page.update({
      where: { id: home.id },
      data: {
        metaTitle: homeSEO.metaTitle,
        metaDescription: homeSEO.metaDescription,
        keywords: homeSEO.keywords,
        schemaMarkup: homeSEO.schemaMarkup
      }
    });
    console.log('✅ Updated Home Page SEO');
  }

  // 2. Update Services (except Tools)
  const services = await prisma.service.findMany();
  let updatedCount = 0;

  for (const service of services) {
    const cat = service.category.toLowerCase();
    
    // Skip tools pages as requested
    if (cat === 'tools' || service.slug.includes('doconnect') || service.slug.includes('madrcs')) {
      console.log(`⏭️  Skipping Tool Service: ${service.title}`);
      continue;
    }

    const enhancedKeywords = `${service.title.toLowerCase()}, ${service.category.toLowerCase()} services, madmarketer ${service.category.toLowerCase()}, enterprise ${service.title.toLowerCase()}, automated ${service.title.toLowerCase()}, professional ${service.title.toLowerCase()}`;
    const enhancedDescription = `Discover our premium ${service.title} services. At Madmarketer, we leverage advanced technologies and industry best practices to deliver scalable, intelligent ${service.title} solutions for your enterprise.`;
    
    const serviceSchema = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": service.title,
      "provider": {
        "@type": "Organization",
        "name": "Madmarketer"
      },
      "description": enhancedDescription,
      "category": service.category
    }, null, 2);

    await prisma.service.update({
      where: { id: service.id },
      data: {
        metaTitle: `${service.title} Services | Madmarketer`,
        metaDescription: enhancedDescription,
        keywords: enhancedKeywords,
        schemaMarkup: serviceSchema
      }
    });
    console.log(`✅ Updated Service: ${service.title}`);
    updatedCount++;
  }

  console.log(`\n🎉 SEO Enrichment Complete! Updated 1 Home page and ${updatedCount} Services.`);
}

updateSEO()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
