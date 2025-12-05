
'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, MoreHorizontal, FilePenLine, Eye, Loader2, Search, Presentation, AlertTriangle, Video } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useGetMatchesQuery, useAddMatchMutation, useUpdateMatchMutation, useDeleteMatchMutation, useGetSportsQuery, useUploadImageMutation, useAddActionLogMutation } from '@/services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 10;

const MatchAdminSkeleton = () => (
    <div className="space-y-6">
        <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-72 mt-2" />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Skeleton className="h-10 w-full sm:w-[300px]" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </CardHeader>
            <CardContent>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Match Name</TableHead>
                                <TableHead>Sport</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
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


const MatchForm = ({ match, sports, onSave, onFileChange, isSaving }) => {
    const [name, setName] = useState(match?.name || '');
    const [sport, setSport] = useState(match?.sport || '');
    const [matchDate, setMatchDate] = useState(match?.matchDate ? format(new Date(match.matchDate), 'yyyy-MM-dd') : '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ _id: match?._id, name, sport, matchDate });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Match Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="sport">Sport</Label>
                <Select onValueChange={setSport} defaultValue={sport} required>
                    <SelectTrigger id="sport"><SelectValue placeholder="Select a sport" /></SelectTrigger>
                    <SelectContent>
                        {sports?.map(s => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="matchDate">Match Date</Label>
                <Input id="matchDate" type="date" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="videoFile">Video File</Label>
                <Input id="videoFile" type="file" onChange={onFileChange} accept="video/*" />
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Match
                </Button>
            </DialogFooter>
        </form>
    );
};

const MatchesListPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const { data: matches = [], isLoading: isMatchesLoading, isError: isMatchesError } = useGetMatchesQuery();
    const { data: sports = [], isLoading: isSportsLoading, isError: isSportsError } = useGetSportsQuery();
    
    const [addMatch, { isLoading: isAdding }] = useAddMatchMutation();
    const [updateMatch, { isLoading: isUpdating }] = useUpdateMatchMutation();
    const [deleteMatch, { isLoading: isDeleting }] = useDeleteMatchMutation();
    const [uploadVideo, { isLoading: isUploading }] = useUploadImageMutation(); // Reusing for video
    const [addActionLog] = useAddActionLogMutation();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [videoFile, setVideoFile] = useState(null);

    const isMutating = isAdding || isUpdating || isDeleting || isUploading;

    const filteredMatches = useMemo(() => {
        return matches.filter(match =>
            match.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [matches, searchQuery]);

    const totalPages = Math.ceil(filteredMatches.length / ITEMS_PER_PAGE);
    const paginatedMatches = filteredMatches.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
        }
    };

    const handleSave = async (matchData) => {
        try {
            let finalData = { ...matchData };

            if (videoFile) {
                const uploadResult = await uploadVideo(videoFile).unwrap();
                finalData.videoUrl = uploadResult.url;
            }

            if (selectedMatch) {
                await updateMatch(finalData).unwrap();
                await addActionLog({ user: 'Admin', action: `updated match "${finalData.name}"`, section: 'Match Analysis', type: 'UPDATE' });
                toast({ title: 'Match Updated' });
            } else {
                await addMatch(finalData).unwrap();
                await addActionLog({ user: 'Admin', action: `created match "${finalData.name}"`, section: 'Match Analysis', type: 'CREATE' });
                toast({ title: 'Match Added' });
            }
            setIsFormOpen(false);
            setSelectedMatch(null);
            setVideoFile(null);
        } catch (error) {
            console.error("Save failed:", error);
            toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save the match details.' });
        }
    };

    const handleDelete = async (matchId) => {
        const matchToDelete = matches.find(m => m._id === matchId);
        if (window.confirm(`Are you sure you want to delete the match "${matchToDelete?.name}"?`)) {
            try {
                await deleteMatch(matchId).unwrap();
                await addActionLog({ user: 'Admin', action: `deleted match "${matchToDelete.name}"`, section: 'Match Analysis', type: 'DELETE' });
                toast({ variant: 'destructive', title: 'Match Deleted' });
            } catch (error) {
                toast({ variant: 'destructive', title: 'Deletion Failed' });
            }
        }
    };

    if (isMatchesLoading || isSportsLoading) return <MatchAdminSkeleton />;
    if (isMatchesError || isSportsError) return (
        <Card className="flex flex-col items-center justify-center p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <CardTitle className="text-xl text-destructive">Error Loading Data</CardTitle>
            <CardDescription className="mt-2">Could not fetch matches or sports data. Please try again.</CardDescription>
        </Card>
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2"><Presentation className="h-6 w-6" /> Match Analysis</CardTitle>
                        <CardDescription>Manage and analyze sports matches.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search matches..."
                                className="pl-8 sm:w-[200px] lg:w-[300px]"
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                        <Button onClick={() => { setSelectedMatch(null); setIsFormOpen(true); }} disabled={isMutating}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Match
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Card className="relative">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Match Name</TableHead>
                                    <TableHead>Sport</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedMatches.length > 0 ? paginatedMatches.map((match) => {
                                    const sport = sports.find(s => s._id === match.sport);
                                    return (
                                        <TableRow key={match._id}>
                                            <TableCell className="font-medium">{match.name}</TableCell>
                                            <TableCell>{sport?.name || 'N/A'}</TableCell>
                                            <TableCell>{format(new Date(match.matchDate), 'PPP')}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="icon" variant="ghost" disabled={isMutating}><MoreHorizontal className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => router.push(`/admin/games/${match._id}`)}>
                                                            <Eye className="mr-2 h-4 w-4" />Analyze
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => { setSelectedMatch(match); setIsFormOpen(true); }}>
                                                            <FilePenLine className="mr-2 h-4 w-4" />Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(match._id)}>
                                                            <Trash2 className="mr-2 h-4 w-4" />Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                }) : (
                                    <TableRow><TableCell colSpan={4} className="h-24 text-center">No matches found.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                        {isMutating && (
                            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        )}
                        <div className="flex items-center justify-between border-t p-4">
                            <div className="text-xs text-muted-foreground">
                                Showing <strong>{paginatedMatches.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedMatches.length}</strong> of <strong>{filteredMatches.length}</strong> matches
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </Card>
                </CardContent>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedMatch ? 'Edit Match' : 'Add New Match'}</DialogTitle>
                        <DialogDescription>Fill out the details for the match.</DialogDescription>
                    </DialogHeader>
                    <MatchForm match={selectedMatch} sports={sports} onSave={handleSave} onFileChange={handleFileChange} isSaving={isMutating} />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default MatchesListPage;
