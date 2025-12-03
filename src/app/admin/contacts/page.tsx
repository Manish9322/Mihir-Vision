
'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Trash2, ChevronLeft, ChevronRight, Inbox, MailCheck, ListFilter, Search, Loader2, Eye, Phone } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useGetContactsQuery, useDeleteContactMutation } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

type ContactMessage = {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    status: 'New' | 'Replied';
    createdAt: string;
};

const ITEMS_PER_PAGE = 5;

const ViewMessageDialog = ({ message, open, onOpenChange }: { message: ContactMessage | null; open: boolean; onOpenChange: (open: boolean) => void; }) => {
    if (!message) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Message from {message.name}</DialogTitle>
                    <DialogDescription>
                        Received on {format(new Date(message.createdAt), 'PPP')}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="text-sm">
                        <p className="font-medium">From: <span className="font-normal text-muted-foreground">{message.name} &lt;{message.email}&gt;</span></p>
                        {message.phone && <p className="font-medium">Phone: <span className="font-normal text-muted-foreground">{message.phone}</span></p>}
                    </div>
                    <div className="p-4 bg-muted rounded-md border text-sm text-foreground">
                        {message.message}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Close</Button>
                    </DialogClose>
                    <Button asChild>
                        <a href={`mailto:${message.email}`}>
                            <Mail className="mr-2 h-4 w-4" /> Reply
                        </a>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


const ContactsPage = () => {
    const { toast } = useToast();
    const { data: messages = [], isLoading, isError } = useGetContactsQuery();
    const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();
    
    const [filter, setFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    const filteredMessages = useMemo(() => {
        return (messages || []).filter(message => {
            const statusMatch = filter === 'all' || message.status.toLowerCase() === filter;
            const searchMatch = !searchQuery ||
                message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (message.phone && message.phone.includes(searchQuery));
            return statusMatch && searchMatch;
        });
    }, [messages, filter, searchQuery]);


    const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
    const paginatedMessages = filteredMessages.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalMessages = messages.length;
    const newMessages = messages.filter(m => m.status === 'New').length;
    const repliedMessages = messages.filter(m => m.status === 'Replied').length;
    
    const handleDelete = async (id: string) => {
        try {
            await deleteContact(id).unwrap();
            toast({
                title: "Message Deleted",
                description: "The contact message has been removed.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Deletion Failed",
                description: "There was an error deleting the message.",
            });
        }
    };
    
    const handleViewClick = (message: ContactMessage) => {
        setSelectedMessage(message);
        setIsViewOpen(true);
    };


    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (isError) {
        return <div>Error loading contact messages. Please try again.</div>;
    }


    return (
        <>
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                            <Inbox className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalMessages}</div>
                            <p className="text-xs text-muted-foreground">All time received messages</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
                            <Mail className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{newMessages}</div>
                            <p className="text-xs text-muted-foreground">Messages awaiting reply</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Replied Messages</CardTitle>
                            <MailCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{repliedMessages}</div>
                            <p className="text-xs text-muted-foreground">Messages that have been answered</p>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader className="px-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Contact Messages</CardTitle>
                            <CardDescription>
                                Recent messages received from the contact form.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-initial">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search by name, email or phone"
                                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-10 gap-1">
                                        <ListFilter className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                            Filter
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem checked={filter === 'all'} onCheckedChange={() => setFilter('all')}>
                                        All
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem checked={filter === 'new'} onCheckedChange={() => setFilter('new')}>
                                        New
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem checked={filter === 'replied'} onCheckedChange={() => setFilter('replied')}>
                                        Replied
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead className="hidden sm:table-cell">Phone</TableHead>
                                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                                    <TableHead className="hidden md:table-cell">Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedMessages.length > 0 ? (
                                    paginatedMessages.map((message) => (
                                        <TableRow key={message._id}>
                                            <TableCell>
                                                <div className="font-medium">{message.name}</div>
                                                <div className="hidden text-sm text-muted-foreground md:inline">
                                                    {message.email}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell text-muted-foreground">
                                                {message.phone || 'N/A'}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <Badge className="text-xs" variant={message.status === 'New' ? 'default' : 'outline'}>
                                                    {message.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {format(new Date(message.createdAt), 'PP')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleViewClick(message)}>
                                                        <Eye className="h-4 w-4" />
                                                        <span className="sr-only">View</span>
                                                    </Button>
                                                    <Button size="icon" variant="outline" className="h-8 w-8" asChild>
                                                        <a href={`mailto:${message.email}`}>
                                                            <Mail className="h-4 w-4" />
                                                            <span className="sr-only">Reply</span>
                                                        </a>
                                                    </Button>
                                                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleDelete(message._id)} disabled={isDeleting}>
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No messages found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <div className="flex items-center justify-between border-t p-4">
                        <div className="text-xs text-muted-foreground">
                            Showing <strong>{paginatedMessages.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedMessages.length}</strong> of <strong>{filteredMessages.length}</strong> messages
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Previous</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                 <span className="sr-only">Next</span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
            <ViewMessageDialog message={selectedMessage} open={isViewOpen} onOpenChange={setIsViewOpen} />
        </>
    );
};

export default ContactsPage;
