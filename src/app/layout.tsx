import type { Metadata } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import "./globals.css";

const archivo = Archivo_Black({
  weight: "400",
  variable: "--font-archivo",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Mad Marketer',
    default: 'Mad Marketer | AI-Powered Growth Infrastructure',
  },
  description: 'The operating system for modern digital business. We build intelligent websites, apps, AI automation systems, CRM ecosystems, and growth infrastructure.',
};

import GlobalBackground from '@/components/GlobalBackground';
import Footer from '@/components/home/Footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <body suppressHydrationWarning>
        <GlobalBackground />
        {children}
        <Footer />
      </body>
    </html>
  );
}
