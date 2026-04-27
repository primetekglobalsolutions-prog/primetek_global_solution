import { NextRequest, NextResponse } from 'next/server';
import { applicationSchema } from '@/lib/validations';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const body = {
      job_id: formData.get('job_id') as string,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || undefined,
      experience_years: formData.get('experience_years')
        ? Number(formData.get('experience_years'))
        : undefined,
      cover_letter: (formData.get('cover_letter') as string) || undefined,
    };

    const validated = applicationSchema.parse(body);

    const resume = formData.get('resume') as File | null;
    let resumeUrl = '';

    if (resume && resume.size > 0) {
      if (resume.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'Resume must be under 5MB' }, { status: 400 });
      }

      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      if (!validTypes.includes(resume.type)) {
        return NextResponse.json({ error: 'Only PDF and DOCX files are accepted' }, { status: 400 });
      }

      // TODO: Upload to Supabase Storage when connected
      resumeUrl = `demo-resume-${Date.now()}.${resume.name.split('.').pop()}`;
    }

    console.log('New application:', { ...validated, resume: resumeUrl });

    return NextResponse.json(
      { success: true, message: 'Application submitted successfully' },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: err.issues }, { status: 400 });
    }
    console.error('Application submission error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
