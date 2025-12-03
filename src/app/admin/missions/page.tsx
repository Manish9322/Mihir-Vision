'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { futureMissionsData } from '@/lib/data';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlusCircle, Trash2, MoreHorizontal, FilePenLine, Eye, ChevronLeft, ChevronRight, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

type Mission = {
    image: ImagePlaceholder;
    title: string;
    description: string;
    tags: string[];
};

const ITEMS_PER_PAGE = 3;

const MissionForm = ({ mission, onSave }: { mission?: Mission | null, onSave: (mission: Mission) => void }) => {
    const [title, setTitle] = useState(mission?.title || '');
    const [description, setDescription] = useState(mission?.description || '');
    const [tags, setTags] = useState(mission?.tags?.join(', ') || '');
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newMission: Mission = {
            title,
            description,
            tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
            image: mission?.image || futureMissionsData.missions[0].image, // Placeholder
        };
        onSave(newMission);
        toast({
            title: `Project ${mission ? 'Updated' : 'Created'}`,
            description: `The project "${title}" has been saved.`,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label>Project Image</Label>
                <div className="flex items-center gap-4">
                    <Image src={mission?.image.imageUrl || 'https://placehold.co/150x100'} alt={mission?.title || 'New Mission'} width={150} height={100} className="rounded-md object-cover aspect-video" />
                    <Input type="file" className="max-w-xs" />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Project</Button>
            </DialogFooter>
        </form>
    )
}

const ViewMissionDialog = ({ mission, open, onOpenChange }: { mission: Mission | null; open: boolean; onOpenChange: (open: boolean) => void; }) => {
    if (!mission) return null;

    return (
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{mission.title}</DialogTitle>
                    <DialogDescription>Viewing project details.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="relative aspect-video w-full rounded-md overflow-hidden mt-4">
                        <Image src={mission.image.imageUrl} alt={mission.title} fill className="object-cover" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">{mission.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {mission.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
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


const MissionsAdminPage = () => {
    const { toast } = useToast();
    const [missions, setMissions] = useState<Mission[]>(futureMissionsData.missions);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const totalPages = Math.ceil(missions.length / ITEMS_PER_PAGE);
    const paginatedMissions = missions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const newMissions = [...missions];
        const item = newMissions[fullIndex];

        if (direction === 'up' && fullIndex > 0) {
            newMissions.splice(fullIndex, 1);
            newMissions.splice(fullIndex - 1, 0, item);
        } else if (direction === 'down' && fullIndex < newMissions.length - 1) {
            newMissions.splice(fullIndex, 1);
            newMissions.splice(fullIndex + 1, 0, item);
        }
        setMissions(newMissions);
        toast({ title: 'Project reordered successfully!' });
    };

    const handleAddClick = () => {
        setSelectedMission(null);
        setEditingIndex(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (mission: Mission, index: number) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        setSelectedMission(mission);
        setEditingIndex(fullIndex);
        setIsFormOpen(true);
    };

    const handleViewClick = (mission: Mission) => {
        setSelectedMission(mission);
        setIsViewOpen(true);
    };

    const handleDelete = (index: number) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const newMissions = missions.filter((_, i) => i !== fullIndex);
        setMissions(newMissions);
        toast({
            variant: "destructive",
            title: "Project Deleted",
            description: "The project has been removed.",
        });
    };
    
    const handleSave = (mission: Mission) => {
        if (editingIndex !== null) {
            const newMissions = [...missions];
            newMissions[editingIndex] = mission;
            setMissions(newMissions);
        } else {
            setMissions([mission, ...missions]);
        }
        setIsFormOpen(false);
    };


    return (
        <>
            <Card>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Featured Projects</CardTitle>
                        <CardDescription>Manage the content of the "Featured Projects" section.</CardDescription>
                    </div>
                    <Button onClick={handleAddClick}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Project
                    </Button>
                </CardHeader>
                <CardContent>
                    <Card className="border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead className="w-[120px] hidden md:table-cell">Image</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead className="hidden sm:table-cell">Description</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedMissions.length > 0 ? paginatedMissions.map((mission, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="text-center align-middle">
                                            <div className="flex flex-col items-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'up')} disabled={(currentPage - 1) * ITEMS_PER_PAGE + index === 0}>
                                                    <ArrowUp className="h-4 w-4" />
                                                </Button>
                                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'down')} disabled={(currentPage - 1) * ITEMS_PER_PAGE + index === missions.length - 1}>
                                                    <ArrowDown className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Image src={mission.image.imageUrl} alt={mission.title} width={100} height={60} className="rounded-md object-cover aspect-video" />
                                        </TableCell>
                                        <TableCell className="font-medium">{mission.title}</TableCell>
                                        <TableCell className="hidden sm:table-cell text-muted-foreground truncate max-w-xs">{mission.description}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleViewClick(mission)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleEditClick(mission, index)}>
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
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">No projects found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <div className="flex items-center justify-between border-t p-4">
                            <div className="text-xs text-muted-foreground">
                                Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedMissions.length}</strong> of <strong>{missions.length}</strong> projects
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
                        <DialogTitle>{selectedMission ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                        <DialogDescription>
                            {selectedMission ? 'Make changes to this project.' : 'Fill out the details for the new project.'}
                        </DialogDescription>
                    </DialogHeader>
                    <MissionForm mission={selectedMission} onSave={handleSave} />
                </DialogContent>
            </Dialog>

            <ViewMissionDialog mission={selectedMission} open={isViewOpen} onOpenChange={setIsViewOpen} />
        </>
    );
}

export default MissionsAdminPage;
