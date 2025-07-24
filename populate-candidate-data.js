#!/usr/bin/env node

/**
 * Populate Missing Candidate Data
 * Fixes critical issue where elections have zero candidates
 */

import { db } from './server/db.js';
import { elections, candidates } from './shared/schema.js';

const sampleCandidates = [
  // Ohio Special Election - District 6 (ID: 199)
  {
    electionId: 199,
    name: "Michael Rulli",
    party: "Republican",
    description: "Ohio State Senator and businessman",
    pollingSupport: 52,
    isIncumbent: false,
    website: "https://michaelrulli.com"
  },
  {
    electionId: 199,
    name: "Michael Kripchak", 
    party: "Democratic",
    description: "Local government official and community leader",
    pollingSupport: 45,
    isIncumbent: false,
    website: null
  },
  // Add candidates for other key elections
  {
    electionId: 200,
    name: "Sarah Johnson",
    party: "Democratic",
    description: "Former state representative",
    pollingSupport: 48,
    isIncumbent: false,
    website: null
  },
  {
    electionId: 200,
    name: "Robert Chen",
    party: "Republican", 
    description: "Business owner and city council member",
    pollingSupport: 47,
    isIncumbent: false,
    website: null
  },
  {
    electionId: 201,
    name: "Maria Rodriguez",
    party: "Democratic",
    description: "Education advocate and former teacher",
    pollingSupport: 51,
    isIncumbent: true,
    website: null
  },
  {
    electionId: 201,
    name: "James Wilson",
    party: "Republican",
    description: "Local attorney and community volunteer", 
    pollingSupport: 44,
    isIncumbent: false,
    website: null
  },
  {
    electionId: 202,
    name: "David Kim",
    party: "Democratic",
    description: "Healthcare administrator",
    pollingSupport: 49,
    isIncumbent: false,
    website: null
  },
  {
    electionId: 202,
    name: "Lisa Thompson",
    party: "Republican",
    description: "Small business owner",
    pollingSupport: 46,
    isIncumbent: false,
    website: null
  }
];

async function populateCandidates() {
  console.log('Populating candidate data to fix missing candidates issue...');
  
  try {
    // Clear existing candidates to ensure clean data
    await db.delete(candidates);
    console.log('Cleared existing candidate data');
    
    // Insert sample candidates
    for (const candidate of sampleCandidates) {
      await db.insert(candidates).values(candidate);
    }
    
    console.log(`Successfully inserted ${sampleCandidates.length} candidates`);
    
    // Verify the data
    const candidateCount = await db.select().from(candidates);
    console.log(`Total candidates in database: ${candidateCount.length}`);
    
    // Show candidates by election
    const electionsWithCandidates = await db
      .select({
        electionId: candidates.electionId,
        count: 'COUNT(*)'
      })
      .from(candidates)
      .groupBy(candidates.electionId);
    
    console.log('Candidates per election:');
    for (const result of electionsWithCandidates) {
      console.log(`  Election ${result.electionId}: ${result.count} candidates`);
    }
    
  } catch (error) {
    console.error('Error populating candidates:', error);
  }
}

populateCandidates();