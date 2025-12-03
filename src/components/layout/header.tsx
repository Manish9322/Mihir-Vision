'use client';

import Link from 'next/link';
import { Mountain, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#activities', label: 'Activities' },
  { href: '#growth', label: 'Growth' },
  { href: '#video-showcase', label: 'Our Work' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#missions', label: 'Missions' },
  { href: '#timeline', label: 'Timeline' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Mountain className="h-6 w-6" />
            <span className="hidden sm:inline-block font-headline"></span>
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
                    <Mountain className="h-6 w-6" />
                    <span className="font-headline"></span>
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
