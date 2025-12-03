'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlusCircle, Trash2, MoreHorizontal, FilePenLine, Eye, ChevronLeft, ChevronRight, GripVertical, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useGetProjectsDataQuery, useUpdateProjectsDataMutation } from '@/services/api';
import { Switch } from '@/components/ui/switch';

type Project = {
    _id?: string;
    image: ImagePlaceholder;
    title: string;
    slug: string;
    description: string;
    details: string;
    tags: string[];
    isVisible: boolean;
};

const ITEMS_PER_PAGE = 3;

const MissionForm = ({ project, onSave }: { project?: Project | null, onSave: (project: Omit<Project, '_id'>) => void }) => {
    const [title, setTitle] = useState(project?.title || '');
    const [description, setDescription] = useState(project?.description || '');
    const [details, setDetails] = useState(project?.details || '');
    const [tags, setTags] = useState(project?.tags?.join(', ') || '');
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newMission: Omit<Project, '_id'> = {
            title,
            slug: title.toLowerCase().replace(/\s+/g, '-'),
            description,
            details,
            tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
            image: project?.image || { id: 'placeholder', description: 'Placeholder', imageUrl: 'https://placehold.co/600x400', imageHint: 'placeholder' },
            isVisible: project?.isVisible ?? true,
        };
        onSave(newMission);
        toast({
            title: `Project ${project ? 'Updated' : 'Created'}`,
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
                <Label htmlFor="description">Short Description (for cards)</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="details">Full Details (for project page)</Label>
                <Textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} required rows={6}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label>Project Image</Label>
                <div className="flex items-center gap-4">
                    <Image src={project?.image.imageUrl || 'https://placehold.co/150x100'} alt={project?.title || 'New Mission'} width={150} height={100} className="rounded-md object-cover aspect-video" />
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

const ViewMissionDialog = ({ project, open, onOpenChange }: { project: Project | null; open: boolean; onOpenChange: (open: boolean) => void; }) => {
    if (!project) return null;

    return (
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{project.title}</DialogTitle>
                    <DialogDescription>Viewing project details.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="relative aspect-video w-full rounded-md overflow-hidden mt-4">
                        <Image src={project.image.imageUrl} alt={project.title} fill className="object-cover" />
                    </div>
                    <div>
                        <p className="font-semibold">Short Description</p>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                     <div>
                        <p className="font-semibold">Full Details</p>
                        <p className="text-sm text-muted-foreground">{project.details}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
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
    const { data: projects = [], isLoading: isQueryLoading, isError } = useGetProjectsDataQuery();
    const [updateProjects, { isLoading: isMutationLoading }] = useUpdateProjectsDataMutation();

    const [currentPage, setCurrentPage] = useState(1);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedMission, setSelectedMission] = useState<Project | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
    const paginatedMissions = projects.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const triggerUpdate = async (updatedItems: Project[]) => {
        try {
            await updateProjects(updatedItems).unwrap();
            toast({
                title: 'Content Saved',
                description: 'Projects section has been updated successfully.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Save Failed',
                description: 'There was an error saving the projects.',
            });
        }
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const newItems = [...projects];
        const item = newItems[fullIndex];

        if (direction === 'up' && fullIndex > 0) {
            newItems.splice(fullIndex, 1);
            newItems.splice(fullIndex - 1, 0, item);
        } else if (direction === 'down' && fullIndex < newItems.length - 1) {
            newItems.splice(fullIndex, 1);
            newItems.splice(fullIndex + 1, 0, item);
        }
        triggerUpdate(newItems);
    };

    const handleAddClick = () => {
        setSelectedMission(null);
        setEditingIndex(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (mission: Project, index: number) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        setSelectedMission(mission);
        setEditingIndex(fullIndex);
        setIsFormOpen(true);
    };

    const handleViewClick = (mission: Project) => {
        setSelectedMission(mission);
        setIsViewOpen(true);
    };

    const handleDelete = (index: number) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const newItems = projects.filter((_, i) => i !== fullIndex);
        triggerUpdate(newItems);
        toast({
            variant: "destructive",
            title: "Project Deleted",
            description: "The project has been removed.",
        });
    };
    
    const handleSave = (project: Omit<Project, '_id'>) => {
        let newItems: Project[];
        if (editingIndex !== null) {
            newItems = [...projects];
            newItems[editingIndex] = { ...newItems[editingIndex], ...project };
        } else {
            const newProject = { ...project, _id: `new_${Date.now()}` } as Project;
            newItems = [newProject, ...projects];
        }
        triggerUpdate(newItems);
        setIsFormOpen(false);
    };

    const handleVisibilityChange = (index: number, isVisible: boolean) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const newItems = projects.map((item, i) => {
            if (i === fullIndex) {
                return { ...item, isVisible };
            }
            return item;
        });
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
                        <CardTitle>Featured Projects</CardTitle>
                        <CardDescription>Manage the content of the "Featured Projects" section.</CardDescription>
                    </div>
                    <Button onClick={handleAddClick} disabled={isMutationLoading}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Project
                    </Button>
                </CardHeader>
                <CardContent>
                    <Card className="border relative">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead className="w-[120px] hidden md:table-cell">Image</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead className="hidden sm:table-cell">Description</TableHead>
                                    <TableHead className="w-[100px]">Visible</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedMissions.length > 0 ? paginatedMissions.map((mission, index) => (
                                    <TableRow key={mission._id || index}>
                                        <TableCell className="text-center align-middle">
                                            <div className="flex flex-col items-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'up')} disabled={isMutationLoading || (currentPage - 1) * ITEMS_PER_PAGE + index === 0}>
                                                    <ArrowUp className="h-4 w-4" />
                                                </Button>
                                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'down')} disabled={isMutationLoading || (currentPage - 1) * ITEMS_PER_PAGE + index === projects.length - 1}>
                                                    <ArrowDown className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Image src={mission.image.imageUrl} alt={mission.title} width={100} height={60} className="rounded-md object-cover aspect-video" />
                                        </TableCell>
                                        <TableCell className="font-medium">{mission.title}</TableCell>
                                        <TableCell className="hidden sm:table-cell text-muted-foreground truncate max-w-xs">{mission.description}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={mission.isVisible}
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
                        {isMutationLoading && (
                            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        )}
                        <div className="flex items-center justify-between border-t p-4">
                            <div className="text-xs text-muted-foreground">
                                Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedMissions.length}</strong> of <strong>{projects.length}</strong> projects
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
                    <MissionForm project={selectedMission} onSave={handleSave} />
                </DialogContent>
            </Dialog>

            <ViewMissionDialog project={selectedMission} open={isViewOpen} onOpenChange={setIsViewOpen} />
        </>
    );
}

export default MissionsAdminPage;

    