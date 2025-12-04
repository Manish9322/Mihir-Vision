
'use client';
import Link from 'next/link';
import {
  LayoutDashboard,
  PanelLeft,
  Settings,
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
  Handshake,
  Gamepad2,
  UsersRound,
  History
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ScrollArea } from '@/components/ui/scroll-area';


const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/stats", icon: LineChart, label: "Stats" },
    { href: "/admin/about", icon: BookText, label: "About" },
    { href: "/admin/clients", icon: Handshake, label: "Clients" },
    { href: "/admin/activities", icon: Settings, label: "Activities" },
    { href: "/admin/missions", icon: Rocket, label: "Projects" },
    { href: "/admin/games", icon: Gamepad2, label: "Games" },
    { href: "/admin/team", icon: UsersRound, label: "Team" },
    { href: "/admin/timeline", icon: Milestone, label: "Timeline" },
    { href: "/admin/videos", icon: Clapperboard, label: "Videos"},
    { href: "/admin/gallery", icon: GalleryHorizontal, label: "Gallery"},
    { href: "/admin/faq", icon: HelpCircle, label: "FAQs" },
    { href: "/admin/contacts", icon: Users, label: "Contacts" },
    { href: "/admin/history", icon: History, label: "History" },
    { href: "/admin/profile", icon: User, label: "Profile" },
]

function LogoutConfirmationDialog({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You will be redirected to the login page.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => router.push('/admin/login')}>Logout</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <Provider store={store}>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
          <div className="flex h-full flex-col">
              <ScrollArea className="flex-1 p-4 scrollbar-hide">
                  <nav className="space-y-2">
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
              </ScrollArea>
              <div className="mt-auto p-4 border-t">
                  <nav className="space-y-1">
                      <Link
                          href="/admin/settings"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                      >
                          <Settings className="h-4 w-4" />
                          Settings
                      </Link>
                      <LogoutConfirmationDialog>
                          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-destructive transition-all hover:text-primary text-sm">
                              <LogOut className="h-4 w-4" />
                              Logout
                          </button>
                      </LogoutConfirmationDialog>
                  </nav>
              </div>
          </div>
        </aside>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                  {navItems.map(item => (
                      <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setSheetOpen(false)}
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
              
            </div>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              {children}
          </main>
        </div>
      </div>
    </Provider>
  );
}

    