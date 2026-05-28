import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.findMany({ select: { id: true, slug: true, title: true } });
  console.log(JSON.stringify(pages, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
