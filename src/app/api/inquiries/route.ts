import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { inquirySchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = inquirySchema.parse(body);

    // For now, log the inquiry (Supabase integration when DB is connected)
    console.log('New inquiry:', validated);

    // TODO: Save to Supabase when connected
    // const supabase = await createClient();
    // const { data, error } = await supabase.from('inquiries').insert({...}).select().single();

    // TODO: Send email notification via Resend when API key is configured
    // resend.emails.send({...}).catch(console.error);

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
  // TODO: Protected route — fetch inquiries from Supabase
  return NextResponse.json({ data: [], message: 'Inquiries API ready' });
}
