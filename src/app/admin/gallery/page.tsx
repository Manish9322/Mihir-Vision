'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { galleryData } from '@/lib/data';
import { PlusCircle, Trash2, ArrowUp, ArrowDown, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const ITEMS_PER_PAGE = 3;

const GalleryAdminPage = () => {
    const { toast } = useToast();
    const [images, setImages] = useState(galleryData.images);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);
    const paginatedImages = images.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

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
        setImages(newImages);
    };

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
                        <Card>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]"></TableHead>
                                        <TableHead className="w-[150px]">Image</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Upload New</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedImages.map((image, index) => (
                                        <TableRow key={image.id}>
                                            <TableCell className="text-center align-middle">
                                                <div className="flex flex-col items-center gap-1">
                                                     <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => handleMove(index, 'up')}
                                                        disabled={(currentPage - 1) * ITEMS_PER_PAGE + index === 0}
                                                    >
                                                        <ArrowUp className="h-4 w-4" />
                                                    </Button>
                                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => handleMove(index, 'down')}
                                                        disabled={(currentPage - 1) * ITEMS_PER_PAGE + index === images.length - 1}
                                                    >
                                                        <ArrowDown className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="relative aspect-video w-32 rounded-md overflow-hidden">
                                                    <Image src={image.imageUrl} alt={image.description} fill className="object-cover" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Input defaultValue={image.description} />
                                            </TableCell>
                                            <TableCell>
                                                <Input type="file" />
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
                             <div className="flex items-center justify-between border-t p-4">
                                <div className="text-xs text-muted-foreground">
                                    Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedImages.length}</strong> of <strong>{images.length}</strong> images
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        <span className="sr-only">Previous</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <span className="sr-only">Next</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
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
