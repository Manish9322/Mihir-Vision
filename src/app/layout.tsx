import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Manrope, Inter } from 'next/font/google';
import { StoreProvider } from '@/store/provider';
import { MONGODB_URI } from '@/config/config';


const headlineFont = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-headline',
});

const bodyFont = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

type SettingsData = {
  siteName: string;
  siteTagline: string;
};

async function getSettingsData(): Promise<SettingsData | null> {
    if (!MONGODB_URI) {
        return null;
    }
    try {
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? `https://` + process.env.NEXT_PUBLIC_VERCEL_URL
            : 'http://localhost:9002';
        const res = await fetch(`${baseUrl}/api/settings`, { cache: 'no-store' });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        return null;
    }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettingsData();
  const siteName = settings?.siteName || 'Pinnacle Pathways';
  const siteTagline = settings?.siteTagline || 'Forging new paths to the peak of innovation.';
  
  return {
    title: siteName,
    description: siteTagline,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${headlineFont.variable} ${bodyFont.variable} font-body antialiased`}
      >
        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
