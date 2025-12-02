'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { faqData } from '@/lib/data';
import { PlusCircle, Trash2 } from 'lucide-react';

const FaqAdminPage = () => {
    const { toast } = useToast();

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
                        {faqData.faqs.map((faq, index) => (
                            <Card key={index} className="p-4 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`faq-question-${index}`}>Question</Label>
                                    <Input id={`faq-question-${index}`} defaultValue={faq.question} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`faq-answer-${index}`}>Answer</Label>
                                    <Textarea id={`faq-answer-${index}`} defaultValue={faq.answer} rows={3} />
                                </div>
                                <div className="flex justify-end">
                                     <Button variant="outline" size="icon">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
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
