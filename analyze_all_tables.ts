#!/usr/bin/env tsx

/**
 * Comprehensive Database Table Analysis
 * Identifies which tables should have data vs. which are legitimately empty
 */

import { db } from './server/db';
import {
  elections,
  candidates,
  candidateProfiles,
  candidatePositions,
  candidateDataSources,
  candidateQA,
  candidateAccounts,
  candidateSubscriptions,
  electionResults,
  congressMembers,
  congressBills,
  congressCommittees,
  campaignAccounts,
  campaignContent,
  voterInteractions,
  realTimePolling,
  electionCycles,
  users,
  watchlist,
  sessions
} from './shared/schema';

interface TableAnalysis {
  tableName: string;
  rowCount: number;
  shouldHaveData: boolean;
  dataSource: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'N/A';
  reason: string;
}

async function analyzeAllTables(): Promise<void> {
  console.log('🔍 Analyzing all database tables...\n');
  
  const analyses: TableAnalysis[] = [];
  
  try {
    // Core election data (should have data from APIs)
    const electionsCount = await db.select().from(elections);
    analyses.push({
      tableName: 'elections',
      rowCount: electionsCount.length,
      shouldHaveData: true,
      dataSource: 'Google Civic API, Ballotpedia, State APIs',
      priority: 'HIGH',
      reason: 'Core platform data - elections should be populated from external sources'
    });
    
    const candidatesCount = await db.select().from(candidates);
    analyses.push({
      tableName: 'candidates',
      rowCount: candidatesCount.length,
      shouldHaveData: true,
      dataSource: 'Google Civic API, FEC, State election offices',
      priority: 'HIGH',
      reason: 'Core platform data - candidates should exist for elections'
    });
    
    // Candidate enrichment data (should have data)
    const profilesCount = await db.select().from(candidateProfiles);
    analyses.push({
      tableName: 'candidate_profiles',
      rowCount: profilesCount.length,
      shouldHaveData: true,
      dataSource: 'Ballotpedia, Wikipedia, Campaign websites',
      priority: 'HIGH',
      reason: 'Needed for modal popups and candidate detail pages'
    });
    
    const positionsCount = await db.select().from(candidatePositions);
    analyses.push({
      tableName: 'candidate_positions',
      rowCount: positionsCount.length,
      shouldHaveData: true,
      dataSource: 'Vote Smart, Campaign websites, News sources',
      priority: 'HIGH',
      reason: 'Needed for candidate policy information display'
    });
    
    const dataSourcesCount = await db.select().from(candidateDataSources);
    analyses.push({
      tableName: 'candidate_data_sources',
      rowCount: dataSourcesCount.length,
      shouldHaveData: true,
      dataSource: 'Generated with data attribution',
      priority: 'MEDIUM',
      reason: 'Transparency and data provenance tracking'
    });
    
    // Congressional data (should have data from APIs)
    const congressMembersCount = await db.select().from(congressMembers);
    analyses.push({
      tableName: 'congress_members',
      rowCount: congressMembersCount.length,
      shouldHaveData: true,
      dataSource: 'ProPublica Congress API, congress.gov',
      priority: 'HIGH',
      reason: 'Congress section requires member data - already have JSON file'
    });
    
    const congressBillsCount = await db.select().from(congressBills);
    analyses.push({
      tableName: 'congress_bills',
      rowCount: congressBillsCount.length,
      shouldHaveData: true,
      dataSource: 'ProPublica Congress API, congress.gov',
      priority: 'MEDIUM',
      reason: 'Legislative tracking feature - can be populated from congress.gov API'
    });
    
    const congressCommitteesCount = await db.select().from(congressCommittees);
    analyses.push({
      tableName: 'congress_committees',
      rowCount: congressCommitteesCount.length,
      shouldHaveData: true,
      dataSource: 'ProPublica Congress API, congress.gov',
      priority: 'MEDIUM',
      reason: 'Committee information for congressional tracking'
    });
    
    // Election results (should have historical data)
    const electionResultsCount = await db.select().from(electionResults);
    analyses.push({
      tableName: 'election_results',
      rowCount: electionResultsCount.length,
      shouldHaveData: true,
      dataSource: 'State election offices, AP, FEC',
      priority: 'MEDIUM',
      reason: 'Historical election results for past elections'
    });
    
    // Election cycles (should have data)
    const electionCyclesCount = await db.select().from(electionCycles);
    analyses.push({
      tableName: 'election_cycles',
      rowCount: electionCyclesCount.length,
      shouldHaveData: true,
      dataSource: 'Manual configuration',
      priority: 'LOW',
      reason: 'Election cycle definitions (2024, 2025, 2026, etc.)'
    });
    
    // User-generated content (legitimately empty until users interact)
    const candidateQACount = await db.select().from(candidateQA);
    analyses.push({
      tableName: 'candidate_qa',
      rowCount: candidateQACount.length,
      shouldHaveData: false,
      dataSource: 'User submissions',
      priority: 'N/A',
      reason: 'User-generated Q&A - empty until users submit questions'
    });
    
    const candidateAccountsCount = await db.select().from(candidateAccounts);
    analyses.push({
      tableName: 'candidate_accounts',
      rowCount: candidateAccountsCount.length,
      shouldHaveData: false,
      dataSource: 'Candidate portal registrations',
      priority: 'N/A',
      reason: 'Campaign portal accounts - empty until candidates register'
    });
    
    const candidateSubscriptionsCount = await db.select().from(candidateSubscriptions);
    analyses.push({
      tableName: 'candidate_subscriptions',
      rowCount: candidateSubscriptionsCount.length,
      shouldHaveData: false,
      dataSource: 'Candidate portal subscriptions',
      priority: 'N/A',
      reason: 'Subscription management - empty until candidates subscribe'
    });
    
    const campaignAccountsCount = await db.select().from(campaignAccounts);
    analyses.push({
      tableName: 'campaign_accounts',
      rowCount: campaignAccountsCount.length,
      shouldHaveData: false,
      dataSource: 'Campaign portal registrations',
      priority: 'N/A',
      reason: 'Campaign API accounts - empty until campaigns register'
    });
    
    const campaignContentCount = await db.select().from(campaignContent);
    analyses.push({
      tableName: 'campaign_content',
      rowCount: campaignContentCount.length,
      shouldHaveData: false,
      dataSource: 'Campaign portal content',
      priority: 'N/A',
      reason: 'Campaign-created content - empty until campaigns post'
    });
    
    const voterInteractionsCount = await db.select().from(voterInteractions);
    analyses.push({
      tableName: 'voter_interactions',
      rowCount: voterInteractionsCount.length,
      shouldHaveData: false,
      dataSource: 'User analytics',
      priority: 'N/A',
      reason: 'User engagement tracking - accumulates as users interact'
    });
    
    const realTimePollingCount = await db.select().from(realTimePolling);
    analyses.push({
      tableName: 'real_time_polling',
      rowCount: realTimePollingCount.length,
      shouldHaveData: false,
      dataSource: 'Platform analytics',
      priority: 'N/A',
      reason: 'Real-time polling data - accumulates from user interactions'
    });
    
    const usersCount = await db.select().from(users);
    analyses.push({
      tableName: 'users',
      rowCount: usersCount.length,
      shouldHaveData: false,
      dataSource: 'User registrations',
      priority: 'N/A',
      reason: 'User accounts - empty until users register'
    });
    
    const watchlistCount = await db.select().from(watchlist);
    analyses.push({
      tableName: 'watchlist',
      rowCount: watchlistCount.length,
      shouldHaveData: false,
      dataSource: 'User watchlists',
      priority: 'N/A',
      reason: 'User-created watchlists - empty until users add elections'
    });
    
    const sessionsCount = await db.select().from(sessions);
    analyses.push({
      tableName: 'sessions',
      rowCount: sessionsCount.length,
      shouldHaveData: false,
      dataSource: 'Active user sessions',
      priority: 'N/A',
      reason: 'Session management - transient data'
    });
    
    // Print analysis
    console.log('📊 DATABASE TABLE ANALYSIS\n');
    console.log('=' .repeat(120));
    
    // Tables that SHOULD have data but don't
    console.log('\n🚨 HIGH PRIORITY - SHOULD HAVE DATA:\n');
    const highPriority = analyses.filter(a => a.priority === 'HIGH' && a.rowCount === 0);
    if (highPriority.length === 0) {
      console.log('✅ All high priority tables have data!');
    } else {
      highPriority.forEach(a => {
        console.log(`❌ ${a.tableName.padEnd(30)} | Rows: ${a.rowCount.toString().padEnd(6)} | Source: ${a.dataSource}`);
        console.log(`   Reason: ${a.reason}\n`);
      });
    }
    
    // Medium priority
    console.log('\n⚠️  MEDIUM PRIORITY - SHOULD HAVE DATA:\n');
    const mediumPriority = analyses.filter(a => a.priority === 'MEDIUM' && a.rowCount === 0);
    if (mediumPriority.length === 0) {
      console.log('✅ All medium priority tables have data!');
    } else {
      mediumPriority.forEach(a => {
        console.log(`⚠️  ${a.tableName.padEnd(30)} | Rows: ${a.rowCount.toString().padEnd(6)} | Source: ${a.dataSource}`);
        console.log(`   Reason: ${a.reason}\n`);
      });
    }
    
    // Tables with data
    console.log('\n✅ TABLES WITH DATA:\n');
    const withData = analyses.filter(a => a.rowCount > 0);
    withData.forEach(a => {
      console.log(`✓  ${a.tableName.padEnd(30)} | Rows: ${a.rowCount.toString().padEnd(6)} | Priority: ${a.priority}`);
    });
    
    // Legitimately empty tables
    console.log('\n✓  LEGITIMATELY EMPTY (User/Campaign Generated):\n');
    const legitimatelyEmpty = analyses.filter(a => !a.shouldHaveData);
    legitimatelyEmpty.forEach(a => {
      console.log(`   ${a.tableName.padEnd(30)} | Rows: ${a.rowCount.toString().padEnd(6)} | ${a.reason}`);
    });
    
    console.log('\n' + '='.repeat(120));
    
    // Summary
    const totalTables = analyses.length;
    const tablesWithData = analyses.filter(a => a.rowCount > 0).length;
    const shouldHaveData = analyses.filter(a => a.shouldHaveData).length;
    const shouldHaveDataButDont = analyses.filter(a => a.shouldHaveData && a.rowCount === 0).length;
    
    console.log('\n📈 SUMMARY:');
    console.log(`   Total tables analyzed: ${totalTables}`);
    console.log(`   Tables with data: ${tablesWithData}`);
    console.log(`   Tables that should have data: ${shouldHaveData}`);
    console.log(`   ❌ Tables missing data: ${shouldHaveDataButDont}`);
    console.log(`   ✅ Completion rate: ${Math.round((tablesWithData / shouldHaveData) * 100)}%`);
    
  } catch (error) {
    console.error('\n❌ Error during analysis:', error);
    throw error;
  }
}

// Run the analysis
analyzeAllTables()
  .then(() => {
    console.log('\n✅ Analysis complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Analysis failed:', error);
    process.exit(1);
  });
