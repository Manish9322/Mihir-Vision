'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { videoData, videoSectionData } from '@/lib/video-data';
import { PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';

const VideosAdminPage = () => {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: `Content Saved`,
            description: `Video clips section has been updated.`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Video Clips Section</CardTitle>
                <CardDescription>
                    Manage the content of the "Our Work" video section.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="videos-title">Section Title</Label>
                        <Input id="videos-title" defaultValue={videoSectionData.title} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="videos-subheadline">Section Subheadline</Label>
                        <Textarea id="videos-subheadline" defaultValue={videoSectionData.subheadline} />
                    </div>
                    <div className="space-y-4">
                        <Label>Video Clips</Label>
                        {videoData.map((video, index) => (
                            <Card key={index} className="p-4 space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor={`video-title-${index}`}>Title</Label>
                                        <Input id={`video-title-${index}`} defaultValue={video.title} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`video-subtitle-${index}`}>Subtitle</Label>
                                        <Input id={`video-subtitle-${index}`} defaultValue={video.subtitle} />
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor={`video-url-${index}`}>Video URL</Label>
                                        <Input id={`video-url-${index}`} defaultValue={video.videoUrl} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`video-duration-${index}`}>Duration</Label>
                                        <Input id={`video-duration-${index}`} defaultValue={video.duration} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Thumbnail Image</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative aspect-video w-32 rounded-md overflow-hidden">
                                            <Image src={video.thumbnail.imageUrl} alt={video.title} fill className="object-cover" />
                                        </div>
                                        <Input type="file" className="max-w-xs" />
                                        <Button variant="outline" size="icon">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        <Button variant="outline" className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Video Clip
                        </Button>
                    </div>
                    <Button type="submit">Save Changes</Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default VideosAdminPage;
