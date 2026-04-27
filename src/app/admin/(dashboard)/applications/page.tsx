import { getAdminApplications } from './actions';
import ApplicationsClient from './ApplicationsClient';

export default async function AdminApplicationsPage() {
  const applications = await getAdminApplications();

  return <ApplicationsClient initialApps={applications || []} />;
}
