import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function fixAllDates() {
  console.log('🔧 Starting database date fixes...\n');

  try {
    // Fix 1: Louisiana elections (state = 'LA', not 'Louisiana')
    console.log('1️⃣ Fixing Louisiana election dates...');
    console.log('   Louisiana congressional elections must be on Saturday, December 5, 2026');
    
    const laResult = await sql`
      UPDATE elections 
      SET date = '2026-12-05'
      WHERE state = 'LA'
        AND EXTRACT(YEAR FROM date) = 2026
        AND date = '2026-11-03'
    `;
    console.log(`   ✅ Fixed ${laResult.length} Louisiana elections\n`);

    // Fix 2: Colorado elections (state = 'CO', not 'Colorado')
    console.log('2️⃣ Fixing Colorado election dates...');
    console.log('   Colorado coordinated elections must be on Tuesday, November 4, 2025');
    
    const coResult = await sql`
      UPDATE elections 
      SET date = '2025-11-04'
      WHERE state = 'CO'
        AND EXTRACT(YEAR FROM date) = 2025
        AND level = 'local'
        AND date != '2025-11-04'
    `;
    console.log(`   ✅ Fixed ${coResult.length} Colorado elections\n`);

    console.log('✨ All date fixes completed!');
    
  } catch (error) {
    console.error('❌ Error fixing dates:', error);
    process.exit(1);
  }
}

fixAllDates();

