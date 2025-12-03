'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { galleryData } from '@/lib/data';
import { PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';

const GalleryAdminPage = () => {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: `Content Saved`,
            description: `Screenshot Gallery section has been updated.`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Screenshot Gallery Section</CardTitle>
                <CardDescription>
                    Manage the images in the screenshot gallery.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="gallery-title">Section Title</Label>
                        <Input id="gallery-title" defaultValue={galleryData.title} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gallery-subheadline">Section Subheadline</Label>
                        <Textarea id="gallery-subheadline" defaultValue={galleryData.subheadline} />
                    </div>
                    <div className="space-y-4">
                        <Label>Gallery Images</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {galleryData.images.map((image, index) => (
                                <Card key={index} className="p-4 space-y-4">
                                    <div className="relative aspect-video w-full rounded-md overflow-hidden">
                                        <Image src={image.imageUrl} alt={image.description} fill className="object-cover" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`image-desc-${index}`}>Description</Label>
                                        <Input id={`image-desc-${index}`} defaultValue={image.description} />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor={`image-file-${index}`}>Image File</Label>
                                        <Input id={`image-file-${index}`} type="file" />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button variant="outline" size="icon">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Image
                        </Button>
                    </div>
                    <Button type="submit">Save Changes</Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default GalleryAdminPage;
