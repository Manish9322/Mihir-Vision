
'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import type { VideoInfo } from '@/lib/video-data';
import { PlusCircle, Trash2, ArrowUp, ArrowDown, GripVertical, ChevronLeft, ChevronRight, MoreHorizontal, Eye, FilePenLine, Loader2, Clapperboard, EyeOff, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useGetVideosDataQuery, useUpdateVideosDataMutation, useAddActionLogMutation, useUploadImageMutation } from '@/services/api';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 3;

const VideosAdminSkeleton = () => (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-16" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-16" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-16" /></CardContent></Card>
        </div>
        <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </div>
                <Skeleton className="h-10 w-36" />
            </CardHeader>
            <CardContent>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead className="w-[120px] hidden md:table-cell">Thumbnail</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead className="hidden sm:table-cell">Subtitle</TableHead>
                                <TableHead className="w-[100px]">Visible</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-12 w-6 mx-auto" /></TableCell>
                                    <TableCell className="hidden md:table-cell"><Skeleton className="h-16 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-11" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex items-center justify-between border-t p-4">
                        <Skeleton className="h-5 w-40" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                        </div>
                    </div>
                </Card>
            </CardContent>
        </Card>
    </div>
);


const VideoForm = ({ video, onSave, onThumbnailChange, onVideoChange, thumbnailPreview }: { video?: VideoInfo | null, onSave: (video: Partial<VideoInfo>) => void, onThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void, thumbnailPreview: string | null }) => {
    const [title, setTitle] = useState(video?.title || '');
    const [subtitle, setSubtitle] = useState(video?.subtitle || '');
    const [duration, setDuration] = useState(video?.duration || '');
    const { toast } = useToast();

    const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onVideoChange(e);
        const file = e.target.files?.[0];
        if (file) {
            const videoElement = document.createElement('video');
            videoElement.preload = 'metadata';
            videoElement.onloadedmetadata = () => {
                window.URL.revokeObjectURL(videoElement.src);
                const videoDuration = Math.round(videoElement.duration);
                const minutes = Math.floor(videoDuration / 60);
                const seconds = videoDuration % 60;
                setDuration(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
            };
            videoElement.src = URL.createObjectURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newVideo: Partial<VideoInfo> = {
            id: video?.id || `vid${Date.now()}`,
            title,
            subtitle,
            duration,
            isVisible: video?.isVisible ?? true,
        };
        onSave(newVideo);
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
                    <Image src={thumbnailPreview || video?.thumbnail.imageUrl || 'https://placehold.co/150x100'} alt={video?.title || 'New Video'} width={150} height={100} className="rounded-md object-cover aspect-video" />
                    <Input type="file" className="max-w-xs" onChange={onThumbnailChange} accept="image/*" />
                </div>
            </div>
             <div className="space-y-2">
                <Label>Video File</Label>
                <Input type="file" onChange={handleVideoFileChange} accept="video/*" />
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
                        <video src={video.videoUrl} controls poster={video.thumbnail.imageUrl} className="w-full h-full" />
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
    const [addActionLog] = useAddActionLogMutation();
    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

    
    const [currentPage, setCurrentPage] = useState(1);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<VideoInfo | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);


    const totalPages = Math.ceil(videos.length / ITEMS_PER_PAGE);
    const paginatedVideos = videos.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    
    const stats = useMemo(() => ({
        total: videos.length,
        visible: videos.filter(v => v.isVisible).length,
        hidden: videos.filter(v => !v.isVisible).length,
    }), [videos]);

    const triggerUpdate = async (updatedItems: VideoInfo[], actionLog: Omit<Parameters<typeof addActionLog>[0], 'user' | 'section'>) => {
        try {
            await updateVideos(updatedItems).unwrap();
            await addActionLog({
                user: 'Admin User',
                section: 'Videos',
                ...actionLog,
            }).unwrap();
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
        const newVideos = [...videos];
        const item = newVideos[fullIndex];
        
        if (direction === 'up' && fullIndex > 0) {
            newVideos.splice(fullIndex, 1);
            newVideos.splice(fullIndex - 1, 0, item);
        } else if (direction === 'down' && fullIndex < newVideos.length - 1) {
            newVideos.splice(fullIndex, 1);
            newVideos.splice(fullIndex + 1, 0, item);
        }
        triggerUpdate(newVideos, { action: `reordered videos`, type: 'UPDATE' });
    };

    const handleAddClick = () => {
        setSelectedVideo(null);
        setEditingIndex(null);
        setThumbnailFile(null);
        setThumbnailPreview(null);
        setVideoFile(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (video: VideoInfo, index: number) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        setSelectedVideo(video);
        setEditingIndex(fullIndex);
        setThumbnailFile(null);
        setThumbnailPreview(null);
        setVideoFile(null);
        setIsFormOpen(true);
    };

    const handleViewClick = (video: VideoInfo) => {
        setSelectedVideo(video);
        setIsViewOpen(true);
    };

    const handleDelete = (index: number) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const deletedVideo = videos[fullIndex];
        const newVideos = videos.filter((_, i) => i !== fullIndex);
        triggerUpdate(newVideos, { action: `deleted video "${deletedVideo.title}"`, type: 'DELETE' });
        toast({
            variant: "destructive",
            title: "Video Deleted",
            description: "The video clip has been removed.",
        });
    };
    
    const handleSave = async (videoData: Partial<VideoInfo>) => {
        let finalData = { ...videoData };
        let action: string, type: 'CREATE' | 'UPDATE';

        try {
            if (thumbnailFile) {
                const uploadResult = await uploadImage(thumbnailFile).unwrap();
                finalData.thumbnail = {
                    id: `thumb_${finalData.id}`,
                    imageUrl: uploadResult.url,
                    description: `${finalData.title} thumbnail`,
                    imageHint: 'video thumbnail'
                };
            } else if (selectedVideo) {
                finalData.thumbnail = selectedVideo.thumbnail;
            }

            if (videoFile) {
                const uploadResult = await uploadImage(videoFile).unwrap();
                finalData.videoUrl = uploadResult.url;
            } else if (selectedVideo) {
                finalData.videoUrl = selectedVideo.videoUrl;
            }

            if (!finalData.thumbnail || !finalData.videoUrl) {
                throw new Error("Thumbnail and video URL are required.");
            }

            let newItems: VideoInfo[];

            if (editingIndex !== null) {
                newItems = [...videos];
                newItems[editingIndex] = finalData as VideoInfo;
                action = `updated video "${finalData.title}"`;
                type = 'UPDATE';
            } else {
                newItems = [finalData as VideoInfo, ...videos];
                action = `created video "${finalData.title}"`;
                type = 'CREATE';
            }
            await triggerUpdate(newItems, { action, type });
            
            setIsFormOpen(false);
            setThumbnailFile(null);
            setThumbnailPreview(null);
            setVideoFile(null);
        } catch (error) {
            console.error('Save failed:', error);
            toast({
                variant: 'destructive',
                title: 'Save Failed',
                description: `There was an error saving the video. ${error.message || ''}`,
            });
        }
    };
    
    const handleVisibilityChange = (index: number, isVisible: boolean) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const newItems = videos.map((item, i) => {
            if (i === fullIndex) {
                return { ...item, isVisible };
            }
            return item;
        });
        const video = videos[fullIndex];
        triggerUpdate(newItems, { action: `set visibility of video "${video.title}" to ${isVisible}`, type: 'UPDATE' });
    }

    if (isQueryLoading) {
        return <VideosAdminSkeleton />;
    }
    
    if (isError) {
        return (
            <Card className="flex flex-col items-center justify-center p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <CardTitle className="text-xl text-destructive">Error Loading Data</CardTitle>
                <CardDescription className="mt-2">
                    There was a problem fetching the content for the Videos page. Please try refreshing the page.
                </CardDescription>
            </Card>
        );
    }


    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                        <Clapperboard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Visible Videos</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.visible}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hidden Videos</CardTitle>
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.hidden}</div>
                    </CardContent>
                </Card>
            </div>
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
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'down')} disabled={isMutationLoading || (currentPage - 1) * ITEMS_PER_PAGE + index === videos.length - 1}>
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
                         {(isMutationLoading || isUploading) && (
                            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        )}
                            <div className="flex items-center justify-between border-t p-4">
                            <div className="text-xs text-muted-foreground">
                                Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedVideos.length}</strong> of <strong>{videos.length}</strong> videos
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
                    <VideoForm 
                        video={selectedVideo} 
                        onSave={handleSave} 
                        onThumbnailChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setThumbnailFile(file);
                                const reader = new FileReader();
                                reader.onloadend = () => setThumbnailPreview(reader.result as string);
                                reader.readAsDataURL(file);
                            }
                        }}
                        onVideoChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setVideoFile(file);
                        }}
                        thumbnailPreview={thumbnailPreview}
                    />
                </DialogContent>
            </Dialog>

            <ViewVideoDialog video={selectedVideo} open={isViewOpen} onOpenChange={setIsViewOpen} />
        </div>
    );
}

export default VideosAdminPage;
