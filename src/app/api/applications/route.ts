import { NextRequest, NextResponse } from 'next/server';
import { applicationSchema } from '@/lib/validations';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase-admin';

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

      // Upload to Supabase Storage
      const fileExt = resume.name.split('.').pop();
      const fileName = `${validated.job_id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const buffer = Buffer.from(await resume.arrayBuffer());
      
      const { data: uploadData, error: uploadError } = await supabaseAdmin
        .storage
        .from('resumes')
        .upload(fileName, buffer, {
          contentType: resume.type,
          upsert: false
        });

      if (uploadError) {
        console.error('Resume upload error:', uploadError);
        return NextResponse.json({ error: 'Failed to upload resume' }, { status: 500 });
      }
      
      resumeUrl = uploadData.path;
    }

    const { error } = await supabaseAdmin.from('applications').insert([
      {
        job_id: validated.job_id,
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        experience_years: validated.experience_years || null,
        cover_letter: validated.cover_letter || null,
        resume_url: resumeUrl || null,
        status: 'pending'
      }
    ]);

    if (error) throw error;

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
