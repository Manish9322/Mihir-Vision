
'use client';
import Link from 'next/link';
import { Mountain } from 'lucide-react';
import { useGetProfileDataQuery, useGetSettingsDataQuery } from '@/services/api';

export default function Footer() {
  const { data: profileData } = useGetProfileDataQuery(undefined);
  const { data: settingsData } = useGetSettingsDataQuery(undefined);
  
  const companyName = settingsData?.siteName || 'Pinnacle Pathways';
  const socialLinks = profileData?.socialLinks || [];

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Mountain className="h-6 w-6" />
            <span className="font-bold font-headline">{companyName}</span>
          </div>
          <div className="flex items-center gap-4">
            {socialLinks.map((social: any) => (
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
