import { db } from "./server/db";
import { elections } from "@shared/schema";
import { eq, and } from "drizzle-orm";

async function fixColoradoDates() {
  console.log('🔧 Fixing Colorado election dates...');
  
  // Denver official website confirms: 2025 Coordinated Election is Tuesday, Nov. 4, 2025
  // NOT Wednesday, November 5, 2025
  
  const correctDate = new Date('2025-11-04T00:00:00.000Z'); // Tuesday, November 4, 2025
  const incorrectDate = new Date('2025-11-05T00:00:00.000Z'); // Wednesday, November 5, 2025
  
  try {
    // Find all Colorado elections scheduled for November 5, 2025
    const coloradoElections = await db.select().from(elections).where(
      and(
        eq(elections.state, 'Colorado'),
        eq(elections.date, incorrectDate)
      )
    );
    
    console.log(`📊 Found ${coloradoElections.length} Colorado elections with incorrect dates`);
    
    if (coloradoElections.length === 0) {
      console.log('✅ No Colorado elections need fixing!');
      return;
    }
    
    // Display elections to be fixed
    console.log('\n📋 Elections to be updated:');
    coloradoElections.forEach((election: any, index: number) => {
      console.log(`   ${index + 1}. ${election.title}`);
    });
    
    // Update each election
    let fixedCount = 0;
    for (const election of coloradoElections) {
      await db.update(elections)
        .set({ 
          date: correctDate,
          // Update subtitle to reflect correct date
          subtitle: election.subtitle?.replace('November 5, 2025', 'November 4, 2025') || null
        })
        .where(eq(elections.id, election.id));
      
      fixedCount++;
      console.log(`   ✓ Fixed: ${election.title}`);
    }
    
    // Verify the fix
    const verifyElections = await db.select().from(elections).where(
      and(
        eq(elections.state, 'Colorado'),
        eq(elections.date, correctDate)
      )
    );
    
    console.log(`\n✅ Successfully updated ${fixedCount} Colorado elections!`);
    console.log(`📊 Verification: ${verifyElections.length} Colorado elections now scheduled for November 4, 2025`);
    console.log('\n🎯 Colorado elections now match official Denver Elections Division dates');
    
  } catch (error) {
    console.error('❌ Error fixing Colorado dates:', error);
    throw error;
  }
}

// Run the fix
fixColoradoDates()
  .then(() => {
    console.log('\n✨ Colorado date fix completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Colorado date fix failed:', error);
    process.exit(1);
  });

