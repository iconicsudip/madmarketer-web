import { prisma } from '@/lib/prisma';
import FAQAccordion from '@/components/services/FAQAccordion';
import Link from 'next/link';
import CTAButton from '@/components/CTAButton';
import DynamicText from '@/components/DynamicText';

// Home components
import Hero from '@/components/home/Hero';
import ServicesEcosystem from '@/components/home/ServicesEcosystem';
import AboutSection from '@/components/home/AboutSection';
import ProductsSection from '@/components/home/ProductsSection';
import InfrastructureMarquee from '@/components/home/InfrastructureMarquee';
import ProcessRoadmap from '@/components/home/ProcessRoadmap';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ReviewsSection from '@/components/home/ReviewsSection';
import BlogSection from '@/components/home/BlogSection';
import PortfolioSection from '@/components/home/PortfolioSection';
import FinalCTA from '@/components/home/FinalCTA';

// ─── Section parsers ───────────────────────────────────────────────────────────
function parse(content: string): Record<string, string> {
  try { return JSON.parse(content); } catch { return {}; }
}

function HeroSection({ data }: { data: Record<string, string> }) {
  return (
    <div style={{ paddingTop: '180px', paddingBottom: '120px', color: '#fff' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        {data.headline && (
          <DynamicText 
            content={data.headline} 
            typography={data.headlineTypography} 
            defaultTag="h1" 
            defaultStyle={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '-0.03em', lineHeight: 1.1 }} 
          />
        )}
        {data.subheadline && (
          <DynamicText 
            content={data.subheadline} 
            typography={data.subheadlineTypography} 
            defaultTag="p" 
            defaultStyle={{ fontFamily: 'var(--font-inter)', fontSize: '1.2rem', color: 'rgba(255,255,255,0.55)', maxWidth: '620px', margin: '0 auto 3rem', lineHeight: 1.7 }} 
          />
        )}
        {data.ctaText && data.ctaLink && (
          <CTAButton
            href={data.ctaLink}
            style={{ display: 'inline-block', background: 'var(--primary-red)', color: '#fff', padding: '16px 40px', borderRadius: '50px', fontWeight: 600, fontSize: '1.1rem', textDecoration: 'none', transition: 'all 0.3s' }}
            actionType={data.ctaActionType}
            popupType={data.ctaPopupType}
            popupSectionType={data.ctaPopupSectionType}
            popupIframeUrl={data.ctaPopupIframeUrl}
          >
            {data.ctaText}
          </CTAButton>
        )}
      </div>
    </div>
  );
}

function TextSection({ data }: { data: Record<string, string> }) {
  return (
    <section style={{ padding: '6rem 0', background: 'var(--dark-bg)' }}>
      <div className="container" style={{ maxWidth: '1024px' }}>
        {data.heading && (
          <DynamicText 
            content={data.heading} 
            typography={data.headingTypography} 
            defaultTag="h2" 
            defaultStyle={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }} 
          />
        )}
        {data.body && (
          <DynamicText 
            content={data.body} 
            typography={data.bodyTypography} 
            defaultTag="p" 
            defaultStyle={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', whiteSpace: 'pre-wrap' }} 
          />
        )}
      </div>
    </section>
  );
}

function CtaSection({ data }: { data: Record<string, string> }) {
  return (
    <section style={{ padding: '8rem 0', background: 'var(--dark-bg)' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        {data.heading && (
          <DynamicText 
            content={data.heading} 
            typography={data.headingTypography} 
            defaultTag="h2" 
            defaultStyle={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: '1.5rem' }} 
          />
        )}
        {data.subtext && (
          <DynamicText 
            content={data.subtext} 
            typography={data.subtextTypography} 
            defaultTag="p" 
            defaultStyle={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', marginBottom: '3rem' }} 
          />
        )}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {data.primaryCtaText && data.primaryCtaLink && (
            <CTAButton
              href={data.primaryCtaLink}
              style={{ padding: '16px 40px', borderRadius: '50px', background: 'var(--primary-red)', color: '#fff', fontWeight: 600, textDecoration: 'none' }}
              actionType={data.primaryCtaActionType}
              popupType={data.primaryCtaPopupType}
              popupSectionType={data.primaryCtaPopupSectionType}
              popupIframeUrl={data.primaryCtaPopupIframeUrl}
            >
              {data.primaryCtaText}
            </CTAButton>
          )}
          {data.secondaryCtaText && data.secondaryCtaLink && (
            <CTAButton
              href={data.secondaryCtaLink}
              style={{ padding: '16px 40px', borderRadius: '50px', background: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: 600, textDecoration: 'none' }}
              actionType={data.secondaryCtaActionType}
              popupType={data.secondaryCtaPopupType}
              popupSectionType={data.secondaryCtaPopupSectionType}
              popupIframeUrl={data.secondaryCtaPopupIframeUrl}
            >
              {data.secondaryCtaText}
            </CTAButton>
          )}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({ data }: { data: Record<string, string> }) {
  const features = [
    { title: data.feature1Title, desc: data.feature1Desc },
    { title: data.feature2Title, desc: data.feature2Desc },
    { title: data.feature3Title, desc: data.feature3Desc },
  ].filter(f => f.title);

  return (
    <section style={{ padding: '6rem 0', background: 'var(--dark-bg)' }}>
      <div className="container">
        {data.heading && (
          <DynamicText 
            content={data.heading} 
            typography={data.headingTypography} 
            defaultTag="h2" 
            defaultStyle={{ fontSize: '2.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '4rem' }} 
          />
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <DynamicText 
                content={f.title} 
                typography={data.featureTitleTypography} 
                defaultTag="h3" 
                defaultStyle={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }} 
              />
              <DynamicText 
                content={f.desc} 
                typography={data.featureDescTypography} 
                defaultTag="p" 
                defaultStyle={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImageTextSection({ data }: { data: Record<string, string> }) {
  const isLeft = data.imagePosition === 'left';
  return (
    <section style={{ padding: '6rem 0', background: 'var(--dark-bg)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        {isLeft && data.imageUrl && (
          <img src={data.imageUrl} alt={data.imageAlt || ''} style={{ width: '100%', borderRadius: '24px', objectFit: 'cover', aspectRatio: '1/1' }} />
        )}
        <div>
          {data.heading && (
            <DynamicText 
              content={data.heading} 
              typography={data.headingTypography} 
              defaultTag="h2" 
              defaultStyle={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }} 
            />
          )}
          {data.body && (
            <DynamicText 
              content={data.body} 
              typography={data.bodyTypography} 
              defaultTag="p" 
              defaultStyle={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', whiteSpace: 'pre-wrap' }} 
            />
          )}
        </div>
        {!isLeft && data.imageUrl && (
          <img src={data.imageUrl} alt={data.imageAlt || ''} style={{ width: '100%', borderRadius: '24px', objectFit: 'cover', aspectRatio: '1/1' }} />
        )}
      </div>
    </section>
  );
}

function FAQSection({ data }: { data: Record<string, string> }) {
  let faqs: { q: string; a: string }[] = [];
  try {
    if (data.faqs) {
      faqs = JSON.parse(data.faqs);
    }
  } catch { }

  if (faqs.length === 0) return null;
  return (
    <section style={{ padding: '4rem 0' }}>
      <div className="container" style={{ maxWidth: '1024px' }}>
        {data.heading && (
          <DynamicText 
            content={data.heading} 
            typography={data.headingTypography} 
            defaultTag="h2" 
            defaultStyle={{ fontSize: '2.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '2rem' }} 
            className="faq-dynamic-heading"
          />
        )}
        <FAQAccordion faqs={faqs} title={data.heading ? "" : 'Frequently Asked Questions'} />
      </div>
    </section>
  );
}

function IframeSection({ data }: { data: Record<string, string> }) {
  return (
    <section style={{ width: '100%', background: 'var(--dark-bg)', padding: '4rem 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {data.heading && <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>{data.heading}</h2>}
        <iframe 
          src={data.url} 
          style={{ width: '100%', height: data.height ? `${data.height}px` : '1024px', border: 'none', borderRadius: '16px' }} 
        />
      </div>
    </section>
  );
}

import {
  ProductHeroSection,
  ProductSplitFeaturesSection,
  ProductBentoGridSection,
  ProductIntegrationsSection,
  ProductPricingSection,
  ProductProcessSection,
  ProductFaqSection,
  ProductReviewsSection
} from './ProductSections';
import {
  ServiceHero,
  ServiceTestimonials,
  ServiceGrid,
  ServiceTeamContact
} from '@/components/services/ServiceSections';

import { getTestimonialsByIds } from '@/app/actions/cms';

// ─── Main Renderer ─────────────────────────────────────────────────────────────
export default async function PageRenderer({ 
  slug,
  collections = {},
  widgets
}: { 
  slug: string;
  collections?: {
    services?: any[];
    products?: any[];
    blogs?: any[];
    reviews?: any[];
    portfolio?: any[];
  },
  widgets?: Record<string, React.ReactNode>
}) {
  const page = await prisma.page.findUnique({
    where: { slug },
    include: { sections: { orderBy: { orderIndex: 'asc' } } },
  });

  if (!page || page.sections.length === 0) return null;

  return (
    <>
      {await Promise.all(page.sections.map(async (section) => {
        const data = parse(section.content);

        // Fetch real testimonials from the DB if this is the reviews section
        if (section.type === 'product_reviews') {
          let ids: any[] = [];
          try { ids = JSON.parse(data.reviews || '[]'); } catch { }
          if (Array.isArray(ids) && ids.length > 0 && typeof ids[0] === 'string') {
            const dbTestimonials = await getTestimonialsByIds(ids as string[]);
            // Map DB format to what the component expects
            data.reviews = JSON.stringify(dbTestimonials.map((t: any) => ({
              name: t.name,
              role: t.role || t.company,
              text: t.content,
              stars: t.rating || 5,
              avatar: t.avatar
            })));
          }
        }

        switch (section.type) {
          case 'hero': return <HeroSection key={section.id} data={data} />;
          case 'text': return <TextSection key={section.id} data={data} />;
          case 'cta': return <CtaSection key={section.id} data={data} />;
          case 'features': return <FeaturesSection key={section.id} data={data} />;
          case 'image_text': return <ImageTextSection key={section.id} data={data} />;
          case 'faq': return <FAQSection key={section.id} data={data} />;
          case 'iframe': return <IframeSection key={section.id} data={data} />;
          case 'product_hero': return <ProductHeroSection key={section.id} data={data} />;
          case 'product_split_features': return <ProductSplitFeaturesSection key={section.id} data={data} />;
          case 'product_bento_grid': return <ProductBentoGridSection key={section.id} data={data} />;
          case 'product_integrations': return <ProductIntegrationsSection key={section.id} data={data} />;
          case 'product_pricing': return <ProductPricingSection key={section.id} data={data} />;
          case 'product_process': return <ProductProcessSection key={section.id} data={data} />;
          case 'product_faqs': return <ProductFaqSection key={section.id} data={data} />;
          case 'product_reviews': return <ProductReviewsSection key={section.id} data={data} />;
          case 'service_hero': return <ServiceHero key={section.id} data={data} />;
          case 'service_testimonials': return <ServiceTestimonials key={section.id} data={data} />;
          case 'service_grid': return <ServiceGrid key={section.id} data={data} />;
          case 'service_team_contact': return <ServiceTeamContact key={section.id} data={data} />;
          case 'home_hero': return <Hero key={section.id} data={data} />;
          case 'home_services': return <ServicesEcosystem key={section.id} initialServices={data.limit ? (collections.services || []).slice(0, parseInt(data.limit, 10)) : (collections.services || [])} />;
          case 'home_about': return <AboutSection key={section.id} data={data} />;
          case 'home_products': return <ProductsSection key={section.id} initialProducts={data.limit ? (collections.products || []).slice(0, parseInt(data.limit, 10)) : (collections.products || [])} />;
          case 'home_marquee': return <InfrastructureMarquee key={section.id} data={data} />;
          case 'home_portfolio': return <PortfolioSection key={section.id} items={data.limit ? (collections.portfolio || []).slice(0, parseInt(data.limit, 10)) : (collections.portfolio || [])} />;
          case 'home_process': return <ProcessRoadmap key={section.id} data={data} />;
          case 'home_why_choose_us': return <WhyChooseUs key={section.id} data={data} />;
          case 'home_reviews': return <ReviewsSection key={section.id} reviews={data.limit ? (collections.reviews || []).slice(0, parseInt(data.limit, 10)) : (collections.reviews || [])} />;
          case 'home_blog': return <BlogSection key={section.id} posts={data.limit ? (collections.blogs || []).slice(0, parseInt(data.limit, 10)) : (collections.blogs || [])} />;
          case 'global_final_cta': return <FinalCTA key={section.id} data={data} />;
          case 'widget': return <div key={section.id}>{widgets?.[data.widgetType] || null}</div>;
          default: return <div key={section.id} style={{ display: 'none' }} />;
        }
      }))}
    </>
  );
}
