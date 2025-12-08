
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useGetSettingsDataQuery } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data: settingsData, isLoading: isSettingsLoading } = useGetSettingsDataQuery();

  const siteName = settingsData?.siteName || 'Mihir Vision';
  const siteLogoUrl = settingsData?.siteLogoUrl;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Hardcoded credentials check
    if (email === 'mihir-vision.vercel.app' && password === 'Mihir-Vision@2025') {
      
      // Simulate JWT creation and storage
      const tokenPayload = { user: email, role: 'admin', iat: Math.floor(Date.now() / 1000) };
      const simulatedToken = btoa(JSON.stringify(tokenPayload)); // Simple base64 encoding for simulation
      localStorage.setItem('admin-access-token', simulatedToken);

      toast({
        title: 'Login Successful',
        description: 'Redirecting to dashboard...',
      });
      
      // Redirect to the dashboard
      router.push('/admin/dashboard');

    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid username or password.',
      });
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            {isSettingsLoading ? (
                <Skeleton className="h-8 w-8" />
            ) : siteLogoUrl ? (
                <Image src={siteLogoUrl} alt={siteName} width={32} height={32} />
            ) : (
                <Skeleton className="h-8 w-8" />
            )}
             {isSettingsLoading ? (
                <Skeleton className="h-8 w-48" />
              ) : (
                <span className="text-2xl font-bold font-headline">{siteName}</span>
              )}
          </div>
          <CardTitle className="text-2xl">Admin Panel</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Username</Label>
              <Input
                id="email"
                type="text"
                placeholder="admin"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
