'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { timelineData } from '@/lib/data';
import { PlusCircle, Trash2 } from 'lucide-react';

const TimelineAdminPage = () => {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: `Content Saved`,
            description: `Timeline section has been updated.`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Timeline Section</CardTitle>
                <CardDescription>
                    Manage the items in the "DNA Timeline" section.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="timeline-title">Section Title</Label>
                        <Input id="timeline-title" defaultValue={timelineData.title} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="timeline-subheadline">Section Subheadline</Label>
                        <Textarea id="timeline-subheadline" defaultValue={timelineData.subheadline} />
                    </div>
                    <div className="space-y-4">
                        <Label>Timeline Events</Label>
                        {timelineData.events.map((event, index) => (
                            <Card key={index} className="p-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                     <div className="space-y-2">
                                        <Label htmlFor={`event-year-${index}`}>Year</Label>
                                        <Input id={`event-year-${index}`} defaultValue={event.year} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`event-title-${index}`}>Title</Label>
                                        <Input id={`event-title-${index}`} defaultValue={event.title} />
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <Label htmlFor={`event-desc-${index}`}>Description</Label>
                                    <Textarea id={`event-desc-${index}`} defaultValue={event.description} />
                                </div>
                                <div className="flex justify-end mt-4">
                                     <Button variant="outline" size="icon">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                        <Button variant="outline" className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Event
                        </Button>
                    </div>
                    <Button type="submit">Save Changes</Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default TimelineAdminPage;
