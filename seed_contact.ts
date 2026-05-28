import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Starting Contact Page Seeding...');

  const page = await prisma.page.findUnique({
    where: { slug: 'contact' },
    include: { sections: true }
  });

  if (!page) {
    console.error('Contact page not found! Please make sure it exists.');
    return;
  }

  // Delete existing sections to avoid duplicates
  if (page.sections.length > 0) {
    await prisma.pageSection.deleteMany({ where: { pageId: page.id } });
  }

  const sections = [
    {
      type: 'hero',
      content: JSON.stringify({ headline: 'Let\'s Build Something Great', subheadline: 'Get in touch with our enterprise experts today.' }),
      orderIndex: 0
    },
    {
      type: 'image_text',
      content: JSON.stringify({
        heading: 'Global Reach, Personal Touch',
        body: 'Whether you need a complete digital transformation or specific AI tools to supercharge your current workflow, our team is ready to assist.\n\nEmail: hello@madmarketer.com\nPhone: 1-800-MAD-MARK',
        imageUrl: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&q=80&w=1200&h=800',
        imagePosition: 'right'
      }),
      orderIndex: 1
    },
    {
      type: 'iframe',
      content: JSON.stringify({ 
        heading: 'Send us a message',
        url: 'https://doconnect.madconx.app/f/cmppggp0y000fqeyfcnhttwh8', 
        height: '1024' 
      }),
      orderIndex: 2
    }
  ];

  // Insert sections
  await prisma.pageSection.createMany({
    data: sections.map(s => ({
      pageId: page.id,
      type: s.type,
      content: s.content,
      orderIndex: s.orderIndex
    }))
  });

  console.log(`✅ Seeded content for contact page`);
  console.log(`\n🎉 Contact Page Seeding Complete!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
