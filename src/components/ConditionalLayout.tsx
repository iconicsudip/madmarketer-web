'use client';

import { usePathname } from 'next/navigation';
export default function ConditionalLayout({ 
  children,
  navbar,
  footer
}: { 
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && navbar}
      {children}
      {!isAdmin && footer}
    </>
  );
}
