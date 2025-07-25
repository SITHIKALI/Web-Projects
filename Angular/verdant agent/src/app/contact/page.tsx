
"use client";

import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Phone, MapPin, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const contactDetails = [
  {
    icon: <MapPin className="w-8 h-8 text-primary" />,
    title: "Location",
    content: [
      "Atominos Consulting FZC LLC",
      "BLB-S5-453 – Ajman Boulevard Commercial,",
      "Al Hassan Al Basri St – Al Jerf 2,",
      "Ajman, United Arab Emirates."
    ],
    isLink: false,
  },
  {
    icon: <Mail className="w-8 h-8 text-primary" />,
    title: "Email Address",
    content: ["info@atominosconsulting.com"],
    href: "mailto:info@atominosconsulting.com",
    isLink: true,
  },
  {
    icon: <Phone className="w-8 h-8 text-primary" />,
    title: "Make A Call",
    content: [
        "+971 545959075",
        "+971 581050559",
        "+971 509127479",
        "+91 8110985012"
    ],
    isLink: false,
  },
  {
    icon: <Clock className="w-8 h-8 text-primary" />,
    title: "Working Hours",
    content: ["Mon-Sat : 08.00 am – 05.00 pm"],
    isLink: false,
  }
];

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(500),
});

function ContactContent() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const mailtoLink = `mailto:sithikali2000@gmail.com?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(`Name: ${values.fullName}\nEmail: ${values.email}\n\nMessage:\n${values.message}`)}`;
    
    // This is a client-side action that opens the user's default email app.
    window.location.href = mailtoLink;

    toast({
      title: "Email Client Opening",
      description: "Please complete sending the email from your default email application.",
      className: "bg-primary text-primary-foreground",
    });
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Get In Touch</h2>
            <p className="text-lg text-muted-foreground mt-2">We're here to help and answer any question you might have.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactDetails.map((detail, index) => (
              <Card key={index} className="bg-card/50 text-center flex flex-col items-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="items-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-2">
                    {detail.icon}
                  </div>
                  <CardTitle>{detail.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  {detail.isLink ? (
                    <a href={detail.href} className="text-muted-foreground hover:text-primary transition-colors break-all">
                      {detail.content[0]}
                    </a>
                  ) : (
                    detail.content.map((line, i) => (
                      <p key={i} className="text-muted-foreground">
                        {line}
                      </p>
                    ))
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
        
        <div className="mt-16">
          <Card className="max-w-4xl mx-auto bg-card/50 shadow-lg border-border/50">
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Regarding your services..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Please type your message here." rows={5} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="lg">
                    <Send className="mr-2" />
                    Send Message
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}


export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Suspense>
                <Header />
            </Suspense>
            <main className="flex-1">
                <Suspense fallback={<div className="text-center p-12">Loading...</div>}>
                    <ContactContent />
                </Suspense>
            </main>
        </div>
    );
}
