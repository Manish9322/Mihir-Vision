
'use client';

import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetProfileDataQuery, useUpdateProfileDataMutation, useGetCountriesQuery, useGetStatesQuery, useGetCitiesQuery } from '@/services/api';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProfilePage() {
    const { toast } = useToast();
    const { data: profileData, isLoading: isProfileLoading, isError: isProfileError } = useGetProfileDataQuery();
    const { data: countries = [], isLoading: isCountriesLoading } = useGetCountriesQuery();
    const { data: states = [], isLoading: isStatesLoading } = useGetStatesQuery();
    const { data: cities = [], isLoading: isCitiesLoading } = useGetCitiesQuery();
    
    const [updateProfile, { isLoading: isMutationLoading }] = useUpdateProfileDataMutation();

    const { register, control, handleSubmit, reset, watch, setValue } = useForm({
        defaultValues: profileData || {
            fullName: '',
            email: '',
            avatarUrl: '',
            phone: '',
            address: { street: '', city: '', state: '', zip: '', country: '' },
        },
    });

    const watchedAvatar = watch("avatarUrl", profileData?.avatarUrl);
    const watchedCountry = watch("address.country");
    const watchedState = watch("address.state");
    
    const availableStates = useMemo(() => {
        if (!states || !watchedCountry) return [];
        return states.filter(s => s.country === watchedCountry);
    }, [states, watchedCountry]);

    const availableCities = useMemo(() => {
        if (!cities || !watchedState) return [];
        return cities.filter(c => c.state === watchedState);
    }, [cities, watchedState]);


    useEffect(() => {
        if (profileData) {
            reset(profileData);
        }
    }, [profileData, reset]);

    const onSubmit = async (data) => {
        try {
            await updateProfile(data).unwrap();
            toast({
                title: "Profile Updated",
                description: "Your profile information has been saved.",
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Update Failed",
                description: "There was an error updating your profile.",
            });
        }
    };

    if (isProfileLoading || isCountriesLoading || isStatesLoading || isCitiesLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    if (isProfileError) {
        return <div>Error loading data.</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your public profile and account settings.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label>Profile Picture</Label>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={watchedAvatar} />
                                    <AvatarFallback>{profileData?.fullName?.charAt(0) || 'A'}</AvatarFallback>
                                </Avatar>
                                <Input type="file" className="max-w-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" {...register("fullName")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" type="tel" {...register("phone")} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" {...register("email")} />
                            </div>
                        </div>
                    </div>
                    
                    <Separator />

                    <div className="space-y-6">
                         <div>
                            <h3 className="text-lg font-medium">Address</h3>
                            <p className="text-sm text-muted-foreground">Your primary address.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address.street">Street Address</Label>
                            <Input id="address.street" {...register("address.street")} />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label>Country</Label>
                                <Controller
                                    name="address.country"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={(value) => {
                                            field.onChange(value);
                                            setValue('address.state', '');
                                            setValue('address.city', '');
                                        }} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {countries?.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>State / Province</Label>
                                <Controller
                                    name="address.state"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={(value) => {
                                            field.onChange(value);
                                            setValue('address.city', '');
                                        }} value={field.value} disabled={!watchedCountry || availableStates.length === 0}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a state" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableStates.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label>City</Label>
                                 <Controller
                                    name="address.city"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value} disabled={!watchedState || availableCities.length === 0}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a city" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableCities.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="address.zip">ZIP / Postal Code</Label>
                            <Input id="address.zip" {...register("address.zip")} />
                        </div>
                    </div>

                    <div>
                        <Button type="submit" disabled={isMutationLoading}>
                            {isMutationLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
