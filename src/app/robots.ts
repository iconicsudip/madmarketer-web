import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://madmarketer.com';
  
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });

  if (settings?.customRobotsTxt) {
    // If they provided custom robots.txt, we just output it as a string block.
    // Next.js `robots()` expects an object, but if we need a raw string, we might just parse it or build rules.
    // However, the easiest way to handle raw custom robots.txt in Next.js App Router is to map the string back to rules,
    // OR we can just return a basic Allow/Disallow rule based on it.
    // Let's parse it roughly:
    const rules: { userAgent: string; allow?: string[]; disallow?: string[] }[] = [];
    let currentRule: any = { userAgent: '*', allow: [], disallow: [] };
    
    const lines = settings.customRobotsTxt.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().startsWith('user-agent:')) {
        if (currentRule.allow.length > 0 || currentRule.disallow.length > 0) {
          rules.push(currentRule);
        }
        currentRule = { userAgent: line.split(':')[1].trim(), allow: [], disallow: [] };
      } else if (line.toLowerCase().startsWith('allow:')) {
        currentRule.allow.push(line.split(':')[1].trim());
      } else if (line.toLowerCase().startsWith('disallow:')) {
        currentRule.disallow.push(line.split(':')[1].trim());
      }
    }
    rules.push(currentRule);

    return {
      rules: rules,
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/_next/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
