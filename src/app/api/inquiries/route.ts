import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { inquirySchema } from '@/lib/validations';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = inquirySchema.parse(body);

    const { error } = await supabaseAdmin
      .from('inquiries')
      .insert([
        {
          name: validated.name,
          email: validated.email,
          phone: validated.phone || null,
          company: validated.company || null,
          message: validated.requirement,
          status: 'new'
        }
      ]);

    if (error) throw error;

    return NextResponse.json(
      { success: true, message: 'Inquiry received successfully' },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: err.issues },
        { status: 400 }
      );
    }
    console.error('Inquiry submission error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}
