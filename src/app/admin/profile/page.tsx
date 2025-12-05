
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetProfileDataQuery, useUpdateProfileDataMutation, useGetCountriesQuery, useGetStatesQuery, useGetCitiesQuery, useAddActionLogMutation, useUploadImageMutation } from '@/services/api';
import { Loader2, AlertTriangle, PlusCircle, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const ProfilePageSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
            <div className="space-y-8">
                 <div className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <Skeleton className="h-10 w-64" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2 md:col-span-2"><Skeleton className="h-4 w-12" /><Skeleton className="h-10 w-full" /></div>
                    </div>
                </div>
                
                <Separator />
                
                <div className="space-y-6">
                    <div>
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-4 w-48 mt-2" />
                    </div>
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-12" /><Skeleton className="h-10 w-full" /></div>
                    </div>
                     <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                </div>

                <Separator />

                <div className="space-y-6">
                    <div>
                        <Skeleton className="h-6 w-28" />
                        <Skeleton className="h-4 w-56 mt-2" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                    </div>
                    <Skeleton className="h-10 w-28" />
                </div>


                <Skeleton className="h-10 w-32" />
            </div>
        </CardContent>
    </Card>
);

export default function ProfilePage() {
    const { toast } = useToast();
    const { data: profileData, isLoading: isProfileLoading, isError: isProfileError } = useGetProfileDataQuery();
    const { data: countries = [], isLoading: isCountriesLoading } = useGetCountriesQuery();
    const { data: states = [], isLoading: isStatesLoading } = useGetStatesQuery();
    const { data: cities = [], isLoading: isCitiesLoading } = useGetCitiesQuery();
    
    const [updateProfile, { isLoading: isMutationLoading }] = useUpdateProfileDataMutation();
    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
    const [addActionLog] = useAddActionLogMutation();

    const [imageFile, setImageFile] = useState<File | null>(null);

    const { register, control, handleSubmit, reset, watch, setValue } = useForm({
        defaultValues: profileData || {
            fullName: '',
            email: '',
            avatarUrl: '',
            phone: '',
            address: { street: '', city: '', state: '', zip: '', country: '' },
            socialLinks: []
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "socialLinks",
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
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setValue('avatarUrl', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            let finalData = { ...data };
            
            if (imageFile) {
                const uploadResult = await uploadImage(imageFile).unwrap();
                if (uploadResult.url) {
                    finalData.avatarUrl = uploadResult.url;
                } else {
                    throw new Error('Image upload failed to return a URL.');
                }
            }

            await updateProfile(finalData).unwrap();
            await addActionLog({
                user: 'Admin User',
                action: 'updated their profile',
                section: 'Profile',
                type: 'UPDATE',
            }).unwrap();
            toast({
                title: "Profile Updated",
                description: "Your profile information has been saved.",
            });
            setImageFile(null);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Update Failed",
                description: "There was an error updating your profile.",
            });
        }
    };

    if (isProfileLoading || isCountriesLoading || isStatesLoading || isCitiesLoading) {
        return <ProfilePageSkeleton />;
    }
    
    if (isProfileError) {
        return (
            <Card className="flex flex-col items-center justify-center p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <CardTitle className="text-xl text-destructive">Error Loading Profile</CardTitle>
                <CardDescription className="mt-2">
                    There was a problem fetching your profile data. Please try refreshing the page.
                </CardDescription>
            </Card>
        );
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
                                <Input type="file" className="max-w-xs" onChange={handleFileChange} accept="image/*" />
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

                    <Separator />

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">Social Links</h3>
                            <p className="text-sm text-muted-foreground">Add links to your social media profiles.</p>
                        </div>
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <Card key={field.id} className="p-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                        <div className="space-y-2">
                                            <Label>Platform</Label>
                                            <Input
                                                {...register(`socialLinks.${index}.platform`)}
                                                placeholder="e.g., LinkedIn, Twitter"
                                            />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <Label>URL</Label>
                                             <div className="flex items-center gap-2">
                                                <Input
                                                    {...register(`socialLinks.${index}.url`)}
                                                    placeholder="https://..."
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                       
                                    </div>
                                </Card>
                            ))}
                        </div>
                         <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({ platform: "", url: "" })}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Social Link
                        </Button>
                    </div>

                    <div>
                        <Button type="submit" disabled={isMutationLoading || isUploading}>
                            {(isMutationLoading || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
