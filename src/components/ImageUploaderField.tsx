'use client';

import { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';

interface Props {
  name: string;
  defaultValue?: string;
  label?: string;
  compact?: boolean;
}

export default function ImageUploaderField({ name, defaultValue = '', label, compact = false }: Props) {
  const [url, setUrl] = useState(defaultValue);

  useEffect(() => {
    setUrl(defaultValue);
  }, [defaultValue]);

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <input type="hidden" name={name} value={url} />
      <ImageUploader value={url} onChange={setUrl} label={label} compact={compact} />
    </div>
  );
}
