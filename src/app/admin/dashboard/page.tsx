'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  heroData,
} from '@/lib/data';
import Image from 'next/image';

const HeroForm = ({ handleSubmit }: { handleSubmit: (e: React.FormEvent, section: string) => void }) => (
    <Card>
        <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>
                Manage the content of the hero section on your homepage.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={(e) => handleSubmit(e, 'Hero')} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="hero-headline">Headline</Label>
                    <Input id="hero-headline" defaultValue={heroData.headline} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="hero-subheadline">Subheadline</Label>
                    <Textarea id="hero-subheadline" defaultValue={heroData.subheadline} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="hero-cta">Call to Action Button</Label>
                    <Input id="hero-cta" defaultValue={heroData.cta} />
                </div>
                <div className="space-y-2">
                    <Label>Background Image</Label>
                    <Card className='p-2'>
                        <div className="relative aspect-video w-full max-w-sm rounded-md overflow-hidden">
                            <Image src={heroData.image.imageUrl} alt="Hero background" fill className='object-cover' />
                        </div>
                        <Input type="file" className="mt-2" />
                        <p className="text-xs text-muted-foreground mt-1">For demonstration purposes, image uploads are not functional.</p>
                    </Card>
                </div>
                <Button type="submit">Save Changes</Button>
            </form>
        </CardContent>
    </Card>
);

const AdminDashboardPage = ({
    searchParams,
}: {
    searchParams: { page: string };
}) => {
    const { toast } = useToast();
    const currentPage = searchParams.page || 'dashboard';

    const handleSubmit = (e: React.FormEvent, section: string) => {
        e.preventDefault();
        toast({
            title: `Content Saved`,
            description: `${section} section has been updated.`,
        });
    };

    const renderContent = () => {
        switch (currentPage) {
            case 'hero':
                return <HeroForm handleSubmit={handleSubmit} />;
            case 'dashboard':
            default:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome to the Admin Dashboard</CardTitle>
                            <CardDescription>Select a section from the sidebar to manage your website's content.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>This is the central hub for all your content management needs.</p>
                        </CardContent>
                    </Card>
                );
        }
    }

    return (
       <div>
         {renderContent()}
       </div>
    );
};

export default AdminDashboardPage;
