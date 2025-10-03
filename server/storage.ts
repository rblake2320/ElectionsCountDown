import {
  elections,
  candidates,
  congressMembers,
  congressBills,
  congressCommittees,
  users,
  sessions,
  watchlist,
  electionResults,
  electionCycles,
  campaignAccounts,
  candidateAccounts,
  candidateProfiles,
  candidateDataSources,
  type Election,
  type InsertElection,
  type Candidate,
  type InsertCandidate,
  type ElectionFilters,
  type CongressMember,
  type InsertCongressMember,
  type User,
  type UpsertUser,
  type WatchlistItem,
  type InsertWatchlistItem,
  type CandidateAccount,
  type InsertCandidateAccount,
  type CandidateProfile,
  type InsertCandidateProfile,
  type CandidateDataSource,
  type InsertCandidateDataSource,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, ilike, or, desc, inArray } from "drizzle-orm";
import { getGoogleCivicService } from "./google-civic-service";
import { getCongressBillService } from "./congress-bill-service";
import { getPerplexityService } from "./perplexity-service";
import { censusService } from "./census-service";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Elections
  getElections(filters?: ElectionFilters): Promise<Election[]>;
  getElection(id: number): Promise<Election | undefined>;
  createElection(election: InsertElection): Promise<Election>;
  deleteElection(id: number): Promise<void>;

  // Candidates
  getCandidatesByElection(electionId: number): Promise<Candidate[]>;
  getCandidates(electionId?: number): Promise<Candidate[]>;
  getCandidatesByIds(ids: number[]): Promise<Candidate[]>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  updateCandidatePolling(
    candidateId: number,
    pollingData: {
      pollingSupport?: number;
      pollingTrend?: string;
      lastPollingUpdate?: Date;
      pollingSource?: string;
    },
  ): Promise<void>;

  // Election Results
  getElectionResults(electionId: number): Promise<any>;
  updateElectionResults(electionId: number, resultsData: any): Promise<any>;

  // Stats
  getElectionStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    byLevel: Record<string, number>;
    nextElection: Election | null;
  }>;

  // API Integrations
  syncElectionsFromGoogleCivic(): Promise<void>;
  getVoterInfo(address: string): Promise<any>;

  // Congress API Data
  getAllBills(): Promise<any[]>;
  getBillsByCongress(congress: string): Promise<any[]>;
  getAllMembers(): Promise<any[]>;
  getAllCongressMembers(): Promise<CongressMember[]>;
  getMembersByState(state: string): Promise<any[]>;
  getAllCommittees(): Promise<any[]>;
  getCommitteeMembers(chamber: string, committeeCode: string): Promise<any[]>;
  getDailyCongressionalRecords(): Promise<any[]>;
  getSenateCommunications(): Promise<any[]>;
  getAllNominations(): Promise<any[]>;
  getHouseVotes(): Promise<any[]>;

  // Perplexity AI Integration
  searchElectionsWithAI(query: string): Promise<string>;
  expandElectionData(): Promise<void>;

  // User Authentication (Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // User watchlist
  getUserWatchlist(userId: string): Promise<WatchlistItem[]>;
  addToWatchlist(userId: string, electionId: number): Promise<WatchlistItem>;
  removeFromWatchlist(userId: string, electionId: number): Promise<void>;

  // Version Control & Election Cycles
  getElectionCycles(): Promise<any[]>;
  getElectionCycle(slug: string): Promise<any>;

  // Analytics & GDPR Compliance
  logInteraction(data: any): Promise<void>;

  // Candidate Authentication & Portal
  authenticateCandidate(
    email: string,
    password: string,
  ): Promise<CandidateAccount | null>;
  createCandidateAccount(
    account: InsertCandidateAccount,
  ): Promise<CandidateAccount>;
  getCandidateProfile(candidateId: number): Promise<CandidateProfile | null>;
  updateCandidateProfile(
    candidateId: number,
    profile: Partial<CandidateProfile>,
  ): Promise<CandidateProfile>;
  getCandidateDataSources(candidateId: number): Promise<CandidateDataSource[]>;
  recordDataSource(
    source: InsertCandidateDataSource,
  ): Promise<CandidateDataSource>;
  getCandidateWithRAG(candidateId: number): Promise<any>;
  recordEngagement(data: any): Promise<void>;
  updateUserPreferences(userId: number, preferences: any): Promise<void>;
  updateUserDemographics(userId: number, demographics: any): Promise<void>;
  exportUserData(userId: number): Promise<any>;
  deleteUserData(userId: number): Promise<boolean>;

  // Campaign Portal & Data Marketplace
  createCampaignAccount(data: any): Promise<any>;
  validateCampaignAccess(apiKey: string): Promise<any>;
  getCampaignAnalytics(
    campaignId: number,
    electionId: number,
    tier: string,
  ): Promise<any>;
  getCampaignGeographics(
    campaignId: number,
    region: string,
    tier: string,
  ): Promise<any>;
  getCampaignPolling(
    campaignId: number,
    electionId: number,
    dateRange: string,
  ): Promise<any>;
  purchaseDataExport(
    campaignId: number,
    datasetType: string,
    format?: string,
  ): Promise<any>;
  getCampaignSubscription(campaignId: number): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getElections(filters?: ElectionFilters): Promise<Election[]> {
    const conditions = [];
    let needsJoin = false;

    if (filters) {
      // Filter by time range
      if (filters.timeframe && filters.timeframe !== "all") {
        const now = new Date();
        let endDate = new Date();

        switch (filters.timeframe) {
          case "week":
            endDate.setDate(now.getDate() + 7);
            break;
          case "month":
            endDate.setMonth(now.getMonth() + 1);
            break;
          case "quarter":
            endDate.setMonth(now.getMonth() + 3);
            break;
          case "year":
            endDate.setFullYear(now.getFullYear() + 1);
            break;
        }

        conditions.push(
          and(gte(elections.date, now), lte(elections.date, endDate)),
        );
      }

      // Filter by election type
      if (filters.type) {
        if (Array.isArray(filters.type)) {
          conditions.push(inArray(elections.type, filters.type));
        } else {
          conditions.push(eq(elections.type, filters.type));
        }
      }

      // Filter by election type array (from frontend)
      if (filters.electionType) {
        if (Array.isArray(filters.electionType)) {
          conditions.push(inArray(elections.type, filters.electionType));
        } else {
          conditions.push(eq(elections.type, filters.electionType));
        }
      }

      // Filter by level
      if (filters.level) {
        if (Array.isArray(filters.level)) {
          conditions.push(inArray(elections.level, filters.level));
        } else {
          conditions.push(eq(elections.level, filters.level));
        }
      }

      // Filter by party (requires JOIN with candidates table)
      if (filters.party) {
        needsJoin = true;
        if (Array.isArray(filters.party)) {
          conditions.push(inArray(candidates.party, filters.party));
        } else {
          conditions.push(eq(candidates.party, filters.party));
        }
      }

      // Filter by state - handle both full names and abbreviations
      if (filters.state && filters.state !== "all") {
        // Map full state names to abbreviations
        const stateAbbreviations: { [key: string]: string } = {
          Alabama: "AL",
          Alaska: "AK",
          Arizona: "AZ",
          Arkansas: "AR",
          California: "CA",
          Colorado: "CO",
          Connecticut: "CT",
          Delaware: "DE",
          Florida: "FL",
          Georgia: "GA",
          Hawaii: "HI",
          Idaho: "ID",
          Illinois: "IL",
          Indiana: "IN",
          Iowa: "IA",
          Kansas: "KS",
          Kentucky: "KY",
          Louisiana: "LA",
          Maine: "ME",
          Maryland: "MD",
          Massachusetts: "MA",
          Michigan: "MI",
          Minnesota: "MN",
          Mississippi: "MS",
          Missouri: "MO",
          Montana: "MT",
          Nebraska: "NE",
          Nevada: "NV",
          "New Hampshire": "NH",
          "New Jersey": "NJ",
          "New Mexico": "NM",
          "New York": "NY",
          "North Carolina": "NC",
          "North Dakota": "ND",
          Ohio: "OH",
          Oklahoma: "OK",
          Oregon: "OR",
          Pennsylvania: "PA",
          "Rhode Island": "RI",
          "South Carolina": "SC",
          "South Dakota": "SD",
          Tennessee: "TN",
          Texas: "TX",
          Utah: "UT",
          Vermont: "VT",
          Virginia: "VA",
          Washington: "WA",
          "West Virginia": "WV",
          Wisconsin: "WI",
          Wyoming: "WY",
        };

        const stateValue = stateAbbreviations[filters.state] || filters.state;
        conditions.push(eq(elections.state, stateValue));
      }

      // Filter by search
      if (filters.search) {
        conditions.push(
          or(
            ilike(elections.title, `%${filters.search}%`),
            ilike(elections.subtitle, `%${filters.search}%`),
            ilike(elections.location, `%${filters.search}%`),
          ),
        );
      }
    }

    // Apply conditions and filter active elections
    const allConditions = [eq(elections.isActive, true)];
    if (conditions.length > 0) {
      allConditions.push(...conditions.filter((c) => c !== undefined));
    }

    let electionQuery;

    // Add JOIN if party filtering is needed
    if (needsJoin) {
      electionQuery = db
        .select({
          id: elections.id,
          title: elections.title,
          subtitle: elections.subtitle,
          location: elections.location,
          state: elections.state,
          date: elections.date,
          type: elections.type,
          level: elections.level,
          offices: elections.offices,
          description: elections.description,
          pollsOpen: elections.pollsOpen,
          pollsClose: elections.pollsClose,
          timezone: elections.timezone,
          isActive: elections.isActive,
        })
        .from(elections)
        .leftJoin(candidates, eq(elections.id, candidates.electionId));
    } else {
      electionQuery = db.select().from(elections);
    }

    const results = await electionQuery
      .where(and(...allConditions))
      .orderBy(elections.date);

    // Remove duplicates when joining with candidates
    if (needsJoin) {
      const uniqueElections = new Map();
      results.forEach((row: any) => {
        const election = row.elections;
        if (!uniqueElections.has(election.id)) {
          uniqueElections.set(election.id, election);
        }
      });
      return Array.from(uniqueElections.values());
    }

    return results;
  }

  async getElection(id: number): Promise<Election | undefined> {
    const [election] = await db
      .select()
      .from(elections)
      .where(eq(elections.id, id));
    return election || undefined;
  }

  async getElectionByTitleAndDate(
    title: string,
    date: Date,
  ): Promise<Election | undefined> {
    const [election] = await db
      .select()
      .from(elections)
      .where(and(eq(elections.title, title), eq(elections.date, date)))
      .limit(1);
    return election;
  }

  async createElection(insertElection: InsertElection): Promise<Election> {
    const [election] = await db
      .insert(elections)
      .values(insertElection)
      .returning();
    return election;
  }

  async deleteElection(id: number): Promise<void> {
    // First delete associated candidates to avoid foreign key constraint
    await db.delete(candidates).where(eq(candidates.electionId, id));
    // Then delete the election
    await db.delete(elections).where(eq(elections.id, id));
  }

  async getCandidatesByElection(electionId: number): Promise<Candidate[]> {
    return await db
      .select()
      .from(candidates)
      .where(eq(candidates.electionId, electionId))
      .orderBy(desc(candidates.pollingSupport));
  }

  async getCandidatesByIds(candidateIds: number[]): Promise<Candidate[]> {
    if (candidateIds.length === 0) return [];

    const results = await db
      .select()
      .from(candidates)
      .where(inArray(candidates.id, candidateIds))
      .orderBy(desc(candidates.pollingSupport));

    return results;
  }

  async getCandidates(electionId: number): Promise<Candidate[]> {
    return await db
      .select()
      .from(candidates)
      .where(eq(candidates.electionId, electionId))
      .orderBy(desc(candidates.pollingSupport));
  }

  async getElectionResults(electionId: number): Promise<any> {
    try {
      // Get candidates with winner information first
      const candidatesWithResults = await db
        .select()
        .from(candidates)
        .where(eq(candidates.electionId, electionId))
        .orderBy(desc(candidates.votePercentage));

      // Check if any candidate has results data
      const hasResults = candidatesWithResults.some(
        (c) => c.votesReceived !== null,
      );
      const winner = candidatesWithResults.find((c) => c.isWinner);

      return {
        electionId,
        candidates: candidatesWithResults,
        hasResults,
        winner,
        totalVotes: candidatesWithResults.reduce(
          (sum, c) => sum + (c.votesReceived || 0),
          0,
        ),
      };
    } catch (error) {
      console.error("Error fetching election results:", error);
      return {
        electionId,
        candidates: [],
        hasResults: false,
        winner: null,
        totalVotes: 0,
      };
    }
  }

  async updateElectionResults(
    electionId: number,
    resultsData: any,
  ): Promise<any> {
    // Update or insert election results
    const existingResults = await db
      .select()
      .from(electionResults)
      .where(eq(electionResults.electionId, electionId));

    const existingResult = existingResults[0];

    if (existingResult) {
      // Update existing results
      await db
        .update(electionResults)
        .set({
          totalVotes: resultsData.totalVotes,
          reportingPrecincts: resultsData.reportingPrecincts,
          totalPrecincts: resultsData.totalPrecincts,
          percentReporting: resultsData.percentReporting,
          isComplete: resultsData.isComplete,
          lastUpdated: new Date(),
        })
        .where(eq(electionResults.electionId, electionId));
    } else {
      // Insert new results
      await db.insert(electionResults).values({
        electionId,
        totalVotes: resultsData.totalVotes,
        reportingPrecincts: resultsData.reportingPrecincts,
        totalPrecincts: resultsData.totalPrecincts,
        percentReporting: resultsData.percentReporting,
        isComplete: resultsData.isComplete,
        lastUpdated: new Date(),
      });
    }

    // Update candidate results if provided
    if (resultsData.candidateResults) {
      for (const candidateResult of resultsData.candidateResults) {
        await db
          .update(candidates)
          .set({
            votesReceived: candidateResult.votesReceived,
            votePercentage: candidateResult.votePercentage,
            isWinner: candidateResult.isWinner,
            isProjectedWinner: candidateResult.isProjectedWinner,
          })
          .where(eq(candidates.id, candidateResult.candidateId));
      }
    }

    return this.getElectionResults(electionId);
  }

  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    const [candidate] = await db
      .insert(candidates)
      .values(insertCandidate)
      .returning();
    return candidate;
  }

  async updateCandidatePolling(
    candidateId: number,
    pollingData: {
      pollingSupport?: number;
      pollingTrend?: string;
      lastPollingUpdate?: Date;
      pollingSource?: string;
    },
  ): Promise<void> {
    await db
      .update(candidates)
      .set({
        ...pollingData,
        updatedAt: new Date(),
      })
      .where(eq(candidates.id, candidateId));
  }

  async getElectionStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    byLevel: Record<string, number>;
    nextElection: Election | null;
  }> {
    const now = new Date();

    // Get ALL active elections for filter counts
    const allElections = await db
      .select()
      .from(elections)
      .where(eq(elections.isActive, true));

    // Get upcoming elections for next election
    const upcomingElections = allElections
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const byType: Record<string, number> = {};
    const byLevel: Record<string, number> = {};

    // Count ALL elections for filters
    allElections.forEach((election) => {
      byType[election.type] = (byType[election.type] || 0) + 1;
      byLevel[election.level] = (byLevel[election.level] || 0) + 1;
    });

    // Add lowercase keys for frontend compatibility
    const normalizedByLevel = {
      ...byLevel,
      federal: byLevel["Federal"] || 0,
      state: byLevel["State"] || 0,
      local: byLevel["Local"] || 0,
    };

    const normalizedByType = {
      ...byType,
      primary: byType["Primary"] || 0,
      general: byType["General"] || 0,
      special: byType["Special"] || 0,
    };

    return {
      total: allElections.length,
      byType: normalizedByType,
      byLevel: normalizedByLevel,
      nextElection: upcomingElections[0] || null,
    };
  }

  async syncElectionsFromGoogleCivic(): Promise<void> {
    const civicService = getGoogleCivicService();
    if (!civicService) {
      console.warn("Google Civic API service not available");
      return;
    }

    try {
      const googleElections = await civicService.fetchElections();

      for (const election of googleElections) {
        // Check if election already exists
        const existing = await db
          .select()
          .from(elections)
          .where(
            and(
              eq(elections.title, election.title),
              eq(elections.date, election.date),
            ),
          )
          .limit(1);

        if (existing.length === 0) {
          // Insert new election from Google Civic API
          await db.insert(elections).values({
            title: election.title,
            subtitle: election.subtitle,
            location: election.location,
            state: election.state,
            date: election.date,
            type: election.type,
            level: election.level,
            offices: election.offices,
            description: election.description,
            pollsOpen: election.pollsOpen,
            pollsClose: election.pollsClose,
            timezone: election.timezone,
            isActive: election.isActive,
          });
        }
      }

      console.log(
        `Synced ${googleElections.length} elections from Google Civic API`,
      );
    } catch (error) {
      console.error("Error syncing elections from Google Civic API:", error);
    }
  }

  async getVoterInfo(address: string): Promise<any> {
    const civicService = getGoogleCivicService();
    if (!civicService) {
      throw new Error("Google Civic API service not available");
    }

    try {
      // Get Google Civic elections to find a valid election ID
      const googleElections = await civicService.fetchElections();
      const upcomingGoogleElection = googleElections.find(
        (election) => election.date > new Date(),
      );

      // Use Google's election ID format (like "9087", "9155", etc.)
      const googleElectionId = upcomingGoogleElection
        ? upcomingGoogleElection.id.toString()
        : undefined;
      return await civicService.fetchVoterInfo(address, googleElectionId);
    } catch (error: any) {
      console.error("Error fetching voter info:", error);

      // Handle case where no voter info is available for this address/election
      if (error.message?.includes("404")) {
        return {
          error: "NO_VOTER_INFO_AVAILABLE",
          message:
            "Voter information is not currently available for this address and upcoming elections. This may be because there are no elections scheduled in your area, or detailed voting information hasn't been published yet by election officials.",
          suggestedActions: [
            "Try a more specific address (include apartment/unit number)",
            "Check back closer to election day when more details are available",
            "Contact your local election office for voting information",
          ],
        };
      }

      throw error;
    }
  }

  async getAllBills(): Promise<any[]> {
    const congressService = getCongressBillService();
    if (!congressService) {
      return [];
    }
    try {
      return await congressService.fetchAllBills();
    } catch (error) {
      console.error("Error fetching all bills:", error);
      return [];
    }
  }

  async getBillsByCongress(congress: string): Promise<any[]> {
    const congressService = getCongressBillService();
    if (!congressService) {
      return [];
    }
    try {
      return await congressService.fetchBillsByCongress(congress);
    } catch (error) {
      console.error("Error fetching bills by congress:", error);
      return [];
    }
  }

  async getAllMembers(): Promise<any[]> {
    try {
      // First try to get from database
      const dbMembers = await db.select().from(congressMembers).limit(550);

      if (dbMembers.length > 0) {
        return dbMembers;
      }

      // If no data in database, fetch from API and store
      const congressService = getCongressBillService();
      if (!congressService) {
        return [];
      }

      const apiMembers = await congressService.fetchAllMembers();

      // Store in database for future use
      if (apiMembers.length > 0) {
        await this.syncCongressMembersToDatabase(apiMembers);
      }

      return apiMembers;
    } catch (error) {
      console.error("Error fetching all members:", error);
      return [];
    }
  }

  async syncCongressMembersToDatabase(members: any[]): Promise<void> {
    try {
      const insertData = members.map((member) => ({
        bioguideId: member.bioguideId,
        name: member.name,
        party: member.party,
        state: member.state,
        chamber: member.chamber,
        district: member.district,
        congress: 119,
      }));

      if (insertData.length > 0) {
        await db.insert(congressMembers).values(insertData);
        console.log(
          `Successfully synced ${insertData.length} members to database`,
        );
      }
    } catch (error) {
      console.error("Error syncing members to database:", error);
    }
  }

  async getAllCongressMembers(): Promise<CongressMember[]> {
    try {
      return await db.select().from(congressMembers);
    } catch (error) {
      console.error("Error fetching all congressional members:", error);
      return [];
    }
  }

  async getMembersByState(state: string): Promise<any[]> {
    const congressService = getCongressBillService();
    if (!congressService) {
      return [];
    }
    try {
      return await congressService.fetchMembersByState(state);
    } catch (error) {
      console.error("Error fetching members by state:", error);
      return [];
    }
  }

  async getAllCommittees(): Promise<any[]> {
    const congressService = getCongressBillService();
    if (!congressService) {
      return [];
    }
    try {
      return await congressService.fetchAllCommittees();
    } catch (error) {
      console.error("Error fetching all committees:", error);
      return [];
    }
  }

  async getCommitteeMembers(
    chamber: string,
    committeeCode: string,
  ): Promise<any[]> {
    const congressService = getCongressBillService();
    if (!congressService) {
      return [];
    }
    try {
      return await congressService.fetchCommitteeMembers(
        chamber,
        committeeCode,
      );
    } catch (error) {
      console.error("Error fetching committee members:", error);
      return [];
    }
  }

  async getDailyCongressionalRecords(): Promise<any[]> {
    const congressService = getCongressBillService();
    if (!congressService) {
      return [];
    }
    try {
      return await congressService.fetchDailyCongressionalRecords();
    } catch (error) {
      console.error("Error fetching congressional records:", error);
      return [];
    }
  }

  async getSenateCommunications(): Promise<any[]> {
    const congressService = getCongressBillService();
    if (!congressService) {
      return [];
    }
    try {
      return await congressService.fetchSenateCommunications();
    } catch (error) {
      console.error("Error fetching senate communications:", error);
      return [];
    }
  }

  async getAllNominations(): Promise<any[]> {
    const congressService = getCongressBillService();
    if (!congressService) {
      return [];
    }
    try {
      return await congressService.fetchAllNominations();
    } catch (error) {
      console.error("Error fetching nominations:", error);
      return [];
    }
  }

  async getHouseVotes(): Promise<any[]> {
    const congressService = getCongressBillService();
    if (!congressService) {
      return [];
    }
    try {
      return await congressService.fetchHouseVotes();
    } catch (error) {
      console.error("Error fetching house votes:", error);
      return [];
    }
  }

  async searchElectionsWithAI(query: string): Promise<string> {
    const perplexityService = getPerplexityService();
    if (!perplexityService) {
      throw new Error("Perplexity AI service not available");
    }

    try {
      return await perplexityService.searchElections(query);
    } catch (error) {
      console.error("Error searching elections with AI:", error);
      throw error;
    }
  }

  async expandElectionData(): Promise<void> {
    const perplexityService = getPerplexityService();
    if (!perplexityService) {
      console.warn(
        "Perplexity AI service not available for election data expansion",
      );
      return;
    }

    try {
      console.log("Expanding election data using Perplexity AI...");
      const comprehensiveElections =
        await perplexityService.findAllElectionsUntil2026();
      console.log("AI Election Search Results:", comprehensiveElections);

      // This would be where we parse the AI response and add missing elections
      // For now, we'll log the results for review
    } catch (error) {
      console.error("Error expanding election data:", error);
    }
  }

  async searchCongressMembers(searchTerm: string): Promise<CongressMember[]> {
    try {
      console.log(
        `[STORAGE] Searching for congress members with term: "${searchTerm}"`,
      );

      // Test database connection first
      const testQuery = await db.select().from(congressMembers).limit(1);
      console.log(`[STORAGE] Database test: found ${testQuery.length} members`);

      if (testQuery.length === 0) {
        console.log(`[STORAGE] No members in database, returning empty`);
        return [];
      }

      const results = await db
        .select()
        .from(congressMembers)
        .where(
          or(
            ilike(congressMembers.name, `%${searchTerm}%`),
            ilike(congressMembers.state, `%${searchTerm}%`),
            ilike(congressMembers.party, `%${searchTerm}%`),
            ilike(congressMembers.bioguideId, `%${searchTerm}%`),
          ),
        )
        .orderBy(congressMembers.name)
        .limit(50);
      console.log(
        `[STORAGE] Found ${results.length} congress members matching "${searchTerm}"`,
      );
      console.log(`[STORAGE] Sample result:`, results[0]?.name || "none");
      return results;
    } catch (error) {
      console.error("[STORAGE] Error searching congress members:", error);
      return [];
    }
  }

  async findMissingCongressMember(memberName: string): Promise<any> {
    const perplexityService = getPerplexityService();
    if (!perplexityService) {
      return { found: false, message: "Search service not available" };
    }

    try {
      // Use Perplexity to find the congressional member
      const query = `Find current U.S. Congressional member named "${memberName}". Include their full name, party affiliation, state, district number (if House), chamber (House or Senate), and bioguide ID if available.`;

      const response = await perplexityService.searchElections(query);

      // Parse the response to extract member information
      // This is a basic implementation - in production you'd want more sophisticated parsing
      if (
        response.toLowerCase().includes("not found") ||
        response.toLowerCase().includes("no member")
      ) {
        return {
          found: false,
          message: "Member not found in official Congressional records",
        };
      }

      // If found, try to extract member details and add to database
      // For now, return the raw response for manual review
      return {
        found: true,
        message: "Member information found",
        details: response,
        action: "Manual review required for data extraction",
      };
    } catch (error) {
      console.error("Error finding congress member:", error);
      return { found: false, message: "Search failed. Please try again." };
    }
  }

  // Replit Authentication Methods (Required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // User Authentication Methods
  async createUser(email: string, password: string): Promise<any> {
    const { authService } = await import("./auth-service");
    return await authService.signup(email, password);
  }

  async authenticateUser(email: string, password: string): Promise<any> {
    const { authService } = await import("./auth-service");
    return await authService.signin(email, password);
  }

  async validateUserSession(token: string): Promise<any> {
    const { authService } = await import("./auth-service");
    return await authService.validateSession(token);
  }

  async signoutUser(token: string): Promise<void> {
    const { authService } = await import("./auth-service");
    return await authService.signout(token);
  }

  // User Watchlist Methods
  async getUserWatchlist(userId: string): Promise<WatchlistItem[]> {
    try {
      const userWatchlist = await db
        .select({
          id: watchlist.id,
          electionId: watchlist.electionId,
          userId: watchlist.userId,
          createdAt: watchlist.createdAt,
          election: elections,
        })
        .from(watchlist)
        .innerJoin(elections, eq(watchlist.electionId, elections.id))
        .where(eq(watchlist.userId, userId));

      return userWatchlist;
    } catch (error) {
      console.error("Error fetching user watchlist:", error);
      return [];
    }
  }

  async addToWatchlist(
    userId: string,
    electionId: number,
  ): Promise<WatchlistItem> {
    try {
      // Check if already in watchlist
      const existing = await db
        .select()
        .from(watchlist)
        .where(
          and(
            eq(watchlist.userId, userId),
            eq(watchlist.electionId, electionId),
          ),
        );

      if (existing.length === 0) {
        const [newItem] = await db
          .insert(watchlist)
          .values({
            userId,
            electionId,
          })
          .returning();
        return newItem;
      }
      return existing[0];
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      throw error;
    }
  }

  async removeFromWatchlist(userId: string, electionId: number): Promise<void> {
    try {
      await db
        .delete(watchlist)
        .where(
          and(
            eq(watchlist.userId, userId),
            eq(watchlist.electionId, electionId),
          ),
        );
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      throw error;
    }
  }

  // Version Control & Election Cycles
  async getElectionCycles(): Promise<any[]> {
    try {
      const { electionCycles } = await import("@shared/schema");
      return await db.select().from(electionCycles);
    } catch (error) {
      console.error("Error fetching election cycles:", error);
      return [];
    }
  }

  async getElectionCycle(slug: string): Promise<any> {
    try {
      const { electionCycles } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");

      const [cycle] = await db
        .select()
        .from(electionCycles)
        .where(eq(electionCycles.slug, slug));

      return cycle || null;
    } catch (error) {
      console.error("Error fetching election cycle:", error);
      return null;
    }
  }

  // Analytics & GDPR Compliance Methods
  async logInteraction(data: any): Promise<void> {
    const { analyticsService } = await import("./analytics-service");
    return await analyticsService.logInteraction(data);
  }

  async recordEngagement(data: any): Promise<void> {
    const { analyticsService } = await import("./analytics-service");
    return await analyticsService.recordEngagement(data);
  }

  async updateUserPreferences(userId: number, preferences: any): Promise<void> {
    const { analyticsService } = await import("./analytics-service");
    return await analyticsService.updateUserPreferences(userId, preferences);
  }

  async updateUserDemographics(
    userId: number,
    demographics: any,
  ): Promise<void> {
    const { analyticsService } = await import("./analytics-service");
    return await analyticsService.updateUserDemographics(userId, demographics);
  }

  async exportUserData(userId: number): Promise<any> {
    const { analyticsService } = await import("./analytics-service");
    return await analyticsService.exportUserData(userId);
  }

  async deleteUserData(userId: number): Promise<boolean> {
    const { analyticsService } = await import("./analytics-service");
    return await analyticsService.deleteUserData(userId);
  }

  // Campaign Portal & Data Marketplace Implementation
  async createCampaignAccount(data: any): Promise<any> {
    const { campaignPortalService } = await import("./campaign-portal-service");
    return await campaignPortalService.createCampaignAccount(data);
  }

  async validateCampaignAccess(apiKey: string): Promise<any> {
    const { campaignPortalService } = await import("./campaign-portal-service");
    return await campaignPortalService.validateCampaignAccess(apiKey);
  }

  async getCampaignAnalytics(
    campaignId: number,
    electionId: number,
    tier: string,
  ): Promise<any> {
    const { campaignPortalService } = await import("./campaign-portal-service");
    return await campaignPortalService.getElectionAnalytics(
      campaignId,
      electionId,
      tier,
    );
  }

  async getCampaignGeographics(
    campaignId: number,
    region: string,
    tier: string,
  ): Promise<any> {
    const { campaignPortalService } = await import("./campaign-portal-service");
    return await campaignPortalService.getGeographicAnalytics(
      campaignId,
      region,
      tier,
    );
  }

  async getCampaignPolling(
    campaignId: number,
    electionId: number,
    dateRange: string,
  ): Promise<any> {
    const { campaignPortalService } = await import("./campaign-portal-service");
    return await campaignPortalService.getPollingData(
      campaignId,
      electionId,
      dateRange,
    );
  }

  // === CANDIDATE AUTHENTICATION & PORTAL METHODS ===

  async authenticateCandidate(
    email: string,
    password: string,
  ): Promise<CandidateAccount | null> {
    try {
      const [account] = await db
        .select()
        .from(candidateAccounts)
        .where(
          and(
            eq(candidateAccounts.email, email),
            eq(candidateAccounts.isActive, true),
          ),
        )
        .limit(1);

      if (!account || !(await bcrypt.compare(password, account.passwordHash))) {
        return null;
      }

      // Update last login
      await db
        .update(candidateAccounts)
        .set({ lastLogin: new Date() })
        .where(eq(candidateAccounts.id, account.id));

      return account;
    } catch (error) {
      console.error("Error authenticating candidate:", error);
      return null;
    }
  }

  async createCandidateAccount(
    account: InsertCandidateAccount,
  ): Promise<CandidateAccount> {
    try {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(
        account.passwordHash,
        saltRounds,
      );

      const [newAccount] = await db
        .insert(candidateAccounts)
        .values({
          ...account,
          passwordHash: hashedPassword,
        })
        .returning();

      return newAccount;
    } catch (error) {
      console.error("Error creating candidate account:", error);
      throw error;
    }
  }

  async getCandidateProfile(
    candidateId: number,
  ): Promise<CandidateProfile | null> {
    try {
      const [profile] = await db
        .select()
        .from(candidateProfiles)
        .where(eq(candidateProfiles.candidateId, candidateId))
        .limit(1);

      return profile || null;
    } catch (error) {
      console.error("Error fetching candidate profile:", error);
      return null;
    }
  }

  async updateCandidateProfile(
    candidateId: number,
    profileData: Partial<CandidateProfile>,
  ): Promise<CandidateProfile> {
    try {
      // Calculate data completeness
      const totalFields = 25; // Estimated number of profile fields
      const filledFields = Object.values(profileData).filter(
        (value) => value !== null && value !== undefined && value !== "",
      ).length;
      const completeness = Math.round((filledFields / totalFields) * 100);

      const updatedData = {
        ...profileData,
        dataCompleteness: completeness,
        updatedAt: new Date(),
      };

      // Check if profile exists
      const existingProfile = await this.getCandidateProfile(candidateId);

      if (existingProfile) {
        // Update existing profile
        const [updated] = await db
          .update(candidateProfiles)
          .set(updatedData)
          .where(eq(candidateProfiles.candidateId, candidateId))
          .returning();

        return updated;
      } else {
        // Create new profile
        const [newProfile] = await db
          .insert(candidateProfiles)
          .values({
            candidateId,
            ...updatedData,
          } as any)
          .returning();

        return newProfile;
      }
    } catch (error) {
      console.error("Error updating candidate profile:", error);
      throw error;
    }
  }

  async getCandidateDataSources(
    candidateId: number,
  ): Promise<CandidateDataSource[]> {
    try {
      return await db
        .select()
        .from(candidateDataSources)
        .where(eq(candidateDataSources.candidateId, candidateId))
        .orderBy(desc(candidateDataSources.createdAt));
    } catch (error) {
      console.error("Error fetching candidate data sources:", error);
      return [];
    }
  }

  async recordDataSource(
    source: InsertCandidateDataSource,
  ): Promise<CandidateDataSource> {
    try {
      const [newSource] = await db
        .insert(candidateDataSources)
        .values(source)
        .returning();

      return newSource;
    } catch (error) {
      console.error("Error recording data source:", error);
      throw error;
    }
  }

  async getCandidateWithRAG(candidateId: number): Promise<any> {
    try {
      // Get base candidate data
      const [candidate] = await db
        .select()
        .from(candidates)
        .where(eq(candidates.id, candidateId))
        .limit(1);

      if (!candidate) {
        throw new Error("Candidate not found");
      }

      // Get candidate-supplied profile data (Priority 1 - RAG)
      const profile = await this.getCandidateProfile(candidateId);

      // Get data sources for attribution
      const dataSources = await this.getCandidateDataSources(candidateId);

      // Create enhanced candidate object with RAG-first approach
      const enhancedCandidate = {
        ...candidate,
        // Personal Information - Candidate-supplied first
        fullName: profile?.fullName || candidate.name,
        preferredName: profile?.preferredName || candidate.name,
        age: profile?.age,
        birthPlace: profile?.birthPlace,
        currentResidence: profile?.currentResidence,
        familyStatus: profile?.familyStatus,

        // Professional Background - Candidate-supplied first
        currentOccupation: profile?.currentOccupation,
        employmentHistory: profile?.employmentHistory || [],
        education: profile?.education || [],
        militaryService: profile?.militaryService,

        // Political Experience - Candidate-supplied first
        previousOffices: profile?.previousOffices || [],
        politicalExperience: profile?.politicalExperience,
        endorsements: profile?.endorsements || [],

        // Policy Positions - Structured candidate data
        policyPositions: {
          economy: profile?.economyPosition || null,
          healthcare: profile?.healthcarePosition || null,
          education: profile?.educationPosition || null,
          environment: profile?.environmentPosition || null,
          immigration: profile?.immigrationPosition || null,
          criminalJustice: profile?.criminalJusticePosition || null,
          infrastructure: profile?.infrastructurePosition || null,
          taxes: profile?.taxesPosition || null,
          foreignPolicy: profile?.foreignPolicyPosition || null,
          socialIssues: profile?.socialIssuesPosition || null,
        },

        // Campaign Information
        campaignWebsite: profile?.campaignWebsite || candidate.website,
        campaignSlogan: profile?.campaignSlogan,
        topPriorities: profile?.topPriorities || [],
        keyAccomplishments: profile?.keyAccomplishments || [],

        // Data Attribution
        dataCompleteness: profile?.dataCompleteness || 0,
        verificationStatus: profile?.verificationStatus || "pending",
        dataSources: dataSources,

        // Source attribution helper function
        getDataAttribution: (fieldName: string) => {
          const source = dataSources.find((s) => s.fieldName === fieldName);
          if (source) {
            switch (source.sourceType) {
              case "candidate_supplied":
                return "Candidate Supplied";
              case "ai_research":
                return "AI Researched";
              case "verified_external":
                return `Verified: ${source.sourceDescription}`;
              default:
                return "Unknown Source";
            }
          }
          return profile && profile[fieldName as keyof CandidateProfile]
            ? "Candidate Supplied"
            : "Candidate has not supplied that info";
        },
      };

      return enhancedCandidate;
    } catch (error) {
      console.error("Error getting candidate with RAG:", error);
      throw error;
    }
  }

  async purchaseDataExport(
    campaignId: number,
    datasetType: string,
    format?: string,
  ): Promise<any> {
    const { campaignPortalService } = await import("./campaign-portal-service");
    return await campaignPortalService.purchaseDataExport(
      campaignId,
      datasetType,
      format,
    );
  }

  async getCampaignSubscription(campaignId: number): Promise<any> {
    const { SUBSCRIPTION_TIERS } = await import("./campaign-portal-service");
    const { campaignAccounts } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");

    const [campaign] = await db
      .select()
      .from(campaignAccounts)
      .where(eq(campaignAccounts.id, campaignId));

    if (!campaign) {
      throw new Error("Campaign not found");
    }

    return {
      tier: campaign.subscriptionTier,
      isActive: campaign.isActive,
      startDate: campaign.createdAt, // Using createdAt as subscription start
      endDate: null, // No end date field in current schema
      features:
        SUBSCRIPTION_TIERS[
          campaign.subscriptionTier as keyof typeof SUBSCRIPTION_TIERS
        ]?.features || [],
    };
  }
}

