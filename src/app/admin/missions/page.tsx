'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { futureMissionsData } from '@/lib/data';
import { PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';

const MissionsAdminPage = () => {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: `Content Saved`,
            description: `Missions section has been updated.`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Future Missions Section</CardTitle>
                <CardDescription>
                    Manage the content of the "Future Missions" section.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="missions-title">Section Title</Label>
                        <Input id="missions-title" defaultValue={futureMissionsData.title} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="missions-subheadline">Section Subheadline</Label>
                        <Textarea id="missions-subheadline" defaultValue={futureMissionsData.subheadline} />
                    </div>
                    <div className="space-y-4">
                        <Label>Missions</Label>
                        {futureMissionsData.missions.map((mission, index) => (
                            <Card key={index} className="p-4 space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor={`mission-title-${index}`}>Title</Label>
                                        <Input id={`mission-title-${index}`} defaultValue={mission.title} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`mission-desc-${index}`}>Description</Label>
                                        <Input id={`mission-desc-${index}`} defaultValue={mission.description} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`mission-tags-${index}`}>Tags (comma-separated)</Label>
                                    <Input id={`mission-tags-${index}`} defaultValue={mission.tags.join(', ')} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Image</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative aspect-video w-32 rounded-md overflow-hidden">
                                            <Image src={mission.image.imageUrl} alt={mission.title} fill className="object-cover" />
                                        </div>
                                        <Input type="file" className="max-w-xs" />
                                        <Button variant="outline" size="icon">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        <Button variant="outline" className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Mission
                        </Button>
                    </div>
                    <Button type="submit">Save Changes</Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default MissionsAdminPage;
