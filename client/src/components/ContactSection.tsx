import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormData } from "@/lib/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { COMPANY_INFO } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

export default function ContactSection() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: ""
    }
  });
  
  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Thank you for your message! We will get back to you soon.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  });

  function onSubmit(data: ContactFormData) {
    contactMutation.mutate(data);
  }

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">Contact Us</h2>
          <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-3xl mx-auto">Have questions or ready to explore your options? Reach out to our team today.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="bg-gray-50 rounded-lg shadow-lg">
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your Name" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent" 
                            {...field} 
                          />
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
                        <FormLabel className="text-gray-700 font-medium">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="your@email.com" 
                            type="email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your Phone Number" 
                            type="tel"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent" 
                            {...field} 
                          />
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
                        <FormLabel className="text-gray-700 font-medium">Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How can we help you?" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                            rows={5}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-primary text-white font-medium py-3 px-6 rounded-md transition-colors duration-300 shadow-md hover:shadow-lg"
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <div>
            <Card className="bg-primary text-white rounded-lg shadow-lg mb-8">
              <CardContent className="p-8">
                <h3 className="text-2xl font-display font-bold mb-6">Get in Touch</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-amber-500 mr-4 mt-1">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Our Office</h4>
                      <p className="text-gray-200">{COMPANY_INFO.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-amber-500 mr-4 mt-1">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Phone</h4>
                      <p className="text-gray-200">{COMPANY_INFO.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-amber-500 mr-4 mt-1">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Email</h4>
                      <p className="text-gray-200">{COMPANY_INFO.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-amber-500 mr-4 mt-1">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Business Hours</h4>
                      <p className="text-gray-200">
                        {COMPANY_INFO.businessHours.weekdays}<br />
                        {COMPANY_INFO.businessHours.saturday}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 rounded-lg shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-display font-bold text-primary mb-4">Connect With Us</h3>
                <p className="text-gray-600 mb-6">Follow us on social media for the latest property listings and real estate news.</p>
                
                <div className="flex space-x-4">
                  <a href={COMPANY_INFO.socialMedia.facebook} className="bg-primary hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href={COMPANY_INFO.socialMedia.twitter} className="bg-primary hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href={COMPANY_INFO.socialMedia.instagram} className="bg-primary hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href={COMPANY_INFO.socialMedia.linkedin} className="bg-primary hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
