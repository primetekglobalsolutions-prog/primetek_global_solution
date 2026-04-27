import { z } from 'zod';

export const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
  requirement: z.string().min(10, 'Please describe your requirement (min 10 characters)'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
