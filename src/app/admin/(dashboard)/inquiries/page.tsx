import InquiryTable from '@/components/admin/InquiryTable';

// Demo data — replace with Supabase fetch
const inquiries = [
  { id: '1', name: 'Rahul Mehra', email: 'rahul@techvista.com', company: 'TechVista', phone: '+91 98765 11111', requirement: 'Need 5 React developers for a 6-month project starting June 2026', status: 'new', created_at: '2026-04-27T10:30:00Z' },
  { id: '2', name: 'Anita Rao', email: 'anita@medcore.com', company: 'MedCore Healthcare', phone: '+91 98765 22222', requirement: 'Looking for healthcare IT consultants with HIPAA compliance experience', status: 'contacted', created_at: '2026-04-26T14:15:00Z' },
  { id: '3', name: 'David Chen', email: 'david@finserve.com', company: 'FinServe Global', phone: '+91 98765 33333', requirement: 'IT outsourcing for banking platform modernization project', status: 'qualified', created_at: '2026-04-25T09:00:00Z' },
  { id: '4', name: 'Priya Nair', email: 'priya@retailmax.com', company: 'RetailMax', phone: '', requirement: 'UX designers and frontend developers for e-commerce revamp', status: 'new', created_at: '2026-04-25T16:45:00Z' },
  { id: '5', name: 'James Wilson', email: 'james@automfg.com', company: 'AutoMfg Corp', phone: '+91 98765 55555', requirement: 'Supply chain optimization consulting engagement', status: 'closed', created_at: '2026-04-24T11:20:00Z' },
  { id: '6', name: 'Sneha Gupta', email: 'sneha@cloudnine.io', company: 'CloudNine', phone: '', requirement: 'Need DevOps engineers and cloud architects for AWS migration', status: 'new', created_at: '2026-04-24T08:00:00Z' },
  { id: '7', name: 'Karthik Iyer', email: 'karthik@datawise.com', company: 'DataWise Analytics', phone: '+91 98765 77777', requirement: 'Data science team augmentation — 3 ML engineers needed', status: 'contacted', created_at: '2026-04-23T13:30:00Z' },
  { id: '8', name: 'Maria Santos', email: 'maria@globaledge.com', company: 'GlobalEdge', phone: '+91 98765 88888', requirement: 'BPO services for customer support operations', status: 'qualified', created_at: '2026-04-22T10:00:00Z' },
  { id: '9', name: 'Arjun Reddy', email: 'arjun@pharmaplus.in', company: 'PharmaPlus', phone: '', requirement: 'Regulatory affairs and clinical research staffing', status: 'new', created_at: '2026-04-21T15:00:00Z' },
  { id: '10', name: 'Lisa Park', email: 'lisa@fintech.co', company: 'FinTech Co', phone: '+91 98765 00000', requirement: 'Full-stack developers with payments integration experience', status: 'contacted', created_at: '2026-04-20T09:45:00Z' },
];

export default function InquiriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-navy-900">Inquiries</h1>
        <p className="text-text-secondary text-sm mt-1">Manage and track all incoming leads.</p>
      </div>
      <InquiryTable inquiries={inquiries} />
    </div>
  );
}
