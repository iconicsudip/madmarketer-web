import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const homeSections = [
  { id: 'hero', data: JSON.stringify({ heading: 'Mad Marketer', subheading: 'Create intelligent growth infrastructure for your business.', ctaText: 'Build Your System', ctaLink: '/contact' }) },
  { id: 'about', data: JSON.stringify({ label: 'ABOUT MAD MARKETER', mainHeading: 'Discover our intelligent systems...', subHeading: 'Life beyond the Agency', paragraph: 'At Mad Marketer, every system begins with strategy and ends with scale. We do not just run ads or write code; we build customized infrastructure that integrates your marketing, sales, and operations into one cohesive machine.' }) },
  { id: 'marquee', data: JSON.stringify({ label: 'CONNECTED WITH MODERN BUSINESS INFRASTRUCTURE', items: 'WooCommerce, WhatsApp, Google Ads, Stripe, HubSpot, Zapier, Meta, TikTok, Shopify, OpenAI' }) },
  { id: 'process', data: JSON.stringify({ heading: 'Our Streamlined Development Process', description: 'At Mad Marketer, we adopt a structured approach to ensure every project is delivered on time, within budget, and above expectations.', s1Title: 'Discovery & Strategy', s1Desc: 'We analyze your needs and outline the technical blueprint.', s2Title: 'Design & Prototyping', s2Desc: 'We create high-fidelity UI/UX wireframes.', s3Title: 'App Development', s3Desc: 'We write clean, scalable code.', s4Title: 'Testing & QA', s4Desc: 'We ensure 99.9% uptime and bug-free performance.', s5Title: 'Deployment & Launch', s5Desc: 'We seamlessly push to production servers.', s6Title: 'Post-Launch Support', s6Desc: 'We maintain and scale your systems over time.' }) },
  { id: 'whychooseus', data: JSON.stringify({ heading: 'Why Choose Mad Marketer?', description: 'Here is why businesses choose us as their dedicated growth partners.', r1Title: 'Expertise', r1Desc: 'We leverage over 15 years of industry experience to deliver top-tier solutions.', r2Title: 'Custom Solutions', r2Desc: 'Each system is personalized to fit your unique operational workflows.', r3Title: 'Customer-Focused', r3Desc: 'We prioritize your satisfaction and maintain open communication.', r4Title: 'Innovation', r4Desc: 'We stay ahead of the curve, utilizing the latest AI and web technologies.', r5Title: 'Flexibility', r5Desc: 'We adapt rapidly as your business model evolves.', r6Title: 'Quality Commitment', r6Desc: 'We are fiercely committed to uncompromising code and design quality.' }) },
  { id: 'faq', data: JSON.stringify({ heading: 'Questions You Might Have In Mind', faqs: JSON.stringify([ { q: 'How long does a typical build take?', a: 'Depending on the complexity, most of our custom infrastructure projects are deployed within 4 to 8 weeks.' }, { q: 'Do you offer post-launch support?', a: 'Yes! We provide ongoing maintenance and strategic support to ensure your systems scale smoothly as your business grows.' }, { q: 'Can you integrate with my existing tools?', a: 'Absolutely. We specialize in API integrations and can connect your new platform with Stripe, CRM systems, and other third-party tools.' }, { q: 'What technologies do you use?', a: 'We build primarily with Next.js, React, Node.js, and Prisma, leveraging modern cloud infrastructure for maximum performance.' } ]) }) }
];

