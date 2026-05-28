'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- SERVICES ---
export async function getServices() {
  return await prisma.service.findMany({ orderBy: { createdAt: 'asc' } });
}

export async function createService(data: { title: string; category: string; slug: string; desc: string; image: string; metaTitle?: string; metaDescription?: string; keywords?: string; ogImage?: string; schemaMarkup?: string }) {
  await prisma.service.create({ data });
  revalidatePath('/');
  revalidatePath('/admin/services');
}

export async function deleteService(id: string) {
  await prisma.service.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin/services');
}

// --- PRODUCTS ---
export async function getProducts() {
  return await prisma.product.findMany({ orderBy: { createdAt: 'asc' } });
}

export async function createProduct(data: { title: string; description: string; image: string; pill: string; link: string; glowColor: string; metaTitle?: string; metaDescription?: string; keywords?: string; ogImage?: string; schemaMarkup?: string }) {
  await prisma.product.create({ data });
  revalidatePath('/');
  revalidatePath('/admin/products');
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin/products');
}

export async function updateProduct(id: string, data: { title: string; description: string; image: string; pill: string; link: string; glowColor: string; metaTitle?: string; metaDescription?: string; keywords?: string; ogImage?: string; schemaMarkup?: string }) {
  await prisma.product.update({ where: { id }, data });
  revalidatePath('/');
  revalidatePath('/admin/products');
}

// --- SETTINGS (SEO) ---
export async function getSiteSettings() {
  try {
    if (!prisma.siteSettings) {
      console.warn('prisma.siteSettings is undefined. Returning default mock settings.');
      return { id: 'default', siteName: 'Madmarketer', defaultMetaTitle: 'Madmarketer', defaultMetaDesc: 'Modern infrastructure', ogImage: null, googleAnalyticsId: null, customScripts: null, footerMenus: null, customSitemapUrls: null, overrideSitemap: false, customRobotsTxt: null, footerNewsletterTitle: null, footerNewsletterDesc: null, footerBrandDesc: null, footerCopyright: null, socialFacebook: null, socialInstagram: null, socialTwitter: null, socialLinkedIn: null, socialYoutube: null, privacyPolicy: null, termsConditions: null, refundPolicy: null };
    }
    return await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: {}, // do nothing if it already exists
      create: { 
        id: 'default', 
        siteName: 'Madmarketer', 
        defaultMetaTitle: 'Madmarketer', 
        defaultMetaDesc: 'Modern infrastructure' 
      }
    });
  } catch (error) {
    console.error('Failed to get site settings:', error);
    return null;
  }
}

export async function updateSiteSettings(data: {
  siteName: string;
  defaultMetaTitle: string;
  defaultMetaDesc: string;
  ogImage: string;
  googleAnalyticsId: string;
  customScripts: string;
  footerMenus?: string;
  customSitemapUrls?: string;
  overrideSitemap?: boolean;
  customRobotsTxt?: string;
  footerNewsletterTitle?: string;
  footerNewsletterDesc?: string;
  footerBrandDesc?: string;
  footerCopyright?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialTwitter?: string;
  socialLinkedIn?: string;
  socialYoutube?: string;
  privacyPolicy?: string;
  termsConditions?: string;
  refundPolicy?: string;
}) {
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: data,
    create: { id: 'default', ...data }
  });
  revalidatePath('/', 'layout');
  revalidatePath('/admin/settings');
}

// --- PAGES ---
export async function getPages() {
  return await prisma.page.findMany({
    orderBy: { title: 'asc' },
    include: { sections: { orderBy: { orderIndex: 'asc' } } }
  });
}

export async function getPageWithSections(id: string) {
  return await prisma.page.findUnique({
    where: { id },
    include: { sections: { orderBy: { orderIndex: 'asc' } } }
  });
}

export async function createPage(data: { title: string; slug: string; metaTitle?: string; metaDescription: string; keywords?: string; ogImage?: string; schemaMarkup?: string; content: string }) {
  await prisma.page.create({ data });
  revalidatePath('/', 'layout');
  revalidatePath('/admin/pages');
}

export async function updatePage(id: string, data: { title: string; slug: string; metaTitle?: string; metaDescription: string; keywords?: string; ogImage?: string; schemaMarkup?: string; content?: string }) {
  await prisma.page.update({ where: { id }, data });
  revalidatePath('/', 'layout');
  revalidatePath('/admin/pages');
  revalidatePath(`/admin/pages/${id}/edit`);
}

export async function deletePage(id: string) {
  await prisma.page.delete({ where: { id } });
  revalidatePath('/', 'layout');
  revalidatePath('/admin/pages');
}

export async function duplicatePage(id: string) {
  const page = await prisma.page.findUnique({
    where: { id },
    include: { sections: true }
  });
  if (!page) throw new Error("Page not found");

  const newSlug = page.slug ? `${page.slug}-copy-${Date.now()}` : `home-copy-${Date.now()}`;
  
  const newPage = await prisma.page.create({
    data: {
      title: `${page.title} (Copy)`,
      slug: newSlug,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      keywords: page.keywords,
      ogImage: page.ogImage,
      content: page.content,
      sections: {
        create: page.sections.map(s => ({
          type: s.type,
          content: s.content,
          orderIndex: s.orderIndex
        }))
      }
    }
  });

  revalidatePath('/', 'layout');
  revalidatePath('/admin/pages');
  return newPage;
}

