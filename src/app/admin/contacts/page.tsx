'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { contactsData } from '@/lib/data';
import { Mail, Trash2 } from 'lucide-react';

const ContactsPage = () => (
    <Card>
        <CardHeader className="px-7">
            <CardTitle>Contact Messages</CardTitle>
            <CardDescription>
                Recent messages received from the contact form.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead className="hidden sm:table-cell">
                        Status
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                        Date
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contactsData.messages.map((message) => (
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
                            <TableCell className="hidden md:table-cell">
                                {message.date}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button size="icon" variant="outline" className="mr-2">
                                    <Mail className="h-4 w-4" />
                                    <span className="sr-only">Reply</span>
                                </Button>
                                <Button size="icon" variant="outline">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

export default ContactsPage;
