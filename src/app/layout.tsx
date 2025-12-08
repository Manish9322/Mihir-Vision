
import type { Metadata, ResolvingMetadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Manrope, Inter } from 'next/font/google';
import { StoreProvider } from '@/store/provider';

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

async function getSettings() {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:9002';
    const res = await fetch(`${baseUrl}/api/settings`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return null;
  }
}

export async function generateMetadata(
  {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const settings = await getSettings();
  const previousIcons = (await parent).icons || {}

  return {
    title: settings?.siteName || 'Mihir Vision',
    description: settings?.siteTagline || 'Forging new paths to the peak of innovation.',
    icons: {
      icon: settings?.faviconUrl || previousIcons.icon,
    },
  }
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
