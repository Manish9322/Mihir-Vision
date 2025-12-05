
'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, ArrowUp, ArrowDown, GripVertical, ChevronLeft, ChevronRight, MoreHorizontal, FilePenLine, Eye, Loader2, Search, Handshake, EyeOff, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useGetClientsDataQuery, useUpdateClientsDataMutation, useAddActionLogMutation, useUploadImageMutation } from '@/services/api';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';

type Client = {
    _id?: string;
    name: string;
    logoUrl: string;
    website?: string;
    isVisible: boolean;
};

const ITEMS_PER_PAGE = 5;

const ClientAdminSkeleton = () => (
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
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead className="w-[150px] hidden md:table-cell">Logo</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="w-[100px]">Visible</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(3)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-12 w-6 mx-auto" /></TableCell>
                                    <TableCell className="hidden md:table-cell"><Skeleton className="h-10 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
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


const ClientForm = ({ client, onSave, onFileChange, logoPreview }: { client?: Client | null, onSave: (client: Omit<Client, '_id' | 'logoUrl'> & { logoUrl?: string }) => void, onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void, logoPreview: string | null }) => {
    const [name, setName] = useState(client?.name || '');
    const [website, setWebsite] = useState(client?.website || '');
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newClient: Omit<Client, '_id' | 'logoUrl'> & { logoUrl?: string } = {
            name,
            website,
            isVisible: client?.isVisible ?? true,
        };
        // The logoUrl will be handled by the parent component after upload
        onSave(newClient);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Client Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" />
            </div>
             <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                    <Image src={logoPreview || client?.logoUrl || 'https://placehold.co/150x50/white/black?text=Logo'} alt={client?.name || 'New Client'} width={150} height={50} className="rounded-md object-contain bg-muted p-2" />
                    <Input type="file" className="max-w-xs" onChange={onFileChange} accept="image/*" />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Client</Button>
            </DialogFooter>
        </form>
    )
}

