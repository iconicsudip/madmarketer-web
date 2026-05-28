import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Starting Page Content Seeding...');
  const pages = await prisma.page.findMany({ include: { sections: true } });
  
  let updated = 0;

  for (const page of pages) {
    if (page.slug === '' || page.slug.startsWith('services/tools/')) continue; // Skip home and tools

    // Delete existing sections to avoid duplicates
    if (page.sections.length > 0) {
      await prisma.pageSection.deleteMany({ where: { pageId: page.id } });
    }

    const name = page.title;
    
    // Default sections for service pages
    let sections = [
      {
        type: 'service_hero',
        content: JSON.stringify({
          pillText: `${name} Services`,
          headline: `${name}`,
          subtext: `Expert ${name.toLowerCase()} solutions tailored to accelerate your business growth and streamline operations.`,
          buttonText: 'Get Started',
          orbitIcons: JSON.stringify(['Code', 'Cpu', 'Globe', 'Layers', 'Zap'])
        }),
        orderIndex: 0
      },
      {
        type: 'service_grid',
        content: JSON.stringify({
          pillText: 'Features',
          heading: `Comprehensive ${name} Capabilities`,
          services: JSON.stringify([
            { title: 'Custom Solutions', desc: `Bespoke ${name.toLowerCase()} tailored exactly to your requirements.`, icon: 'Settings' },
            { title: 'Scalable Architecture', desc: 'Built to grow seamlessly alongside your expanding business.', icon: 'TrendingUp' },
            { title: 'Dedicated Support', desc: 'Round-the-clock maintenance and expert technical assistance.', icon: 'Shield' }
          ])
        }),
        orderIndex: 1
      },
      {
        type: 'service_testimonials',
        content: JSON.stringify({
          pillText: 'Success Stories',
          heading: 'Trusted by Industry Leaders',
          testimonials: JSON.stringify([
            { name: 'Sarah Jenkins', role: 'CTO @ TechFlow', text: `Madmarketer completely transformed our approach to ${name.toLowerCase()}. The ROI has been incredible.`, avatar: '' },
            { name: 'Michael Chen', role: 'Director @ InnovateCo', text: `Their ${name.toLowerCase()} expertise saved us months of development time and significantly boosted our metrics.`, avatar: '' },
            { name: 'Elena Rodriguez', role: 'VP Operations @ ScaleUp', text: `The best ${name.toLowerCase()} partner we've ever worked with. Seamless integration and outstanding results.`, avatar: '' }
          ])
        }),
        orderIndex: 2
      },
      {
        type: 'faq',
        content: JSON.stringify({
          heading: `Frequently Asked Questions`,
          faqs: JSON.stringify([
            { q: `How long does a typical ${name} project take?`, a: 'Project timelines vary depending on scope, but our agile approach ensures rapid deployment, often delivering initial iterations within weeks.' },
            { q: `Do you provide ongoing support for ${name}?`, a: 'Absolutely. We offer comprehensive enterprise SLA packages that include 24/7 monitoring, maintenance, and continuous optimization.' },
            { q: `Can this integrate with our existing infrastructure?`, a: 'Yes! We specialize in complex API integrations and legacy system modernizations.' }
          ])
        }),
        orderIndex: 3
      },
      {
        type: 'service_team_contact',
        content: JSON.stringify({
          teamPill: 'Our Team',
          teamHeading: `Meet the experts behind our ${name} services.`,
          teamSubtext: `We are a dedicated team providing enterprise-grade ${name.toLowerCase()} infrastructure.`,
          stats: JSON.stringify([
            { number: '150+', label: 'Projects Delivered' },
            { number: '99%', label: 'Client Satisfaction' },
            { number: '24/7', label: 'Technical Support' }
          ]),
          ctaHeading: 'Ready to transform your business?',
          ctaSubtext: `Take the first step towards building your ultimate ${name.toLowerCase()} infrastructure today.`,
          ctaButtonText: 'Contact Our Experts',
          ctaLink: '/contact'
        }),
        orderIndex: 4
      }
    ];

    // Overrides for specific pages
    if (page.slug === 'about') {
      sections = [
        {
          type: 'hero',
          content: JSON.stringify({ headline: 'We are Madmarketer', subheadline: 'Empowering enterprises with intelligent automation and world-class digital infrastructure.', ctaText: 'Partner With Us', ctaLink: '/contact' }),
          orderIndex: 0
        },
        {
          type: 'image_text',
          content: JSON.stringify({
            heading: 'Our Mission',
            body: 'Madmarketer was founded on a simple principle: technology should accelerate human potential, not complicate it.\n\nWe build AI-integrated software and automated marketing systems that allow teams to focus on creativity and strategy while machines handle execution at scale.',
            imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200&h=800',
            imagePosition: 'left'
          }),
          orderIndex: 1
        },
        {
          type: 'features',
          content: JSON.stringify({
            heading: 'Core Values',
            feature1Title: 'Innovation',
            feature1Desc: 'We constantly push the boundaries of what is possible with AI.',
            feature2Title: 'Scalability',
            feature2Desc: 'We build systems designed for tomorrow\'s growth.',
            feature3Title: 'Results',
            feature3Desc: 'We measure our success entirely by the ROI we generate for our clients.'
          }),
          orderIndex: 2
        }
      ];
    } else if (page.slug === 'portfolio') {
      sections = [
        {
          type: 'hero',
          content: JSON.stringify({ headline: 'Our Proven Success', subheadline: 'See how we have helped Fortune 500s and ambitious startups scale their digital presence.' }),
          orderIndex: 0
        },
        {
          type: 'text',
          content: JSON.stringify({ heading: 'Industry-Leading Results', body: 'Below you will find a selection of our most impactful deployments. Each case study represents our commitment to robust engineering, AI integration, and measurable business growth.' }),
          orderIndex: 1
        }
      ];
    } else if (page.slug === 'contact') {
      sections = [
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
        }
      ];
    } else if (page.slug === 'blog') {
      sections = [
        {
          type: 'hero',
          content: JSON.stringify({ headline: 'Insights & Blog', subheadline: 'The latest thinking on AI, enterprise tech, and digital marketing strategies.' }),
          orderIndex: 0
        }
      ];
    }

    // Insert sections
    await prisma.pageSection.createMany({
      data: sections.map(s => ({
        pageId: page.id,
        type: s.type,
        content: s.content,
        orderIndex: s.orderIndex
      }))
    });

    console.log(`✅ Seeded content for page: ${page.slug || 'home'}`);
    updated++;
  }

  console.log(`\n🎉 Page Content Seeding Complete! Updated ${updated} pages.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
