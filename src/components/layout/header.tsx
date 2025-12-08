
'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useGetSettingsDataQuery } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#activities', label: 'Activities' },
  { href: '#growth', label: 'Growth' },
  { href: '#video-showcase', label: 'Our Work' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#projects', label: 'Projects' },
  { href: '#timeline', label: 'Timeline' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { data: settingsData, isLoading: isSettingsLoading } = useGetSettingsDataQuery(undefined);

  const siteName = settingsData?.siteName || 'Pinnacle Pathways';
  const siteLogoUrl = settingsData?.siteLogoUrl;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary/10 backdrop-blur supports-[backdrop-filter]:bg-primary/5">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 font-bold">
            {isSettingsLoading ? (
                <Skeleton className="h-8 w-8" />
            ) : siteLogoUrl ? (
                <Image src={siteLogoUrl} alt={siteName} width={32} height={32} />
            ) : (
                <Skeleton className="h-8 w-8" />
            )}
            <span className="hidden sm:inline-block font-headline">
              {isSettingsLoading ? <Skeleton className="h-5 w-32" /> : siteName}
            </span>
          </Link>
        </div>
        <nav className="hidden items-center justify-center gap-4 text-sm font-medium lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground/80 text-foreground/60">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-2">
          <ThemeToggle />
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b pb-4">
                  <Link href="/" className="flex items-center gap-2 font-bold" onClick={() => setSheetOpen(false)}>
                    {isSettingsLoading ? (
                        <Skeleton className="h-8 w-8" />
                    ) : siteLogoUrl ? (
                        <Image src={siteLogoUrl} alt={siteName} width={32} height={32} />
                    ) : (
                         <Skeleton className="h-8 w-8" />
                    )}
                    <span className="font-headline">
                      {isSettingsLoading ? <Skeleton className="h-5 w-32" /> : siteName}
                    </span>
                  </Link>
                </div>
                <nav className="flex flex-col gap-4 py-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="text-lg font-medium transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
