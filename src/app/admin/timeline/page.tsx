
'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, ArrowUp, ArrowDown, GripVertical, ChevronLeft, ChevronRight, MoreHorizontal, Eye, FilePenLine, Loader2, Lightbulb, Target, Users, Bot, Milestone, EyeOff, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useGetTimelineDataQuery, useUpdateTimelineDataMutation, useAddActionLogMutation } from '@/services/api';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';

type TimelineEvent = {
    _id?: string;
    year: string;
    title: string;
    description: string;
    icon: string; // Store icon name as string
    isVisible: boolean;
};

const iconMap: { [key: string]: LucideIcon } = {
    Lightbulb: Lightbulb,
    Target: Target,
    Users: Users,
    Bot: Bot,
};

const ITEMS_PER_PAGE = 3;

const TimelineAdminSkeleton = () => (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-16" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-16" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-16" /></CardContent></Card>
        </div>
        <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <Skeleton className="h-8 w-40" />
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
                                <TableHead className="w-[100px]">Year</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead className="hidden md:table-cell">Description</TableHead>
                                <TableHead className="w-[100px]">Visible</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(3)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-12 w-6 mx-auto" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-48" /></TableCell>
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


const EventForm = ({ event, onSave }: { event?: TimelineEvent | null, onSave: (event: Omit<TimelineEvent, '_id'>) => void }) => {
    const [year, setYear] = useState(event?.year || '');
    const [title, setTitle] = useState(event?.title || '');
    const [description, setDescription] = useState(event?.description || '');
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newEvent: Omit<TimelineEvent, '_id'> = {
            year,
            title,
            description,
            icon: event?.icon || 'Lightbulb', // Default icon
            isVisible: event?.isVisible ?? true,
        };
        onSave(newEvent);
        toast({
            title: `Event ${event ? 'Updated' : 'Created'}`,
            description: `The event "${title}" has been saved.`,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" value={year} onChange={(e) => setYear(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
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
                <Button type="submit">Save Event</Button>
            </DialogFooter>
        </form>
    );
};

const ViewEventDialog = ({ event, open, onOpenChange }: { event: TimelineEvent | null; open: boolean; onOpenChange: (open: boolean) => void; }) => {
    if (!event) return null;
    const Icon = iconMap[event.icon] || Lightbulb;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5" /> {event.title} ({event.year})
                    </DialogTitle>
                    <DialogDescription>Viewing timeline event details.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <p className="text-sm text-muted-foreground">{event.description}</p>
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

const TimelineAdminPage = () => {
    const { toast } = useToast();
    const { data: events = [], isLoading: isQueryLoading, isError } = useGetTimelineDataQuery();
    const [updateTimeline, { isLoading: isMutationLoading }] = useUpdateTimelineDataMutation();
    const [addActionLog] = useAddActionLogMutation();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
    const paginatedEvents = events.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    
    const stats = useMemo(() => ({
        total: events.length,
        visible: events.filter(e => e.isVisible).length,
        hidden: events.filter(e => !e.isVisible).length,
    }), [events]);

    const triggerUpdate = async (updatedItems: TimelineEvent[], actionLog: Omit<Parameters<typeof addActionLog>[0], 'user' | 'section'>) => {
        try {
            await updateTimeline(updatedItems).unwrap();
            await addActionLog({
                user: 'Admin User',
                section: 'Timeline',
                ...actionLog,
            }).unwrap();
            toast({
                title: 'Content Saved',
                description: 'Timeline section has been updated successfully.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Save Failed',
                description: 'There was an error saving the timeline.',
            });
        }
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const newEvents = [...events];
        const item = newEvents[fullIndex];

        if (direction === 'up' && fullIndex > 0) {
            newEvents.splice(fullIndex, 1);
            newEvents.splice(fullIndex - 1, 0, item);
        } else if (direction === 'down' && fullIndex < newEvents.length - 1) {
            newEvents.splice(fullIndex, 1);
            newEvents.splice(fullIndex + 1, 0, item);
        }
        triggerUpdate(newEvents, { action: `reordered timeline events`, type: 'UPDATE' });
    };

    const handleAddClick = () => {
        setSelectedEvent(null);
        setEditingIndex(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (event: TimelineEvent, index: number) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        setSelectedEvent(event);
        setEditingIndex(fullIndex);
        setIsFormOpen(true);
    };

    const handleViewClick = (event: TimelineEvent) => {
        setSelectedEvent(event);
        setIsViewOpen(true);
    };

    const handleDelete = (index: number) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const deletedEvent = events[fullIndex];
        const newEvents = events.filter((_, i) => i !== fullIndex);
        triggerUpdate(newEvents, { action: `deleted event "${deletedEvent.title}"`, type: 'DELETE' });
        toast({
            variant: "destructive",
            title: "Event Deleted",
            description: "The timeline event has been removed.",
        });
    };
    
    const handleSave = (event: Omit<TimelineEvent, '_id'>) => {
        let newItems: TimelineEvent[];
        let action: string, type: 'CREATE' | 'UPDATE';

        if (editingIndex !== null) {
            newItems = [...events];
            newItems[editingIndex] = { ...newItems[editingIndex], ...event };
            action = `updated event "${event.title}"`;
            type = 'UPDATE';
        } else {
            const newEvent = { ...event, _id: `new_${Date.now()}` } as TimelineEvent;
            newItems = [newEvent, ...events];
            action = `created event "${event.title}"`;
            type = 'CREATE';
        }
        triggerUpdate(newItems, { action, type });
        setIsFormOpen(false);
    };

    const handleVisibilityChange = (index: number, isVisible: boolean) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const newItems = events.map((item, i) => {
            if (i === fullIndex) {
                return { ...item, isVisible };
            }
            return item;
        });
        const event = events[fullIndex];
        triggerUpdate(newItems, { action: `set visibility of event "${event.title}" to ${isVisible}`, type: 'UPDATE' });
    }

    if (isQueryLoading) {
        return <TimelineAdminSkeleton />;
    }
    
    if (isError) {
        return (
            <Card className="flex flex-col items-center justify-center p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <CardTitle className="text-xl text-destructive">Error Loading Data</CardTitle>
                <CardDescription className="mt-2">
                    There was a problem fetching the content for the Timeline page. Please try refreshing the page.
                </CardDescription>
            </Card>
        );
    }


    return (
        <div className="space-y-6">
             <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        <Milestone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Visible Events</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.visible}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hidden Events</CardTitle>
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
                        <CardTitle>Timeline Section</CardTitle>
                        <CardDescription>
                            Manage the items in the "DNA Timeline" section.
                        </CardDescription>
                    </div>
                     <Button onClick={handleAddClick} disabled={isMutationLoading}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Event
                    </Button>
                </CardHeader>
                <CardContent>
                    <Card className="relative">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead className="w-[100px]">Year</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead className="hidden md:table-cell">Description</TableHead>
                                    <TableHead className="w-[100px]">Visible</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedEvents.map((event, index) => (
                                    <TableRow key={event._id || index}>
                                        <TableCell className="text-center align-middle">
                                            <div className="flex flex-col items-center gap-1">
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'up')} disabled={isMutationLoading || (currentPage - 1) * ITEMS_PER_PAGE + index === 0}>
                                                    <ArrowUp className="h-4 w-4" />
                                                </Button>
                                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'down')} disabled={isMutationLoading || (currentPage - 1) * ITEMS_PER_PAGE + index === events.length - 1}>
                                                    <ArrowDown className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{event.year}</TableCell>
                                        <TableCell className="font-medium">{event.title}</TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground truncate max-w-sm">{event.description}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={event.isVisible}
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
                                                    <DropdownMenuItem onClick={() => handleViewClick(event)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleEditClick(event, index)}>
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
                                Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedEvents.length}</strong> of <strong>{events.length}</strong> events
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
                        <DialogTitle>{selectedEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                        <DialogDescription>
                            {selectedEvent ? 'Make changes to this timeline event.' : 'Fill out the details for the new timeline event.'}
                        </DialogDescription>
                    </DialogHeader>
                    <EventForm event={selectedEvent} onSave={handleSave} />
                </DialogContent>
            </Dialog>

            <ViewEventDialog event={selectedEvent} open={isViewOpen} onOpenChange={setIsViewOpen} />
        </div>
    );
}

export default TimelineAdminPage;

    