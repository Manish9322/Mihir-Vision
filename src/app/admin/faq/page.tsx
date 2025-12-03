'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { faqData } from '@/lib/data';
import { PlusCircle, Trash2, ArrowUp, ArrowDown, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 3;

const FaqAdminPage = () => {
    const { toast } = useToast();
    const [faqs, setFaqs] = useState(faqData.faqs);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(faqs.length / ITEMS_PER_PAGE);
    const paginatedFaqs = faqs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const fullIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
        const newFaqs = [...faqs];
        const item = newFaqs[fullIndex];

        if (direction === 'up' && fullIndex > 0) {
            newFaqs.splice(fullIndex, 1);
            newFaqs.splice(fullIndex - 1, 0, item);
        } else if (direction === 'down' && fullIndex < newFaqs.length - 1) {
            newFaqs.splice(fullIndex, 1);
            newFaqs.splice(fullIndex + 1, 0, item);
        }
        setFaqs(newFaqs);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: `Content Saved`,
            description: `FAQs section has been updated.`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>FAQ Section</CardTitle>
                <CardDescription>
                    Manage the questions and answers in the FAQ section.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="faq-title">Section Title</Label>
                        <Input id="faq-title" defaultValue={faqData.title} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="faq-subheadline">Section Subheadline</Label>
                        <Textarea id="faq-subheadline" defaultValue={faqData.subheadline} />
                    </div>
                    <div className="space-y-4">
                        <Label>FAQ Items</Label>
                         <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]"></TableHead>
                                        <TableHead>Question</TableHead>
                                        <TableHead>Answer</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedFaqs.map((faq, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="text-center align-middle">
                                                <div className="flex flex-col items-center gap-1">
                                                     <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'up')} disabled={(currentPage - 1) * ITEMS_PER_PAGE + index === 0}>
                                                        <ArrowUp className="h-4 w-4" />
                                                    </Button>
                                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'down')} disabled={(currentPage - 1) * ITEMS_PER_PAGE + index === faqs.length - 1}>
                                                        <ArrowDown className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Input defaultValue={faq.question} />
                                            </TableCell>
                                            <TableCell>
                                                <Textarea defaultValue={faq.answer} rows={3} />
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
                        <Button variant="outline" className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add FAQ
                        </Button>
                    </div>
                    <Button type="submit">Save Changes</Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default FaqAdminPage;
