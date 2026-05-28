'use client';

import dynamic from 'next/dynamic';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateSiteSettings } from '@/app/actions/cms';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function LegalPolicyEditor({ initialData }: { initialData: { privacyPolicy?: string | null, termsConditions?: string | null, refundPolicy?: string | null } }) {
  const [privacyPolicy, setPrivacyPolicy] = useState(initialData.privacyPolicy || '');
  const [termsConditions, setTermsConditions] = useState(initialData.termsConditions || '');
  const [refundPolicy, setRefundPolicy] = useState(initialData.refundPolicy || '');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSave() {
    startTransition(async () => {
      // Fetch current settings, but wait, updateSiteSettings merges fields. 
      // But we can just send the three fields we care about. 
      // However, `updateSiteSettings` in cms.ts is typed to require `siteName`, `defaultMetaTitle`, etc.
      // Wait, let's look at `updateSiteSettings`. It doesn't actually require them all if we only pass what we want.
      // But typescript might complain. Let's just create a hidden form that submits to the server action, or we can just pass them if we update the server action to make everything optional.
      // Wait, `updateSiteSettings` has EVERYTHING optional except `siteName`, `defaultMetaTitle`, `defaultMetaDesc`, `ogImage`, `googleAnalyticsId`, `customScripts`.
      // Let's create a dedicated server action or just use hidden inputs in the main form instead!
      // If we use hidden inputs, we don't need a save button here, it just updates the hidden inputs for the main form.
    });
  }

  // To integrate cleanly with the existing form without rewriting everything, we can just render hidden inputs!
  return (
    <div>
      <input type="hidden" name="privacyPolicy" value={privacyPolicy} />
      <input type="hidden" name="termsConditions" value={termsConditions} />
      <input type="hidden" name="refundPolicy" value={refundPolicy} />

      <div data-color-mode="dark" style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Privacy Policy (Markdown)</label>
        <MDEditor
          value={privacyPolicy}
          onChange={val => setPrivacyPolicy(val || '')}
          height={300}
          preview="live"
          style={{ background: '#080808', borderRadius: '8px' }}
        />
      </div>

      <div data-color-mode="dark" style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Terms & Conditions (Markdown)</label>
        <MDEditor
          value={termsConditions}
          onChange={val => setTermsConditions(val || '')}
          height={300}
          preview="live"
          style={{ background: '#080808', borderRadius: '8px' }}
        />
      </div>

      <div data-color-mode="dark" style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Refund Policy (Markdown)</label>
        <MDEditor
          value={refundPolicy}
          onChange={val => setRefundPolicy(val || '')}
          height={300}
          preview="live"
          style={{ background: '#080808', borderRadius: '8px' }}
        />
      </div>
    </div>
  );
}
