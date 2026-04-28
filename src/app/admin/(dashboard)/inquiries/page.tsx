import InquiryTable from '@/components/admin/InquiryTable';
import { getAdminInquiries, updateInquiryStatus } from './actions';

export default async function InquiriesPage() {
  const inquiries = await getAdminInquiries();

  // Map the database fields to the component expectations
  // 'message' from DB maps to 'requirement' in component
  interface DBInquiry {
    id: string;
    name: string;
    email: string;
    company?: string;
    phone?: string;
    message: string;
    status: string;
    created_at: string;
  }

  const formattedInquiries = inquiries.map((inq: DBInquiry) => ({
    id: inq.id,
    name: inq.name,
    email: inq.email,
    company: inq.company || '',
    phone: inq.phone || '',
    requirement: inq.message,
    status: inq.status,
    created_at: inq.created_at,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-navy-900">Inquiries</h1>
        <p className="text-text-secondary text-sm mt-1">Manage and track all incoming leads.</p>
      </div>
      <InquiryTable inquiries={formattedInquiries} updateStatus={updateInquiryStatus} />
    </div>
  );
}
