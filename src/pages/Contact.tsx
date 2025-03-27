
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-medium tracking-tight mb-3">Get in Touch</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions about our platform, products, or how to join as an artisan? We'd love to hear from you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="glass rounded-xl p-8">
              <h2 className="text-2xl font-medium mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="John Doe" 
                      required 
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      required 
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      name="subject" 
                      placeholder="How can we help?" 
                      required 
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      placeholder="Your message here..." 
                      rows={5} 
                      required 
                      className="resize-none"
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full py-6 text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-medium mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium mb-1">Our Office</h3>
                      <p className="text-muted-foreground">
                        123 Handloom Street, Textile District<br />
                        Weaving City - 560001<br />
                        India
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Phone className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">Phone</h3>
                      <p className="text-muted-foreground">+91 98765 43210</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Mail className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">Email</h3>
                      <p className="text-muted-foreground">hello@threadly.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Map */}
              <div className="mt-8 rounded-xl overflow-hidden h-80 bg-secondary relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">Interactive map would be displayed here</p>
                </div>
              </div>
              
              {/* Business Hours */}
              <div className="glass rounded-xl p-8 mt-8">
                <h3 className="text-xl font-medium mb-4">Business Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-2xl font-medium mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "How do I become a verified weaver on Threadly?",
                  answer: "To join as a verified weaver, fill out the application form on our website. Our team will review your credentials, portfolio, and arrange a virtual interview to ensure quality standards."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, UPI payments, net banking, and mobile wallets for a seamless shopping experience."
                },
                {
                  question: "How are shipping costs calculated?",
                  answer: "Shipping costs are based on the delivery location and package weight. We offer free shipping on orders above ₹2000 within India."
                },
                {
                  question: "Can I request customizations for products?",
                  answer: "Yes! You can message weavers directly through our platform to request customizations for any product, from fabric type to design modifications."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-secondary/30 rounded-xl p-6 hover-lift transition-all-300">
                  <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
