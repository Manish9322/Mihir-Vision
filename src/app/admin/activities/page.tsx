'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { activitiesData } from '@/lib/data';
import { PlusCircle, Trash2, ArrowUp, ArrowDown, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 3;

const ActivitiesAdminPage = () => {
    const { toast } = useToast();
    const [items, setItems] = useState(activitiesData.activities);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const paginatedItems = items.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

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
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: `Content Saved`,
            description: `Activities section has been updated.`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Activities Section</CardTitle>
                <CardDescription>
                    Manage the items in the "What We Do" section.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="activities-title">Section Title</Label>
                        <Input id="activities-title" defaultValue={activitiesData.title} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="activities-subheadline">Section Subheadline</Label>
                        <Textarea id="activities-subheadline" defaultValue={activitiesData.subheadline} />
                    </div>
                    <div className="space-y-4">
                        <Label>Activities</Label>
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]"></TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedItems.map((activity, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="text-center align-middle">
                                                <div className="flex flex-col items-center gap-1">
                                                     <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'up')} disabled={(currentPage - 1) * ITEMS_PER_PAGE + index === 0}>
                                                        <ArrowUp className="h-4 w-4" />
                                                    </Button>
                                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'down')} disabled={(currentPage - 1) * ITEMS_PER_PAGE + index === items.length - 1}>
                                                        <ArrowDown className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Input defaultValue={activity.title} />
                                            </TableCell>
                                            <TableCell>
                                                <Input defaultValue={activity.description} />
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
                        <Button variant="outline" className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Activity
                        </Button>
                    </div>
                    <Button type="submit">Save Changes</Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default ActivitiesAdminPage;