const ViewClientDialog = ({ client, open, onOpenChange }: { client: Client | null; open: boolean; onOpenChange: (open: boolean) => void; }) => {
    if (!client) return null;

    return (
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>View Client</DialogTitle>
                    <DialogDescription>{client.name}</DialogDescription>
                </DialogHeader>
                <div className="flex justify-center items-center p-8 bg-muted rounded-md my-4">
                    <Image src={client.logoUrl} alt={client.name} width={200} height={80} className="object-contain" />
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


const ClientsAdminPage = () => {
    const { toast } = useToast();
    const { data: clients = [], isLoading: isQueryLoading, isError } = useGetClientsDataQuery();
    const [updateClients, { isLoading: isMutationLoading }] = useUpdateClientsDataMutation();
    const [addActionLog] = useAddActionLogMutation();
    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const filteredClients = clients.filter(client => client.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
    const paginatedClients = filteredClients.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    
    const stats = useMemo(() => ({
        total: clients.length,
        visible: clients.filter(c => c.isVisible).length,
        hidden: clients.filter(c => !c.isVisible).length,
    }), [clients]);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerUpdate = async (updatedItems: Client[], actionLog: Omit<Parameters<typeof addActionLog>[0], 'user' | 'section'>) => {
        try {
            await updateClients(updatedItems).unwrap();
            await addActionLog({
                user: 'Admin User',
                section: 'Clients',
                ...actionLog,
            }).unwrap();
            toast({
                title: 'Content Saved',
                description: 'Clients list has been updated successfully.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Save Failed',
                description: 'There was an error saving the clients.',
            });
        }
    };


    const handleMove = (index: number, direction: 'up' | 'down') => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const newClients = [...clients];
        const item = newClients[fullIndex];
        
        if (direction === 'up' && fullIndex > 0) {
            newClients.splice(fullIndex, 1);
            newClients.splice(fullIndex - 1, 0, item);
        } else if (direction === 'down' && fullIndex < newClients.length - 1) {
            newClients.splice(fullIndex, 1);
            newClients.splice(fullIndex + 1, 0, item);
        }
        triggerUpdate(newClients, { action: `reordered clients`, type: 'UPDATE' });
    };

    const handleAddClick = () => {
        setSelectedClient(null);
        setEditingIndex(null);
        setImageFile(null);
        setLogoPreview(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (client: Client, index: number) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        setSelectedClient(client);
        setEditingIndex(fullIndex);
        setImageFile(null);
        setLogoPreview(null);
        setIsFormOpen(true);
    };

    const handleViewClick = (client: Client) => {
        setSelectedClient(client);
        setIsViewOpen(true);
    };

    const handleDelete = (index: number) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const deletedClient = clients[fullIndex];
        const newClients = clients.filter((_, i) => i !== fullIndex);
        triggerUpdate(newClients, { action: `deleted client "${deletedClient.name}"`, type: 'DELETE' });
        toast({
            variant: "destructive",
            title: "Client Deleted",
            description: "The client has been removed from the list.",
        });
    };
    
    const handleSave = async (clientData: Omit<Client, '_id'>) => {
        let finalData = { ...clientData };
        let action: string, type: 'CREATE' | 'UPDATE';

        try {
            if (imageFile) {
                const uploadResult = await uploadImage(imageFile).unwrap();
                if (uploadResult.url) {
                    finalData.logoUrl = uploadResult.url;
                } else {
                    throw new Error('Image upload failed to return a URL.');
                }
            } else if (selectedClient) {
                 finalData.logoUrl = selectedClient.logoUrl;
            } else {
                 finalData.logoUrl = 'https://placehold.co/150x50/white/black?text=Logo'; // Default placeholder
            }

            let newItems: Client[];

            if (editingIndex !== null) {
                newItems = [...clients];
                newItems[editingIndex] = { ...clients[editingIndex], ...finalData };
                action = `updated client "${finalData.name}"`;
                type = 'UPDATE';
            } else {
                const newClient = { ...finalData } as Client;
                newItems = [newClient, ...clients];
                action = `created client "${finalData.name}"`;
                type = 'CREATE';
            }
            await triggerUpdate(newItems, { action, type });
            
            setIsFormOpen(false);
            setImageFile(null);
            setLogoPreview(null);
            toast({
                title: `Client ${editingIndex !== null ? 'Updated' : 'Created'}`,
                description: `The client "${finalData.name}" has been saved.`,
            });
        } catch (error) {
            console.error('Save failed:', error);
            toast({
                variant: 'destructive',
                title: 'Save Failed',
                description: `There was an error saving the client. ${error.message || ''}`,
            });
        }
    };
    
    const handleVisibilityChange = (index: number, isVisible: boolean) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const newItems = clients.map((item, i) =>
            i === fullIndex ? { ...item, isVisible } : item
        );
        const client = clients[fullIndex];
        triggerUpdate(newItems, { action: `set visibility of client "${client.name}" to ${isVisible}`, type: 'UPDATE' });
    }

    if (isQueryLoading) {
        return <ClientAdminSkeleton />;
    }
    
    if (isError) {
        return (
            <Card className="flex flex-col items-center justify-center p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <CardTitle className="text-xl text-destructive">Error Loading Data</CardTitle>
                <CardDescription className="mt-2">
                    There was a problem fetching the content for the Clients page. Please try refreshing the page.
                </CardDescription>
            </Card>
        );
    }


    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                        <Handshake className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Visible Clients</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.visible}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hidden Clients</CardTitle>
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
                        <CardTitle>Clients Section</CardTitle>
                        <CardDescription>Manage the client logos shown in the marquee.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by name..."
                                className="pl-8 sm:w-[200px] lg:w-[300px]"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                         <Button onClick={handleAddClick} disabled={isMutationLoading || isUploading}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Client
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Card className="relative">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead className="w-[150px] hidden md:table-cell">Logo</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="w-[100px]">Visible</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedClients.map((client, index) => (
                                    <TableRow key={client._id || index}>
                                        <TableCell className="text-center align-middle">
                                            <div className="flex flex-col items-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'up')} disabled={isMutationLoading || isUploading || (currentPage - 1) * ITEMS_PER_PAGE + index === 0}>
                                                    <ArrowUp className="h-4 w-4" />
                                                </Button>
                                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'down')} disabled={isMutationLoading || isUploading || (currentPage - 1) * ITEMS_PER_PAGE + index === clients.length - 1}>
                                                    <ArrowDown className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Image src={client.logoUrl} alt={client.name} width={120} height={40} className="rounded-md object-contain bg-muted p-1" />
                                        </TableCell>
                                        <TableCell className="font-medium">{client.name}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={client.isVisible}
                                                onCheckedChange={(checked) => handleVisibilityChange(index, checked)}
                                                disabled={isMutationLoading || isUploading}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" disabled={isMutationLoading || isUploading}>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleViewClick(client)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleEditClick(client, index)}>
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
                         {(isMutationLoading || isUploading) && (
                            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        )}
                        <div className="flex items-center justify-between border-t p-4">
                            <div className="text-xs text-muted-foreground">
                                Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedClients.length}</strong> of <strong>{filteredClients.length}</strong> clients
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
                        <DialogTitle>{selectedClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
                        <DialogDescription>
                            {selectedClient ? 'Make changes to this client.' : 'Add a new client to the marquee.'}
                        </DialogDescription>
                    </DialogHeader>
                    <ClientForm 
                        client={selectedClient} 
                        onSave={handleSave}
                        onFileChange={handleFileChange}
                        logoPreview={logoPreview}
                    />
                </DialogContent>
            </Dialog>

            <ViewClientDialog client={selectedClient} open={isViewOpen} onOpenChange={setIsViewOpen} />
        </div>
    );
}

export default ClientsAdminPage;

    