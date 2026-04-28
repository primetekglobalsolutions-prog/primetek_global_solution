import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getAssignedProfiles } from './actions';
import AssignedProfilesClient from './AssignedProfilesClient';

export default async function EmployeeAssignedProfilesPage() {
  const session = await getSession();
  
  if (!session || !session.id) {
    redirect('/admin/login');
  }

  const profiles = await getAssignedProfiles();

  return (
    <div className="max-w-5xl mx-auto">
      <AssignedProfilesClient initialProfiles={profiles} />
    </div>
  );
}
