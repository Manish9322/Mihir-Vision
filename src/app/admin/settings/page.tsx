
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useGetSettingsDataQuery, useUpdateSettingsDataMutation } from '@/services/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Country = { name: string; description: string };
type State = { name: string; description: string; country: string };
type City = { name: string; description: string; state: string };

type SettingsFormValues = {
    siteName: string;
    siteTagline: string;
    countries: Country[];
    states: State[];
    cities: City[];
};

const ProfileOptionsManager = ({ control, settingsData, triggerUpdate }) => {
    const { fields: countryFields, append: appendCountry, remove: removeCountry } = useFieldArray({ control, name: "countries" });
    const { fields: stateFields, append: appendState, remove: removeState } = useFieldArray({ control, name: "states" });
    const { fields: cityFields, append: appendCity, remove: removeCity } = useFieldArray({ control, name: "cities" });
    
    return (
        <div className="space-y-8">
            {/* Countries Manager */}
            <Card>
                <CardHeader>
                    <CardTitle>Countries</CardTitle>
                    <CardDescription>Manage the countries available for user profiles.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {countryFields.map((field, index) => (
                        <div key={field.id} className="flex gap-4 items-start border p-4 rounded-md">
                            <div className="flex-grow space-y-2">
                                <Input {...control.register(`countries.${index}.name`)} placeholder="Country Name"/>
                                <Textarea {...control.register(`countries.${index}.description`)} placeholder="Description"/>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeCountry(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendCountry({ name: '', description: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Add Country</Button>
                </CardContent>
            </Card>

            {/* States Manager */}
            <Card>
                 <CardHeader>
                    <CardTitle>States / Provinces</CardTitle>
                    <CardDescription>Manage states and assign them to a country.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {stateFields.map((field, index) => (
                         <div key={field.id} className="flex gap-4 items-start border p-4 rounded-md">
                            <div className="flex-grow space-y-2">
                                <Input {...control.register(`states.${index}.name`)} placeholder="State Name"/>
                                <Textarea {...control.register(`states.${index}.description`)} placeholder="Description"/>
                                <Select onValueChange={(value) => control.setValue(`states.${index}.country`, value)} defaultValue={field.country}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {settingsData?.countries?.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeState(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendState({ name: '', description: '', country: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Add State</Button>
                </CardContent>
            </Card>

            {/* Cities Manager */}
            <Card>
                <CardHeader>
                    <CardTitle>Cities</CardTitle>
                    <CardDescription>Manage cities and assign them to a state.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {cityFields.map((field, index) => (
                        <div key={field.id} className="flex gap-4 items-start border p-4 rounded-md">
                            <div className="flex-grow space-y-2">
                                <Input {...control.register(`cities.${index}.name`)} placeholder="City Name"/>
                                <Textarea {...control.register(`cities.${index}.description`)} placeholder="Description"/>
                                 <Select onValueChange={(value) => control.setValue(`cities.${index}.state`, value)} defaultValue={field.state}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {settingsData?.states?.map(s => <SelectItem key={s.name} value={s.name}>{s.name} ({s.country})</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeCity(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendCity({ name: '', description: '', state: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Add City</Button>
                </CardContent>
            </Card>
            <Button onClick={triggerUpdate}>Save Address Options</Button>
        </div>
    );
}

export default function SettingsPage() {
    const { toast } = useToast();
    const { data: settingsData, isLoading: isQueryLoading, isError } = useGetSettingsDataQuery();
    const [updateSettings, { isLoading: isMutationLoading }] = useUpdateSettingsDataMutation();
    
    const { register, control, handleSubmit, reset } = useForm<SettingsFormValues>({
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
                <ProfileOptionsManager control={control} settingsData={settingsData} triggerUpdate={handleSubmit(onSubmit)} />
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
