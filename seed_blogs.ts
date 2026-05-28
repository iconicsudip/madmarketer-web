import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const additionalBlogs = [
  { 
    title: '5 Steps to Scale Outbound using AI', 
    slug: '5-steps-to-scale-outbound-using-ai', 
    category: 'Sales', 
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', 
    date: 'Nov 15, 2026', 
    excerpt: 'Learn the exact strategies used by top-tier agencies to automate lead generation and booking.', 
    content: '# Scaling Outbound\n\nSales is a numbers game. By using AI to automate your outreach, you can 10x your booking rate without increasing headcount. In this post, we explore 5 proven strategies...' 
  },
  { 
    title: 'The Shift to Headless Commerce in 2026', 
    slug: 'shift-to-headless-commerce-2026', 
    category: 'Technology', 
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', 
    date: 'Nov 22, 2026', 
    excerpt: 'Why monolithic platforms are dying and how headless architecture is saving e-commerce.', 
    content: '# Headless Commerce\n\nFlexibility is the name of the game. A headless CMS decoupled from your frontend gives your team the ultimate agility. E-commerce platforms that fail to adapt will be left behind.' 
  },
  { 
    title: 'Optimizing Next.js Turbopack Workflows', 
    slug: 'optimizing-nextjs-turbopack-workflows', 
    category: 'Engineering', 
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80', 
    date: 'Dec 01, 2026', 
    excerpt: 'A deep dive into accelerating your development environments using Turbopack.', 
    content: '# Turbopack Tips\n\nTurbopack is blazing fast, but only if you configure it correctly. Here are some of the best practices we use at Mad Marketer to keep our dev servers snappy.' 
  },
  { 
    title: 'Building High-Converting Landing Pages', 
    slug: 'building-high-converting-landing-pages', 
    category: 'Marketing', 
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', 
    date: 'Dec 10, 2026', 
    excerpt: 'Design psychology meets copywriting: how to create pages that convert browsers into buyers.', 
    content: '# Conversion Rate Optimization\n\nThe difference between a 1% and 3% conversion rate is millions in revenue for a scaled business. We discuss A/B testing, micro-interactions, and compelling CTAs.' 
  }
];

async function main() {
  console.log('Seeding additional dummy blogs...');
  
  for (const b of additionalBlogs) {
    // Upsert to avoid unique constraint errors if ran multiple times
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: b,
      create: b
    });
  }

  console.log('Successfully added more dummy blogs!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
