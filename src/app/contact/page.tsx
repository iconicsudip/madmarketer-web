import FinalCTA from '@/components/home/FinalCTA';
import PageRenderer from '@/components/PageRenderer';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

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
      <div className="container" style={{ textAlign: 'center' }}>
        <form style={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '3rem',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', color: '#fff' }}>Name</label>
            <input type="text" style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', color: '#fff' }}>Work Email</label>
            <input type="email" style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', color: '#fff' }}>How can we help?</label>
            <textarea rows={4} style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', outline: 'none', resize: 'none' }}></textarea>
          </div>
          <button style={{ 
            padding: '16px', 
            borderRadius: '50px', 
            background: 'var(--primary-red)', 
            color: '#fff', 
            fontFamily: 'var(--font-inter)', 
            fontWeight: 600, 
            fontSize: '1.05rem', 
            border: 'none', 
            cursor: 'pointer',
            marginTop: '1rem'
          }}>
            Submit Request
          </button>
        </form>
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
