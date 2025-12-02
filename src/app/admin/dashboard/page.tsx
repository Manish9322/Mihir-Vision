'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  aboutData,
  heroData,
  activitiesData,
} from '@/lib/data';
import { PlusCircle, Trash2 } from 'lucide-react';
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

const AboutForm = ({ handleSubmit }: { handleSubmit: (e: React.FormEvent, section: string) => void }) => (
    <Card>
        <CardHeader>
            <CardTitle>About Section</CardTitle>
            <CardDescription>
                Edit the content of the about section.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={(e) => handleSubmit(e, 'About')} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="about-title">Title</Label>
                    <Input id="about-title" defaultValue={aboutData.title} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="about-p1">Paragraph 1</Label>
                    <Textarea id="about-p1" defaultValue={aboutData.paragraph1} rows={4} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="about-p2">Paragraph 2</Label>
                    <Textarea id="about-p2" defaultValue={aboutData.paragraph2} rows={4} />
                </div>
                <div className="space-y-2">
                    <Label>Image</Label>
                    <Card className='p-2'>
                        <div className="relative aspect-[4/3] w-full max-w-sm rounded-md overflow-hidden">
                            <Image src={aboutData.image.imageUrl} alt="About section image" fill className='object-cover' />
                        </div>
                        <Input type="file" className="mt-2" />
                    </Card>
                </div>
                <Button type="submit">Save Changes</Button>
            </form>
        </CardContent>
    </Card>
);

const ActivitiesForm = ({ handleSubmit }: { handleSubmit: (e: React.FormEvent, section: string) => void }) => (
     <Card>
        <CardHeader>
            <CardTitle>Activities Section</CardTitle>
            <CardDescription>
                Manage the items in the "What We Do" section.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={(e) => handleSubmit(e, 'Activities')} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="activities-title">Section Title</Label>
                    <Input id="activities-title" defaultValue={activitiesData.title} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="activities-subheadline">Section Subheadline</Label>
                    <Textarea id="activities-subheadline" defaultValue={activitiesData.subheadline} />
                </div>
                <div className="space-y-4">
                    <Label>Activities</Label>
                    {activitiesData.activities.map((activity, index) => (
                        <Card key={index} className="p-4">
                            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                                <div className="space-y-2">
                                    <Label htmlFor={`activity-title-${index}`}>Title</Label>
                                    <Input id={`activity-title-${index}`} defaultValue={activity.title} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`activity-desc-${index}`}>Description</Label>
                                    <Input id={`activity-desc-${index}`} defaultValue={activity.description} />
                                </div>
                                <div className="flex items-end">
                                     <Button variant="outline" size="icon">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                    <Button variant="outline" className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Activity
                    </Button>
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
            case 'about':
                return <AboutForm handleSubmit={handleSubmit} />;
            case 'activities':
                return <ActivitiesForm handleSubmit={handleSubmit} />;
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
