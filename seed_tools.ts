import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // DoConnect OS
  const doconnect = await prisma.page.upsert({
    where: { slug: 'services/tools/doconnect' },
    update: { title: 'DoConnect OS', metaTitle: 'DoConnect OS | The Ultimate Business Command Center' },
    create: {
      slug: 'services/tools/doconnect',
      title: 'DoConnect OS',
      metaTitle: 'DoConnect OS | The Ultimate Business Command Center',
      metaDescription: 'Unify your CRM, Live Chat, WhatsApp API, RCS Campaigns, and Automations in one powerful workspace.',
      content: 'DoConnect OS Dynamic Page',
    }
  });

  await prisma.pageSection.deleteMany({ where: { pageId: doconnect.id } });

  await prisma.pageSection.create({
    data: {
      pageId: doconnect.id, type: 'product_hero', orderIndex: 0,
      content: JSON.stringify({
        pillText: "DoConnect OS 2.0",
        headline: "Your Business,\\nUnified in One Place.",
        subheadline: "The ultimate Business Command Center. Manage omnichannel engagement, robust CRM pipelines, dynamic forms, and powerful automations from a single, intuitive workspace.",
        primaryCtaText: "Upgrade to Pro",
        primaryCtaLink: "/contact",
        secondaryCtaText: "View Documentation",
        secondaryCtaLink: "/docs",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
        glowColor: "rgba(99, 102, 241, 0.4)"
      })
    }
  });

  await prisma.pageSection.create({
    data: {
      pageId: doconnect.id, type: 'product_bento_grid', orderIndex: 1,
      content: JSON.stringify({
        heading: "Everything you need to scale.",
        subheading: "From first chat to closed deal, DoConnect handles every step of your customer journey.",
        features: JSON.stringify([
          { title: "Omnichannel Engagement", desc: "Manage Live Chat, WhatsApp API, RCS Campaigns, and Email Marketing from a unified inbox.", size: "large", icon: "message-square" },
          { title: "Visual Automations", desc: "Build smart automations that trigger instantly based on user behavior.", size: "small", icon: "zap" },
          { title: "Dynamic Forms", desc: "Create custom forms or use industry-specific templates to collect data.", size: "small", icon: "layout" },
          { title: "Integrated CRM", desc: "Never lose track of a lead with Deal Pipeline Stages and Support Ticketing.", size: "large", icon: "users" }
        ])
      })
    }
  });

  await prisma.pageSection.create({
    data: {
      pageId: doconnect.id, type: 'product_pricing', orderIndex: 2,
      content: JSON.stringify({
        heading: "Simple, transparent pricing.",
        subheading: "Start for free, upgrade when you need more power.",
        plans: JSON.stringify([
          { name: "Starter", price: "$0", desc: "Perfect for small teams", features: ["1,000 Contacts", "Live Chat", "Basic CRM"], isPopular: false, buttonText: "Get Started", buttonLink: "/contact" },
          { name: "Pro", price: "$49", desc: "For growing businesses", features: ["10,000 Contacts", "WhatsApp API", "Visual Automations"], isPopular: true, buttonText: "Upgrade to Pro", buttonLink: "/contact" }
        ])
      })
    }
  });

  // MadRCS
  const madrcs = await prisma.page.upsert({
    where: { slug: 'services/tools/madrcs' },
    update: { title: 'MadRCS', metaTitle: 'MadRCS | Next-Gen RCS Messaging' },
    create: {
      slug: 'services/tools/madrcs',
      title: 'MadRCS',
      metaTitle: 'MadRCS | Next-Gen RCS Messaging',
      metaDescription: 'Engage your customers with highly interactive Rich Communication Services (RCS) campaigns.',
      content: 'MadRCS Dynamic Page',
    }
  });

  await prisma.pageSection.deleteMany({ where: { pageId: madrcs.id } });

  await prisma.pageSection.create({
    data: {
      pageId: madrcs.id, type: 'product_hero', orderIndex: 0,
      content: JSON.stringify({
        pillText: "MadRCS 1.0",
        headline: "The Future of\\nMobile Engagement.",
        subheadline: "Upgrade from standard SMS to highly interactive Rich Communication Services. Send carousels, action buttons, and rich media directly to your customers' native messaging apps.",
        primaryCtaText: "Start Campaign",
        primaryCtaLink: "/contact",
        secondaryCtaText: "See Examples",
        secondaryCtaLink: "#features",
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200",
        glowColor: "rgba(237, 28, 36, 0.4)"
      })
    }
  });

  await prisma.pageSection.create({
    data: {
      pageId: madrcs.id, type: 'product_split_features', orderIndex: 1,
      content: JSON.stringify({
        features: JSON.stringify([
          { title: "Verified Sender IDs", desc: "Build trust with your audience. Your brand name and logo appear right in the native inbox, instantly establishing authenticity and significantly boosting open rates.", imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800", imagePosition: "right" },
          { title: "Rich Media Carousels", desc: "Showcase up to 10 products or offers in a single message. Users can swipe through high-resolution images, read descriptions, and click action buttons without ever leaving their messaging app.", imageUrl: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&q=80&w=800", imagePosition: "left" }
        ])
      })
    }
  });

  console.log("DoConnect and MadRCS tools successfully seeded with Product Templates at correct URLs!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
