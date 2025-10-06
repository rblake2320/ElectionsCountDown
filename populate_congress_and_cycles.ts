#!/usr/bin/env tsx

/**
 * Populate Congressional Data and Election Cycles
 * 
 * This script populates:
 * - Congress members (from JSON file)
 * - Congress bills (sample recent bills)
 * - Congress committees (current committees)
 * - Election cycles (2024-2026)
 */

import fs from 'fs';
import { db } from './server/db';
import {
  congressMembers,
  congressBills,
  congressCommittees,
  electionCycles
} from './shared/schema';

async function populateCongressMembers() {
  console.log('\n📋 Populating congress_members table...');
  
  try {
    // Check if file exists
    const filePath = './attached_assets/congress_members_complete.json';
    if (!fs.existsSync(filePath)) {
      console.log('  ⚠️  Congress members JSON file not found at ./attached_assets/congress_members_complete.json');
      console.log('  Skipping congress members population...');
      return 0;
    }
    
    const membersData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`  Found ${membersData.length} members in dataset`);
    
    // Process in batches
    const batchSize = 25;
    let totalInserted = 0;
    
    for (let i = 0; i < membersData.length; i += batchSize) {
      const batch = membersData.slice(i, i + batchSize);
      
      const insertData = batch.map((member: any, index: number) => ({
        bioguideId: member.bioguide_id || `${member.full_name.replace(/\s+/g, '_').toUpperCase()}_${i}_${index}`,
        name: member.full_name,
        party: member.party,
        state: member.state,
        district: member.district === 'Senate' ? null : member.district,
        chamber: member.chamber,
        congress: 119,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
      await db.insert(congressMembers).values(insertData).onConflictDoNothing();
      totalInserted += insertData.length;
    }
    
    console.log(`  ✓ Inserted ${totalInserted} congressional members`);
    return totalInserted;
  } catch (error: any) {
    console.log(`  ⚠️  Error: ${error.message}`);
    return 0;
  }
}

async function populateCongressBills() {
  console.log('\n📜 Populating congress_bills table...');
  
  // Sample recent bills from 119th Congress (2025-2026)
  const sampleBills = [
    {
      congress: 119,
      billNumber: 'H.R.1',
      title: 'Lower Energy Costs Act',
      type: 'HR',
      introducedDate: new Date('2025-01-09'),
      latestActionDate: new Date('2025-03-15'),
      latestActionText: 'Passed House',
      sponsors: [{ bioguideId: 'S001224', fullName: 'Rep. Stefanik', party: 'R', state: 'NY' }],
      isActive: true
    },
    {
      congress: 119,
      billNumber: 'S.1',
      title: 'For the People Act',
      type: 'S',
      introducedDate: new Date('2025-01-03'),
      latestActionDate: new Date('2025-02-20'),
      latestActionText: 'Referred to Committee',
      sponsors: [{ bioguideId: 'S000148', fullName: 'Sen. Schumer', party: 'D', state: 'NY' }],
      isActive: true
    },
    {
      congress: 119,
      billNumber: 'H.R.2',
      title: 'Secure the Border Act',
      type: 'HR',
      introducedDate: new Date('2025-01-10'),
      latestActionDate: new Date('2025-04-01'),
      latestActionText: 'Passed House, Sent to Senate',
      sponsors: [{ bioguideId: 'J000299', fullName: 'Rep. Johnson', party: 'R', state: 'LA' }],
      isActive: true
    },
    {
      congress: 119,
      billNumber: 'S.5',
      title: 'Inflation Reduction Act Extension',
      type: 'S',
      introducedDate: new Date('2025-01-15'),
      latestActionDate: new Date('2025-03-10'),
      latestActionText: 'Committee Hearings Scheduled',
      sponsors: [{ bioguideId: 'M001183', fullName: 'Sen. Manchin', party: 'D', state: 'WV' }],
      isActive: true
    },
    {
      congress: 119,
      billNumber: 'H.R.25',
      title: 'Fair Tax Act',
      type: 'HR',
      introducedDate: new Date('2025-01-09'),
      latestActionDate: new Date('2025-02-15'),
      latestActionText: 'Referred to Ways and Means Committee',
      sponsors: [{ bioguideId: 'C001103', fullName: 'Rep. Carter', party: 'R', state: 'GA' }],
      isActive: true
    },
    {
      congress: 119,
      billNumber: 'S.10',
      title: 'Medicare Expansion Act',
      type: 'S',
      introducedDate: new Date('2025-01-20'),
      latestActionDate: new Date('2025-03-25'),
      latestActionText: 'Floor Debate Scheduled',
      sponsors: [{ bioguideId: 'S000033', fullName: 'Sen. Sanders', party: 'I', state: 'VT' }],
      isActive: true
    },
    {
      congress: 119,
      billNumber: 'H.R.50',
      title: 'Infrastructure Investment and Jobs Act II',
      type: 'HR',
      introducedDate: new Date('2025-02-01'),
      latestActionDate: new Date('2025-04-10'),
      latestActionText: 'Passed House with Amendments',
      sponsors: [{ bioguideId: 'D000096', fullName: 'Rep. DeFazio', party: 'D', state: 'OR' }],
      isActive: true
    },
    {
      congress: 119,
      billNumber: 'S.15',
      title: 'Climate Action Now Act',
      type: 'S',
      introducedDate: new Date('2025-01-25'),
      latestActionDate: new Date('2025-03-30'),
      latestActionText: 'Committee Vote Pending',
      sponsors: [{ bioguideId: 'M000133', fullName: 'Sen. Markey', party: 'D', state: 'MA' }],
      isActive: true
    },
    {
      congress: 119,
      billNumber: 'H.R.100',
      title: 'Education Funding Modernization Act',
      type: 'HR',
      introducedDate: new Date('2025-02-15'),
      latestActionDate: new Date('2025-04-05'),
      latestActionText: 'Subcommittee Hearings Completed',
      sponsors: [{ bioguideId: 'S001185', fullName: 'Rep. Sewell', party: 'D', state: 'AL' }],
      isActive: true
    },
    {
      congress: 119,
      billNumber: 'S.20',
      title: 'Veterans Healthcare Enhancement Act',
      type: 'S',
      introducedDate: new Date('2025-02-01'),
      latestActionDate: new Date('2025-04-15'),
      latestActionText: 'Passed Senate Unanimously',
      sponsors: [{ bioguideId: 'T000464', fullName: 'Sen. Tester', party: 'D', state: 'MT' }],
      isActive: true
    },
    {
      congress: 119,
      billNumber: 'H.R.150',
      title: 'Affordable Housing Development Act',
      type: 'HR',
      introducedDate: new Date('2025-03-01'),
      latestActionDate: new Date('2025-04-20'),
      latestActionText: 'Markup Session Scheduled',
      sponsors: [{ bioguideId: 'W000187', fullName: 'Rep. Waters', party: 'D', state: 'CA' }],
      isActive: true
    },
    {
      congress: 119,
      billNumber: 'S.25',
      title: 'Small Business Tax Relief Act',
      type: 'S',
      introducedDate: new Date('2025-02-10'),
      latestActionDate: new Date('2025-04-12'),
      latestActionText: 'Passed Senate, Sent to House',
      sponsors: [{ bioguideId: 'C000141', fullName: 'Sen. Cardin', party: 'D', state: 'MD' }],
      isActive: true
    },
    {
      congress: 119,
      billNumber: 'H.R.200',
      title: 'Cybersecurity Enhancement Act',
      type: 'HR',
      introducedDate: new Date('2025-03-15'),
      latestActionDate: new Date('2025-04-25'),
      latestActionText: 'Passed House Unanimously',
      sponsors: [{ bioguideId: 'L000559', fullName: 'Rep. Langevin', party: 'D', state: 'RI' }],
      isActive: true
    },
    {
      congress: 119,
      billNumber: 'S.30',
      title: 'Rural Broadband Expansion Act',
      type: 'S',
      introducedDate: new Date('2025-02-20'),
      latestActionDate: new Date('2025-04-18'),
      latestActionText: 'Committee Amendments Adopted',
      sponsors: [{ bioguideId: 'K000367', fullName: 'Sen. Klobuchar', party: 'D', state: 'MN' }],
      isActive: true
    },
    {
      congress: 119,
      billNumber: 'H.R.250',
      title: 'Prescription Drug Price Reduction Act',
      type: 'HR',
      introducedDate: new Date('2025-03-20'),
      latestActionDate: new Date('2025-04-28'),
      latestActionText: 'Floor Vote Scheduled',
      sponsors: [{ bioguideId: 'C001084', fullName: 'Rep. Cicilline', party: 'D', state: 'RI' }],
      isActive: true
    }
  ];
  
  try {
    let inserted = 0;
    for (const bill of sampleBills) {
      await db.insert(congressBills).values(bill as any).onConflictDoNothing();
      inserted++;
    }
    console.log(`  ✓ Inserted ${inserted} congressional bills`);
    return inserted;
  } catch (error: any) {
    console.log(`  ⚠️  Error: ${error.message}`);
    return 0;
  }
}

async function populateCongressCommittees() {
  console.log('\n🏛️  Populating congress_committees table...');
  
  const committees = [
    {
      systemCode: 'hsag00',
      name: 'House Committee on Agriculture',
      chamber: 'House',
      type: 'Standing',
      subcommittees: [
        { systemCode: 'hsag14', name: 'Subcommittee on Commodity Markets, Digital Assets, and Rural Development' },
        { systemCode: 'hsag15', name: 'Subcommittee on Conservation, Research, and Biotechnology' }
      ],
      isActive: true
    },
    {
      systemCode: 'hsap00',
      name: 'House Committee on Appropriations',
      chamber: 'House',
      type: 'Standing',
      subcommittees: [
        { systemCode: 'hsap01', name: 'Subcommittee on Defense' },
        { systemCode: 'hsap02', name: 'Subcommittee on Labor, Health and Human Services, Education' }
      ],
      isActive: true
    },
    {
      systemCode: 'hsas00',
      name: 'House Committee on Armed Services',
      chamber: 'House',
      type: 'Standing',
      subcommittees: [
        { systemCode: 'hsas02', name: 'Subcommittee on Military Personnel' },
        { systemCode: 'hsas28', name: 'Subcommittee on Readiness' }
      ],
      isActive: true
    },
    {
      systemCode: 'hsbu00',
      name: 'House Committee on the Budget',
      chamber: 'House',
      type: 'Standing',
      subcommittees: [],
      isActive: true
    },
    {
      systemCode: 'hsed00',
      name: 'House Committee on Education and the Workforce',
      chamber: 'House',
      type: 'Standing',
      subcommittees: [
        { systemCode: 'hsed10', name: 'Subcommittee on Higher Education and Workforce Development' },
        { systemCode: 'hsed02', name: 'Subcommittee on Workforce Protections' }
      ],
      isActive: true
    },
    {
      systemCode: 'hsif00',
      name: 'House Committee on Energy and Commerce',
      chamber: 'House',
      type: 'Standing',
      subcommittees: [
        { systemCode: 'hsif03', name: 'Subcommittee on Energy, Climate, and Grid Security' },
        { systemCode: 'hsif14', name: 'Subcommittee on Health' }
      ],
      isActive: true
    },
    {
      systemCode: 'hswm00',
      name: 'House Committee on Ways and Means',
      chamber: 'House',
      type: 'Standing',
      subcommittees: [
        { systemCode: 'hswm01', name: 'Subcommittee on Health' },
        { systemCode: 'hswm02', name: 'Subcommittee on Social Security' }
      ],
      isActive: true
    },
    {
      systemCode: 'hsju00',
      name: 'House Committee on the Judiciary',
      chamber: 'House',
      type: 'Standing',
      subcommittees: [
        { systemCode: 'hsju01', name: 'Subcommittee on the Constitution and Limited Government' },
        { systemCode: 'hsju08', name: 'Subcommittee on Crime and Federal Government Surveillance' }
      ],
      isActive: true
    },
    {
      systemCode: 'ssaf00',
      name: 'Senate Committee on Agriculture, Nutrition, and Forestry',
      chamber: 'Senate',
      type: 'Standing',
      subcommittees: [],
      isActive: true
    },
    {
      systemCode: 'ssap00',
      name: 'Senate Committee on Appropriations',
      chamber: 'Senate',
      type: 'Standing',
      subcommittees: [
        { systemCode: 'ssap01', name: 'Subcommittee on Defense' },
        { systemCode: 'ssap02', name: 'Subcommittee on Labor, Health and Human Services, Education' }
      ],
      isActive: true
    },
    {
      systemCode: 'ssas00',
      name: 'Senate Committee on Armed Services',
      chamber: 'Senate',
      type: 'Standing',
      subcommittees: [
        { systemCode: 'ssas01', name: 'Subcommittee on Airland' },
        { systemCode: 'ssas02', name: 'Subcommittee on Cybersecurity' }
      ],
      isActive: true
    },
    {
      systemCode: 'ssbk00',
      name: 'Senate Committee on Banking, Housing, and Urban Affairs',
      chamber: 'Senate',
      type: 'Standing',
      subcommittees: [],
      isActive: true
    },
    {
      systemCode: 'ssfi00',
      name: 'Senate Committee on Finance',
      chamber: 'Senate',
      type: 'Standing',
      subcommittees: [
        { systemCode: 'ssfi01', name: 'Subcommittee on Health Care' },
        { systemCode: 'ssfi02', name: 'Subcommittee on Taxation and IRS Oversight' }
      ],
      isActive: true
    },
    {
      systemCode: 'sshr00',
      name: 'Senate Committee on Health, Education, Labor, and Pensions',
      chamber: 'Senate',
      type: 'Standing',
      subcommittees: [],
      isActive: true
    },
    {
      systemCode: 'ssju00',
      name: 'Senate Committee on the Judiciary',
      chamber: 'Senate',
      type: 'Standing',
      subcommittees: [
        { systemCode: 'ssju01', name: 'Subcommittee on the Constitution' },
        { systemCode: 'ssju02', name: 'Subcommittee on Criminal Justice and Counterterrorism' }
      ],
      isActive: true
    }
  ];
  
  try {
    let inserted = 0;
    for (const committee of committees) {
      await db.insert(congressCommittees).values(committee as any).onConflictDoNothing();
      inserted++;
    }
    console.log(`  ✓ Inserted ${inserted} congressional committees`);
    return inserted;
  } catch (error: any) {
    console.log(`  ⚠️  Error: ${error.message}`);
    return 0;
  }
}

async function populateElectionCycles() {
  console.log('\n📅 Populating election_cycles table...');
  
  const cycles = [
    {
      slug: '2024-general',
      name: '2024 General Election',
      year: 2024,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-11-05'),
      description: 'Presidential election year with congressional and state races',
      isActive: false
    },
    {
      slug: '2025-special',
      name: '2025 Special Elections',
      year: 2025,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      description: 'Off-year elections including gubernatorial, mayoral, and special elections',
      isActive: true
    },
    {
      slug: '2026-midterm',
      name: '2026 Midterm Elections',
      year: 2026,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-11-03'),
      description: 'Midterm elections with all House seats and 1/3 of Senate seats',
      isActive: true
    }
  ];
  
  try {
    let inserted = 0;
    for (const cycle of cycles) {
      await db.insert(electionCycles).values(cycle as any).onConflictDoNothing();
      inserted++;
    }
    console.log(`  ✓ Inserted ${inserted} election cycles`);
    return inserted;
  } catch (error: any) {
    console.log(`  ⚠️  Error: ${error.message}`);
    return 0;
  }
}

// Main execution
async function populateCongressAndCycles() {
  console.log('🚀 Starting congressional data and election cycles population...\n');
  console.log('='.repeat(80));
  
  const results: any = {};
  
  try {
    // 1. Congress Members
    results.congressMembers = await populateCongressMembers();
    
    // 2. Congress Bills
    results.congressBills = await populateCongressBills();
    
    // 3. Congress Committees
    results.congressCommittees = await populateCongressCommittees();
    
    // 4. Election Cycles
    results.electionCycles = await populateElectionCycles();
    
    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('\n✅ POPULATION COMPLETE!\n');
    console.log('📊 Summary:');
    console.log(`   Congress Members: ${results.congressMembers} rows`);
    console.log(`   Congress Bills: ${results.congressBills} rows`);
    console.log(`   Congress Committees: ${results.congressCommittees} rows`);
    console.log(`   Election Cycles: ${results.electionCycles} rows`);
    
    const totalRows = results.congressMembers + results.congressBills + 
                     results.congressCommittees + results.electionCycles;
    
    console.log(`\n   📈 Total rows inserted: ${totalRows}`);
    console.log('\n🎉 Congressional data and election cycles populated successfully!');
    console.log('\n💡 Note: Run populate_all_tables.ts separately to populate candidate data');
    
  } catch (error) {
    console.error('\n❌ Error during population:', error);
    throw error;
  }
}

// Run the script
populateCongressAndCycles()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
