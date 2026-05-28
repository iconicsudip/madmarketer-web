import { execSync } from 'child_process';

const scripts = [
  'seed_pages.ts',
  'seed_content.ts',
  'seed_home_sections.ts',
  'seed_page_content.ts',
  'seed_generic_pages.ts',
  'seed_doconnect.ts',
  'seed_madrcs.ts',
  'seed_tools.ts',
  'seed_blogs.ts',
  'expand_blogs.ts',
  'update_pages_seo.ts',
  'update_seo_content.ts',
  'update_doconnect_pricing.ts',
  'migrate_footer.ts'
];

console.log('--- Starting full database seed ---');

for (const script of scripts) {
  console.log(`\n⏳ Running ${script}...`);
  try {
    execSync(`npx ts-node ${script}`, { stdio: 'inherit' });
    console.log(`✅ Finished ${script}`);
  } catch (error) {
    console.error(`❌ Failed to run ${script}`, error);
    process.exit(1);
  }
}

console.log('\n🎉 All seeding completed successfully!');
