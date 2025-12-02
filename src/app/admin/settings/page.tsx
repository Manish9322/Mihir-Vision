'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent, section: string) => {
        e.preventDefault();
        toast({
            title: "Settings Saved",
            description: `${section} settings have been updated.`,
        });
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Manage your site's general configuration.</CardDescription>
                </CardHeader>
                <CardContent>
                     <form onSubmit={(e) => handleSubmit(e, 'General')} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="siteName">Site Name</Label>
                            <Input id="siteName" defaultValue="Pinnacle Pathways" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="siteTagline">Tagline</Label>
                            <Input id="siteTagline" defaultValue="Forging new paths to the peak of innovation." />
                        </div>
                        <Button type="submit">Save General</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Configure how you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => handleSubmit(e, 'Notification')} className="space-y-6">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive an email for every new contact form submission.</p>
                            </div>
                            <Switch id="email-notifications" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                             <div className="space-y-0.5">
                                <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                                <p className="text-sm text-muted-foreground">Get push notifications on your devices. (Coming soon)</p>
                            </div>
                            <Switch id="push-notifications" disabled />
                        </div>
                        <Button type="submit">Save Notifications</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
