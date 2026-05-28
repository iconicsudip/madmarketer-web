import { getSiteSettings, updateSiteSettings } from '@/app/actions/cms';
import FooterMenuEditor from './FooterMenuEditor';
import LegalPolicyEditor from './LegalPolicyEditor';

export default async function SettingsAdmin() {
  const settings = await getSiteSettings();

  async function handleSave(formData: FormData) {
    'use server';
    await updateSiteSettings({
      siteName: formData.get('siteName') as string,
      defaultMetaTitle: formData.get('defaultMetaTitle') as string,
      defaultMetaDesc: formData.get('defaultMetaDesc') as string,
      ogImage: formData.get('ogImage') as string,
      googleAnalyticsId: formData.get('googleAnalyticsId') as string,
      customScripts: formData.get('customScripts') as string,
      footerMenus: formData.get('footerMenus') as string,
      footerNewsletterTitle: formData.get('footerNewsletterTitle') as string,
      footerNewsletterDesc: formData.get('footerNewsletterDesc') as string,
      footerBrandDesc: formData.get('footerBrandDesc') as string,
      footerCopyright: formData.get('footerCopyright') as string,
      socialFacebook: formData.get('socialFacebook') as string,
      socialInstagram: formData.get('socialInstagram') as string,
      socialTwitter: formData.get('socialTwitter') as string,
      socialLinkedIn: formData.get('socialLinkedIn') as string,
      socialYoutube: formData.get('socialYoutube') as string,
      privacyPolicy: formData.get('privacyPolicy') as string,
      termsConditions: formData.get('termsConditions') as string,
      refundPolicy: formData.get('refundPolicy') as string,
    });
  }

  const inputStyle = { width: '100%', padding: '0.75rem', marginBottom: '1.5rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>SEO & Settings</h1>

      <div style={{ background: '#111', padding: '2rem', borderRadius: '8px', border: '1px solid #333', maxWidth: '1024px' }}>
        <form action={handleSave}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Site Name</label>
          <input name="siteName" defaultValue={settings.siteName || ''} style={inputStyle} />

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Default Meta Title</label>
          <input name="defaultMetaTitle" defaultValue={settings.defaultMetaTitle || ''} style={inputStyle} />

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Default Meta Description</label>
          <textarea name="defaultMetaDesc" defaultValue={settings.defaultMetaDesc || ''} style={{ ...inputStyle, height: '80px' }} />

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Open Graph Image URL</label>
          <input name="ogImage" defaultValue={settings.ogImage || ''} style={inputStyle} />

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #333' }}>Third-Party Integrations</h3>

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Google Analytics ID (e.g. G-XXXXXXX)</label>
          <input name="googleAnalyticsId" defaultValue={settings.googleAnalyticsId || ''} style={inputStyle} />

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Custom Head Scripts (HTML)</label>
          <textarea name="customScripts" defaultValue={settings.customScripts || ''} placeholder="<script>...</script>" style={{ ...inputStyle, height: '150px', fontFamily: 'monospace' }} />

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #333' }}>Footer Content & Branding</h3>

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Brand Description (Under Logo)</label>
          <textarea name="footerBrandDesc" defaultValue={settings.footerBrandDesc || ''} placeholder="Automatically generate blog articles, website copy..." style={{ ...inputStyle, height: '80px' }} />

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Newsletter Box Title</label>
          <input name="footerNewsletterTitle" defaultValue={settings.footerNewsletterTitle || ''} placeholder="Get the Latest Updates" style={inputStyle} />

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Newsletter Box Description</label>
          <input name="footerNewsletterDesc" defaultValue={settings.footerNewsletterDesc || ''} placeholder="No spam. Just helpful AI writing insights..." style={inputStyle} />

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Copyright Notice</label>
          <input name="footerCopyright" defaultValue={settings.footerCopyright || ''} placeholder="© 2026 Mad Marketer. All rights reserved." style={inputStyle} />

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #333' }}>Social Media Links</h3>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>Enter the full URLs to your profiles. Leave blank to hide the icon.</p>
          
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Facebook</label>
          <input name="socialFacebook" defaultValue={settings.socialFacebook || ''} placeholder="https://facebook.com/..." style={inputStyle} />
          
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Instagram</label>
          <input name="socialInstagram" defaultValue={settings.socialInstagram || ''} placeholder="https://instagram.com/..." style={inputStyle} />
          
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Twitter / X</label>
          <input name="socialTwitter" defaultValue={settings.socialTwitter || ''} placeholder="https://twitter.com/..." style={inputStyle} />
          
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>LinkedIn</label>
          <input name="socialLinkedIn" defaultValue={settings.socialLinkedIn || ''} placeholder="https://linkedin.com/..." style={inputStyle} />
          
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>YouTube</label>
          <input name="socialYoutube" defaultValue={settings.socialYoutube || ''} placeholder="https://youtube.com/..." style={inputStyle} />

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #333' }}>Legal Policies</h3>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>Enter the full content for your legal pages using the Markdown editor below.</p>

          <LegalPolicyEditor initialData={{ privacyPolicy: settings.privacyPolicy, termsConditions: settings.termsConditions, refundPolicy: settings.refundPolicy }} />

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #333' }}>Footer Menus</h3>

          <FooterMenuEditor initialData={settings.footerMenus || '[]'} />

          <button type="submit" style={{ background: '#ED1C24', color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>Save All Settings</button>
        </form>
      </div>
    </div>
  );
}
