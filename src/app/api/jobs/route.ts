import { NextRequest, NextResponse } from 'next/server';
import { demoJobs } from '@/lib/demo-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const department = searchParams.get('department');
  const location = searchParams.get('location');
  const type = searchParams.get('type');
  const search = searchParams.get('search');

  let filtered = demoJobs.filter((job) => job.is_active);

  if (department && department !== 'all') {
    filtered = filtered.filter((job) => job.department === department);
  }

  if (location && location !== 'all') {
    filtered = filtered.filter((job) => job.location === location);
  }

  if (type && type !== 'all') {
    filtered = filtered.filter((job) => job.type === type);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ data: filtered, total: filtered.length });
}
