import { z } from 'zod';

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_GEOAPIFY_API_KEY: z.string().optional(),
});

const serverSchema = publicSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1).optional(),
  JWT_SECRET: z.string().min(10).default('primetek-fallback-secret-key-2026'),
});

// Detect if we are on the server or client
const isServer = typeof window === 'undefined';

const rawEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_GEOAPIFY_API_KEY: process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
};

// Validate based on environment
export const env = isServer 
  ? serverSchema.parse(rawEnv) 
  : publicSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: rawEnv.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: rawEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_GEOAPIFY_API_KEY: rawEnv.NEXT_PUBLIC_GEOAPIFY_API_KEY,
    }) as any;

/**
 * Validates that all required environment variables are present.
 * Should be called at the top of the main entry points.
 */
export function validateEnv() {
  try {
    if (isServer) {
      serverSchema.parse(process.env);
    } else {
      publicSchema.parse(process.env);
    }
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
