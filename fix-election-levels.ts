import { db } from "./server/db";
import { elections } from "@shared/schema";
import { like, eq } from "drizzle-orm";

async function fixElectionLevels() {
  console.log("🔧 Fixing election level categorization...\n");

  try {
    // Find all mayoral elections that aren't categorized as 'local'
    const mayoralElections = await db.select().from(elections).where(
      like(elections.title, '%Mayor%')
    );
    
    const needsFixing = mayoralElections.filter((e: any) => e.level !== 'local');
    
    if (needsFixing.length === 0) {
      console.log("✅ No mayoral elections need fixing - all are already 'local'!");
      return;
    }
    
    console.log(`📊 Found ${needsFixing.length} mayoral elections to fix:\n`);
    
    // Update each election
    for (const election of needsFixing) {
      console.log(`   Fixing: ${election.title}`);
      console.log(`      Current level: ${election.level}`);
      
      await db.update(elections)
        .set({ level: 'local' })
        .where(eq(elections.id, election.id));
      
      console.log(`      ✅ Updated to: local\n`);
    }
    
    console.log(`\n✅ Successfully updated ${needsFixing.length} elections to 'local' level!`);
    
    // Verify the fix
    console.log("\n🔍 Verifying fix...");
    const verifyMayoral = await db.select().from(elections).where(
      like(elections.title, '%Mayor%')
    );
    
    const localCount = verifyMayoral.filter((e: any) => e.level === 'local').length;
    console.log(`   ✅ ${localCount} of ${verifyMayoral.length} mayoral elections are now 'local'`);
    
    if (localCount === verifyMayoral.length) {
      console.log("\n🎉 SUCCESS! All mayoral elections are now correctly categorized!");
    } else {
      console.log("\n⚠️  WARNING: Some mayoral elections still not categorized as 'local'");
    }

  } catch (error) {
    console.error("❌ Error fixing election levels:", error);
    throw error;
  }
}

// Run fix
fixElectionLevels()
  .then(() => {
    console.log("\n✅ Fix complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Fix failed:", error);
    process.exit(1);
  });
