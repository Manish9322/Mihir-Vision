'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mountain } from 'lucide-react';
import { useGetSettingsDataQuery } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { data: settingsData, isLoading: isSettingsLoading } = useGetSettingsDataQuery();

  const siteName = settingsData?.siteName || 'Pinnacle Pathways';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would validate credentials against a backend.
    // Here, we'll just simulate a successful login.
    if (email && password) {
      toast({
        title: 'Login Successful',
        description: 'Redirecting to dashboard...',
      });
      // Simulate API call delay
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1000);
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Please enter both email and password.',
      });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <Mountain className="h-8 w-8" />
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
