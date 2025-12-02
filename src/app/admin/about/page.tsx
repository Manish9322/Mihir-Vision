'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { aboutData } from '@/lib/data';
import Image from 'next/image';

const AboutAdminPage = () => {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: `Content Saved`,
            description: `About section has been updated.`,
        });
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>About Section</CardTitle>
                <CardDescription>
                    Edit the content of the about section.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
};

export default AboutAdminPage;
