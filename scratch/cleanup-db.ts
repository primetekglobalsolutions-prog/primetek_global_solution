import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanup() {
  console.log('--- Cleaning Up Database ---');

  // 1. Delete inquiries named Bhavana
  const { count: inqCount, error: inqError } = await supabase
    .from('inquiries')
    .delete()
    .ilike('name', '%Bhavana%');
  
  if (inqError) console.error('Inquiry Delete Error:', inqError);
  else console.log(`Deleted inquiries matching Bhavana.`);

  // 2. Check for employee named Bhavana
  const { data: emps, error: empError } = await supabase
    .from('employees')
    .delete()
    .ilike('name', '%Bhavana%');

  if (empError) console.error('Employee Delete Error:', empError);
  else console.log(`Deleted employees matching Bhavana.`);

  // 3. Reset ALL leave balances to 0 if they are 12, 10, or 15
  // This is a bit risky but the user calls them "fake"
  const { error: balError } = await supabase
    .from('leave_balances')
    .update({ total_days: 0, remaining_days: 0 })
    .in('total_days', [12, 10, 15]);

  if (balError) console.error('Balance Reset Error:', balError);
  else console.log('Reset "fake" leave balances (12/10/15) to 0.');
}

cleanup();
