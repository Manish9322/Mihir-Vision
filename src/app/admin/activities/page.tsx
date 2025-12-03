'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, ArrowUp, ArrowDown, GripVertical, ChevronLeft, ChevronRight, MoreHorizontal, FilePenLine, Eye, Loader2, Rocket, Dna, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useGetActivitiesDataQuery, useUpdateActivitiesDataMutation } from '@/services/api';

type Activity = {
    _id?: string;
    icon: string; // Storing icon name as string
    title: string;
    description: string;
};

const iconMap: { [key: string]: LucideIcon } = {
    Rocket: Rocket,
    Dna: Dna,
    Users: Users,
};

const ITEMS_PER_PAGE = 3;

const ActivityForm = ({ activity, onSave }: { activity?: Activity | null, onSave: (activity: Omit<Activity, '_id'>) => void }) => {
    const [title, setTitle] = useState(activity?.title || '');
    const [description, setDescription] = useState(activity?.description || '');
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newActivity: Omit<Activity, '_id'> = {
            title,
            description,
            icon: activity?.icon || 'Rocket', // Default icon
        };
        onSave(newActivity);
        toast({
            title: `Activity ${activity ? 'Updated' : 'Created'}`,
            description: `The activity "${title}" has been saved.`,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Activity Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Activity</Button>
            </DialogFooter>
        </form>
    );
};

const ViewActivityDialog = ({ activity, open, onOpenChange }: { activity: Activity | null; open: boolean; onOpenChange: (open: boolean) => void; }) => {
    if (!activity) return null;
    const Icon = iconMap[activity.icon] || Rocket;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        {activity.title}
                    </DialogTitle>
                    <DialogDescription>Viewing activity details.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                 <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


const ActivitiesAdminPage = () => {
    const { toast } = useToast();
    const { data: activities = [], isLoading: isQueryLoading, isError } = useGetActivitiesDataQuery();
    const [updateActivities, { isLoading: isMutationLoading }] = useUpdateActivitiesDataMutation();
    const [items, setItems] = useState<Activity[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    useEffect(() => {
        if (activities) {
            setItems(activities);
        }
    }, [activities]);

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const paginatedItems = items.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    
    const triggerUpdate = async (updatedItems: Activity[]) => {
        try {
            await updateActivities(updatedItems).unwrap();
            toast({
                title: `Content Saved`,
                description: `Activities section has been updated successfully.`,
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: `Save Failed`,
                description: `There was an error saving the activities.`,
            });
        }
    };


    const handleMove = (index: number, direction: 'up' | 'down') => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const newItems = [...items];
        const item = newItems[fullIndex];

        if (direction === 'up' && fullIndex > 0) {
            newItems.splice(fullIndex, 1);
            newItems.splice(fullIndex - 1, 0, item);
        } else if (direction === 'down' && fullIndex < newItems.length - 1) {
            newItems.splice(fullIndex, 1);
            newItems.splice(fullIndex + 1, 0, item);
        }
        setItems(newItems);
        triggerUpdate(newItems);
    };

    const handleAddClick = () => {
        setSelectedActivity(null);
        setEditingIndex(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (activity: Activity, index: number) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        setSelectedActivity(activity);
        setEditingIndex(fullIndex);
        setIsFormOpen(true);
    };

    const handleViewClick = (activity: Activity) => {
        setSelectedActivity(activity);
        setIsViewOpen(true);
    };

    const handleDelete = (index: number) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const newItems = items.filter((_, i) => i !== fullIndex);
        setItems(newItems);
        triggerUpdate(newItems);
        toast({
            variant: "destructive",
            title: "Activity Deleted",
            description: "The activity has been removed.",
        });
    };
    
    const handleSave = (activityData: Omit<Activity, '_id'>) => {
        let newItems: Activity[];
        if (editingIndex !== null) {
            newItems = [...items];
            newItems[editingIndex] = { ...newItems[editingIndex], ...activityData };
        } else {
            // Add a temporary ID for React's key prop. This will be stripped on the backend.
            const newActivity = { ...activityData, _id: `new_${Date.now()}`}; 
            newItems = [newActivity, ...items];
        }
        setItems(newItems);
        triggerUpdate(newItems);
        setIsFormOpen(false);
    };

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
                        <CardTitle>Activities Section</CardTitle>
                        <CardDescription>
                            Manage the items in the "What We Do" section.
                        </CardDescription>
                    </div>
                     <Button onClick={handleAddClick} disabled={isMutationLoading}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Activity
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <Card>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]"></TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead className="hidden sm:table-cell">Description</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedItems.map((activity, index) => {
                                            const Icon = iconMap[activity.icon] || Rocket;
                                            return (
                                                <TableRow key={activity._id || index}>
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
                                                    <TableCell className="font-medium max-w-[150px] truncate">{activity.title}</TableCell>
                                                    <TableCell className="hidden sm:table-cell text-muted-foreground truncate max-w-xs">{activity.description}</TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button size="icon" variant="ghost" disabled={isMutationLoading}>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleViewClick(activity)}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleEditClick(activity, index)}>
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
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                                {isMutationLoading && (
                                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                )}
                                <div className="flex items-center justify-between border-t p-4">
                                    <div className="text-xs text-muted-foreground">
                                        Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedItems.length}</strong> of <strong>{items.length}</strong> items
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
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{selectedActivity ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
                        <DialogDescription>
                            {selectedActivity ? 'Make changes to this activity.' : 'Fill out the details for the new activity.'}
                        </DialogDescription>
                    </DialogHeader>
                    <ActivityForm activity={selectedActivity} onSave={handleSave} />
                </DialogContent>
            </Dialog>

            <ViewActivityDialog activity={selectedActivity} open={isViewOpen} onOpenChange={setIsViewOpen} />
        </>
    );
}

export default ActivitiesAdminPage;

    
    