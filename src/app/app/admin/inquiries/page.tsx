import InquiryTable from '@/components/admin/InquiryTable';
import { supabaseAdmin } from '@/lib/supabase-admin';

export default async function AdminAppInquiriesPage() {
  const { data: inquiries } = await supabaseAdmin
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-navy-900 tracking-tight">Inquiries</h1>
        <p className="text-text-secondary text-sm">Manage business and career inquiries.</p>
      </div>
      <InquiryTable initialInquiries={inquiries || []} />
    </div>
  );
}
