import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Home Page Sections...');
  
  const homePage = await prisma.page.findUnique({ where: { slug: '' } });
  if (!homePage) {
    console.error('Home page not found!');
    return;
  }

  // Delete existing to avoid duplicates
  await prisma.pageSection.deleteMany({ where: { pageId: homePage.id } });

  const sections = [
    {
      type: 'home_hero',
      content: JSON.stringify({ heading: 'Mad Marketer', subheading: 'Create intelligent growth infrastructure for your business.', ctaText: 'Build Your System', ctaLink: '/contact' }),
      orderIndex: 0
    },
    {
      type: 'home_services',
      content: JSON.stringify({ limit: '6' }),
      orderIndex: 1
    },
    {
      type: 'home_about',
      content: JSON.stringify({ label: 'ABOUT MAD MARKETER', mainHeading: 'Discover our intelligent systems...', subHeading: 'Life beyond the Agency', paragraph: 'At Mad Marketer, every system begins with strategy and ends with scale. We do not just run ads or write code; we build customized infrastructure that integrates your marketing, sales, and operations into one cohesive machine.' }),
      orderIndex: 2
    },
    {
      type: 'home_products',
      content: JSON.stringify({ limit: '2' }),
      orderIndex: 3
    },
    {
      type: 'home_marquee',
      content: JSON.stringify({ label: 'CONNECTED WITH MODERN BUSINESS INFRASTRUCTURE', items: 'WooCommerce, WhatsApp, Google Ads, Stripe, HubSpot, Zapier, Meta, TikTok, Shopify, OpenAI' }),
      orderIndex: 4
    },
    {
      type: 'home_portfolio',
      content: JSON.stringify({ limit: '3' }),
      orderIndex: 5
    },
    {
      type: 'home_process',
      content: JSON.stringify({ heading: 'Our Streamlined Development Process', description: 'At Mad Marketer, we adopt a structured approach to ensure every project is delivered on time, within budget, and above expectations.', s1Title: 'Discovery & Strategy', s1Desc: 'We analyze your needs and outline the technical blueprint.', s2Title: 'Design & Prototyping', s2Desc: 'We create high-fidelity UI/UX wireframes.', s3Title: 'App Development', s3Desc: 'We write clean, scalable code.', s4Title: 'Testing & QA', s4Desc: 'We ensure 99.9% uptime and bug-free performance.', s5Title: 'Deployment & Launch', s5Desc: 'We seamlessly push to production servers.', s6Title: 'Post-Launch Support', s6Desc: 'We maintain and scale your systems over time.' }),
      orderIndex: 6
    },
    {
      type: 'home_why_choose_us',
      content: JSON.stringify({ heading: 'Why Choose Mad Marketer?', description: 'Here is why businesses choose us as their dedicated growth partners.', r1Title: 'Expertise', r1Desc: 'We leverage over 15 years of industry experience to deliver top-tier solutions.', r2Title: 'Custom Solutions', r2Desc: 'Each system is personalized to fit your unique operational workflows.', r3Title: 'Customer-Focused', r3Desc: 'We prioritize your satisfaction and maintain open communication.', r4Title: 'Innovation', r4Desc: 'We stay ahead of the curve, utilizing the latest AI and web technologies.', r5Title: 'Flexibility', r5Desc: 'We adapt rapidly as your business model evolves.', r6Title: 'Quality Commitment', r6Desc: 'We are fiercely committed to uncompromising code and design quality.' }),
      orderIndex: 7
    },
    {
      type: 'home_reviews',
      content: JSON.stringify({ limit: '3' }),
      orderIndex: 8
    },
    {
      type: 'home_blog',
      content: JSON.stringify({ limit: '3' }),
      orderIndex: 9
    },
    {
      type: 'global_final_cta',
      content: JSON.stringify({ heading: 'Ready to Scale?', subheading: 'Let\'s build your growth infrastructure today.', ctaText: 'Contact Us', ctaLink: '/contact' }),
      orderIndex: 10
    }
  ];

  await prisma.pageSection.createMany({
    data: sections.map(s => ({
      pageId: homePage.id,
      type: s.type,
      content: s.content,
      orderIndex: s.orderIndex
    }))
  });

  console.log('✅ Home Page Sections successfully seeded!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
