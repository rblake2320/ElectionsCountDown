import { db } from "./server/db";
import { elections } from "@shared/schema";
import { like } from "drizzle-orm";

async function checkElectionLevels() {
  console.log("🔍 Checking election level categorization...\n");

  try {
    // Check Detroit mayoral elections
    console.log("📊 Detroit Mayoral Elections:");
    const detroitElections = await db.select().from(elections).where(
      like(elections.title, '%Detroit%')
    );
    
    if (detroitElections.length === 0) {
      console.log("   ⚠️  No Detroit elections found");
    } else {
      detroitElections.forEach((election: any) => {
        const levelStatus = election.level === 'local' ? '✅' : '❌';
        console.log(`   ${levelStatus} ${election.title}`);
        console.log(`      Level: ${election.level || 'NOT SET'}`);
        console.log(`      Type: ${election.type || 'NOT SET'}`);
        console.log(`      ID: ${election.id}`);
      });
    }
    console.log("");

    // Check Nashville mayoral elections
    console.log("📊 Nashville Mayoral Elections:");
    const nashvilleElections = await db.select().from(elections).where(
      like(elections.title, '%Nashville%')
    );
    
    if (nashvilleElections.length === 0) {
      console.log("   ⚠️  No Nashville elections found");
    } else {
      nashvilleElections.forEach((election: any) => {
        const levelStatus = election.level === 'local' ? '✅' : '❌';
        console.log(`   ${levelStatus} ${election.title}`);
        console.log(`      Level: ${election.level || 'NOT SET'}`);
        console.log(`      Type: ${election.type || 'NOT SET'}`);
        console.log(`      ID: ${election.id}`);
      });
    }
    console.log("");

    // Check all mayoral elections
    console.log("📊 All Mayoral Elections:");
    const mayoralElections = await db.select().from(elections).where(
      like(elections.title, '%Mayor%')
    );
    
    console.log(`   Found ${mayoralElections.length} mayoral elections`);
    
    const localCount = mayoralElections.filter((e: any) => e.level === 'local').length;
    const nonLocalCount = mayoralElections.length - localCount;
    
    console.log(`   ✅ Correctly categorized as 'local': ${localCount}`);
    console.log(`   ❌ NOT categorized as 'local': ${nonLocalCount}`);
    
    if (nonLocalCount > 0) {
      console.log("\n   ⚠️  Elections that need fixing:");
      mayoralElections
        .filter((e: any) => e.level !== 'local')
        .forEach((election: any) => {
          console.log(`      - ${election.title} (ID: ${election.id}, Level: ${election.level})`);
        });
    }
    console.log("");

    // Summary
    console.log("📊 SUMMARY:");
    console.log(`   - Total mayoral elections: ${mayoralElections.length}`);
    console.log(`   - Correctly categorized: ${localCount}`);
    console.log(`   - Need fixing: ${nonLocalCount}`);
    
    if (nonLocalCount > 0) {
      console.log("\n💡 RECOMMENDATION:");
      console.log("   Run the fix script to update election levels:");
      console.log("   npx tsx fix-election-levels.ts");
    } else {
      console.log("\n✅ All mayoral elections are correctly categorized as 'local'!");
    }

  } catch (error) {
    console.error("❌ Error checking election levels:", error);
    throw error;
  }
}

// Run check
checkElectionLevels()
  .then(() => {
    console.log("\n✅ Check complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Check failed:", error);
    process.exit(1);
  });
