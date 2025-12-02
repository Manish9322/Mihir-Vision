import Link from 'next/link';
import { Mountain } from 'lucide-react';
import { footerData } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Mountain className="h-6 w-6" />
            <span className="font-bold font-headline">{footerData.companyName}</span>
          </div>
          <p className="text-sm text-muted-foreground italic">&quot;{footerData.quote}&quot;</p>
          <div className="flex items-center gap-4">
            {footerData.socials.map((social) => (
              <Link key={social.name} href={social.url} className="text-sm text-muted-foreground hover:text-foreground">
                {social.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {footerData.companyName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
