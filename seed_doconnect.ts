import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding DoConnect OS page...');

  // Upsert the page
  const page = await prisma.page.upsert({
    where: { slug: 'services/tools/doconnect' },
    update: {},
    create: {
      slug: 'services/tools/doconnect',
      title: 'DoConnect OS',
      metaTitle: 'DoConnect OS | The Ultimate Business Command Center',
      metaDescription: 'Unify your CRM, Live Chat, WhatsApp API, RCS Campaigns, and Automations in one powerful workspace.',
    },
  });

  // Clear existing sections for this page to start fresh
  await prisma.pageSection.deleteMany({
    where: { pageId: page.id },
  });

  console.log(`Creating Product sections for page ${page.id}...`);

  const sections = [
    {
      type: 'product_hero',
      orderIndex: 0,
      content: JSON.stringify({
        pillText: 'DoConnect OS 2.0',
        headline: 'Your Business,\\nUnified in One Place.',
        primaryCtaText: 'Upgrade to Pro',
        primaryCtaLink: '/contact',
        secondaryCtaText: 'View Documentation',
        secondaryCtaLink: '#features',
        heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000',
        bgGradient: 'linear-gradient(180deg, rgba(99, 102, 241, 0.1) 0%, var(--dark-bg) 100%)',
      }),
    },
    {
      type: 'product_split_features',
      orderIndex: 1,
      content: JSON.stringify({
        pillText: 'OMNICHANNEL ENGAGEMENT',
        heading: 'Connect with customers where they are.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000',
        features: JSON.stringify([
          { title: 'Unified Inbox', desc: 'Manage Live Chat, WhatsApp, RCS, and Email from a single interface.', icon: 'MessageSquare', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1000&q=80' },
          { title: 'Visual Automations', desc: 'Build smart automations that trigger instantly based on user behavior.', icon: 'Workflow', image: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&w=1000&q=80' },
          { title: 'Dynamic Forms', desc: 'Create custom forms to collect data and feed it directly into your CRM.', icon: 'Layout', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80' },
          { title: 'Integrated CRM', desc: 'Never lose track of a lead with Deal Pipeline Stages and Ticketing.', icon: 'Users', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=80' }
        ]),
      }),
    },
    {
      type: 'product_bento_grid',
      orderIndex: 2,
      content: JSON.stringify({
        pillText: 'COMMAND CENTER',
        heading: 'Everything you need to scale.',
        cards: JSON.stringify([
          { title: 'Omnichannel Inbox', desc: 'Respond to WhatsApp, Web Chat, and SMS leads instantly from one dashboard.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', icon: 'MessageSquare', colSpan: 8 },
          { title: 'Automated Routing', desc: 'Assign chats to the right agents automatically.', image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&w=800&q=80', icon: 'GitMerge', colSpan: 4 },
          { title: 'Deal Pipelines', desc: 'Drag and drop CRM pipelines to visualize your revenue.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', icon: 'KanbanSquare', colSpan: 4 },
          { title: 'Custom Analytics', desc: 'Track response times, agent performance, and conversion metrics in real-time.', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80', icon: 'BarChart3', colSpan: 8 }
        ]),
      }),
    },
    {
      type: 'product_bento_grid',
      orderIndex: 3,
      content: JSON.stringify({
        pillText: 'BUSINESS METRICS',
        heading: 'Real-Time Insights at a Glance',
        cards: JSON.stringify([
          { title: '$182.4k', desc: 'Estimated Revenue (+24%)', image: '', icon: 'DollarSign', colSpan: 3 },
          { title: '1,240', desc: 'Captured Leads', image: '', icon: 'Users', colSpan: 3 },
          { title: '3,420', desc: 'Automations Triggered', image: '', icon: 'Zap', colSpan: 3 },
          { title: '84', desc: 'Appointments Won', image: '', icon: 'CalendarCheck', colSpan: 3 }
        ]),
      }),
    },
    {
      type: 'product_pricing',
      orderIndex: 4,
      content: JSON.stringify({
        pillText: 'PRICING',
        heading: 'Simple, Transparent Pricing',
        pricing: JSON.stringify([
          { name: "Starter", price: "$0", desc: "Perfect for small teams", features: ["1,000 Contacts", "Live Chat", "Basic CRM"], isPopular: false, buttonText: "Get Started", buttonLink: "/contact" },
          { name: "Pro", price: "$49", desc: "For growing businesses", features: ["10,000 Contacts", "WhatsApp API", "Visual Automations"], isPopular: true, buttonText: "Upgrade to Pro", buttonLink: "/contact" }
        ])
      }),
    },
    {
      type: 'product_process',
      orderIndex: 5,
      content: JSON.stringify({
        pillText: 'HOW IT WORKS',
        heading: 'Deploy DoConnect in Minutes',
        steps: JSON.stringify([
          { title: 'Import Contacts', desc: 'Sync your existing leads via CSV or our open APIs seamlessly.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80' },
          { title: 'Build Pipelines', desc: 'Customize your deal stages and ticketing queues to match your sales process.', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80' },
          { title: 'Automate & Scale', desc: 'Set up visual triggers to auto-respond, assign leads, and close deals faster.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80' }
        ]),
      }),
    },
    {
      type: 'product_reviews',
      orderIndex: 6,
      content: JSON.stringify({
        pillText: 'TESTIMONIALS',
        heading: 'Trusted by High-Growth Teams',
        reviews: JSON.stringify([
          { name: 'David Smith', role: 'Sales Director', text: 'Having our WhatsApp conversations and Deal Pipelines in the exact same window has cut our response time by 80%.', stars: 5 },
          { name: 'Jessica Taylor', role: 'Operations Manager', text: 'The visual automations are incredibly powerful. We automated our entire lead qualification process in an afternoon.', stars: 5 }
        ]),
      }),
    },
    {
      type: 'product_faqs',
      orderIndex: 7,
      content: JSON.stringify({
        pillText: 'SUPPORT',
        heading: 'Frequently Asked Questions',
        faqs: JSON.stringify([
          { q: 'Can I integrate with my existing tools?', a: 'Yes! DoConnect OS offers robust APIs and native integrations with Zapier, Google Workspace, and major payment gateways.' },
          { q: 'Is there a limit on team members?', a: 'The Pro plan includes up to 5 team members, with the option to add more at a per-seat cost.' }
        ]),
      }),
    }
  ];

  for (const s of sections) {
    await prisma.pageSection.create({
      data: {
        pageId: page.id,
        type: s.type,
        orderIndex: s.orderIndex,
        content: s.content,
      },
    });
  }

  console.log('✅ DoConnect OS page seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
