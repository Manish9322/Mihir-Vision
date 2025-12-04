'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { aboutData as initialAboutData } from '@/lib/data';
import { useGetAboutDataQuery, useUpdateAboutDataMutation, useAddActionLogMutation } from '@/services/api';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useEffect } from 'react';

const AboutAdminPage = () => {
    const { toast } = useToast();
    const { data: aboutData, isLoading: isQueryLoading, isError } = useGetAboutDataQuery();
    const [updateAboutData, { isLoading: isMutationLoading }] = useUpdateAboutDataMutation();
    const [addActionLog] = useAddActionLogMutation();
    
    const { register, control, handleSubmit, reset, watch } = useForm({
        defaultValues: aboutData || initialAboutData
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "highlights",
    });

    const watchedImage = watch("image.imageUrl", aboutData?.image.imageUrl);

    useEffect(() => {
        if (aboutData) {
            reset(aboutData);
        }
    }, [aboutData, reset]);

    const onSubmit = async (data) => {
        try {
            await updateAboutData(data).unwrap();
            await addActionLog({
                user: 'Admin User',
                action: 'updated the About section',
                section: 'About',
                type: 'UPDATE',
            }).unwrap();
            toast({
                title: `Content Saved`,
                description: `About section has been updated successfully.`,
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: `Save Failed`,
                description: `There was an error saving the about section.`,
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
        return <div>Error loading data.</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>About Section</CardTitle>
                <CardDescription>
                    Edit the content of the about section.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="about-title">Title</Label>
                        <Input id="about-title" {...register("title")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="about-p1">Paragraph</Label>
                        <Textarea id="about-p1" {...register("paragraph1")} rows={4} />
                    </div>

                    <div className="space-y-4">
                        <Label>Highlights</Label>
                        {fields.map((field, index) => (
                            <Card key={field.id} className="p-4">
                                <div className="flex items-center gap-4">
                                    <Controller
                                        render={({ field }) => <Input {...field} className="flex-grow" />}
                                        name={`highlights.${index}`}
                                        control={control}
                                    />
                                    <Button variant="outline" size="icon" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                         <Button variant="outline" type="button" className="w-full" onClick={() => append("")}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Highlight
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label>Image</Label>
                        <Card className='p-2'>
                            <div className="relative aspect-[4/3] w-full max-w-sm rounded-md overflow-hidden">
                                <Image src={watchedImage} alt="About section image" fill className='object-cover' />
                            </div>
                            <Input type="file" className="mt-2" />
                        </Card>
                    </div>
                    <Button type="submit" disabled={isMutationLoading}>
                        {isMutationLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default AboutAdminPage;
