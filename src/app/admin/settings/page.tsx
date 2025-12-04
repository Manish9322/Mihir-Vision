
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useGetSettingsDataQuery, useUpdateSettingsDataMutation } from '@/services/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type SettingsFormValues = {
    siteName: string;
    siteTagline: string;
    countries: string[];
    states: string[];
    cities: string[];
};

const ProfileOptionsManager = ({ title, items, onUpdateItems }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAddItem = () => {
        if (inputValue && !items.includes(inputValue)) {
            onUpdateItems([...items, inputValue]);
            setInputValue('');
        }
    };

    const handleRemoveItem = (itemToRemove: string) => {
        onUpdateItems(items.filter(item => item !== itemToRemove));
    };

    return (
        <div className="space-y-4">
            <h4 className="font-medium">{title}</h4>
            <div className="flex items-center gap-2">
                <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={`New ${title.slice(0, -1)}...`} />
                <Button type="button" onClick={handleAddItem}><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
            </div>
            <div className="space-y-2">
                {items.map(item => (
                    <div key={item} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span>{item}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default function SettingsPage() {
    const { toast } = useToast();
    const { data: settingsData, isLoading: isQueryLoading, isError } = useGetSettingsDataQuery();
    const [updateSettings, { isLoading: isMutationLoading }] = useUpdateSettingsDataMutation();
    
    const { register, handleSubmit, reset, getValues, setValue } = useForm<SettingsFormValues>({
        defaultValues: settingsData || {
            siteName: '',
            siteTagline: '',
            countries: [],
            states: [],
            cities: [],
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
                description: "Your settings have been updated.",
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
    
    const handleProfileOptionsUpdate = () => {
        handleSubmit(onSubmit)();
    }

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
        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="profile-options">Profile Options</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
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
            </TabsContent>
            <TabsContent value="profile-options">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Address Options</CardTitle>
                        <CardDescription>Manage the dropdown options for user addresses in the profile page.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                         <ProfileOptionsManager 
                            title="Countries"
                            items={getValues('countries') || []}
                            onUpdateItems={(newItems) => setValue('countries', newItems, { shouldDirty: true })}
                        />
                         <ProfileOptionsManager 
                            title="States"
                            items={getValues('states') || []}
                            onUpdateItems={(newItems) => setValue('states', newItems, { shouldDirty: true })}
                        />
                         <ProfileOptionsManager 
                            title="Cities"
                            items={getValues('cities') || []}
                            onUpdateItems={(newItems) => setValue('cities', newItems, { shouldDirty: true })}
                        />
                        <Button onClick={handleProfileOptionsUpdate} disabled={isMutationLoading}>
                            {isMutationLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Address Options
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="notifications">
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
            </TabsContent>
        </Tabs>
    );
}
