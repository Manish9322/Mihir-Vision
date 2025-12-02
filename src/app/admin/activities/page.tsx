'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { activitiesData } from '@/lib/data';
import { PlusCircle, Trash2 } from 'lucide-react';

const ActivitiesAdminPage = () => {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: `Content Saved`,
            description: `Activities section has been updated.`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Activities Section</CardTitle>
                <CardDescription>
                    Manage the items in the "What We Do" section.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="activities-title">Section Title</Label>
                        <Input id="activities-title" defaultValue={activitiesData.title} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="activities-subheadline">Section Subheadline</Label>
                        <Textarea id="activities-subheadline" defaultValue={activitiesData.subheadline} />
                    </div>
                    <div className="space-y-4">
                        <Label>Activities</Label>
                        {activitiesData.activities.map((activity, index) => (
                            <Card key={index} className="p-4">
                                <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                                    <div className="space-y-2">
                                        <Label htmlFor={`activity-title-${index}`}>Title</Label>
                                        <Input id={`activity-title-${index}`} defaultValue={activity.title} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`activity-desc-${index}`}>Description</Label>
                                        <Input id={`activity-desc-${index}`} defaultValue={activity.description} />
                                    </div>
                                    <div className="flex items-end">
                                        <Button variant="outline" size="icon">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        <Button variant="outline" className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Activity
                        </Button>
                    </div>
                    <Button type="submit">Save Changes</Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default ActivitiesAdminPage;
