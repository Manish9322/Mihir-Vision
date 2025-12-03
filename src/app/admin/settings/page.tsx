
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from 'lucide-react';
import { useGetSettingsDataQuery, useUpdateSettingsDataMutation } from '@/services/api';

type SettingsFormValues = {
    siteName: string;
    siteTagline: string;
};

export default function SettingsPage() {
    const { toast } = useToast();
    const { data: settingsData, isLoading: isQueryLoading, isError } = useGetSettingsDataQuery();
    const [updateSettings, { isLoading: isMutationLoading }] = useUpdateSettingsDataMutation();
    
    const { register, handleSubmit, reset } = useForm<SettingsFormValues>({
        defaultValues: settingsData || {
            siteName: '',
            siteTagline: '',
        }
    });

    useEffect(() => {
        if (settingsData) {
            reset(settingsData);
        }
    }, [settingsData, reset]);

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            await updateSettings(data).unwrap();
            toast({
                title: "Settings Saved",
                description: "General settings have been updated.",
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Save Failed",
                description: "There was an error saving the settings.",
            });
        }
    };
    
    const handleNotificationsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Settings Saved",
            description: `Notification settings have been updated.`,
        });
    };

    if (isQueryLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    if (isError) {
        return <div>Error loading settings data.</div>;
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Manage your site's general configuration.</CardDescription>
                </CardHeader>
                <CardContent>
                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="siteName">Site Name</Label>
                            <Input id="siteName" {...register("siteName")} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="siteTagline">Tagline</Label>
                            <Input id="siteTagline" {...register("siteTagline")} />
                        </div>
                        <Button type="submit" disabled={isMutationLoading}>
                             {isMutationLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save General
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Configure how you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleNotificationsSubmit} className="space-y-6">
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
