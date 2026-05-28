import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding MadRCS page...');

  // Upsert the page
  const page = await prisma.page.upsert({
    where: { slug: 'services/tools/madrcs' },
    update: {},
    create: {
      slug: 'services/tools/madrcs',
      title: 'MadRCS - Next-Gen Product Platform',
      metaTitle: 'MadRCS | Smarter Financial Tools',
      metaDescription: 'Empower your business with smarter financial tools. Connect what you already use with MadRCS.',
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
        pillText: '99%+ Delivery Success Rate',
        headline: 'The Next Evolution of Business Messaging',
        primaryCtaText: 'Schedule Demo',
        primaryCtaLink: '/demo',
        secondaryCtaText: 'Watch Demo',
        secondaryCtaLink: '#demo',
        heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop', // Provide an initial placeholder, user will upload real hero image
        bgGradient: 'linear-gradient(180deg, rgba(237,28,36,0.1) 0%, var(--dark-bg) 100%)',
      }),
    },
    {
      type: 'product_split_features',
      orderIndex: 1,
      content: JSON.stringify({
        pillText: 'MESSAGE FORMATS',
        heading: '4 Types of Interactive Messages',
        image: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=1000&q=80',
        features: JSON.stringify([
          { title: 'Plain Text', desc: 'Simple, reliable delivery for critical alerts and notifications.', icon: 'MessageSquare', image: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&w=1000&q=80' },
          { title: 'Carousel Cards', desc: 'Showcase multiple products or offers in a swipeable gallery.', icon: 'Images', image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1000&q=80' },
          { title: 'Action Buttons', desc: 'Drive conversions with clickable call-to-action buttons.', icon: 'MousePointerClick', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=80' },
          { title: 'Rich Image Cards', desc: 'Deliver visually stunning messages with high-res images & branding.', icon: 'Image', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1000&q=80' }
        ]),
      }),
    },
    {
      type: 'product_bento_grid',
      orderIndex: 2,
      content: JSON.stringify({
        pillText: 'ENTERPRISE PLATFORM',
        heading: 'Engineered for Scale',
        cards: JSON.stringify([
          { title: 'High-Throughput Engine', desc: 'Kafka-based architecture delivering millions of messages per hour with a 99.9% uptime guarantee. Built to handle your largest campaigns effortlessly.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', icon: 'Server', colSpan: 8 },
          { title: 'Verified Blue Tick', desc: 'Official verification badge that builds instant trust and credibility with customers, protecting your brand from spoofing.', image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&w=800&q=80', icon: 'BadgeCheck', colSpan: 4 },
          { title: 'Smart Rate Control', desc: 'Dynamic TPS adjustment with automatic retry queues ensuring message delivery success across all carrier networks.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', icon: 'Activity', colSpan: 4 },
          { title: 'Enterprise-Grade Security', desc: 'End-to-end encryption, authenticated APIs, GDPR compliance, and SOC2 certified infrastructure. Your data and your customers\' privacy are protected at every layer.', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80', icon: 'ShieldCheck', colSpan: 8 }
        ]),
      }),
    },
    {
      type: 'product_bento_grid',
      orderIndex: 3,
      content: JSON.stringify({
        pillText: 'ANALYTICS',
        heading: 'Real-Time Analytics Dashboard',
        cards: JSON.stringify([
          { title: '1,000,000+', desc: 'Messages Analyzed Daily', image: '', icon: 'BarChart3', colSpan: 3 },
          { title: '99.9%', desc: 'Data Accuracy', image: '', icon: 'CheckCircle2', colSpan: 3 },
          { title: '<100ms', desc: 'Real-time Updates', image: '', icon: 'Zap', colSpan: 3 },
          { title: '24/7', desc: 'Active Monitoring', image: '', icon: 'Activity', colSpan: 3 }
        ]),
      }),
    },
    {
      type: 'product_pricing',
      orderIndex: 4,
      content: JSON.stringify({
        pillText: 'PRICING',
        heading: 'Simple, Transparent Pricing',
        pricingSource: 'api',
        pricingApiEndpoint: 'https://api-rcs.madmarketer.net/api/public/plans',
        pricingApiDataPath: 'plans',
        pricingApiNameKey: 'name',
        pricingApiPriceKey: 'rate_per_message',
        pricingApiFeaturesKey: '',
        pricing: '[]',
      }),
    },
    {
      type: 'product_process',
      orderIndex: 5,
      content: JSON.stringify({
        pillText: 'HOW IT WORKS',
        heading: 'Setup in 3 Simple Steps',
        steps: JSON.stringify([
          { title: 'Connect Your API', desc: 'Plug our verified sender API into your existing CRM or notification service in under 5 minutes.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80' },
          { title: 'Verify Your Brand', desc: 'Get your official Blue Tick badge directly from Google and carrier networks to ensure maximum trust.', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80' },
          { title: 'Send & Track', desc: 'Start sending rich carousels and tracking conversions in real-time on your dashboard.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80' }
        ]),
      }),
    },
    {
      type: 'product_reviews',
      orderIndex: 6,
      content: JSON.stringify({
        pillText: 'TESTIMONIALS',
        heading: 'Trusted by Global Brands',
        reviews: JSON.stringify([
          { name: 'Sarah Chen', role: 'VP of Marketing', text: 'Our open rates jumped from 15% on SMS to over 60% with MadRCS. The rich carousels literally changed our conversion funnel.', stars: 5 },
          { name: 'Michael Rodriguez', role: 'Head of Product', text: 'The easiest API integration we have ever done. The throughput is incredible and the blue tick builds instant trust.', stars: 5 },
          { name: 'Elena Rostova', role: 'E-commerce Director', text: 'Being able to put clickable checkout buttons directly into the messaging app has skyrocketed our ROI.', stars: 5 }
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
          { q: 'What is RCS?', a: 'Rich Communication Services (RCS) is the modern upgrade to SMS, allowing for high-res images, read receipts, typing indicators, and verified sender profiles.' },
          { q: 'How long does brand verification take?', a: 'Usually between 24-48 hours depending on the carrier network approval process.' },
          { q: 'Is it globally available?', a: 'RCS is supported by most major carriers globally on Android devices. Fallback to standard SMS is automatically handled for iOS users (until iOS fully rolls out RCS support).' }
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

  console.log('✅ MadRCS page seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
