import { db } from './server/db';
import { candidates, candidateProfiles, candidatePositions, candidateDataSources } from './shared/schema';
import { voteSmartService } from './server/votesmart-service';
import { eq } from 'drizzle-orm';

/**
 * Populate candidate profiles from VoteSmart API
 * 
 * This script fetches real candidate data from VoteSmart API and populates
 * the candidate_profiles and candidate_positions tables.
 */

async function populateFromVoteSmart() {
  try {
    console.log('🚀 Starting VoteSmart API population...\n');

    // Check if VoteSmart API is available
    if (!voteSmartService.isAvailable()) {
      console.error('❌ VoteSmart API key not configured!');
      console.log('Please set VOTESMART_API_KEY environment variable in Replit Secrets.');
      console.log('Get your API key from: https://votesmart.org/share/api');
      return;
    }

    console.log('✅ VoteSmart API is available\n');

    // Get all candidates from our database that don't have profiles yet
    const allCandidates = await db
      .select()
      .from(candidates)
      .limit(100); // Start with first 100

    console.log(`📊 Found ${allCandidates.length} candidates in database\n`);

    // Check which candidates already have profiles
    const existingProfiles = await db
      .select({ candidateId: candidateProfiles.candidateId })
      .from(candidateProfiles);

    const existingIds = new Set(existingProfiles.map(p => p.candidateId));
    const candidatesNeedingProfiles = allCandidates.filter(c => !existingIds.has(c.id));

    console.log(`📝 ${candidatesNeedingProfiles.length} candidates need profiles\n`);

    if (candidatesNeedingProfiles.length === 0) {
      console.log('✅ All candidates already have profiles!');
      return;
    }

    let successCount = 0;
    let failCount = 0;

    // Process candidates one by one (to respect API rate limits)
    for (const candidate of candidatesNeedingProfiles.slice(0, 10)) { // Start with 10 candidates
      try {
        console.log(`\n🔍 Processing: ${candidate.name}`);

        // Try to find candidate in VoteSmart by name
        // Note: This is a simplified approach. In production, you'd want to:
        // 1. Store VoteSmart candidate IDs in your database
        // 2. Or implement fuzzy name matching
        // 3. Or use office/state to narrow down search

        // For now, we'll skip candidates without VoteSmart IDs
        // You would need to add a voteSmartId field to your candidates table

        console.log(`⚠️ Skipping ${candidate.name} - VoteSmart ID mapping not implemented yet`);
        console.log(`   To enable: Add voteSmartId field to candidates table and populate it`);

        failCount++;
      } catch (error: any) {
        console.error(`❌ Error processing ${candidate.name}:`, error.message);
        failCount++;
      }

      // Rate limiting: wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Successfully populated: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`\n💡 Next Steps:`);
    console.log(`1. Add voteSmartId column to candidates table`);
    console.log(`2. Map your candidates to VoteSmart candidate IDs`);
    console.log(`3. Re-run this script to fetch real data`);

  } catch (error) {
    console.error('❌ Error during VoteSmart population:', error);
    throw error;
  }
}

/**
 * Example: Fetch a specific candidate by VoteSmart ID
 */
async function fetchSpecificCandidate(voteSmartId: string, candidateId: number) {
  try {
    console.log(`\n🔍 Fetching VoteSmart candidate ${voteSmartId}...`);

    const data = await voteSmartService.fetchCompleteProfile(voteSmartId);

    if (!data) {
      console.log(`❌ No data found for VoteSmart ID ${voteSmartId}`);
      return;
    }

    console.log(`✅ Fetched profile for ${data.profile.fullName}`);
    console.log(`📚 Education entries: ${data.profile.education?.length || 0}`);
    console.log(`💼 Employment entries: ${data.profile.employmentHistory?.length || 0}`);
    console.log(`⭐ Ratings: ${data.ratings?.length || 0}`);
    console.log(`📋 Positions: ${data.positions?.length || 0}`);

    // Insert profile
    await db.insert(candidateProfiles).values({
      candidateId,
      ...data.profile,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).onConflictDoNothing();

    console.log(`✅ Profile saved to database`);

    // Insert data source
    await db.insert(candidateDataSources).values({
      candidateId,
      sourceType: 'api',
      sourceName: 'VoteSmart',
      sourceUrl: `https://votesmart.org/candidate/${voteSmartId}`,
      dataFields: ['biography', 'education', 'experience', 'ratings', 'positions'],
      lastUpdated: new Date(),
      verificationStatus: 'verified',
      createdAt: new Date(),
    }).onConflictDoNothing();

    console.log(`✅ Data source recorded`);

  } catch (error) {
    console.error('❌ Error fetching specific candidate:', error);
    throw error;
  }
}

// Run the population
populateFromVoteSmart()
  .then(() => {
    console.log('\n✅ VoteSmart population script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ VoteSmart population script failed:', error);
    process.exit(1);
  });

// Export for use in other scripts
export { fetchSpecificCandidate };

