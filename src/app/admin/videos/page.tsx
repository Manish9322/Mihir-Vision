'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { videoData, videoSectionData } from '@/lib/video-data';
import { PlusCircle, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import Image from 'next/image';

const VideosAdminPage = () => {
    const { toast } = useToast();
    const [videos, setVideos] = useState(videoData);

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newVideos = [...videos];
        const item = newVideos[index];
        if (direction === 'up' && index > 0) {
            newVideos.splice(index, 1);
            newVideos.splice(index - 1, 0, item);
        } else if (direction === 'down' && index < newVideos.length - 1) {
            newVideos.splice(index, 1);
            newVideos.splice(index + 1, 0, item);
        }
        setVideos(newVideos);
    };

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
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]"></TableHead>
                                        <TableHead className="w-[100px]">Thumbnail</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Subtitle</TableHead>
                                        <TableHead>Video File</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {videos.map((video, index) => (
                                        <TableRow key={video.id}>
                                            <TableCell className="text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                     <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => handleMove(index, 'up')}
                                                        disabled={index === 0}
                                                    >
                                                        <ArrowUp className="h-4 w-4" />
                                                    </Button>
                                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => handleMove(index, 'down')}
                                                        disabled={index === videos.length - 1}
                                                    >
                                                        <ArrowDown className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="relative aspect-video w-24 rounded-md overflow-hidden">
                                                    <Image src={video.thumbnail.imageUrl} alt={video.title} fill className="object-cover" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <Input defaultValue={video.title} />
                                            </TableCell>
                                            <TableCell>
                                                <Input defaultValue={video.subtitle} />
                                            </TableCell>
                                            <TableCell>
                                                <Input type="file" />
                                            </TableCell>
                                            <TableCell>
                                                <Input defaultValue={video.duration} className="w-24"/>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                 <Button variant="outline" size="icon">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
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
