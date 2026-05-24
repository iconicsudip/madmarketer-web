import Navbar from '@/components/home/Navbar';
import FinalCTA from '@/components/home/FinalCTA';
import FAQAccordion from '@/components/services/FAQAccordion';

const serviceData = {
  'ai-automation': {
    title: 'AI Automation Engine',
    desc: 'Scale your operations instantly with custom AI workflows and intelligent agents.',
    faqs: [
      { q: 'How long does implementation take?', a: 'Typically 2-4 weeks depending on the complexity of your workflows.' },
      { q: 'Is our data secure with AI?', a: 'Yes, we use enterprise-grade encryption and secure private LLM instances ensuring your data is never used for training external models.' },
      { q: 'What systems can you integrate with?', a: 'We can integrate with virtually any modern SaaS platform that has an API, including Salesforce, HubSpot, Slack, and custom databases.' }
    ]
  },
  'custom-crm': {
    title: 'Custom CRM Infrastructure',
    desc: 'Scalable data systems designed exactly for how your business actually runs.',
    faqs: [
      { q: 'Why build custom instead of using HubSpot/Salesforce?', a: 'Off-the-shelf CRMs become bloated and expensive as you scale. Custom CRMs give you exact workflows without per-seat licensing fees.' },
      { q: 'Can we migrate our existing data?', a: 'Absolutely. We handle secure data migration from your legacy systems into the new infrastructure.' }
    ]
  },
  'web-development': {
    title: 'High-Performance Web Development',
    desc: 'Cinematic, ultra-fast websites engineered to convert visitors into enterprise clients.',
    faqs: [
      { q: 'What tech stack do you use?', a: 'We specialize in Next.js, React, and modern backend architectures for maximum performance and SEO.' },
      { q: 'Do you handle the design as well?', a: 'Yes, we provide end-to-end service from UX/UI design to full-stack implementation.' }
    ]
  },
  'seo-marketing': {
    title: 'Data-Driven SEO & Marketing',
    desc: 'Advanced analytics pipelines and growth strategies that turn raw data into actionable intelligence.',
    faqs: [
      { q: 'How is this different from traditional SEO?', a: 'We build automated pipelines that analyze search intent at scale, finding programmatic opportunities rather than just writing blog posts.' },
      { q: 'When can we expect results?', a: 'While infrastructure setup takes weeks, SEO compounding typically shows significant ROI between months 3 and 6.' }
    ]
  }
};

export default async function ServicePage(props: { params: Promise<{ category: string, slug: string }> }) {
  const params = await props.params;
  const data = serviceData[params.slug as keyof typeof serviceData] || {
    title: params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    desc: `Enterprise ${params.category.replace(/-/g, ' ')} infrastructure designed exactly for your business needs.`,
    faqs: [
      { q: 'Can you customize this?', a: 'Absolutely, everything we build is tailored exactly to your operational requirements.' }
    ]
  };

  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: '180px', paddingBottom: '120px', backgroundColor: 'transparent', color: '#fff', minHeight: '80vh' }}>
        <div className="container">
          <span style={{ 
            display: 'inline-block', 
            padding: '6px 16px', 
            borderRadius: '50px', 
            background: 'rgba(255, 255, 255, 0.1)', 
            border: '1px solid rgba(255, 255, 255, 0.2)', 
            fontSize: '0.85rem', 
            fontWeight: 600, 
            letterSpacing: '0.05em', 
            textTransform: 'uppercase', 
            marginBottom: '2rem' 
          }}>
            Service Overview
          </span>
          <h1 style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            {data.title}
          </h1>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.6)', maxWidth: '650px', marginBottom: '6rem', lineHeight: 1.6 }}>
            {data.desc}
          </p>
          
          <div style={{ maxWidth: '800px' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '2.5rem', fontFamily: 'var(--font-inter)', fontWeight: 600 }}>Frequently Asked Questions</h3>
            <FAQAccordion faqs={data.faqs} />
          </div>
        </div>
      </div>
      <FinalCTA />
    </main>
  );
}
