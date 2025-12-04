
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useGetSettingsDataQuery, useUpdateSettingsDataMutation, useGetCountriesQuery, useUpdateCountriesMutation, useGetStatesQuery, useUpdateStatesMutation, useGetCitiesQuery, useUpdateCitiesMutation } from '@/services/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const ProfileOptionsManager = () => {
    const { toast } = useToast();
    const { data: countries = [], isLoading: isCountriesLoading } = useGetCountriesQuery();
    const { data: states = [], isLoading: isStatesLoading } = useGetStatesQuery();
    const { data: cities = [], isLoading: isCitiesLoading } = useGetCitiesQuery();
    
    const [updateCountries, { isLoading: isUpdatingCountries }] = useUpdateCountriesMutation();
    const [updateStates, { isLoading: isUpdatingStates }] = useUpdateStatesMutation();
    const [updateCities, { isLoading: isUpdatingCities }] = useUpdateCitiesMutation();

    const { control: countryControl, handleSubmit: handleCountrySubmit, reset: resetCountries } = useForm({ defaultValues: { countries } });
    const { control: stateControl, handleSubmit: handleStateSubmit, reset: resetStates } = useForm({ defaultValues: { states } });
    const { control: cityControl, handleSubmit: handleCitySubmit, reset: resetCities } = useForm({ defaultValues: { cities } });

    const { fields: countryFields, append: appendCountry, remove: removeCountry } = useFieldArray({ control: countryControl, name: "countries" });
    const { fields: stateFields, append: appendState, remove: removeState } = useFieldArray({ control: stateControl, name: "states" });
    const { fields: cityFields, append: appendCity, remove: removeCity } = useFieldArray({ control: cityControl, name: "cities" });

    useEffect(() => { resetCountries({ countries }) }, [countries, resetCountries]);
    useEffect(() => { resetStates({ states }) }, [states, resetStates]);
    useEffect(() => { resetCities({ cities }) }, [cities, resetCities]);

    const onSaveCountries = async (data) => {
        try {
            await updateCountries(data.countries).unwrap();
            toast({ title: "Countries Saved", description: "The list of countries has been updated." });
        } catch {
            toast({ variant: 'destructive', title: "Save Failed", description: "Could not save countries." });
        }
    };
    const onSaveStates = async (data) => {
        try {
            await updateStates(data.states).unwrap();
            toast({ title: "States Saved", description: "The list of states has been updated." });
        } catch {
            toast({ variant: 'destructive', title: "Save Failed", description: "Could not save states." });
        }
    };
    const onSaveCities = async (data) => {
         try {
            await updateCities(data.cities).unwrap();
            toast({ title: "Cities Saved", description: "The list of cities has been updated." });
        } catch {
            toast({ variant: 'destructive', title: "Save Failed", description: "Could not save cities." });
        }
    };
    
    const isLoading = isCountriesLoading || isStatesLoading || isCitiesLoading;
    const isSaving = isUpdatingCountries || isUpdatingStates || isUpdatingCities;

    if (isLoading) {
        return <div className="flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="space-y-8">
            <form onSubmit={handleCountrySubmit(onSaveCountries)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Countries</CardTitle>
                        <CardDescription>Manage the countries available for user profiles.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {countryFields.map((field, index) => (
                            <div key={field.id} className="flex gap-4 items-start border p-4 rounded-md">
                                <div className="flex-grow space-y-2">
                                    <Input {...countryControl.register(`countries.${index}.name`)} placeholder="Country Name"/>
                                    <Textarea {...countryControl.register(`countries.${index}.description`)} placeholder="Description"/>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeCountry(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => appendCountry({ _id: `new_${Date.now()}`, name: '', description: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Add Country</Button>
                    </CardContent>
                </Card>
                 <Button type="submit" disabled={isSaving} className="mt-4">
                    {isUpdatingCountries && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Countries
                </Button>
            </form>

            <form onSubmit={handleStateSubmit(onSaveStates)}>
                <Card>
                    <CardHeader>
                        <CardTitle>States / Provinces</CardTitle>
                        <CardDescription>Manage states and assign them to a country.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {stateFields.map((field, index) => (
                            <div key={field.id} className="flex gap-4 items-start border p-4 rounded-md">
                                <div className="flex-grow space-y-2">
                                    <Input {...stateControl.register(`states.${index}.name`)} placeholder="State Name"/>
                                    <Textarea {...stateControl.register(`states.${index}.description`)} placeholder="Description"/>
                                    <Controller
                                        control={stateControl}
                                        name={`states.${index}.country`}
                                        render={({ field: controllerField }) => (
                                            <Select onValueChange={controllerField.onChange} defaultValue={field.country}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a country" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {countries?.map(c => <SelectItem key={c._id || c.name} value={c.name}>{c.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeState(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => appendState({ _id: `new_${Date.now()}`, name: '', description: '', country: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Add State</Button>
                    </CardContent>
                </Card>
                <Button type="submit" disabled={isSaving} className="mt-4">
                    {isUpdatingStates && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save States
                </Button>
            </form>

            <form onSubmit={handleCitySubmit(onSaveCities)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Cities</CardTitle>
                        <CardDescription>Manage cities and assign them to a state.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {cityFields.map((field, index) => (
                            <div key={field.id} className="flex gap-4 items-start border p-4 rounded-md">
                                <div className="flex-grow space-y-2">
                                    <Input {...cityControl.register(`cities.${index}.name`)} placeholder="City Name"/>
                                    <Textarea {...cityControl.register(`cities.${index}.description`)} placeholder="Description"/>
                                    <Controller
                                        control={cityControl}
                                        name={`cities.${index}.state`}
                                        render={({ field: controllerField }) => (
                                            <Select onValueChange={controllerField.onChange} defaultValue={field.state}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a state" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {states?.map(s => <SelectItem key={s._id || s.name} value={s.name}>{s.name} ({s.country})</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeCity(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => appendCity({ _id: `new_${Date.now()}`, name: '', description: '', state: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Add City</Button>
                    </CardContent>
                </Card>
                <Button type="submit" disabled={isSaving} className="mt-4">
                    {isUpdatingCities && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Cities
                </Button>
            </form>
        </div>
    );
}

export default function SettingsPage() {
    const { toast } = useToast();
    const { data: settingsData, isLoading: isQueryLoading, isError } = useGetSettingsDataQuery();
    const [updateSettings, { isLoading: isMutationLoading }] = useUpdateSettingsDataMutation();
    
    const { register, handleSubmit, reset } = useForm({ defaultValues: settingsData });

    useEffect(() => {
        if (settingsData) {
            reset(settingsData);
        }
    }, [settingsData, reset]);

    const onSubmit = async (data) => {
        try {
            await updateSettings(data).unwrap();
            toast({
                title: "Settings Saved",
                description: "Your general settings have been updated.",
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Save Failed",
                description: "There was an error saving the settings.",
            });
        }
    };
    
    const handleNotificationsSubmit = (e) => {
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
                <ProfileOptionsManager />
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
