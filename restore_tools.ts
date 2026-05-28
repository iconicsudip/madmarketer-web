import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Removing generated service pages for Tools...');
  
  const tools = ['services/tools/doconnect', 'services/tools/madrcs'];
  
  for (const slug of tools) {
    const page = await prisma.page.findUnique({ where: { slug } });
    if (page) {
      console.log(`Deleting ${slug}...`);
      await prisma.pageSection.deleteMany({ where: { pageId: page.id } });
      await prisma.page.delete({ where: { id: page.id } });
    }
  }
  
  console.log('Tools pages removed. Ready to run seed_madrcs.ts');
}

main().catch(console.error).finally(() => prisma.$disconnect());
