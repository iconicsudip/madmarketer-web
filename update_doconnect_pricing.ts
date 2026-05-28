import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const page = await prisma.page.findUnique({
    where: { slug: 'services/tools/doconnect' },
    include: { sections: true }
  });

  if (!page) {
    console.error("Page not found");
    return;
  }

  const pricingSection = page.sections.find(s => s.type === 'product_pricing');
  if (pricingSection) {
    await prisma.pageSection.update({
      where: { id: pricingSection.id },
      data: {
        content: JSON.stringify({
          pillText: 'PRICING',
          heading: 'Simple, Transparent Pricing',
          subheading: 'Start for free, upgrade when you need more power.',
          pricingSource: 'api',
          pricingApiEndpoint: 'https://api-dochats.madmarketer.net/api/public/plans',
          pricingApiDataPath: '',
          pricingApiNameKey: 'name',
          pricingApiPriceKey: 'monthlyPrice',
          pricingApiYearlyPriceKey: 'yearlyPrice',
          pricingApiDescKey: 'description',
          priceUnit: '/mo',
          priceUnitYearly: '/yr',
          pricing: '[]'
        })
      }
    });
    console.log("DoConnect pricing section updated to include yearly logic!");
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
