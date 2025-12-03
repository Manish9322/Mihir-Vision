'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import type { VideoInfo } from '@/lib/video-data';
import { PlusCircle, Trash2, ArrowUp, ArrowDown, GripVertical, ChevronLeft, ChevronRight, MoreHorizontal, Eye, FilePenLine, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useGetVideosDataQuery, useUpdateVideosDataMutation } from '@/services/api';
import { Switch } from '@/components/ui/switch';

const ITEMS_PER_PAGE = 3;

const VideoForm = ({ video, onSave, videoData }: { video?: VideoInfo | null, onSave: (video: VideoInfo) => void, videoData: VideoInfo[] }) => {
    const [title, setTitle] = useState(video?.title || '');
    const [subtitle, setSubtitle] = useState(video?.subtitle || '');
    const [duration, setDuration] = useState(video?.duration || '');
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newVideo: VideoInfo = {
            id: video?.id || `vid${Date.now()}`,
            title,
            subtitle,
            duration,
            thumbnail: video?.thumbnail || videoData[0].thumbnail, // Placeholder
            videoUrl: video?.videoUrl || videoData[0].videoUrl, // Placeholder
            isVisible: video?.isVisible ?? true,
        };
        onSave(newVideo);
        toast({
            title: `Video Clip ${video ? 'Updated' : 'Created'}`,
            description: `The video "${title}" has been saved.`,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 0:45" required />
            </div>
             <div className="space-y-2">
                <Label>Thumbnail Image</Label>
                <div className="flex items-center gap-4">
                    <Image src={video?.thumbnail.imageUrl || 'https://placehold.co/150x100'} alt={video?.title || 'New Video'} width={150} height={100} className="rounded-md object-cover aspect-video" />
                    <Input type="file" className="max-w-xs" />
                </div>
            </div>
             <div className="space-y-2">
                <Label>Video File</Label>
                <Input type="file" />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Video</Button>
            </DialogFooter>
        </form>
    )
}

const ViewVideoDialog = ({ video, open, onOpenChange }: { video: VideoInfo | null; open: boolean; onOpenChange: (open: boolean) => void; }) => {
    if (!video) return null;

    return (
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{video.title}</DialogTitle>
                    <DialogDescription>Viewing video clip details.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="relative aspect-video w-full rounded-md overflow-hidden mt-4">
                        <Image src={video.thumbnail.imageUrl} alt={video.title} fill className="object-cover" />
                    </div>
                    <div>
                        <p className="font-semibold">{video.subtitle}</p>
                        <p className="text-sm text-muted-foreground">Duration: {video.duration}</p>
                    </div>
                </div>
                 <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};


const VideosAdminPage = () => {
    const { toast } = useToast();
    const { data: videos = [], isLoading: isQueryLoading, isError } = useGetVideosDataQuery();
    const [updateVideos, { isLoading: isMutationLoading }] = useUpdateVideosDataMutation();
    const [items, setItems] = useState<VideoInfo[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<VideoInfo | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    useEffect(() => {
        if(videos) {
            setItems(videos);
        }
    }, [videos]);


    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const paginatedVideos = items.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const triggerUpdate = async (updatedItems: VideoInfo[]) => {
        try {
            await updateVideos(updatedItems).unwrap();
            toast({
                title: 'Content Saved',
                description: 'Videos section has been updated successfully.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Save Failed',
                description: 'There was an error saving the videos.',
            });
        }
    };


    const handleMove = (index: number, direction: 'up' | 'down') => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const newVideos = [...items];
        const item = newVideos[fullIndex];
        
        if (direction === 'up' && fullIndex > 0) {
            newVideos.splice(fullIndex, 1);
            newVideos.splice(fullIndex - 1, 0, item);
        } else if (direction === 'down' && fullIndex < newVideos.length - 1) {
            newVideos.splice(fullIndex, 1);
            newVideos.splice(fullIndex + 1, 0, item);
        }
        setItems(newVideos);
        triggerUpdate(newVideos);
    };

    const handleAddClick = () => {
        setSelectedVideo(null);
        setEditingIndex(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (video: VideoInfo, index: number) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        setSelectedVideo(video);
        setEditingIndex(fullIndex);
        setIsFormOpen(true);
    };

    const handleViewClick = (video: VideoInfo) => {
        setSelectedVideo(video);
        setIsViewOpen(true);
    };

    const handleDelete = (index: number) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const newVideos = items.filter((_, i) => i !== fullIndex);
        setItems(newVideos);
        triggerUpdate(newVideos);
        toast({
            variant: "destructive",
            title: "Video Deleted",
            description: "The video clip has been removed.",
        });
    };
    
    const handleSave = (video: VideoInfo) => {
        let newItems: VideoInfo[];
        if (editingIndex !== null) {
            newItems = [...items];
            newItems[editingIndex] = video;
        } else {
            newItems = [video, ...items];
        }
        setItems(newItems);
        triggerUpdate(newItems);
        setIsFormOpen(false);
    };
    
    const handleVisibilityChange = (index: number, isVisible: boolean) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const newItems = [...items];
        newItems[fullIndex].isVisible = isVisible;
        setItems(newItems);
        triggerUpdate(newItems);
    }

    if (isQueryLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    if (isError) {
        return <div>Error loading data. Please try again.</div>;
    }


    return (
        <>
            <Card>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Video Clips Section</CardTitle>
                        <CardDescription>Manage the content of the "Our Work" video section.</CardDescription>
                    </div>
                     <Button onClick={handleAddClick} disabled={isMutationLoading}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Video Clip
                    </Button>
                </CardHeader>
                <CardContent>
                    <Card className="relative">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead className="w-[120px] hidden md:table-cell">Thumbnail</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead className="hidden sm:table-cell">Subtitle</TableHead>
                                    <TableHead className="hidden md:table-cell">Duration</TableHead>
                                    <TableHead className="w-[100px]">Visible</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedVideos.map((video, index) => (
                                    <TableRow key={video.id}>
                                        <TableCell className="text-center align-middle">
                                            <div className="flex flex-col items-center gap-1">
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'up')} disabled={isMutationLoading || (currentPage - 1) * ITEMS_PER_PAGE + index === 0}>
                                                    <ArrowUp className="h-4 w-4" />
                                                </Button>
                                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'down')} disabled={isMutationLoading || (currentPage - 1) * ITEMS_PER_PAGE + index === items.length - 1}>
                                                    <ArrowDown className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Image src={video.thumbnail.imageUrl} alt={video.title} width={100} height={60} className="rounded-md object-cover aspect-video" />
                                        </TableCell>
                                        <TableCell className="font-medium">{video.title}</TableCell>
                                        <TableCell className="hidden sm:table-cell text-muted-foreground truncate max-w-xs">{video.subtitle}</TableCell>
                                        <TableCell className="hidden md:table-cell">{video.duration}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={video.isVisible}
                                                onCheckedChange={(checked) => handleVisibilityChange(index, checked)}
                                                disabled={isMutationLoading}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" disabled={isMutationLoading}>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleViewClick(video)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleEditClick(video, index)}>
                                                        <FilePenLine className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(index)}>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {isMutationLoading && (
                            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        )}
                            <div className="flex items-center justify-between border-t p-4">
                            <div className="text-xs text-muted-foreground">
                                Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedVideos.length}</strong> of <strong>{items.length}</strong> videos
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="sr-only">Previous</span>
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                                    <span className="sr-only">Next</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </CardContent>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{selectedVideo ? 'Edit Video Clip' : 'Add New Video Clip'}</DialogTitle>
                        <DialogDescription>
                            {selectedVideo ? 'Make changes to this video clip.' : 'Fill out the details for the new video clip.'}
                        </DialogDescription>
                    </DialogHeader>
                    <VideoForm video={selectedVideo} onSave={handleSave} videoData={videos} />
                </DialogContent>
            </Dialog>

            <ViewVideoDialog video={selectedVideo} open={isViewOpen} onOpenChange={setIsViewOpen} />
        </>
    );
}

export default VideosAdminPage;
