import { getAdminApplications } from './actions';
import ApplicationsClient from './ApplicationsClient';

export default async function AdminAppApplicationsPage() {
  const applications = await getAdminApplications();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-heading font-bold text-navy-900 tracking-tight">Job Applications</h1>
        <p className="text-text-secondary text-sm">Review and manage candidate applications.</p>
      </div>
      <ApplicationsClient initialApps={applications || []} />
    </div>
  );
}
