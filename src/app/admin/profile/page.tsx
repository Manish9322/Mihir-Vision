'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetProfileDataQuery, useUpdateProfileDataMutation } from '@/services/api';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
    const { toast } = useToast();
    const { data: profileData, isLoading: isQueryLoading, isError } = useGetProfileDataQuery();
    const [updateProfile, { isLoading: isMutationLoading }] = useUpdateProfileDataMutation();

    const { register, control, handleSubmit, reset, watch } = useForm({
        defaultValues: profileData || {
            fullName: '',
            email: '',
            role: '',
            avatarUrl: '',
            phone: '',
            address: { street: '', city: '', state: '', zip: '', country: '' },
        },
    });

    const watchedAvatar = watch("avatarUrl", profileData?.avatarUrl);

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

    if (isQueryLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    if (isError) {
        return <div>Error loading profile data.</div>;
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
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" {...register("email")} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Input id="role" {...register("role")} disabled />
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
                                <Label htmlFor="address.city">City</Label>
                                <Input id="address.city" {...register("address.city")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address.state">State / Province</Label>
                                <Input id="address.state" {...register("address.state")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address.zip">ZIP / Postal Code</Label>
                                <Input id="address.zip" {...register("address.zip")} />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="address.country">Country</Label>
                            <Input id="address.country" {...register("address.country")} />
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
