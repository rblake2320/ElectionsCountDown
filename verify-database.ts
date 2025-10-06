import { db } from "./server/db";
import { candidateProfiles, candidatePositions, candidates, elections } from "@shared/schema";
import { eq, like, sql } from "drizzle-orm";

async function verifyDatabase() {
  console.log("🔍 Starting Database Verification...\n");

  try {
    // 1. Check candidate_profiles table
    console.log("📊 Checking candidate_profiles table...");
    const profiles = await db.select().from(candidateProfiles).limit(10);
    console.log(`   ✅ Found ${profiles.length} profile entries`);
    if (profiles.length > 0) {
      console.log("   Sample entries:");
      profiles.forEach((profile: any) => {
        console.log(`      - Candidate ID ${profile.candidateId}: ${profile.fullName || profile.preferredName || 'No name'}`);
      });
    }
    console.log("");

    // 2. Check candidate_positions table
    console.log("📊 Checking candidate_positions table...");
    const positions = await db.select().from(candidatePositions).limit(10);
    console.log(`   ✅ Found ${positions.length} position entries`);
    if (positions.length > 0) {
      console.log("   Sample entries:");
      const grouped: any = {};
      positions.forEach((pos: any) => {
        if (!grouped[pos.candidateId]) grouped[pos.candidateId] = [];
        grouped[pos.candidateId].push(pos.category);
      });
      Object.entries(grouped).forEach(([candidateId, categories]) => {
        console.log(`      - Candidate ID ${candidateId}: ${(categories as string[]).length} positions`);
      });
    }
    console.log("");

    // 3. Check for Detroit mayoral candidates
    console.log("📊 Checking for Detroit mayoral election...");
    const detroitElections = await db.select().from(elections).where(
      like(elections.title, '%Detroit%Mayor%')
    );
    console.log(`   ✅ Found ${detroitElections.length} Detroit mayoral elections`);
    
    if (detroitElections.length > 0) {
      for (const election of detroitElections) {
        console.log(`   Election: ${election.title} (ID: ${election.id})`);
        const detroitCandidates = await db.select().from(candidates).where(
          eq(candidates.electionId, election.id)
        );
        console.log(`   ✅ Found ${detroitCandidates.length} candidates`);
        detroitCandidates.forEach((cand: any) => {
          console.log(`      - ${cand.name} (${cand.party}) - ID: ${cand.id}`);
        });
      }
    }
    console.log("");

    // 4. Check for Nashville mayoral candidates
    console.log("📊 Checking for Nashville mayoral election...");
    const nashvilleElections = await db.select().from(elections).where(
      like(elections.title, '%Nashville%Mayor%')
    );
    console.log(`   ✅ Found ${nashvilleElections.length} Nashville mayoral elections`);
    
    if (nashvilleElections.length > 0) {
      for (const election of nashvilleElections) {
        console.log(`   Election: ${election.title} (ID: ${election.id})`);
        const nashvilleCandidates = await db.select().from(candidates).where(
          eq(candidates.electionId, election.id)
        );
        console.log(`   ✅ Found ${nashvilleCandidates.length} candidates`);
        nashvilleCandidates.forEach((cand: any) => {
          console.log(`      - ${cand.name} (${cand.party}) - ID: ${cand.id}`);
        });
      }
    }
    console.log("");

    // 5. Check which candidates have both profile AND positions
    console.log("📊 Checking data completeness...");
    const allProfiles = await db.select().from(candidateProfiles);
    const candidatesWithData: any = {};
    
    for (const profile of allProfiles) {
      const positions = await db.select().from(candidatePositions).where(
        eq(candidatePositions.candidateId, profile.candidateId)
      );
      candidatesWithData[profile.candidateId] = {
        name: profile.fullName || profile.preferredName,
        hasProfile: true,
        positionCount: positions.length
      };
    }
    
    console.log("   Candidates with complete data:");
    Object.entries(candidatesWithData).forEach(([id, data]: [string, any]) => {
      const status = data.positionCount > 0 ? "✅ COMPLETE" : "⚠️  Missing positions";
      console.log(`      ${status} - Candidate ID ${id}: ${data.name} (${data.positionCount} positions)`);
    });
    console.log("");

    // 6. Summary
    console.log("📊 SUMMARY:");
    console.log(`   - Total profiles: ${profiles.length}`);
    console.log(`   - Total positions: ${positions.length}`);
    console.log(`   - Detroit elections: ${detroitElections.length}`);
    console.log(`   - Nashville elections: ${nashvilleElections.length}`);
    console.log(`   - Candidates with complete data: ${Object.keys(candidatesWithData).length}`);
    console.log("");

    console.log("✅ Database verification complete!");
    
  } catch (error) {
    console.error("❌ Error during verification:", error);
    throw error;
  }
}

// Run verification
verifyDatabase()
  .then(() => {
    console.log("\n✅ All checks passed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Verification failed:", error);
    process.exit(1);
  });
