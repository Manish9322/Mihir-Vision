'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { futureMissionsData } from '@/lib/data';
import { PlusCircle, Trash2, ArrowUp, ArrowDown, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ITEMS_PER_PAGE = 2;

const MissionsAdminPage = () => {
    const { toast } = useToast();
    const [missions, setMissions] = useState(futureMissionsData.missions);
    const [currentPage, setCurrentPage] = useState(1);

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
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: `Content Saved`,
            description: `Missions section has been updated.`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Future Missions Section</CardTitle>
                <CardDescription>
                    Manage the content of the "Future Missions" section.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="missions-title">Section Title</Label>
                        <Input id="missions-title" defaultValue={futureMissionsData.title} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="missions-subheadline">Section Subheadline</Label>
                        <Textarea id="missions-subheadline" defaultValue={futureMissionsData.subheadline} />
                    </div>
                    <div className="space-y-4">
                        <Label>Missions</Label>
                        <Card>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]"></TableHead>
                                        <TableHead className="w-[150px]">Image</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Tags</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedMissions.map((mission, index) => (
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
                                            <TableCell>
                                                <div className="flex flex-col gap-2">
                                                    <div className="relative aspect-video w-32 rounded-md overflow-hidden">
                                                        <Image src={mission.image.imageUrl} alt={mission.title} fill className="object-cover" />
                                                    </div>
                                                     <Input type="file" className="max-w-xs" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Input defaultValue={mission.title} />
                                            </TableCell>
                                            <TableCell>
                                                <Input defaultValue={mission.description} />
                                            </TableCell>
                                             <TableCell>
                                                <Input defaultValue={mission.tags.join(', ')} />
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
                                    Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedMissions.length}</strong> of <strong>{missions.length}</strong> missions
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
                            Add Mission
                        </Button>
                    </div>
                    <Button type="submit">Save Changes</Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default MissionsAdminPage;
