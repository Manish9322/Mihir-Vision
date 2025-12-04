

'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, ArrowUp, ArrowDown, GripVertical, ChevronLeft, ChevronRight, MoreHorizontal, FilePenLine, Eye, Loader2, Search, Gamepad2, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useGetGamesDataQuery, useUpdateGamesDataMutation, useAddActionLogMutation } from '@/services/api';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

type Game = {
    _id?: string;
    title: string;
    coverImageUrl: string;
    description: string;
    releaseDate: string;
    platforms: string[];
    websiteUrl?: string;
    isVisible: boolean;
};

const ITEMS_PER_PAGE = 5;

const GameForm = ({ game, onSave }: { game?: Game | null, onSave: (game: Omit<Game, '_id'>) => void }) => {
    const [title, setTitle] = useState(game?.title || '');
    const [description, setDescription] = useState(game?.description || '');
    const [releaseDate, setReleaseDate] = useState(game?.releaseDate || '');
    const [platforms, setPlatforms] = useState(game?.platforms?.join(', ') || '');
    const [websiteUrl, setWebsiteUrl] = useState(game?.websiteUrl || '');
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newGame: Omit<Game, '_id'> = {
            title,
            description,
            releaseDate,
            platforms: platforms.split(',').map(p => p.trim()).filter(Boolean),
            websiteUrl,
            coverImageUrl: game?.coverImageUrl || 'https://placehold.co/300x400/white/black?text=Cover', // Placeholder
            isVisible: game?.isVisible ?? true,
        };
        onSave(newGame);
        toast({
            title: `Game ${game ? 'Updated' : 'Created'}`,
            description: `The game "${title}" has been saved.`,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Game Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="releaseDate">Release Date</Label>
                    <Input id="releaseDate" type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} required />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="platforms">Platforms (comma-separated)</Label>
                    <Input id="platforms" value={platforms} onChange={(e) => setPlatforms(e.target.value)} placeholder="PC, PlayStation, Xbox..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input id="websiteUrl" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://example.com" />
                </div>
            </div>
             <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="flex items-center gap-4">
                    <Image src={game?.coverImageUrl || 'https://placehold.co/150x200/white/black?text=Cover'} alt={game?.title || 'New Game'} width={150} height={200} className="rounded-md object-cover bg-muted p-1" />
                    <Input type="file" className="max-w-xs" />
                </div>
            </div>
            <DialogFooter className="pt-4">
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Game</Button>
            </DialogFooter>
        </form>
    )
}

