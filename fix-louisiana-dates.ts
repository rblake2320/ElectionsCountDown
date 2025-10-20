import { db } from "./server/db";
import { elections } from "@shared/schema";
import { eq, and, like } from "drizzle-orm";

async function fixLouisianaDates() {
  console.log('🔧 Fixing Louisiana election dates to comply with state law...');
  
  // Louisiana law (LA RS 18:402) requires congressional general elections
  // to be held on the FIFTH SATURDAY after the first Tuesday after first Monday in November
  
  // For 2026:
  // First Tuesday after first Monday in November: Tuesday, November 3, 2026
  // Fifth Saturday after that: Saturday, December 5, 2026
  
  const correctDate = new Date('2026-12-05T00:00:00.000Z'); // Saturday, December 5, 2026
  const incorrectDate = new Date('2026-11-03T00:00:00.000Z'); // Tuesday, November 3, 2026
  
  try {
    // Find all Louisiana elections scheduled for November 3, 2026
    const louisianaElections = await db.select().from(elections).where(
      and(
        eq(elections.state, 'Louisiana'),
        eq(elections.date, incorrectDate)
      )
    );
    
    console.log(`📊 Found ${louisianaElections.length} Louisiana elections with incorrect dates`);
    
    if (louisianaElections.length === 0) {
      console.log('✅ No Louisiana elections need fixing!');
      return;
    }
    
    // Display elections to be fixed
    console.log('\n📋 Elections to be updated:');
    louisianaElections.forEach((election: any, index: number) => {
      console.log(`   ${index + 1}. ${election.title}`);
    });
    
    // Update each election
    let fixedCount = 0;
    for (const election of louisianaElections) {
      await db.update(elections)
        .set({ 
          date: correctDate,
          // Update subtitle to reflect correct date
          subtitle: election.subtitle?.replace('November 3, 2026', 'December 5, 2026') || null
        })
        .where(eq(elections.id, election.id));
      
      fixedCount++;
      console.log(`   ✓ Fixed: ${election.title}`);
    }
    
    // Verify the fix
    const verifyElections = await db.select().from(elections).where(
      and(
        eq(elections.state, 'Louisiana'),
        eq(elections.date, correctDate)
      )
    );
    
    console.log(`\n✅ Successfully updated ${fixedCount} Louisiana elections!`);
    console.log(`📊 Verification: ${verifyElections.length} Louisiana elections now scheduled for December 5, 2026`);
    console.log('\n🎯 Louisiana elections now comply with state law (LA RS 18:402)');
    
  } catch (error) {
    console.error('❌ Error fixing Louisiana dates:', error);
    throw error;
  }
}

// Run the fix
fixLouisianaDates()
  .then(() => {
    console.log('\n✨ Louisiana date fix completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Louisiana date fix failed:', error);
    process.exit(1);
  });

