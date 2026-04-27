'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { inquirySchema, type InquiryFormData } from '@/lib/validations';
import Button from '@/components/ui/Button';

export default function InquiryForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
  });

  const onSubmit = async (data: InquiryFormData) => {
    setStatus('loading');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Submission failed');

      setStatus('success');
      reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="inquiry-name" className="block text-sm font-medium text-navy-900 mb-1.5">
          Full Name <span className="text-error">*</span>
        </label>
        <input
          id="inquiry-name"
          type="text"
          placeholder="John Doe"
          {...register('name')}
          className="w-full px-4 py-3 rounded-lg border border-border bg-white text-navy-900 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-sm"
        />
        {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="inquiry-email" className="block text-sm font-medium text-navy-900 mb-1.5">
          Email Address <span className="text-error">*</span>
        </label>
        <input
          id="inquiry-email"
          type="email"
          placeholder="john@company.com"
          {...register('email')}
          className="w-full px-4 py-3 rounded-lg border border-border bg-white text-navy-900 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-sm"
        />
        {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* Company + Phone Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="inquiry-company" className="block text-sm font-medium text-navy-900 mb-1.5">
            Company
          </label>
          <input
            id="inquiry-company"
            type="text"
            placeholder="Acme Inc."
            {...register('company')}
            className="w-full px-4 py-3 rounded-lg border border-border bg-white text-navy-900 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-sm"
          />
        </div>
        <div>
          <label htmlFor="inquiry-phone" className="block text-sm font-medium text-navy-900 mb-1.5">
            Phone
          </label>
          <input
            id="inquiry-phone"
            type="tel"
            placeholder="+91 98765 43210"
            {...register('phone')}
            className="w-full px-4 py-3 rounded-lg border border-border bg-white text-navy-900 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-sm"
          />
        </div>
      </div>

      {/* Requirement */}
      <div>
        <label htmlFor="inquiry-requirement" className="block text-sm font-medium text-navy-900 mb-1.5">
          How Can We Help? <span className="text-error">*</span>
        </label>
        <textarea
          id="inquiry-requirement"
          rows={4}
          placeholder="Tell us about your staffing needs, timeline, and any specific requirements..."
          {...register('requirement')}
          className="w-full px-4 py-3 rounded-lg border border-border bg-white text-navy-900 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-sm resize-none"
        />
        {errors.requirement && <p className="text-error text-xs mt-1">{errors.requirement.message}</p>}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Sending...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" /> Submit Inquiry
          </>
        )}
      </Button>

      {/* Feedback */}
      {status === 'success' && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          Thank you! We&apos;ll get back to you within 24 hours.
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          Something went wrong. Please try again or email us directly.
        </div>
      )}
    </form>
  );
}