const ViewGameDialog = ({ game, open, onOpenChange }: { game: Game | null; open: boolean; onOpenChange: (open: boolean) => void; }) => {
    if (!game) return null;

    return (
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>View Game</DialogTitle>
                    <DialogDescription>{game.title}</DialogDescription>
                </DialogHeader>
                <div className="flex justify-center items-center p-4 bg-muted rounded-md my-4">
                    <Image src={game.coverImageUrl} alt={game.title} width={200} height={267} className="object-cover rounded-md" />
                </div>
                <div className="space-y-2 text-sm">
                    <p><strong>Release Date:</strong> {new Date(game.releaseDate).toLocaleDateString()}</p>
                    <p><strong>Platforms:</strong> {game.platforms.join(', ')}</p>
                    <p><strong>Website:</strong> <a href={game.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{game.websiteUrl}</a></p>
                    <p><strong>Description:</strong> {game.description}</p>
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


const GamesAdminPage = () => {
    const { toast } = useToast();
    const { data: games = [], isLoading: isQueryLoading, isError } = useGetGamesDataQuery();
    const [updateGames, { isLoading: isMutationLoading }] = useUpdateGamesDataMutation();
    const [addActionLog] = useAddActionLogMutation();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const filteredGames = useMemo(() => {
        return games.filter(game => 
            game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.platforms.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [games, searchQuery]);
    
    const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);
    const paginatedGames = filteredGames.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    
    const stats = useMemo(() => ({
        total: games.length,
        visible: games.filter(g => g.isVisible).length,
        hidden: games.filter(g => !g.isVisible).length,
    }), [games]);

    const triggerUpdate = async (updatedItems: Game[], actionLog: Omit<Parameters<typeof addActionLog>[0], 'user' | 'section'>) => {
        try {
            await updateGames(updatedItems).unwrap();
            await addActionLog({
                user: 'Admin User',
                section: 'Games',
                ...actionLog,
            }).unwrap();
            toast({
                title: 'Content Saved',
                description: 'Games list has been updated successfully.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Save Failed',
                description: 'There was an error saving the games.',
            });
        }
    };

    const handleAddClick = () => {
        setSelectedGame(null);
        setEditingIndex(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (game: Game, index: number) => {
        const fullIndex = games.findIndex(g => g._id === game._id);
        setSelectedGame(game);
        setEditingIndex(fullIndex);
        setIsFormOpen(true);
    };

    const handleViewClick = (game: Game) => {
        setSelectedGame(game);
        setIsViewOpen(true);
    };

    const handleDelete = (gameId: string) => {
        const deletedGame = games.find(g => g._id === gameId);
        const newGames = games.filter(g => g._id !== gameId);
        triggerUpdate(newGames, { action: `deleted game "${deletedGame?.title}"`, type: 'DELETE' });
        toast({
            variant: "destructive",
            title: "Game Deleted",
            description: "The game has been removed from the list.",
        });
    };
    
    const handleSave = (gameData: Omit<Game, '_id'>) => {
        let newItems: Game[];
        let action: string, type: 'CREATE' | 'UPDATE';

        if (editingIndex !== null) {
            newItems = games.map((game, index) => index === editingIndex ? { ...games[editingIndex], ...gameData } : game);
            action = `updated game "${gameData.title}"`;
            type = 'UPDATE';
        } else {
            const newGame = { ...gameData, _id: `new_${Date.now()}` } as Game;
            newItems = [newGame, ...games];
            action = `created game "${gameData.title}"`;
            type = 'CREATE';
        }
        triggerUpdate(newItems, { action, type });
        setIsFormOpen(false);
        setEditingIndex(null);
        setSelectedGame(null);
    };
    
    const handleVisibilityChange = (gameId: string, isVisible: boolean) => {
        const newItems = games.map((item) =>
            item._id === gameId ? { ...item, isVisible } : item
        );
        const game = games.find(g => g._id === gameId);
        triggerUpdate(newItems, { action: `set visibility of game "${game?.title}" to ${isVisible}`, type: 'UPDATE' });
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
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Games</CardTitle>
                        <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Visible Games</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.visible}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hidden Games</CardTitle>
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
                        <CardTitle>Games Management</CardTitle>
                        <CardDescription>Manage the games developed by your company.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by name or platform..."
                                className="pl-8 sm:w-[200px] lg:w-[300px]"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                         <Button onClick={handleAddClick} disabled={isMutationLoading}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Game
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Card className="relative">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px] hidden md:table-cell">Cover</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Release Date</TableHead>
                                    <TableHead className="hidden sm:table-cell">Platforms</TableHead>
                                    <TableHead className="w-[100px]">Visible</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedGames.map((game, index) => (
                                    <TableRow key={game._id || index}>
                                        <TableCell className="hidden md:table-cell">
                                            <Image src={game.coverImageUrl} alt={game.title} width={60} height={80} className="rounded-sm object-cover bg-muted p-1" />
                                        </TableCell>
                                        <TableCell className="font-medium">{game.title}</TableCell>
                                        <TableCell>{new Date(game.releaseDate).toLocaleDateString()}</TableCell>
                                        <TableCell className="hidden sm:table-cell max-w-xs truncate text-muted-foreground">{game.platforms.join(', ')}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={game.isVisible}
                                                onCheckedChange={(checked) => handleVisibilityChange(game._id, checked)}
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
                                                    <DropdownMenuItem onClick={() => handleViewClick(game)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleEditClick(game, index)}>
                                                        <FilePenLine className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(game._id)}>
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
                                Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedGames.length}</strong> of <strong>{filteredGames.length}</strong> games
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

            <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) { setSelectedGame(null); setEditingIndex(null); }}}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedGame ? 'Edit Game' : 'Add New Game'}</DialogTitle>
                        <DialogDescription>
                            {selectedGame ? 'Make changes to this game.' : 'Add a new game to your portfolio.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[70vh] overflow-y-auto px-1 pr-6 pl-6 scrollbar-hide">
                        <GameForm game={selectedGame} onSave={handleSave} />
                    </div>
                </DialogContent>
            </Dialog>

            <ViewGameDialog game={selectedGame} open={isViewOpen} onOpenChange={setIsViewOpen} />
        </div>
    );
}

export default GamesAdminPage;
