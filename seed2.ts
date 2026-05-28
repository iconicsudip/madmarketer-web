import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const blogPosts = [
  { title: 'The Future of AI in Enterprise Automation', slug: 'the-future-of-ai-in-enterprise-automation', category: 'Technology', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80', date: 'Oct 12, 2026', excerpt: '', content: '' },
  { title: 'Why WhatsApp is the New Storefront', slug: 'why-whatsapp-is-the-new-storefront', category: 'Marketing', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80', date: 'Oct 08, 2026', excerpt: '', content: '' },
  { title: 'Architecting Scalable CMS Systems', slug: 'architecting-scalable-cms-systems', category: 'Engineering', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', date: 'Sep 29, 2026', excerpt: '', content: '' }
];

const reviews = [
  { company: 'Wager', logoName: 'Hexagon', name: 'Emma Johnson', role: 'Senior Wealth Manager', content: "Mad Marketer has completely transformed how we manage our operations. The automation features saved us countless hours, allowing our team to focus on what truly matters.", rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
  { company: 'Unicoin', logoName: 'CircleDashed', name: 'Kane Willamson', role: 'Senior Wealth Manager', content: "Mad Marketer has revolutionized our operations management. The automation features have saved us countless hours, allowing our team to concentrate on what truly matters.", rating: 5, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
  { company: 'BookStore', logoName: 'BookOpen', name: 'Taylor Swift', role: 'Senior Wealth Manager', content: "Mad Marketer has completely revolutionized our operations management. The automation features have saved us countless hours, enabling our team to focus on what truly matters.", rating: 5, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' }
];

const portfolioItems = [
  { client: 'Leva Healthcare', title: 'Healthcare platform connecting patients, clinics, and pharmacies with AI automation tools.', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', stats: JSON.stringify([{ value: '44%', label: 'Faster Reporting' }, { value: '31%', label: 'Lower Overhead' }]) },
  { client: 'Nexus Trading', title: 'AI-driven trading app with real-time insights and institutional-grade market analysis.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop', stats: JSON.stringify([{ value: '2.5x', label: 'Trade Volume' }, { value: '99.9%', label: 'Uptime' }]) },
  { client: 'EcoStore Global', title: 'Scalable e-commerce infrastructure with dynamic pricing and custom CRM integration.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop', stats: JSON.stringify([{ value: '180%', label: 'Sales Growth' }, { value: '40%', label: 'Cart Retention' }]) }
];

async function main() {
  console.log('Seeding Phase 2 Data...');
  
  await prisma.blogPost.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.portfolioProject.deleteMany();

  for (const b of blogPosts) await prisma.blogPost.create({ data: b });
  console.log('Seeded blogs!');

  for (const r of reviews) await prisma.testimonial.create({ data: r });
  console.log('Seeded reviews!');

  for (const p of portfolioItems) await prisma.portfolioProject.create({ data: p });
  console.log('Seeded portfolios!');
  
  console.log('Done Phase 2!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
