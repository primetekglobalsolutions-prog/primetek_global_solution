import type { Metadata } from 'next';
import CareersPageClient from '@/components/sections/CareersPageClient';

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Explore job openings at Primetek Global Solutions. Find roles in IT, Healthcare, Finance, Manufacturing, and more.',
};

export default function CareersPage() {
  return <CareersPageClient />;
}
