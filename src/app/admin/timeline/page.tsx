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
import { PlusCircle, Trash2, ArrowUp, ArrowDown, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 3;

const TimelineAdminPage = () => {
    const { toast } = useToast();
    const [events, setEvents] = useState(timelineData.events);
    const [currentPage, setCurrentPage] = useState(1);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: `Content Saved`,
            description: `Timeline section has been updated.`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Timeline Section</CardTitle>
                <CardDescription>
                    Manage the items in the "DNA Timeline" section.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="timeline-title">Section Title</Label>
                        <Input id="timeline-title" defaultValue={timelineData.title} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="timeline-subheadline">Section Subheadline</Label>
                        <Textarea id="timeline-subheadline" defaultValue={timelineData.subheadline} />
                    </div>
                    <div className="space-y-4">
                        <Label>Timeline Events</Label>
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]"></TableHead>
                                        <TableHead className="w-[100px]">Year</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Description</TableHead>
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
                                            <TableCell>
                                                <Input defaultValue={event.year} />
                                            </TableCell>
                                            <TableCell>
                                                <Input defaultValue={event.title} />
                                            </TableCell>
                                            <TableCell>
                                                <Textarea defaultValue={event.description} rows={2} />
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
                        <Button variant="outline" className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Event
                        </Button>
                    </div>
                    <Button type="submit">Save Changes</Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default TimelineAdminPage;
