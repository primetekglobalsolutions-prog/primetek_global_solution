import { z } from 'zod';

const envSchema = z.object({
  // Public
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_GEOAPIFY_API_KEY: z.string().optional(),
  
  // Private
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1).optional(), // Optional if email is not setup yet
  
  // Auth
  JWT_SECRET: z.string().min(10).default('primetek-fallback-secret-key-2026'),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_GEOAPIFY_API_KEY: process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
});

/**
 * Validates that all required environment variables are present.
 * Should be called at the top of the main entry points.
 */
export function validateEnv() {
  try {
    envSchema.parse(process.env);
    console.log('✅ Environment variables validated');
  } catch (err) {
    if (err instanceof z.ZodError) {
      const missing = err.issues.map(e => e.path.join('.')).join(', ');
      console.error('❌ Missing or invalid environment variables:', missing);
      throw new Error(`Environment validation failed: ${missing}`);
    }
    throw err;
  }
}
