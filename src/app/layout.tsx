import type { Metadata } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import "./globals.css";
import GlobalBackground from "@/components/GlobalBackground";
import ConditionalLayout from "@/components/ConditionalLayout";
import { getSiteSettings } from "@/app/actions/cms";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

const archivo = Archivo_Black({
  subsets: ["latin"],
  variable: '--font-archivo',
  weight: "400",
  display: 'swap',
});

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings?.defaultMetaTitle || "Mad Marketer | Digital Infrastructure",
    description: settings?.defaultMetaDesc || "Next-generation digital infrastructure for ambitious brands.",
    openGraph: {
      images: settings?.ogImage ? [settings.ogImage] : [],
    },
    icons: {
      icon: '/logo.png',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <head>
        {settings?.customScripts && (
          <div dangerouslySetInnerHTML={{ __html: settings.customScripts }} />
        )}
      </head>
      <body suppressHydrationWarning>
        <GlobalBackground />
        <ConditionalLayout navbar={<Navbar />} footer={<Footer />}>
          {children}
        </ConditionalLayout>

        {settings?.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.googleAnalyticsId}');
              `}
            </Script>
          </>
        )}
        <Analytics />
      </body>
    </html>
  );
}
