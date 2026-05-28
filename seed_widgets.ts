import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const pagesToUpdate = [
    { slug: 'blog', widget: 'blog_grid' },
    { slug: 'portfolio', widget: 'portfolio_grid' },
    { slug: 'contact', widget: 'contact_form' }
  ];

  for (const p of pagesToUpdate) {
    const page = await prisma.page.findUnique({ where: { slug: p.slug }, include: { sections: { orderBy: { orderIndex: 'asc' } } } });
    if (!page) continue;

    const hasWidget = page.sections.some(s => s.type === 'widget');
    if (!hasWidget) {
      console.log(`Adding widget for /${p.slug}`);
      
      // Shift sections after index 0 down by 1
      const sectionsToShift = page.sections.filter(s => s.orderIndex >= 1);
      for (const s of sectionsToShift) {
        await prisma.pageSection.update({
          where: { id: s.id },
          data: { orderIndex: s.orderIndex + 1 }
        });
      }

      await prisma.pageSection.create({
        data: {
          pageId: page.id,
          type: 'widget',
          orderIndex: 1,
          content: JSON.stringify({ widgetType: p.widget })
        }
      });
    } else {
      console.log(`Widget already exists for /${p.slug}`);
    }
  }
}

main().then(() => console.log('Done')).catch(console.error);
