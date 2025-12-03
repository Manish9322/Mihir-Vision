
'use client';

import { useToast } from '@/hooks/use-toast';
import { contactData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useAddContactMutation } from '@/services/api';
import { Loader2 } from 'lucide-react';

type Inputs = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

export default function Contact() {
  const { toast } = useToast();
  const [addContact, { isLoading }] = useAddContactMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await addContact(data).unwrap();
      toast({
        title: 'Message Sent!',
        description: "Thanks for reaching out. We'll get back to you shortly.",
      });
      reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Send Failed',
        description: 'There was an error sending your message. Please try again.',
      });
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-background">
      <div className="container max-w-4xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {contactData.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {contactData.subheadline}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
                id="name"
                placeholder="e.g. John Doe"
                {...register('name', { required: 'Name is required' })}
                className="py-6 text-base"
                disabled={isLoading}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
                id="email"
                type="email"
                placeholder="e.g. john.doe@example.com"
                {...register('email', {
                required: 'Email is required',
                pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                },
                })}
                className="py-6 text-base"
                disabled={isLoading}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="md:col-span-2 space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
                id="phone"
                type="tel"
                placeholder="e.g. (123) 456-7890"
                {...register('phone')}
                className="py-6 text-base"
                disabled={isLoading}
            />
            </div>
            <div className="md:col-span-2 space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
                id="message"
                placeholder="Your message..."
                rows={6}
                {...register('message', { required: 'Message cannot be empty' })}
                className="py-4 text-base"
                disabled={isLoading}
            />
            {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
            </div>
            <div className="md:col-span-2 text-right">
            <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Message
            </Button>
            </div>
        </form>
      </div>
    </section>
  );
}
