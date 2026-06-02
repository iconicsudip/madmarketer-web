'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useModal } from '@/components/ModalContext';

interface CTAButtonProps {
  href: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  actionType?: string; // 'redirect' | 'popup'
  popupType?: string; // 'section' | 'iframe'
  popupSectionType?: string; // e.g. 'contact_form'
  popupIframeUrl?: string; // e.g. 'https://docs.google.com/forms/...'
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function CTAButton({
  href,
  className,
  style,
  children,
  actionType = 'redirect',
  popupType = 'section',
  popupSectionType = 'contact_form',
  popupIframeUrl = '',
  onClick,
}: CTAButtonProps) {
  const pathname = usePathname();
  const { openModal } = useModal();

  // Detect service pages to override standard behavior
  const isServicePage = pathname && (pathname.startsWith('/services') || pathname.includes('/services/'));

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    if (isServicePage) {
      e.preventDefault();
      openModal({
        popupType: 'section',
        popupSectionType: 'contact_form',
        popupIframeUrl: '',
      });
      return;
    }

    if (actionType === 'popup') {
      e.preventDefault();
      openModal({
        popupType: (popupType as any) || 'section',
        popupSectionType: popupSectionType || 'contact_form',
        popupIframeUrl: popupIframeUrl || '',
      });
    }
  };

  const isExternal = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//');
  const isAnchor = href.startsWith('#');

  if (isExternal || isAnchor) {
    return (
      <a
        href={href}
        className={className}
        style={style}
        onClick={handleClick}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} style={style} onClick={handleClick}>
      {children}
    </Link>
  );
}
