import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const navbarPages = [
  { title: 'Home', slug: '', metaDescription: 'Mad Marketer Homepage', content: 'Home content' },
  { title: 'About', slug: 'about', metaDescription: 'About Mad Marketer', content: 'About content' },
  { title: 'Portfolio', slug: 'portfolio', metaDescription: 'Our Portfolio', content: 'Portfolio content' },
  { title: 'Blog', slug: 'blog', metaDescription: 'Read our latest blogs', content: 'Blog content' },
  { title: 'Contact', slug: 'contact', metaDescription: 'Contact us today', content: 'Contact content' },
  
  // Development
  { title: 'Website Development', slug: 'services/development/website-development', metaDescription: '', content: '' },
  { title: 'App Development', slug: 'services/development/app-development', metaDescription: '', content: '' },
  { title: 'Android App Development', slug: 'services/development/android-app-development', metaDescription: '', content: '' },
  { title: 'iOS App Development', slug: 'services/development/ios-app-development', metaDescription: '', content: '' },
  { title: 'Custom TOOLS Development', slug: 'services/development/custom-tools-development', metaDescription: '', content: '' },
  { title: 'E-commerce Development', slug: 'services/development/ecommerce-development', metaDescription: '', content: '' },
  { title: 'Shopify Development', slug: 'services/development/shopify-development', metaDescription: '', content: '' },
  { title: 'WordPress / WooCommerce', slug: 'services/development/wordpress-woocommerce-development', metaDescription: '', content: '' },

  // Marketing
  { title: 'Digital Marketing', slug: 'services/marketing/digital-marketing', metaDescription: '', content: '' },
  { title: 'SEO', slug: 'services/marketing/seo', metaDescription: '', content: '' },
  { title: 'Social Media Marketing', slug: 'services/marketing/social-media-marketing', metaDescription: '', content: '' },
  { title: 'Email Marketing', slug: 'services/marketing/email-marketing', metaDescription: '', content: '' },
  { title: 'Paid Ads', slug: 'services/marketing/paid-ads', metaDescription: '', content: '' },
  { title: 'Google Ads', slug: 'services/marketing/google-ads', metaDescription: '', content: '' },
  { title: 'TikTok Marketing', slug: 'services/marketing/tiktok-marketing', metaDescription: '', content: '' },

  // Marketplace
  { title: 'Amazon Listing', slug: 'services/marketplace/amazon-listing', metaDescription: '', content: '' },
  { title: 'Etsy Listing', slug: 'services/marketplace/etsy-listing', metaDescription: '', content: '' },
  { title: 'Marketplace Management', slug: 'services/marketplace/marketplace-management', metaDescription: '', content: '' },

  // Tools
  { title: 'DoConnect', slug: 'services/tools/doconnect', metaDescription: '', content: '' },
  { title: 'MadRCS', slug: 'services/tools/madrcs', metaDescription: '', content: '' },

  // Plugins
  { title: 'Multi Listing Tools', slug: 'services/plugins/multi-listing-tools', metaDescription: '', content: '' },
  { title: 'WhatsApp Multi Number', slug: 'services/plugins/whatsapp-multi-number', metaDescription: '', content: '' },
];

async function main() {
  console.log('Seeding Pages...');
  
  await prisma.page.deleteMany();

  for (const page of navbarPages) {
    try {
      await prisma.page.create({ data: page });
    } catch (e) {
      console.log('Skipping duplicate: ', page.slug);
    }
  }
  
  console.log('Seeded pages!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
