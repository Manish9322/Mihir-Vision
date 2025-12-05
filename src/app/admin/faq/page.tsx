
'use client';
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, ArrowUp, ArrowDown, GripVertical, ChevronLeft, ChevronRight, MoreHorizontal, FilePenLine, Eye, Loader2, HelpCircle, EyeOff, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useGetFaqDataQuery, useUpdateFaqDataMutation, useAddActionLogMutation } from '@/services/api';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';

type FAQ = {
    _id?: string;
    question: string;
    answer: string;
    isVisible: boolean;
};

const ITEMS_PER_PAGE = 3;

const FaqAdminSkeleton = () => (
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
                <Skeleton className="h-10 w-28" />
            </CardHeader>
            <CardContent>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead>Question</TableHead>
                                <TableHead className="hidden md:table-cell">Answer</TableHead>
                                <TableHead className="w-[100px]">Visible</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-12 w-6 mx-auto" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-64" /></TableCell>
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


const FaqForm = ({ faq, onSave }: { faq?: FAQ | null, onSave: (faq: Omit<FAQ, '_id'>) => void }) => {
    const [question, setQuestion] = useState(faq?.question || '');
    const [answer, setAnswer] = useState(faq?.answer || '');
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newFaq: Omit<FAQ, '_id'> = { question, answer, isVisible: faq?.isVisible ?? true };
        onSave(newFaq);
        toast({
            title: `FAQ ${faq ? 'Updated' : 'Created'}`,
            description: `The FAQ has been saved.`,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input id="question" value={question} onChange={(e) => setQuestion(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea id="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} required rows={4} />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save FAQ</Button>
            </DialogFooter>
        </form>
    );
};

const ViewFaqDialog = ({ faq, open, onOpenChange }: { faq: FAQ | null; open: boolean; onOpenChange: (open: boolean) => void; }) => {
    if (!faq) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{faq.question}</DialogTitle>
                    <DialogDescription>Viewing FAQ details.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                     <p className="text-sm text-muted-foreground">{faq.answer}</p>
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


const FaqAdminPage = () => {
    const { toast } = useToast();
    const { data: faqs = [], isLoading: isQueryLoading, isError } = useGetFaqDataQuery();
    const [updateFaqs, { isLoading: isMutationLoading }] = useUpdateFaqDataMutation();
    const [addActionLog] = useAddActionLogMutation();

    const [currentPage, setCurrentPage] = useState(1);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const totalPages = Math.ceil(faqs.length / ITEMS_PER_PAGE);
    const paginatedFaqs = faqs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    
    const stats = useMemo(() => ({
        total: faqs.length,
        visible: faqs.filter(faq => faq.isVisible).length,
        hidden: faqs.filter(faq => !faq.isVisible).length,
    }), [faqs]);

    const triggerUpdate = async (updatedItems: FAQ[], actionLog: Omit<Parameters<typeof addActionLog>[0], 'user' | 'section'>) => {
        try {
            await updateFaqs(updatedItems).unwrap();
            await addActionLog({
                user: 'Admin User',
                section: 'FAQ',
                ...actionLog,
            }).unwrap();
            toast({
                title: 'Content Saved',
                description: 'FAQ section has been updated successfully.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Save Failed',
                description: 'There was an error saving the FAQs.',
            });
        }
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const newItems = [...faqs];
        const item = newItems[fullIndex];

        if (direction === 'up' && fullIndex > 0) {
            newItems.splice(fullIndex, 1);
            newItems.splice(fullIndex - 1, 0, item);
        } else if (direction === 'down' && fullIndex < newItems.length - 1) {
            newItems.splice(fullIndex, 1);
            newItems.splice(fullIndex + 1, 0, item);
        }
        triggerUpdate(newItems, { action: `reordered FAQs`, type: 'UPDATE' });
    };

    const handleAddClick = () => {
        setSelectedFaq(null);
        setEditingIndex(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (faq: FAQ, index: number) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        setSelectedFaq(faq);
        setEditingIndex(fullIndex);
        setIsFormOpen(true);
    };

    const handleViewClick = (faq: FAQ) => {
        setSelectedFaq(faq);
        setIsViewOpen(true);
    };

    const handleDelete = (index: number) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const deletedFaq = faqs[fullIndex];
        const newItems = faqs.filter((_, i) => i !== fullIndex);
        triggerUpdate(newItems, { action: `deleted FAQ "${deletedFaq.question}"`, type: 'DELETE' });
        toast({
            variant: "destructive",
            title: "FAQ Deleted",
            description: "The FAQ has been removed.",
        });
    };
    
    const handleSave = (faqData: Omit<FAQ, '_id'>) => {
        let newItems: FAQ[];
        let action: string, type: 'CREATE' | 'UPDATE';

        if (editingIndex !== null) {
            newItems = [...faqs];
            newItems[editingIndex] = { ...newItems[editingIndex], ...faqData };
            action = `updated FAQ "${faqData.question}"`;
            type = 'UPDATE';
        } else {
            const newFaq = { ...faqData, _id: `new_${Date.now()}`}; 
            newItems = [newFaq, ...faqs];
            action = `created FAQ "${faqData.question}"`;
            type = 'CREATE';
        }
        triggerUpdate(newItems, { action, type });
        setIsFormOpen(false);
    };

    const handleVisibilityChange = (index: number, isVisible: boolean) => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const newItems = [...faqs];
        newItems[fullIndex].isVisible = isVisible;
        const faq = faqs[fullIndex];
        triggerUpdate(newItems, { action: `set visibility of FAQ "${faq.question}" to ${isVisible}`, type: 'UPDATE' });
    }
    
    if (isQueryLoading) {
        return <FaqAdminSkeleton />;
    }
    
    if (isError) {
        return (
            <Card className="flex flex-col items-center justify-center p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <CardTitle className="text-xl text-destructive">Error Loading Data</CardTitle>
                <CardDescription className="mt-2">
                    There was a problem fetching the content for the FAQ page. Please try refreshing the page.
                </CardDescription>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total FAQs</CardTitle>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Visible FAQs</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.visible}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hidden FAQs</CardTitle>
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
                        <CardTitle>FAQ Section</CardTitle>
                        <CardDescription>Manage the questions and answers in the FAQ section.</CardDescription>
                    </div>
                     <Button onClick={handleAddClick} disabled={isMutationLoading}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add FAQ
                    </Button>
                </CardHeader>
                <CardContent>
                    <Card className="relative">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Question</TableHead>
                                    <TableHead className="hidden md:table-cell">Answer</TableHead>
                                    <TableHead className="w-[100px]">Visible</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedFaqs.map((faq, index) => (
                                    <TableRow key={faq._id || index}>
                                        <TableCell className="text-center align-middle">
                                            <div className="flex flex-col items-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'up')} disabled={isMutationLoading || (currentPage - 1) * ITEMS_PER_PAGE + index === 0}>
                                                    <ArrowUp className="h-4 w-4" />
                                                </Button>
                                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'down')} disabled={isMutationLoading || (currentPage - 1) * ITEMS_PER_PAGE + index === faqs.length - 1}>
                                                    <ArrowDown className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium max-w-xs truncate">{faq.question}</TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground truncate max-w-sm">{faq.answer}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={faq.isVisible}
                                                onCheckedChange={(checked) => handleVisibilityChange(index, checked)}
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
                                                    <DropdownMenuItem onClick={() => handleViewClick(faq)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleEditClick(faq, index)}>
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
                        {isMutationLoading && (
                            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        )}
                        <div className="flex items-center justify-between border-t p-4">
                        <div className="text-xs text-muted-foreground">
                            Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedFaqs.length}</strong> of <strong>{faqs.length}</strong> FAQs
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
                        <DialogTitle>{selectedFaq ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle>
                        <DialogDescription>
                            {selectedFaq ? 'Make changes to this FAQ.' : 'Fill out the details for the new FAQ.'}
                        </DialogDescription>
                    </DialogHeader>
                    <FaqForm faq={selectedFaq} onSave={handleSave} />
                </DialogContent>
            </Dialog>

            <ViewFaqDialog faq={selectedFaq} open={isViewOpen} onOpenChange={setIsViewOpen} />
        </div>
    );
}

export default FaqAdminPage;
