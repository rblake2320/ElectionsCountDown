import { db } from './server/db';
import { congressMembers } from './shared/schema';
import { sql } from 'drizzle-orm';

async function fixCongressDuplicates() {
  try {
    console.log('🔍 Analyzing congress members for duplicates...\n');
    
    // Get all members
    const allMembers = await db.select().from(congressMembers);
    console.log(`Total members in database: ${allMembers.length}`);
    
    // Find duplicates by name + state + chamber
    const memberMap = new Map<string, typeof allMembers>();
    const duplicates: string[] = [];
    
    for (const member of allMembers) {
      const key = `${member.name}-${member.state}-${member.chamber}`;
      if (memberMap.has(key)) {
        const existing = memberMap.get(key)!;
        duplicates.push(key);
        console.log(`❌ Duplicate found: ${member.name} (${member.state}, ${member.chamber})`);
      } else {
        memberMap.set(key, [member]);
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`- Total members: ${allMembers.length}`);
    console.log(`- Unique members: ${memberMap.size}`);
    console.log(`- Duplicates: ${duplicates.length}`);
    
    if (duplicates.length === 0) {
      console.log('\n✅ No duplicates found!');
      return;
    }
    
    console.log('\n🔧 Removing duplicates...');
    
    // Delete all and re-insert unique members only
    await db.delete(congressMembers);
    console.log('✅ Cleared all members');
    
    // Insert unique members
    const uniqueMembers = Array.from(memberMap.values()).flat();
    
    // Insert in batches
    const batchSize = 50;
    for (let i = 0; i < uniqueMembers.length; i += batchSize) {
      const batch = uniqueMembers.slice(i, i + batchSize);
      await db.insert(congressMembers).values(batch);
      console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(uniqueMembers.length/batchSize)}`);
    }
    
    // Final verification
    const finalCount = await db.select().from(congressMembers);
    console.log(`\n🎉 Fix complete!`);
    console.log(`Final count: ${finalCount.length} members`);
    console.log(`Expected: ~535 members (100 Senate + 435 House)`);
    
    if (finalCount.length > 550 || finalCount.length < 500) {
      console.log(`\n⚠️ WARNING: Member count seems off. Expected ~535, got ${finalCount.length}`);
    } else {
      console.log(`\n✅ Member count looks correct!`);
    }
    
  } catch (error) {
    console.error('❌ Error fixing duplicates:', error);
    throw error;
  }
}

// Run the fix
fixCongressDuplicates()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

