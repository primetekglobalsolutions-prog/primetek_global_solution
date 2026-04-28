import { supabaseAdmin } from './src/lib/supabase-admin';

async function testDB() {
  console.log('Testing connection to office_locations...');
  
  const testData = {
    name: 'Test Office',
    lat: 17.3850,
    lng: 78.4867,
    radius_meters: 500,
    is_active: true
  };

  const { data, error } = await supabaseAdmin
    .from('office_locations')
    .insert(testData)
    .select();

  if (error) {
    console.error('Insert failed:', error);
  } else {
    console.log('Insert success:', data);
    
    // Clean up
    const { error: delError } = await supabaseAdmin
      .from('office_locations')
      .delete()
      .eq('id', data[0].id);
      
    if (delError) console.error('Cleanup failed:', delError);
    else console.log('Cleanup success');
  }
}

testDB();
