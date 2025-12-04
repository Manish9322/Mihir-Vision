
'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlusCircle, Trash2, ArrowUp, ArrowDown, GripVertical, ChevronLeft, ChevronRight, MoreHorizontal, Eye, FilePenLine, Loader2, GalleryHorizontal, EyeOff, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useGetGalleryDataQuery, useUpdateGalleryDataMutation, useAddActionLogMutation } from '@/services/api';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';

interface GalleryImage extends ImagePlaceholder {
    _id?: string;
    isVisible: boolean;
}

const ITEMS_PER_PAGE = 3;

const GalleryAdminSkeleton = () => (
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
                <Skeleton className="h-10 w-32" />
            </CardHeader>
            <CardContent>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead className="w-[150px] hidden md:table-cell">Image</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-[100px]">Visible</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-12 w-6 mx-auto" /></TableCell>
                                    <TableCell className="hidden md:table-cell"><Skeleton className="h-16 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
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


const ImageForm = ({ image, onSave }: { image?: GalleryImage | null, onSave: (image: Omit<GalleryImage, '_id'>) => void }) => {
    const [description, setDescription] = useState(image?.description || '');
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newImage: Omit<GalleryImage, '_id'> = {
            id: image?.id || `new_${Date.now()}`,
            description,
            imageUrl: image?.imageUrl || 'https://placehold.co/600x400', // Placeholder
            imageHint: image?.imageHint || 'placeholder',
            isVisible: image?.isVisible ?? true,
        };
        onSave(newImage);
        toast({
            title: `Image ${image ? 'Updated' : 'Created'}`,
            description: `The image has been saved.`,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
             <div className="space-y-2">
                <Label>Image</Label>
                <div className="flex items-center gap-4">
                    <Image src={image?.imageUrl || 'https://placehold.co/150x100'} alt={image?.description || 'New Image'} width={150} height={100} className="rounded-md object-cover aspect-video" />
                    <Input type="file" className="max-w-xs" />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Image</Button>
            </DialogFooter>
        </form>
    )
}

const ViewImageDialog = ({ image, open, onOpenChange }: { image: GalleryImage | null; open: boolean; onOpenChange: (open: boolean) => void; }) => {
    if (!image) return null;

    return (
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>View Image</DialogTitle>
                    <DialogDescription>{image.description}</DialogDescription>
                </DialogHeader>
                <div className="relative aspect-video w-full rounded-md overflow-hidden mt-4">
                    <Image src={image.imageUrl} alt={image.description} fill className="object-cover" />
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


const GalleryAdminPage = () => {
    const { toast } = useToast();
    const { data: images = [], isLoading: isQueryLoading, isError } = useGetGalleryDataQuery();
    const [updateGallery, { isLoading: isMutationLoading }] = useUpdateGalleryDataMutation();
    const [addActionLog] = useAddActionLogMutation();

    const [currentPage, setCurrentPage] = useState(1);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);
    const paginatedImages = images.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    
    const stats = useMemo(() => ({
        total: images.length,
        visible: images.filter(img => img.isVisible).length,
        hidden: images.filter(img => !img.isVisible).length,
    }), [images]);

    const triggerUpdate = async (updatedItems: GalleryImage[], actionLog: Omit<Parameters<typeof addActionLog>[0], 'user' | 'section'>) => {
        try {
            await updateGallery(updatedItems).unwrap();
            await addActionLog({
                user: 'Admin User',
                section: 'Gallery',
                ...actionLog,
            }).unwrap();
            toast({
                title: 'Content Saved',
                description: 'Gallery section has been updated successfully.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Save Failed',
                description: 'There was an error saving the gallery.',
            });
        }
    };


    const handleMove = (index: number, direction: 'up' | 'down') => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const newImages = [...images];
        const item = newImages[fullIndex];

        if (direction === 'up' && fullIndex > 0) {
            newImages.splice(fullIndex, 1);
            newImages.splice(fullIndex - 1, 0, item);
        } else if (direction === 'down' && fullIndex < newImages.length - 1) {
            newImages.splice(fullIndex, 1);
            newImages.splice(fullIndex + 1, 0, item);
        }
        triggerUpdate(newImages, { action: `reordered images`, type: 'UPDATE' });
    };

    const handleAddClick = () => {
        setSelectedImage(null);
        setEditingIndex(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (image: GalleryImage, index: number) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        setSelectedImage(image);
        setEditingIndex(fullIndex);
        setIsFormOpen(true);
    };

    const handleViewClick = (image: GalleryImage) => {
        setSelectedImage(image);
        setIsViewOpen(true);
    };

    const handleDelete = (index: number) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const deletedImage = images[fullIndex];
        const newImages = images.filter((_, i) => i !== fullIndex);
        triggerUpdate(newImages, { action: `deleted image "${deletedImage.description}"`, type: 'DELETE' });
        toast({
            variant: "destructive",
            title: "Image Deleted",
            description: "The image has been removed from the gallery.",
        });
    };
    
    const handleSave = (image: Omit<GalleryImage, '_id'>) => {
        let newItems: GalleryImage[];
        let action: string, type: 'CREATE' | 'UPDATE';

        if (editingIndex !== null) {
            newItems = [...images];
            newItems[editingIndex] = { ...images[editingIndex], ...image } as GalleryImage;
            action = `updated image "${image.description}"`;
            type = 'UPDATE';
        } else {
            newItems = [image as GalleryImage, ...images];
            action = `created image "${image.description}"`;
            type = 'CREATE';
        }
        triggerUpdate(newItems, { action, type });
        setIsFormOpen(false);
    };

    const handleVisibilityChange = (index: number, isVisible: boolean) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const newItems = images.map((item, i) => {
            if (i === fullIndex) {
                return { ...item, isVisible };
            }
            return item;
        });
        const image = images[fullIndex];
        triggerUpdate(newItems, { action: `set visibility of image "${image.description}" to ${isVisible}`, type: 'UPDATE' });
    }

    if (isQueryLoading) {
        return <GalleryAdminSkeleton />;
    }
    
    if (isError) {
        return (
            <Card className="flex flex-col items-center justify-center p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <CardTitle className="text-xl text-destructive">Error Loading Data</CardTitle>
                <CardDescription className="mt-2">
                    There was a problem fetching the content for the Gallery page. Please try refreshing the page.
                </CardDescription>
            </Card>
        );
    }


    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Images</CardTitle>
                        <GalleryHorizontal className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Visible Images</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.visible}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hidden Images</CardTitle>
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
                        <CardTitle>Screenshot Gallery Section</CardTitle>
                        <CardDescription>Manage the images in the screenshot gallery.</CardDescription>
                    </div>
                     <Button onClick={handleAddClick} disabled={isMutationLoading}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Image
                    </Button>
                </CardHeader>
                <CardContent>
                    <Card className="relative">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead className="w-[150px] hidden md:table-cell">Image</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="w-[100px]">Visible</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedImages.map((image, index) => (
                                    <TableRow key={image.id}>
                                        <TableCell className="text-center align-middle">
                                            <div className="flex flex-col items-center gap-1">
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'up')} disabled={isMutationLoading || (currentPage - 1) * ITEMS_PER_PAGE + index === 0}>
                                                    <ArrowUp className="h-4 w-4" />
                                                </Button>
                                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'down')} disabled={isMutationLoading || (currentPage - 1) * ITEMS_PER_PAGE + index === images.length - 1}>
                                                    <ArrowDown className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Image src={image.imageUrl} alt={image.description} width={120} height={67.5} className="rounded-md object-cover aspect-video" />
                                        </TableCell>
                                        <TableCell className="font-medium">{image.description}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={image.isVisible}
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
                                                    <DropdownMenuItem onClick={() => handleViewClick(image)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleEditClick(image, index)}>
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
                                Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedImages.length}</strong> of <strong>{images.length}</strong> images
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
                        <DialogTitle>{selectedImage ? 'Edit Image' : 'Add New Image'}</DialogTitle>
                        <DialogDescription>
                            {selectedImage ? 'Make changes to this gallery image.' : 'Upload a new image for the gallery.'}
                        </DialogDescription>
                    </DialogHeader>
                    <ImageForm image={selectedImage} onSave={handleSave} />
                </DialogContent>
            </Dialog>

            <ViewImageDialog image={selectedImage} open={isViewOpen} onOpenChange={setIsViewOpen} />
        </div>
    );
}

export default GalleryAdminPage;