// Create a seeding function for initial data
async function seedDatabase() {
  try {
    // Check if data already exists
    const existingElections = await db.select().from(elections).limit(1);
    if (existingElections.length > 0) {
      console.log("Database already seeded");
      return;
    }

    // Comprehensive election data until November 2026
    const electionData = [
      // June 2025 Elections
      {
        title: "New Jersey Primary Elections",
        subtitle: "Governor & General Assembly",
        location: "New Jersey",
        state: "NJ",
        date: new Date("2025-06-10T20:00:00"),
        type: "primary",
        level: "state",
        offices: ["Governor", "General Assembly"],
        description:
          "Democratic and Republican primaries for Governor and all 80 seats of the General Assembly",
        pollsOpen: "6:00 AM EST",
        pollsClose: "8:00 PM EST",
        timezone: "EST",
        isActive: true,
      },
      {
        title: "Virginia Primary Elections",
        subtitle: "Governor, Lt. Governor & Attorney General",
        location: "Virginia",
        state: "VA",
        date: new Date("2025-06-10T19:00:00"),
        type: "primary",
        level: "state",
        offices: [
          "Governor",
          "Lieutenant Governor",
          "Attorney General",
          "House of Delegates",
        ],
        description:
          "Party primaries in Virginia for Governor, Lieutenant Governor, Attorney General, and all 100 seats of the House of Delegates",
        pollsOpen: "6:00 AM EST",
        pollsClose: "7:00 PM EST",
        timezone: "EST",
        isActive: true,
      },

      // July 2025 Elections
      {
        title: "Arizona's 7th Congressional District Special Primary",
        subtitle: "U.S. House Representative",
        location: "Arizona",
        state: "AZ",
        date: new Date("2025-07-15T19:00:00"),
        type: "primary",
        level: "federal",
        offices: ["U.S. Representative"],
        description:
          "Special primary for U.S. House Arizona District 7 to replace the late Rep. Raúl Grijalva",
        pollsOpen: "6:00 AM MST",
        pollsClose: "7:00 PM MST",
        timezone: "MST",
        isActive: true,
      },

      // September 2025 Elections
      {
        title: "Arizona's 7th Congressional District Special Election",
        subtitle: "U.S. House Representative",
        location: "Arizona",
        state: "AZ",
        date: new Date("2025-09-23T19:00:00"),
        type: "special",
        level: "federal",
        offices: ["U.S. Representative"],
        description:
          "Special general election for U.S. House AZ-7 to fill the seat of Rep. Raúl Grijalva",
        pollsOpen: "6:00 AM MST",
        pollsClose: "7:00 PM MST",
        timezone: "MST",
        isActive: true,
      },

      // November 2025 Elections
      {
        title: "New Jersey Governor Election",
        subtitle: "Governor & Lt. Governor",
        location: "New Jersey",
        state: "NJ",
        date: new Date("2025-11-04T20:00:00"),
        type: "general",
        level: "state",
        offices: ["Governor", "Lieutenant Governor", "General Assembly"],
        description:
          "New Jersey statewide general election for Governor, Lieutenant Governor, and all 80 seats of the General Assembly",
        pollsOpen: "6:00 AM EST",
        pollsClose: "8:00 PM EST",
        timezone: "EST",
        isActive: true,
      },
      {
        title: "Virginia Governor Election",
        subtitle: "Governor, Lt. Governor & Attorney General",
        location: "Virginia",
        state: "VA",
        date: new Date("2025-11-04T19:00:00"),
        type: "general",
        level: "state",
        offices: [
          "Governor",
          "Lieutenant Governor",
          "Attorney General",
          "House of Delegates",
        ],
        description:
          "Virginia statewide general election for Governor, Lieutenant Governor, Attorney General, and all 100 seats of the House of Delegates",
        pollsOpen: "6:00 AM EST",
        pollsClose: "7:00 PM EST",
        timezone: "EST",
        isActive: true,
      },
      {
        title: "Texas District 18 Special Election",
        subtitle: "U.S. House Representative",
        location: "Texas",
        state: "TX",
        date: new Date("2025-11-04T20:00:00"),
        type: "special",
        level: "federal",
        offices: ["U.S. Representative"],
        description:
          "Special general election for U.S. House Texas District 18 to fill the seat of the late Rep. Sylvester Turner",
        pollsOpen: "7:00 AM CST",
        pollsClose: "8:00 PM CST",
        timezone: "CST",
        isActive: true,
      },
      {
        title: "New York City Mayor",
        subtitle: "Mayoral General Election",
        location: "New York City",
        state: "NY",
        date: new Date("2025-11-04T20:00:00"),
        type: "general",
        level: "local",
        offices: ["Mayor"],
        description: "New York City mayoral general election",
        pollsOpen: "6:00 AM EST",
        pollsClose: "9:00 PM EST",
        timezone: "EST",
        isActive: true,
      },

      // 2026 Primary Elections
      {
        title: "Super Tuesday Primaries - Arkansas, North Carolina, Texas",
        subtitle: "Congressional and State Primaries",
        location: "Multiple States",
        state: "Multi",
        date: new Date("2026-03-03T20:00:00"),
        type: "primary",
        level: "federal",
        offices: ["U.S. House", "U.S. Senate", "State Offices"],
        description:
          "Primary elections in Arkansas, North Carolina, and Texas for congressional and state offices",
        pollsOpen: "Varies by state",
        pollsClose: "Varies by state",
        timezone: "Varies",
        isActive: true,
      },
      {
        title: "Mississippi Congressional Primary",
        subtitle: "U.S. House and Senate",
        location: "Mississippi",
        state: "MS",
        date: new Date("2026-03-10T19:00:00"),
        type: "primary",
        level: "federal",
        offices: ["U.S. House", "U.S. Senate"],
        description: "Mississippi primary for U.S. House and Senate races",
        pollsOpen: "7:00 AM CST",
        pollsClose: "7:00 PM CST",
        timezone: "CST",
        isActive: true,
      },
      {
        title: "Illinois Primary Election",
        subtitle: "Congressional and State Offices",
        location: "Illinois",
        state: "IL",
        date: new Date("2026-03-17T19:00:00"),
        type: "primary",
        level: "federal",
        offices: ["U.S. House", "U.S. Senate", "State Legislature"],
        description:
          "Illinois primary for U.S. House, Senate (Sen. Dick Durbin retiring), and state offices",
        pollsOpen: "6:00 AM CST",
        pollsClose: "7:00 PM CST",
        timezone: "CST",
        isActive: true,
      },
      {
        title: "Multi-State Primary Elections",
        subtitle: "Georgia, Idaho, Kentucky, Oregon, Pennsylvania",
        location: "Multiple States",
        state: "Multi",
        date: new Date("2026-05-19T20:00:00"),
        type: "primary",
        level: "federal",
        offices: ["U.S. House", "U.S. Senate", "Governor"],
        description:
          "Major primary day including Georgia Governor (open seat), Oregon Governor, and multiple Senate races",
        pollsOpen: "Varies by state",
        pollsClose: "Varies by state",
        timezone: "Varies",
        isActive: true,
      },
      {
        title: "California Primary Election",
        subtitle: "Congressional, Senate & Governor",
        location: "California",
        state: "CA",
        date: new Date("2026-06-02T20:00:00"),
        type: "primary",
        level: "federal",
        offices: ["U.S. House", "U.S. Senate", "Governor"],
        description:
          "California primary elections for U.S. Senate (Sen. Alex Padilla), House districts, and Governor",
        pollsOpen: "7:00 AM PST",
        pollsClose: "8:00 PM PST",
        timezone: "PST",
        isActive: true,
      },

      // November 2026 - Congressional Midterm Elections
      {
        title: "2026 Congressional Midterm Elections",
        subtitle: "All U.S. House Seats & 33 Senate Seats",
        location: "United States",
        state: "ALL",
        date: new Date("2026-11-03T20:00:00"),
        type: "general",
        level: "federal",
        offices: ["U.S. House", "U.S. Senate", "Governor"],
        description:
          "Congressional midterm elections - all 435 House seats, 33 Senate seats, and gubernatorial elections",
        pollsOpen: "Varies by state",
        pollsClose: "Varies by state",
        timezone: "Varies",
        isActive: true,
      },
    ];

    // Insert elections
    const insertedElections = await db
      .insert(elections)
      .values(electionData)
      .returning();

    // Populate comprehensive candidate data for all major elections
    const candidateData = [
      // Ohio Special Election - District 6 (first election)
      {
        name: "Michael Rulli",
        party: "Republican",
        electionId: insertedElections[0].id,
        pollingSupport: 52,
        isIncumbent: false,
        description: "Ohio State Senator and businessman",
      },
      {
        name: "Michael Kripchak",
        party: "Democratic",
        electionId: insertedElections[0].id,
        pollingSupport: 45,
        isIncumbent: false,
        description: "Local government official and community leader",
      },

      // New Jersey Governor Election
      {
        name: "Josh Gottheimer",
        party: "Democratic",
        electionId: insertedElections[1].id,
        pollingSupport: 34,
        isIncumbent: false,
        description: "U.S. Representative",
      },
      {
        name: "Ras Baraka",
        party: "Democratic",
        electionId: insertedElections[1].id,
        pollingSupport: 28,
        isIncumbent: false,
        description: "Mayor of Newark",
      },
      {
        name: "Bill Spadea",
        party: "Republican",
        electionId: insertedElections[1].id,
        pollingSupport: 42,
        isIncumbent: false,
        description: "Radio host and businessman",
      },

      // Virginia Governor Election
      {
        name: "Abigail Spanberger",
        party: "Democratic",
        electionId: insertedElections[2].id,
        pollingSupport: 48,
        isIncumbent: false,
        description: "U.S. Representative",
      },
      {
        name: "Glenn Youngkin",
        party: "Republican",
        electionId: insertedElections[2].id,
        pollingSupport: 47,
        isIncumbent: true,
        description: "Current Governor of Virginia",
      },

      // Add candidates for other key elections to ensure functionality
      {
        name: "Sarah Johnson",
        party: "Democratic",
        electionId: insertedElections[3].id,
        pollingSupport: 49,
        isIncumbent: false,
        description: "State legislator",
      },
      {
        name: "Robert Chen",
        party: "Republican",
        electionId: insertedElections[3].id,
        pollingSupport: 46,
        isIncumbent: false,
        description: "Business executive",
      },

      {
        name: "Maria Rodriguez",
        party: "Democratic",
        electionId: insertedElections[4].id,
        pollingSupport: 51,
        isIncumbent: true,
        description: "Current officeholder",
      },
      {
        name: "James Wilson",
        party: "Republican",
        electionId: insertedElections[4].id,
        pollingSupport: 44,
        isIncumbent: false,
        description: "Former mayor",
      },
    ];

    await db.insert(candidates).values(candidateData);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export const storage = new DatabaseStorage();

// Seed the database and sync with Google Civic API on startup
async function initializeData() {
  await seedDatabase();

  // Automatically sync elections from Google Civic API
  try {
    await storage.syncElectionsFromGoogleCivic();
    console.log("Initial sync with Google Civic API completed");
  } catch (error) {
    console.log(
      "Google Civic API sync skipped - API key may not be configured",
    );
  }
}

initializeData();

// Set up periodic sync every 6 hours
setInterval(
  async () => {
    try {
      await storage.syncElectionsFromGoogleCivic();
      console.log("Periodic sync with Google Civic API completed");
    } catch (error) {
      console.log("Periodic sync failed:", error);
    }
  },
  6 * 60 * 60 * 1000,
); // 6 hours
