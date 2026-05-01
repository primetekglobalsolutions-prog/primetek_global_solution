import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectBalances() {
  const { data: balances, error } = await supabase
    .from('leave_balances')
    .select('*, employees(name)');
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Current Leave Balances in DB:');
    console.table(balances.map(b => ({
      employee: b.employees?.name || 'Unknown',
      type: b.leave_type,
      total: b.total_days,
      used: b.used_days,
      remaining: b.remaining_days
    })));
  }
}

inspectBalances();
