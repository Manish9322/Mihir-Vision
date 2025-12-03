'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { timelineData } from '@/lib/data';
import { PlusCircle, Trash2, ArrowUp, ArrowDown, GripVertical, ChevronLeft, ChevronRight, MoreHorizontal, Eye, FilePenLine } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type TimelineEvent = {
    year: string;
    title: string;
    description: string;
    icon: LucideIcon;
};

const ITEMS_PER_PAGE = 3;

const EventForm = ({ event, onSave }: { event?: TimelineEvent | null, onSave: (event: TimelineEvent) => void }) => {
    const [year, setYear] = useState(event?.year || '');
    const [title, setTitle] = useState(event?.title || '');
    const [description, setDescription] = useState(event?.description || '');
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newEvent: TimelineEvent = {
            year,
            title,
            description,
            icon: event?.icon || timelineData.events[0].icon,
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
    const Icon = event.icon;

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
    const [events, setEvents] = useState<TimelineEvent[]>(timelineData.events);
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
        setEvents(newEvents);
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
        const newEvents = events.filter((_, i) => i !== fullIndex);
        setEvents(newEvents);
        toast({
            variant: "destructive",
            title: "Event Deleted",
            description: "The timeline event has been removed.",
        });
    };
    
    const handleSave = (event: TimelineEvent) => {
        if (editingIndex !== null) {
            const newEvents = [...events];
            newEvents[editingIndex] = event;
            setEvents(newEvents);
        } else {
            setEvents([event, ...events]);
        }
        setIsFormOpen(false);
    };

    return (
        <>
            <Card>
                 <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Timeline Section</CardTitle>
                        <CardDescription>
                            Manage the items in the "DNA Timeline" section.
                        </CardDescription>
                    </div>
                     <Button onClick={handleAddClick}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Event
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]"></TableHead>
                                        <TableHead className="w-[100px]">Year</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead className="hidden md:table-cell">Description</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedEvents.map((event, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="text-center align-middle">
                                                <div className="flex flex-col items-center gap-1">
                                                     <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'up')} disabled={(currentPage - 1) * ITEMS_PER_PAGE + index === 0}>
                                                        <ArrowUp className="h-4 w-4" />
                                                    </Button>
                                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'down')} disabled={(currentPage - 1) * ITEMS_PER_PAGE + index === events.length - 1}>
                                                        <ArrowDown className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{event.year}</TableCell>
                                            <TableCell className="font-medium">{event.title}</TableCell>
                                            <TableCell className="hidden md:table-cell text-muted-foreground truncate max-w-sm">{event.description}</TableCell>
                                            <TableCell className="text-right">
                                                 <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="icon" variant="ghost">
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
                    </div>
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
        </>
    );
}

export default TimelineAdminPage;
