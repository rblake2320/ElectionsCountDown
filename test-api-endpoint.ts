import { db } from "./server/db";
import { candidates, elections } from "@shared/schema";
import { like, eq } from "drizzle-orm";

async function testAPIEndpoint() {
  console.log("🧪 Testing /api/candidates/detailed endpoint...\n");

  try {
    // First, find Detroit and Nashville mayoral candidates
    console.log("📋 Finding test candidates...");
    
    const detroitElections = await db.select().from(elections).where(
      like(elections.title, '%Detroit%Mayor%')
    );
    
    const nashvilleElections = await db.select().from(elections).where(
      like(elections.title, '%Nashville%Mayor%')
    );
    
    const testCandidates: any[] = [];
    
    if (detroitElections.length > 0) {
      const detroitCands = await db.select().from(candidates).where(
        eq(candidates.electionId, detroitElections[0].id)
      ).limit(2);
      testCandidates.push(...detroitCands.map(c => ({ ...c, election: detroitElections[0] })));
    }
    
    if (nashvilleElections.length > 0) {
      const nashvilleCands = await db.select().from(candidates).where(
        eq(candidates.electionId, nashvilleElections[0].id)
      ).limit(2);
      testCandidates.push(...nashvilleCands.map(c => ({ ...c, election: nashvilleElections[0] })));
    }
    
    if (testCandidates.length === 0) {
      console.log("⚠️  No test candidates found. Make sure to run populate_all_tables.ts first.");
      return;
    }
    
    console.log(`✅ Found ${testCandidates.length} test candidates\n`);
    
    // Test each candidate
    for (const candidate of testCandidates) {
      console.log(`\n🔍 Testing Candidate: ${candidate.name} (ID: ${candidate.id})`);
      console.log(`   Election: ${candidate.election.title}`);
      
      try {
        // Simulate the API call
        const baseUrl = process.env.REPL_SLUG ? 
          `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` :
          'http://localhost:5000';
        
        const url = `${baseUrl}/api/candidates/detailed?candidateIds=${candidate.id}&electionId=${candidate.electionId}`;
        console.log(`   API URL: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          console.log(`   ❌ API returned status: ${response.status}`);
          const errorText = await response.text();
          console.log(`   Error: ${errorText}`);
          continue;
        }
        
        const data = await response.json();
        const candidateData = Array.isArray(data) ? data[0] : data;
        
        console.log(`   ✅ API Response received`);
        console.log(`   📊 Data Structure Check:`);
        console.log(`      - Has preferredName: ${!!candidateData.preferredName ? '✅' : '❌'}`);
        console.log(`      - Has fullName: ${!!candidateData.fullName ? '✅' : '❌'}`);
        console.log(`      - Has background: ${!!candidateData.background ? '✅' : '❌'}`);
        console.log(`      - Has currentOccupation: ${!!candidateData.currentOccupation ? '✅' : '❌'}`);
        console.log(`      - Has education: ${!!candidateData.education ? '✅' : '❌'} (${candidateData.education?.length || 0} entries)`);
        console.log(`      - Has employmentHistory: ${!!candidateData.employmentHistory ? '✅' : '❌'} (${candidateData.employmentHistory?.length || 0} entries)`);
        console.log(`      - Has topPriorities: ${!!candidateData.topPriorities ? '✅' : '❌'} (${candidateData.topPriorities?.length || 0} entries)`);
        console.log(`      - Has policyPositions: ${!!candidateData.policyPositions ? '✅' : '❌'}`);
        console.log(`      - Data Source: ${candidateData.dataSource || 'Unknown'}`);
        console.log(`      - Has Authentic Data: ${candidateData.hasAuthenticData ? '✅' : '❌'}`);
        
        // Check if data is from local database
        if (candidateData.dataSource === 'Local Database') {
          console.log(`   🎉 SUCCESS: Using local database data!`);
        } else {
          console.log(`   ⚠️  WARNING: Not using local database (source: ${candidateData.dataSource})`);
        }
        
      } catch (error: any) {
        console.log(`   ❌ Error testing candidate: ${error.message}`);
      }
    }
    
    console.log("\n✅ API endpoint testing complete!");
    
  } catch (error) {
    console.error("❌ Error during API testing:", error);
    throw error;
  }
}

// Run test
testAPIEndpoint()
  .then(() => {
    console.log("\n✅ All API tests completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ API testing failed:", error);
    process.exit(1);
  });
