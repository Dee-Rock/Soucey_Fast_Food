"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock, Loader2, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Map from '@/components/map/index';
import { cn } from '@/lib/utils';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      toast({
        title: "Message sent!",
        description: "We've received your message and will get back to you soon.",
        duration: 5000,
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to send message. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact Us</h1>
      <p className="text-gray-600 mb-8">Get in touch with our team</p>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Contact Form */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <Label htmlFor="name" className={cn(errors.name && 'text-destructive')}>
                    Your Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={cn(errors.name && 'border-destructive focus-visible:ring-destructive')}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-sm text-destructive">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className={cn(errors.email && 'text-destructive')}>
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={cn(errors.email && 'border-destructive focus-visible:ring-destructive')}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-destructive">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-1 mb-4">
                <Label htmlFor="subject" className={cn(errors.subject && 'text-destructive')}>
                  Subject <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  aria-invalid={!!errors.subject}
                  aria-describedby={errors.subject ? 'subject-error' : undefined}
                  className={cn(errors.subject && 'border-destructive focus-visible:ring-destructive')}
                />
                {errors.subject && (
                  <p id="subject-error" className="text-sm text-destructive">
                    {errors.subject}
                  </p>
                )}
              </div>
              
              <div className="space-y-1 mb-6">
                <Label htmlFor="message" className={cn(errors.message && 'text-destructive')}>
                  Message <span className="text-destructive">*</span>
                </Label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={cn(
                    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    errors.message && 'border-destructive focus-visible:ring-destructive'
                  )}
                  placeholder="Enter your message"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="text-sm text-destructive">
                    {errors.message}
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-pink-600 hover:bg-pink-700 transition-colors"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
            </form>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-pink-600 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-gray-600">Campus Area, Ho Technical Unversity, Ho, Volta Region, Ghana</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-pink-600 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-gray-600">+233 54 570 4442</p>
                  <p className="text-gray-600">+233 24 340 4515</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-pink-600 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-600">noraagbenorto5@gmail.com</p>
                  <p className="text-gray-600">delalirock5@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-pink-600 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium">Business Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 5:00 PM - 12:00 AM</p>
                  <p className="text-gray-600">Saturday: 9:00 AM - 11:00 PM</p>
                  <p className="text-gray-600">Sunday: 2:00 PM - 12:00 AM</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-pink-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/souceyfastfood" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-200 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/souceyfastfood" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-200 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/souceyfastfood" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-200 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com/@souceyfastfood" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-200 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Follow us for the latest updates, promotions, and more!
            </p>
          </div>
        </div>
      </div>
      
      {/* Map */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Our Location</h2>
        <Map />
      </div>
      
      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">What are your delivery hours?</h3>
            <p className="text-gray-700">
              We deliver from 8:00 AM to 10:00 PM on weekdays, 9:00 AM to 11:00 PM on Saturdays, 
              and 10:00 AM to 9:00 PM on Sundays.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">How much is the delivery fee?</h3>
            <p className="text-gray-700">
              Delivery fees start at GHS 10 and may vary based on distance and order size. 
              We occasionally offer free delivery promotions.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-700">
              We accept credit/debit cards, mobile money (MTN, Vodafone, AirtelTigo), 
              and cash on delivery.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">How can I track my order?</h3>
            <p className="text-gray-700">
              Once your order is confirmed, you'll receive a tracking link via SMS and email 
              that allows you to track your delivery in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
