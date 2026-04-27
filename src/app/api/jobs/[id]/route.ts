import { NextRequest, NextResponse } from 'next/server';
import { demoJobs } from '@/lib/demo-data';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const job = demoJobs.find((j) => j.id === id);

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  return NextResponse.json({ data: job });
}
