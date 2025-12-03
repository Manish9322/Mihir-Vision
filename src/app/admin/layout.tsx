import Link from 'next/link';
import {
  Home,
  LayoutDashboard,
  PanelLeft,
  Settings,
  Image as ImageIcon,
  BookText,
  LineChart,
  Rocket,
  Milestone,
  Users,
  HelpCircle,
  User,
  LogOut,
  Clapperboard,
  GalleryHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/dashboard?page=hero", icon: ImageIcon, label: "Hero" },
    { href: "/admin/about", icon: BookText, label: "About" },
    { href: "/admin/activities", icon: Settings, label: "Activities" },
    { href: "/admin/missions", icon: Rocket, label: "Missions" },
    { href: "/admin/timeline", icon: Milestone, label: "Timeline" },
    { href: "/admin/videos", icon: Clapperboard, label: "Videos"},
    { href: "/admin/gallery", icon: GalleryHorizontal, label: "Gallery"},
    { href: "/admin/faq", icon: HelpCircle, label: "FAQs" },
    { href: "/admin/contacts", icon: Users, label: "Contacts" },
    { href: "/admin/profile", icon: User, label: "Profile" },
    { href: "#", icon: LineChart, label: "Stats" },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-16 items-center border-b px-6">
            <Link
                href="/"
                className="flex items-center gap-2 font-semibold"
            >
                <Home className="h-6 w-6" />
                <span></span>
            </Link>
        </div>
        <div className="flex flex-col justify-between flex-1">
            <nav className="flex-1 space-y-2 p-4">
                {navItems.map(item => (
                     <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className="mt-auto p-4 border-t">
                 <nav className="space-y-1">
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                     <Link
                        href="/admin/login"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-destructive transition-all hover:text-primary"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Link>
                </nav>
            </div>
        </div>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Home className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Pinnacle Pathways</span>
                </Link>
                {navItems.map(item => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                    <Avatar>
                        <AvatarImage src="https://picsum.photos/seed/admin/32/32" alt="@shadcn" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/admin/profile">Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/admin/settings">Settings</Link></DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/admin/login">Logout</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
        </main>
      </div>
    </div>
  );
}
