import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching all pages...');
  const pages = await prisma.page.findMany({
    include: { sections: true }
  });

  console.log(`Found ${pages.length} total pages.`);

  let seededCount = 0;

  for (const page of pages) {
    // If the page already has sections, or is the homepage (slug is empty string or 'home' or '/'), skip it.
    // Wait, the homepage handles sections via HomepageContent, not PageSection. But let's skip it anyway.
    if (page.sections.length > 0 || page.slug === '' || page.slug === '/' || page.slug === 'home') {
      console.log(`Skipping /${page.slug} (already has sections or is home)`);
      continue;
    }

    console.log(`Seeding sections for /${page.slug} ...`);
    
    // 1. Hero Block
    await prisma.pageSection.create({
      data: {
        pageId: page.id,
        type: 'hero',
        orderIndex: 0,
        content: JSON.stringify({
          headline: page.title,
          subheadline: 'Enterprise-grade infrastructure built exactly for your business needs.',
        })
      }
    });

    // 2. Text / About Block
    await prisma.pageSection.create({
      data: {
        pageId: page.id,
        type: 'text',
        orderIndex: 1,
        content: JSON.stringify({
          heading: `About ${page.title}`,
          body: 'We provide specialized solutions tailored to ensure maximum growth and seamless scalability. Our infrastructure is designed to integrate effortlessly into your existing workflows, saving you time and money.'
        })
      }
    });

    // 3. FAQ Block (Dynamic Array format)
    await prisma.pageSection.create({
      data: {
        pageId: page.id,
        type: 'faq',
        orderIndex: 2,
        content: JSON.stringify({
          heading: 'Frequently Asked Questions',
          faqs: JSON.stringify([
            { q: 'Can you customize this service?', a: 'Absolutely, everything we build is tailored exactly to your operational requirements.' },
            { q: 'How do we get started?', a: `Book a free consultation and we'll map out a custom plan for your business.` }
          ])
        })
      }
    });

    // 4. CTA Block
    await prisma.pageSection.create({
      data: {
        pageId: page.id,
        type: 'cta',
        orderIndex: 3,
        content: JSON.stringify({
          heading: 'Ready to scale your business?',
          subtext: 'Join hundreds of businesses that trust our infrastructure.',
          primaryCtaText: 'Get a Free Quote',
          primaryCtaLink: '/contact'
        })
      }
    });

    seededCount++;
  }

  console.log(`Successfully seeded sections for ${seededCount} pages.`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
