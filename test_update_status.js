const { createClient } = require('c:/Users/vaagr/OneDrive/Desktop/My Projects/fundmypo/node_modules/@supabase/supabase-js');

const SUPABASE_URL = 'https://efzszombcfxyyobqehyp.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenN6b21iY2Z4eXlvYnFlaHlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzQ1MDQ3MiwiZXhwIjoyMDkzMDI2NDcyfQ.gvZoh99i4AGWqeHwPyaiXQkcidXOsEVD2Glt0IqFPzw';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function run() {
  // Try to update one of the users to 'suspended' and then revert it
  const userId = 'fe23622e-4358-4d1e-b1e8-a1207d75a908'; // vsiphoesihle@gmail.com
  
  // 1. Fetch current status
  const { data: before } = await supabase.from('profiles').select('status').eq('id', userId).single();
  console.log('Status before:', before.status);

  // 2. Update to 'suspended'
  const { error: updateError } = await supabase.from('profiles').update({ status: 'suspended' }).eq('id', userId);
  if (updateError) {
    console.error('Error updating status to suspended:', updateError);
    return;
  }

  // 3. Fetch status after
  const { data: after } = await supabase.from('profiles').select('status').eq('id', userId).single();
  console.log('Status after:', after.status);

  // 4. Revert
  await supabase.from('profiles').update({ status: before.status }).eq('id', userId);
  console.log('Reverted to original status.');
}

run();