// --- PAGE SECTIONS ---
export async function createPageSection(pageId: string, type: string, content: string, orderIndex: number) {
  const section = await prisma.pageSection.create({
    data: { pageId, type, content, orderIndex }
  });
  revalidatePath(`/admin/pages/${pageId}/edit`);
  return section;
}

export async function updatePageSection(sectionId: string, content: string, pageId: string) {
  await prisma.pageSection.update({
    where: { id: sectionId },
    data: { content }
  });
  revalidatePath(`/admin/pages/${pageId}/edit`);
}

export async function deletePageSection(sectionId: string, pageId: string) {
  await prisma.pageSection.delete({ where: { id: sectionId } });
  revalidatePath(`/admin/pages/${pageId}/edit`);
}

export async function reorderPageSections(pageId: string, orderedIds: string[]) {
  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.pageSection.update({ where: { id }, data: { orderIndex: index } })
    )
  );
  revalidatePath(`/admin/pages/${pageId}/edit`);
}

// --- BLOG POSTS ---
export async function getBlogPosts() {
  return await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createBlogPost(data: { title: string; slug: string; category: string; image: string; date: string; excerpt: string; content: string; metaTitle?: string; metaDescription?: string; tags?: string; keywords?: string; ogImage?: string }) {
  await prisma.blogPost.create({ data });
  revalidatePath('/');
  revalidatePath('/admin/blogs');
}

export async function updateBlogPost(id: string, data: { title: string; slug: string; category: string; image: string; date: string; excerpt: string; content: string; metaTitle?: string; metaDescription?: string; tags?: string; keywords?: string; ogImage?: string }) {
  await prisma.blogPost.update({ where: { id }, data });
  revalidatePath('/');
  revalidatePath('/admin/blogs');
}

export async function deleteBlogPost(id: string) {
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin/blogs');
}

// --- TESTIMONIALS ---
export async function getTestimonials() {
  return await prisma.testimonial.findMany({ orderBy: { createdAt: 'asc' } });
}

export async function createTestimonial(data: { company: string; logoName: string; name: string; role: string; content: string; rating: number; avatar: string }) {
  await prisma.testimonial.create({ data });
  revalidatePath('/');
  revalidatePath('/admin/reviews');
}

export async function updateTestimonial(id: string, data: { company: string; logoName: string; name: string; role: string; content: string; rating: number; avatar: string }) {
  await prisma.testimonial.update({ where: { id }, data });
  revalidatePath('/');
  revalidatePath('/admin/reviews');
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin/reviews');
}

// --- PORTFOLIO PROJECTS ---
export async function getPortfolioProjects() {
  return await prisma.portfolioProject.findMany({ orderBy: { createdAt: 'asc' } });
}

export async function createPortfolioProject(data: { client: string; slug?: string; title: string; image: string; stats: string; content?: string; metaTitle?: string; metaDescription?: string; keywords?: string; ogImage?: string }) {
  await prisma.portfolioProject.create({ data });
  revalidatePath('/');
  revalidatePath('/admin/portfolio');
}

export async function updatePortfolioProject(id: string, data: { client: string; slug?: string; title: string; image: string; stats: string; content?: string; metaTitle?: string; metaDescription?: string; keywords?: string; ogImage?: string }) {
  await prisma.portfolioProject.update({ where: { id }, data });
  revalidatePath('/');
  revalidatePath('/admin/portfolio');
}

export async function deletePortfolioProject(id: string) {
  await prisma.portfolioProject.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin/portfolio');
}

// --- HOMEPAGE CONTENT ---
export async function getHomepageSection(sectionId: string): Promise<Record<string, string>> {
  const row = await prisma.homepageContent.findUnique({ where: { id: sectionId } });
  if (!row) return {};
  try { return JSON.parse(row.data); } catch { return {}; }
}

export async function getAllHomepageSections(): Promise<Record<string, Record<string, string>>> {
  const rows = await prisma.homepageContent.findMany();
  const result: Record<string, Record<string, string>> = {};
  for (const row of rows) {
    try { result[row.id] = JSON.parse(row.data); } catch { result[row.id] = {}; }
  }
  return result;
}

export async function saveHomepageSection(sectionId: string, data: Record<string, string>) {
  await prisma.homepageContent.upsert({
    where: { id: sectionId },
    update: { data: JSON.stringify(data) },
    create: { id: sectionId, data: JSON.stringify(data) },
  });
  revalidatePath('/');
  revalidatePath('/admin/home');
}

// --- TESTIMONIALS (For SectionBuilder) ---
export async function getAllTestimonials() {
  return await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function getTestimonialsByIds(ids: string[]) {
  if (!ids || ids.length === 0) return [];
  return await prisma.testimonial.findMany({
    where: { id: { in: ids } },
  });
}

