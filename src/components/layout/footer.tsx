
import Link from 'next/link';
import { Mountain } from 'lucide-react';
import { MONGODB_URI } from '@/config/config';

type SocialLink = {
  platform: string;
  url: string;
};

type ProfileData = {
  fullName: string;
  email: string;
  socialLinks: SocialLink[];
};

type FooterData = {
  companyName: string;
  quote: string;
};

async function getProfileData(): Promise<ProfileData | null> {
  if (!MONGODB_URI) {
    console.error('MongoDB URI is not configured, skipping fetch for Profile data.');
    return null;
  }
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? `https://` + process.env.NEXT_PUBLIC_VERCEL_URL
      : 'http://localhost:9002';
      
    const res = await fetch(`${baseUrl}/api/profile`, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Failed to fetch profile data: ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error('An error occurred while fetching profile data:', error);
    return null;
  }
}

async function getSettingsData(): Promise<FooterData | null> {
    if (!MONGODB_URI) {
        return null;
    }
    try {
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? `https://` + process.env.NEXT_PUBLIC_VERCEL_URL
            : 'http://localhost:9002';
        const res = await fetch(`${baseUrl}/api/settings`, { cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();
        return { companyName: data.siteName, quote: data.siteTagline };
    } catch (error) {
        return null;
    }
}


export default async function Footer() {
  const profileData = await getProfileData();
  const settingsData = await getSettingsData();
  
  const companyName = settingsData?.companyName || 'Pinnacle Pathways';
  const quote = settingsData?.quote || 'The best way to predict the future is to create it.';
  const socialLinks = profileData?.socialLinks || [];

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Mountain className="h-6 w-6" />
            <span className="font-bold font-headline">{companyName}</span>
          </div>
          <p className="text-sm text-center md:text-left text-muted-foreground italic">&quot;{quote}&quot;</p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <Link key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
                {social.platform}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
