'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { contactsData } from '@/lib/data';
import { Mail, Trash2, ChevronLeft, ChevronRight, Inbox, MailCheck, ListFilter } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';

const ITEMS_PER_PAGE = 5;

const ContactsPage = () => {
    const [filter, setFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredMessages = contactsData.messages.filter(message => {
        if (filter === 'all') return true;
        return message.status.toLowerCase() === filter;
    });

    const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
    const paginatedMessages = filteredMessages.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalMessages = contactsData.messages.length;
    const newMessages = contactsData.messages.filter(m => m.status === 'New').length;
    const repliedMessages = contactsData.messages.filter(m => m.status === 'Replied').length;

    return (
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
                <CardHeader className="px-7 flex-row items-center justify-between">
                    <div>
                        <CardTitle>Contact Messages</CardTitle>
                        <CardDescription>
                            Recent messages received from the contact form.
                        </CardDescription>
                    </div>
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 gap-1">
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
                                <TableHead className="hidden sm:table-cell">Status</TableHead>
                                <TableHead className="hidden md:table-cell">Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedMessages.length > 0 ? (
                                paginatedMessages.map((message) => (
                                    <TableRow key={message.id}>
                                        <TableCell>
                                            <div className="font-medium">{message.name}</div>
                                            <div className="hidden text-sm text-muted-foreground md:inline">
                                                {message.email}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Badge className="text-xs" variant={message.status === 'New' ? 'default' : 'outline'}>
                                                {message.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{message.date}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="icon" variant="outline" className="h-8 w-8">
                                                    <Mail className="h-4 w-4" />
                                                    <span className="sr-only">Reply</span>
                                                </Button>
                                                <Button size="icon" variant="outline" className="h-8 w-8">
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No messages found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                <div className="flex items-center justify-between border-t p-4">
                    <div className="text-xs text-muted-foreground">
                        Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedMessages.length}</strong> of <strong>{filteredMessages.length}</strong> messages
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
    );
};

export default ContactsPage;
