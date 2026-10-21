import { z } from 'zod';

export const enquirySchema = z.object({
  customerName: z
    .string()
    .min(2, { message: 'Please enter your name (at least 2 characters)' })
    .max(80, { message: 'Name cannot exceed 80 characters' }),
  
  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, { message: 'Please enter a valid 10-digit Indian mobile number (e.g. 9840123456)' }),
  
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .optional()
    .or(z.literal('')),
  
  eventType: z.string().optional(),
  
  eventDate: z.string().optional(),
  
  guestCount: z.coerce.number().optional(),
  
  eventLocation: z.string().optional(),
  
  preferredContactMethod: z.enum(['Phone Call', 'WhatsApp', 'Email']).optional(),
  
  cateringService: z.string().optional(),
  
  mealPreference: z.enum(['Vegetarian', 'Non-Vegetarian', 'Both']).optional(),
  
  message: z.string().max(1000, { message: 'Message cannot exceed 1000 characters' }).optional(),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;
