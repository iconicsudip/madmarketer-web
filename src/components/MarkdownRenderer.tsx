'use client';

import dynamic from 'next/dynamic';
import '@uiw/react-markdown-preview/markdown.css';
import { CSSProperties } from 'react';

// Dynamically import the markdown preview to avoid SSR issues
const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div style={{ backgroundColor: 'transparent', color: 'inherit' }}>
      <MarkdownPreview 
        source={content} 
        style={{ 
          backgroundColor: 'transparent',
          color: 'var(--warm-white)',
          fontFamily: 'var(--font-inter)'
        } as CSSProperties} 
      />
    </div>
  );
}