const fallbackServices = [
  { title: "Website Development", category: "Development", slug: "/services/development/website-development", desc: "Custom-coded, high-performance websites built to maximize conversion and speed.", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop" },
  { title: "App Development", category: "Development", slug: "/services/development/app-development", desc: "End-to-end mobile application engineering for modern, scalable businesses.", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop" },
  { title: "Android App Development", category: "Development", slug: "/services/development/android-app-development", desc: "Native Android applications optimized for the massive Google Play ecosystem.", image: "https://images.unsplash.com/photo-1607252656733-fd7458bc97dc?q=80&w=600&auto=format&fit=crop" },
  { title: "iOS App Development", category: "Development", slug: "/services/development/ios-app-development", desc: "Premium iOS applications engineered with flawless Apple ecosystem integration.", image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=600&auto=format&fit=crop" },
  { title: "Custom Tools Development", category: "Development", slug: "/services/development/custom-tools-development", desc: "Bespoke internal software designed to automate your specific operational workflows.", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop" },
  { title: "E-commerce Development", category: "Development", slug: "/services/development/ecommerce-development", desc: "Scalable online stores engineered with advanced conversion rate optimization.", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop" },
  { title: "Shopify Development", category: "Development", slug: "/services/development/shopify-development", desc: "Custom Shopify themes, apps, and headless commerce architectures.", image: "https://images.unsplash.com/photo-1664261439535-f09bce0ca613?q=80&w=600&auto=format&fit=crop" },
  { title: "WordPress / WooCommerce", category: "Development", slug: "/services/development/wordpress-woocommerce-development", desc: "Flexible, SEO-optimized WordPress setups with powerful WooCommerce backends.", image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=600&auto=format&fit=crop" },
  { title: "Digital Marketing", category: "Marketing", slug: "/services/marketing/digital-marketing", desc: "Data-driven, omnichannel marketing strategies to aggressively scale acquisition.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop" },
  { title: "SEO", category: "Marketing", slug: "/services/marketing/seo", desc: "Deep technical and content SEO to dominate your industry's search rankings.", image: "https://images.unsplash.com/photo-1572177812156-58036aae439c?q=80&w=600&auto=format&fit=crop" },
  { title: "Social Media", category: "Marketing", slug: "/services/marketing/social-media-marketing", desc: "Engaging organic and paid social campaigns that build cult-like brand loyalty.", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop" },
  { title: "Google Ads", category: "Marketing", slug: "/services/marketing/google-ads", desc: "High-ROI paid search and display campaigns optimized relentlessly by AI algorithms.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop" },
  { title: "WhatsApp Marketing", category: "Tools", slug: "/services/tools/whatsapp-multi-number", desc: "Direct-to-consumer conversational marketing pipelines via the official WhatsApp API.", image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=600&auto=format&fit=crop" },
  { title: "Chatbot Development", category: "Tools", slug: "/services/tools/doconnect", desc: "Intelligent AI chatbots trained on your data to automate customer support 24/7.", image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=600&auto=format&fit=crop" },
];

const fallbackProducts = [
  { title: 'MADRCS', description: 'Next-generation rich communication services. Engage your customers with interactive, app-like experiences directly in their native messaging app.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop', pill: 'Business Portal', link: '/products/madrcs', glowColor: 'rgba(237, 28, 36, 0.4)' },
  { title: 'DOCONNECT', description: 'Unified AI Business Command Center. Centralize your CRM, WhatsApp API, chatbots, and automation pipelines in one powerful OS.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop', pill: 'Operating System', link: '/products/doconnect', glowColor: 'rgba(255, 255, 255, 0.15)' }
];

const blogPosts = [
  { title: 'The Future of AI in Enterprise Automation', slug: 'the-future-of-ai-in-enterprise-automation', category: 'Technology', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80', date: 'Oct 12, 2026', excerpt: 'Discover how AI is revolutionizing the way large enterprises manage their workflows.', content: '# The Future of AI\n\nArtificial intelligence is changing the world. It provides automation at a scale previously thought impossible.' },
  { title: 'Why WhatsApp is the New Storefront', slug: 'why-whatsapp-is-the-new-storefront', category: 'Marketing', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80', date: 'Oct 08, 2026', excerpt: 'Learn why conversational commerce is the highest converting channel of 2026.', content: '# Conversational Commerce\n\nWhatsApp boasts over 2 billion users. Your storefront should be where your customers are.' },
  { title: 'Architecting Scalable CMS Systems', slug: 'architecting-scalable-cms-systems', category: 'Engineering', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', date: 'Sep 29, 2026', excerpt: 'Deep dive into how we built the new Next.js 16 dynamic CMS.', content: '# Headless Architecture\n\nUsing Next.js App Router and Prisma gives unparalleled flexibility for managing massive content ecosystems.' }
];

const reviews = [
  { company: 'Wager', logoName: 'Hexagon', name: 'Emma Johnson', role: 'Senior Wealth Manager', content: "Mad Marketer has completely transformed how we manage our operations. The automation features saved us countless hours, allowing our team to focus on what truly matters.", rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
  { company: 'Unicoin', logoName: 'CircleDashed', name: 'Kane Willamson', role: 'Senior Wealth Manager', content: "Mad Marketer has revolutionized our operations management. The automation features have saved us countless hours, allowing our team to concentrate on what truly matters.", rating: 5, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
  { company: 'BookStore', logoName: 'BookOpen', name: 'Taylor Swift', role: 'Senior Wealth Manager', content: "Mad Marketer has completely revolutionized our operations management. The automation features have saved us countless hours, enabling our team to focus on what truly matters.", rating: 5, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' }
];

const portfolioItems = [
  { slug: 'leva-healthcare', client: 'Leva Healthcare', title: 'Healthcare platform connecting patients, clinics, and pharmacies with AI automation tools.', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', stats: JSON.stringify([{ value: '44%', label: 'Faster Reporting' }, { value: '31%', label: 'Lower Overhead' }]), content: '# Transforming Healthcare\n\nWe built a centralized platform for Leva.' },
  { slug: 'nexus-trading', client: 'Nexus Trading', title: 'AI-driven trading app with real-time insights and institutional-grade market analysis.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop', stats: JSON.stringify([{ value: '2.5x', label: 'Trade Volume' }, { value: '99.9%', label: 'Uptime' }]), content: '# Market Domination\n\nNexus needed an app that would never go down during massive volatility.' },
  { slug: 'ecostore-global', client: 'EcoStore Global', title: 'Scalable e-commerce infrastructure with dynamic pricing and custom CRM integration.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop', stats: JSON.stringify([{ value: '180%', label: 'Sales Growth' }, { value: '40%', label: 'Cart Retention' }]), content: '# E-commerce at Scale\n\nScaling an international storefront requires robust headless commerce architecture.' }
];

async function main() {
  console.log('Seeding Comprehensive Data...');
  
  await prisma.homepageContent.deleteMany();
  await prisma.service.deleteMany();
  await prisma.product.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.portfolioProject.deleteMany();

  for (const s of homeSections) await prisma.homepageContent.create({ data: s });
  for (const s of fallbackServices) await prisma.service.create({ data: s });
  for (const p of fallbackProducts) await prisma.product.create({ data: p });
  for (const b of blogPosts) await prisma.blogPost.create({ data: b });
  for (const r of reviews) await prisma.testimonial.create({ data: r });
  for (const p of portfolioItems) await prisma.portfolioProject.create({ data: p });

  console.log('Successfully prepopulated all data into the database!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
