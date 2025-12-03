'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, ArrowUp, ArrowDown, GripVertical, ChevronLeft, ChevronRight, MoreHorizontal, FilePenLine, Eye, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useGetFaqDataQuery, useUpdateFaqDataMutation } from '@/services/api';


type FAQ = {
    _id?: string;
    question: string;
    answer: string;
};

const ITEMS_PER_PAGE = 3;

const FaqForm = ({ faq, onSave }: { faq?: FAQ | null, onSave: (faq: Omit<FAQ, '_id'>) => void }) => {
    const [question, setQuestion] = useState(faq?.question || '');
    const [answer, setAnswer] = useState(faq?.answer || '');
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newFaq: Omit<FAQ, '_id'> = { question, answer };
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
    const [items, setItems] = useState<FAQ[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    useEffect(() => {
        if (faqs) {
            setItems(faqs);
        }
    }, [faqs]);

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const paginatedFaqs = items.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const triggerUpdate = async (updatedItems: FAQ[]) => {
        try {
            await updateFaqs(updatedItems).unwrap();
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
        triggerUpdate(newItems);
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
        const newItems = items.filter((_, i) => i !== fullIndex);
        setItems(newItems);
        triggerUpdate(newItems);
        toast({
            variant: "destructive",
            title: "FAQ Deleted",
            description: "The FAQ has been removed.",
        });
    };
    
    const handleSave = (faqData: Omit<FAQ, '_id'>) => {
        let newItems: FAQ[];
        if (editingIndex !== null) {
            newItems = [...items];
            newItems[editingIndex] = { ...newItems[editingIndex], ...faqData };
        } else {
            const newFaq = { ...faqData, _id: `new_${Date.now()}`}; 
            newItems = [newFaq, ...items];
        }
        setItems(newItems);
        triggerUpdate(newItems);
        setIsFormOpen(false);
    };
    
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
        <>
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
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'down')} disabled={isMutationLoading || (currentPage - 1) * ITEMS_PER_PAGE + index === items.length - 1}>
                                                    <ArrowDown className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium max-w-xs truncate">{faq.question}</TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground truncate max-w-sm">{faq.answer}</TableCell>
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
                            Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedFaqs.length}</strong> of <strong>{items.length}</strong> FAQs
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
        </>
    );
}

export default FaqAdminPage;
