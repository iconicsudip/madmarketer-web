import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Analyzing pages and services for Footer Migration...');
  
  const pages = await prisma.page.findMany();
  const services = await prisma.service.findMany();

  // Group 1: Company / Core
  const coreLinks = [
    { label: 'About', url: '/about' },
    { label: 'Portfolio', url: '/portfolio' },
    { label: 'Blog', url: '/blog' },
    { label: 'Contact', url: '/contact' },
    { label: 'Sitemap', url: '/sitemap.xml' }
  ];

  // Map services into groups
  const groups: Record<string, { label: string, url: string }[]> = {};

  for (const service of services) {
    // Only take a few top services per category so the footer isn't huge
    const cat = service.category;
    if (!groups[cat]) groups[cat] = [];
    
    // Limit to 5 per category to keep footer clean
    if (groups[cat].length < 5) {
      groups[cat].push({
        label: service.title,
        url: service.slug.startsWith('/') ? service.slug : `/${service.slug}`
      });
    }
  }

  // Construct final footer JSON
  const footerMenus = [
    { title: 'Company', links: coreLinks },
  ];

  // Add the generated groups (capitalize title)
  for (const [category, links] of Object.entries(groups)) {
    if (links.length > 0) {
      const title = category.charAt(0).toUpperCase() + category.slice(1);
      // Skip "Tools" if we want to keep it focused, or just include it
      if (title !== 'Tools') {
        footerMenus.push({ title, links });
      }
    }
  }

  // Update Settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: { footerMenus: JSON.stringify(footerMenus) },
    create: { id: 'default', footerMenus: JSON.stringify(footerMenus) }
  });

  console.log('✅ Footer Menus Migrated Successfully!');
  console.log(JSON.stringify(footerMenus, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
