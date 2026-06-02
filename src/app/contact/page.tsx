import FinalCTA from '@/components/home/FinalCTA';
import PageRenderer from '@/components/PageRenderer';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findUnique({ where: { slug: 'contact' } });
  if (!page) return { title: 'Contact Us' };
  return { title: page.title, description: page.metaDescription };
}

export default async function ContactPage() {
  const page = await prisma.page.findUnique({
    where: { slug: 'contact' },
    include: { sections: true },
  });
  const contactWidgetSection = page?.sections.find(s => s.type === 'widget' && s.content.includes('contact_form'));
  let widgetData: Record<string, string> = {};
  try { widgetData = JSON.parse(contactWidgetSection?.content || '{}'); } catch { }
  
  const hasCmsSections = (page?.sections.length ?? 0) > 0;
  const hasWidget = !!contactWidgetSection;

  const ContactFormWidget = widgetData.embedUrl ? (
    <div style={{ backgroundColor: 'var(--dark-bg)', paddingBottom: '100px' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <iframe 
          src={widgetData.embedUrl} 
          width="100%" 
          height={widgetData.embedHeight || '800px'} 
          style={{ border: 'none', borderRadius: '16px', background: 'transparent', maxWidth: '800px', margin: '0 auto', display: 'block' }}
          title="Contact Form"
        />
      </div>
    </div>
  ) : (
    <div style={{ backgroundColor: 'var(--dark-bg)', paddingBottom: '100px' }}>
      <div className="container">
        <ContactForm />
      </div>
    </div>
  );

  return (
    <main>
      {/* Dynamic CMS Sections first */}
      <PageRenderer slug="contact" widgets={{ contact_form: ContactFormWidget }} />

      {!hasCmsSections && (

      <div style={{ 
        paddingBottom: '100px',
        backgroundColor: 'var(--dark-bg)',
        color: 'var(--warm-white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontFamily: 'var(--font-inter)', 
            fontSize: 'clamp(3rem, 5vw, 4.5rem)', 
            fontWeight: 600, 
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
            color: '#fff',
            marginTop: '80px' // Ensure spacing if no hero is added
          }}>
            Let's build the future.
          </h1>
          <p style={{ 
            fontFamily: 'var(--font-inter)',
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '4rem'
          }}>
            Book your free AI consultation today.
          </p>
        </div>
      </div>
      )}

      {/* Form Section appended manually if CMS didn't explicitly place the widget block */}
      {!hasWidget && ContactFormWidget}
    </main>
  );
}
