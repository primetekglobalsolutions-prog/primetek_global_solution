import { getAdminJobs } from './actions';
import JobsClient from './JobsClient';

export default async function AdminJobsPage() {
  const jobs = await getAdminJobs();

  return <JobsClient initialJobs={jobs || []} />;
}
