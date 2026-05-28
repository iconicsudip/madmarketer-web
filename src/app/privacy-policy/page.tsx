import { getSiteSettings } from '@/app/actions/cms';
import { Metadata } from 'next';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();

  return (
    <main style={{ paddingTop: '160px', paddingBottom: '120px', minHeight: '100vh', background: 'var(--dark-bg)' }}>
      <div className="container" style={{ maxWidth: '1024px', margin: '0 auto', background: '#111', padding: '40px', borderRadius: '12px', border: '1px solid #222' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontFamily: 'var(--font-archivo)', color: '#fff' }}>Privacy Policy</h1>
        <div style={{ color: '#ccc', lineHeight: '1.8', fontSize: '1.05rem' }}>
          <MarkdownRenderer content={settings.privacyPolicy || 'Privacy policy content has not been set yet.'} />
        </div>
      </div>
    </main>
  );
}
