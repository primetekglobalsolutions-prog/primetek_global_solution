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

export const jobSchema = z.object({
  title: z.string().min(3, 'Job title is required'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['full-time', 'contract', 'remote', 'part-time']),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  requirements: z.string().min(10, 'Requirements must be at least 10 characters'),
  salary_range: z.string().optional(),
  is_active: z.boolean().optional().default(true),
});

export const applicationSchema = z.object({
  job_id: z.string().min(1, 'Job ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  experience_years: z.number().min(0).max(50).optional(),
  cover_letter: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const fullApplicationSchema = z.object({
  job_id: z.string().min(1, 'Please select a job'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  experience_years: z.coerce.number().min(0).optional(),
  
  // Profile Details
  client_address: z.string().optional(),
  client_role: z.string().optional(),
  client_linkedin: z.string().optional(),
  education_bachelors: z.string().optional(),
  education_masters: z.string().optional(),
  
  // Assignment
  assigned_to: z.string().optional(),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type JobFormData = z.input<typeof jobSchema>;
export type ApplicationFormData = z.input<typeof applicationSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type FullApplicationFormData = z.infer<typeof fullApplicationSchema>;

