import React, { JSX } from 'react';

type TypographySettings = {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  fontFamily?: string;
  color?: string;
};

interface DynamicTextProps {
  content: string;
  typography?: string; // JSON string
  defaultTag?: keyof JSX.IntrinsicElements;
  defaultStyle?: React.CSSProperties;
  className?: string;
}

export default function DynamicText({
  content,
  typography,
  defaultTag = 'p',
  defaultStyle = {},
  className = '',
}: DynamicTextProps) {
  if (!content) return null;

  let settings: TypographySettings = {};
  try {
    if (typography) {
      settings = JSON.parse(typography);
    }
  } catch (e) {
    console.error('Failed to parse typography settings', e);
  }

  const Tag = (settings.tag || defaultTag) as keyof JSX.IntrinsicElements;

  const style: React.CSSProperties = {
    ...defaultStyle,
    ...(settings.fontSize ? { fontSize: settings.fontSize } : {}),
    ...(settings.fontWeight ? { fontWeight: settings.fontWeight } : {}),
    ...(settings.fontStyle ? { fontStyle: settings.fontStyle } : {}),
    ...(settings.fontFamily ? { fontFamily: settings.fontFamily } : {}),
    ...(settings.color ? { color: settings.color } : {}),
  };

  return (
    <Tag className={className} style={style}>
      {content.split('\n').map((line, i, arr) => (
        <React.Fragment key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </React.Fragment>
      ))}
    </Tag>
  );
}
