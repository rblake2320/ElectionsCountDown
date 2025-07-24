import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, numeric, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const elections = pgTable("elections", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  location: text("location").notNull(),
  state: text("state").notNull(),
  date: timestamp("date").notNull(),
  type: text("type").notNull(), // 'primary', 'general', 'special'
  level: text("level").notNull(), // 'federal', 'state', 'local'
  offices: text("offices").array(),
  description: text("description"),
  pollsOpen: text("polls_open"),
  pollsClose: text("polls_close"),
  timezone: text("timezone"),
  isActive: boolean("is_active").default(true),
});

export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  party: text("party").notNull(), // 'D', 'R', 'I', 'G', etc.
  electionId: integer("election_id").references(() => elections.id),
  pollingSupport: integer("polling_support"), // percentage
  pollingTrend: text("polling_trend"), // 'up', 'down', 'stable'
  lastPollingUpdate: timestamp("last_polling_update"),
  pollingSource: text("polling_source"), // Source of polling data
  isIncumbent: boolean("is_incumbent").default(false),
  description: text("description"),
  website: text("website"),
  votesReceived: integer("votes_received"), // actual vote count
  votePercentage: numeric("vote_percentage", { precision: 5, scale: 2 }), // percentage of total votes
  isWinner: boolean("is_winner").default(false), // election winner
  isProjectedWinner: boolean("is_projected_winner").default(false), // early projection
  // Candidate Management Fields
  isVerified: boolean("is_verified").default(false), // platform verified candidate
  subscriptionTier: text("subscription_tier"), // 'basic', 'premium', 'enterprise'
  profileImageUrl: text("profile_image_url"),
  campaignBio: text("campaign_bio"),
  contactEmail: text("contact_email"),
  campaignPhone: text("campaign_phone"),
  socialMedia: jsonb("social_media"), // {twitter, facebook, instagram, tiktok, youtube}
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const electionResults = pgTable("election_results", {
  id: serial("id").primaryKey(),
  electionId: integer("election_id").references(() => elections.id),
  totalVotes: integer("total_votes"),
  reportingPrecincts: integer("reporting_precincts"),
  totalPrecincts: integer("total_precincts"),
  percentReporting: numeric("percent_reporting", { precision: 5, scale: 2 }),
  isComplete: boolean("is_complete").default(false),
  isCertified: boolean("is_certified").default(false),
  lastUpdated: timestamp("last_updated").defaultNow(),
  resultsSource: text("results_source"), // 'Associated Press', 'Secretary of State', etc.
});

// Session storage table for auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const watchlist = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  electionId: integer("election_id").references(() => elections.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Candidate Q&A and Position Management
export const candidatePositions = pgTable("candidate_positions", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").references(() => candidates.id).notNull(),
  category: text("category").notNull(), // Economy, Healthcare, Education, etc.
  position: text("position").notNull(),
  detailedStatement: text("detailed_statement"),
  isVerified: boolean("is_verified").default(false), // candidate verified this position
  sourceUrl: text("source_url"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const candidateQA = pgTable("candidate_qa", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").references(() => candidates.id).notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category"), // topic categorization
  isPublic: boolean("is_public").default(true),
  isPriority: boolean("is_priority").default(false), // featured Q&A
  isVerified: boolean("is_verified").default(false), // candidate approved
  upvotes: integer("upvotes").default(0),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Candidate Authentication and Campaign Portal Management
export const candidateAccounts = pgTable("candidate_accounts", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").references(() => candidates.id).notNull(),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash").notNull(),
  role: text("role").notNull().default('campaign_manager'), // 'candidate', 'campaign_manager', 'staff'
  subscriptionTier: text("subscription_tier").notNull().default('basic'), // 'basic', 'premium', 'enterprise'
  isActive: boolean("is_active").default(true),
  emailVerified: boolean("email_verified").default(false),
  lastLogin: timestamp("last_login"),
  campaignName: text("campaign_name"),
  campaignTitle: text("campaign_title"), // "Campaign Manager for John Smith"
  accessLevel: text("access_level").default('full'), // 'full', 'limited', 'view_only'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Candidate-Supplied Information (RAG Source)
export const candidateProfiles = pgTable("candidate_profiles", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").references(() => candidates.id).notNull(),
  // Personal Information
  fullName: text("full_name"),
  preferredName: text("preferred_name"),
  age: integer("age"),
  birthPlace: text("birth_place"),
  currentResidence: text("current_residence"),
  familyStatus: text("family_status"),
  // Professional Background
  currentOccupation: text("current_occupation"),
  employmentHistory: jsonb("employment_history"), // Array of {company, position, years, description}
  education: jsonb("education"), // Array of {institution, degree, year, field}
  militaryService: text("military_service"),
  // Political Experience
  previousOffices: jsonb("previous_offices"), // Array of {office, years, achievements}
  politicalExperience: text("political_experience"),
  endorsements: jsonb("endorsements"), // Array of {organization, description, date}
  // Policy Positions (Structured)
  economyPosition: text("economy_position"),
  healthcarePosition: text("healthcare_position"),
  educationPosition: text("education_position"),
  environmentPosition: text("environment_position"),
  immigrationPosition: text("immigration_position"),
  criminalJusticePosition: text("criminal_justice_position"),
  infrastructurePosition: text("infrastructure_position"),
  taxesPosition: text("taxes_position"),
  foreignPolicyPosition: text("foreign_policy_position"),
  socialIssuesPosition: text("social_issues_position"),
  // Campaign Information
  campaignWebsite: text("campaign_website"),
  campaignSlogan: text("campaign_slogan"),
  topPriorities: jsonb("top_priorities"), // Array of {priority, description}
  keyAccomplishments: jsonb("key_accomplishments"),
  // Data Source Tracking
  lastUpdatedBy: integer("last_updated_by").references(() => candidateAccounts.id),
  dataCompleteness: integer("data_completeness").default(0), // percentage 0-100
  verificationStatus: text("verification_status").default('pending'), // 'pending', 'verified', 'needs_review'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Track data sources and attributions for transparency
export const candidateDataSources = pgTable("candidate_data_sources", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").references(() => candidates.id).notNull(),
  fieldName: text("field_name").notNull(), // which field this source applies to
  sourceType: text("source_type").notNull(), // 'candidate_supplied', 'ai_research', 'verified_external'
  sourceDescription: text("source_description"), // e.g., "Candidate Campaign Portal", "Perplexity AI Research", "Ballotpedia"
  sourceUrl: text("source_url"),
  lastVerified: timestamp("last_verified"),
  confidenceScore: integer("confidence_score"), // 1-100
  createdAt: timestamp("created_at").defaultNow(),
});

// Real-time voter engagement and polling
export const voterInteractions = pgTable("voter_interactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"), // can be anonymous
  candidateId: integer("candidate_id").references(() => candidates.id).notNull(),
  interactionType: text("interaction_type").notNull(), // 'view', 'like', 'share', 'question_ask', 'poll_response'
  electionId: integer("election_id").references(() => elections.id),
  contentId: integer("content_id"), // references to QA, position, etc.
  sentiment: text("sentiment"), // 'positive', 'neutral', 'negative'
  sessionId: text("session_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata"), // additional interaction data
  createdAt: timestamp("created_at").defaultNow(),
});

export const realTimePolling = pgTable("real_time_polling", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").references(() => candidates.id).notNull(),
  electionId: integer("election_id").references(() => elections.id).notNull(),
  pollDate: timestamp("poll_date").defaultNow(),
  supportLevel: numeric("support_level", { precision: 5, scale: 2 }), // percentage
  confidence: numeric("confidence", { precision: 5, scale: 2 }), // confidence interval
  sampleSize: integer("sample_size"),
  methodology: text("methodology"), // 'user_interactions', 'direct_poll', 'engagement_analysis'
  demographics: jsonb("demographics"), // age, location, party affiliation breakdown
  trendDirection: text("trend_direction"), // 'up', 'down', 'stable'
  createdAt: timestamp("created_at").defaultNow(),
});

// Campaign content management
export const campaignContent = pgTable("campaign_content", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").references(() => candidates.id).notNull(),
  contentType: text("content_type").notNull(), // 'announcement', 'policy', 'event', 'media'
  title: text("title").notNull(),
  content: text("content").notNull(),
  mediaUrls: text("media_urls").array(), // images, videos, documents
  isPublished: boolean("is_published").default(false),
  publishDate: timestamp("publish_date"),
  views: integer("views").default(0),
  engagementScore: numeric("engagement_score", { precision: 5, scale: 2 }).default('0'),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Candidate subscription and payment tracking
export const candidateSubscriptions = pgTable("candidate_subscriptions", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").references(() => candidates.id).notNull(),
  subscriptionTier: text("subscription_tier").notNull(), // 'basic', 'premium', 'enterprise'
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  paymentStatus: text("payment_status").default('pending'), // 'pending', 'paid', 'overdue', 'cancelled'
  features: jsonb("features"), // tier-specific feature access
  monthlyPrice: numeric("monthly_price", { precision: 10, scale: 2 }),
  totalPaid: numeric("total_paid", { precision: 10, scale: 2 }).default('0'),
  lastPaymentDate: timestamp("last_payment_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const congressMembers = pgTable("congress_members", {
  id: serial("id").primaryKey(),
  bioguideId: varchar("bioguide_id", { length: 50 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  party: varchar("party", { length: 50 }),
  state: varchar("state", { length: 10 }).notNull(),
  district: varchar("district", { length: 10 }),
  chamber: varchar("chamber", { length: 20 }).notNull(), // 'House' or 'Senate'
  congress: integer("congress").default(119), // Current Congress number (119th)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const congressBills = pgTable("congress_bills", {
  id: serial("id").primaryKey(),
  congress: integer("congress").notNull(),
  billNumber: varchar("bill_number", { length: 50 }).notNull(),
  title: text("title").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  introducedDate: timestamp("introduced_date"),
  latestActionDate: timestamp("latest_action_date"),
  latestActionText: text("latest_action_text"),
  sponsors: jsonb("sponsors").default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const congressCommittees = pgTable("congress_committees", {
  id: serial("id").primaryKey(),
  systemCode: varchar("system_code", { length: 50 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  chamber: varchar("chamber", { length: 20 }).notNull(),
  type: varchar("type", { length: 50 }),
  subcommittees: jsonb("subcommittees").default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Election cycles for version control
export const electionCycles = pgTable("election_cycles", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  year: integer("year").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Campaign accounts for the candidate portal
export const campaignAccounts = pgTable("campaign_accounts", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").references(() => candidates.id).notNull(),
  apiKey: varchar("api_key", { length: 255 }).unique().notNull(),
  organizationName: varchar("organization_name", { length: 255 }).notNull(),
  contactEmail: varchar("contact_email", { length: 255 }).notNull(),
  subscriptionTier: varchar("subscription_tier", { length: 50 }).default('basic'),
  isActive: boolean("is_active").default(true),
  lastAccessedAt: timestamp("last_accessed_at"),
  totalApiCalls: integer("total_api_calls").default(0),
  monthlyApiLimit: integer("monthly_api_limit").default(1000),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



// Relations
export const electionsRelations = relations(elections, ({ many }) => ({
  candidates: many(candidates),
  results: many(electionResults),
}));

export const electionResultsRelations = relations(electionResults, ({ one }) => ({
  election: one(elections, {
    fields: [electionResults.electionId],
    references: [elections.id],
  }),
}));

export const candidatesRelations = relations(candidates, ({ one }) => ({
  election: one(elections, {
    fields: [candidates.electionId],
    references: [elections.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  watchlist: many(watchlist),
}));

export const watchlistRelations = relations(watchlist, ({ one }) => ({
  election: one(elections, {
    fields: [watchlist.electionId],
    references: [elections.id],
  }),
}));

// Filter schema
export const filterSchema = z.object({
  state: z.string().optional(),
  type: z.union([z.string(), z.array(z.string())]).optional(),
  level: z.union([z.string(), z.array(z.string())]).optional(),
  timeframe: z.string().optional(),
  timeRange: z.string().optional(),
  search: z.string().optional(),
  party: z.union([z.string(), z.array(z.string())]).optional(),
  electionType: z.union([z.string(), z.array(z.string())]).optional(),
}).transform((data) => {
  // Handle query string arrays being passed as comma-separated strings
  return {
    ...data,
    state: data.state === 'all' ? undefined : data.state,
    type: data.type === 'all' ? undefined : data.type,
    level: data.level === 'all' ? undefined : data.level,
    timeframe: data.timeframe === 'all' ? undefined : data.timeframe,
    timeRange: data.timeRange === 'all' ? undefined : data.timeRange,
    party: data.party === 'all' ? undefined : data.party,
    electionType: data.electionType === 'all' ? undefined : data.electionType,
  };
});

// Insert schemas
export const insertElectionSchema = createInsertSchema(elections).omit({
  id: true,
});

export const insertCandidateSchema = createInsertSchema(candidates).omit({
  id: true,
});

export const insertWatchlistSchema = createInsertSchema(watchlist).omit({
  id: true,
  createdAt: true,
});

export const insertCongressMemberSchema = createInsertSchema(congressMembers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertElectionResultSchema = createInsertSchema(electionResults).omit({
  id: true,
  lastUpdated: true,
});

// Candidate engagement schemas
export const insertCandidatePositionSchema = createInsertSchema(candidatePositions).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertCandidateQASchema = createInsertSchema(candidateQA).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVoterInteractionSchema = createInsertSchema(voterInteractions).omit({
  id: true,
  createdAt: true,
});

export const insertRealTimePollingSchema = createInsertSchema(realTimePolling).omit({
  id: true,
  createdAt: true,
});

export const insertCampaignContentSchema = createInsertSchema(campaignContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCandidateSubscriptionSchema = createInsertSchema(candidateSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Election = typeof elections.$inferSelect;
export type InsertElection = z.infer<typeof insertElectionSchema>;
export type Candidate = typeof candidates.$inferSelect;
export type ElectionResult = typeof electionResults.$inferSelect;
export type InsertElectionResult = z.infer<typeof insertElectionResultSchema>;
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type ElectionFilters = z.infer<typeof filterSchema>;
export type User = typeof users.$inferSelect;

// Data authenticity interfaces
export interface DataAuthenticity {
  hasAuthenticPolling: boolean;
  hasAuthenticVotes: boolean;
  lastDataVerification: string;
  pollingConfidence: number;
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
}

// Enhanced candidate type with authenticity data
export interface CandidateWithAuthenticity extends Candidate {
  dataAuthenticity?: DataAuthenticity;
}
export type UpsertUser = typeof users.$inferInsert;
export type WatchlistItem = typeof watchlist.$inferSelect;
export type InsertWatchlistItem = z.infer<typeof insertWatchlistSchema>;
export type CongressMember = typeof congressMembers.$inferSelect;
export type InsertCongressMember = z.infer<typeof insertCongressMemberSchema>;

// Candidate Authentication Types
export type CandidateAccount = typeof candidateAccounts.$inferSelect;
export type InsertCandidateAccount = typeof candidateAccounts.$inferInsert;

export type CandidateProfile = typeof candidateProfiles.$inferSelect;
export type InsertCandidateProfile = typeof candidateProfiles.$inferInsert;

export type CandidateDataSource = typeof candidateDataSources.$inferSelect;
export type InsertCandidateDataSource = typeof candidateDataSources.$inferInsert;

// Candidate engagement types
export type CandidatePosition = typeof candidatePositions.$inferSelect;
export type InsertCandidatePosition = z.infer<typeof insertCandidatePositionSchema>;
export type CandidateQA = typeof candidateQA.$inferSelect;
export type InsertCandidateQA = z.infer<typeof insertCandidateQASchema>;
export type VoterInteraction = typeof voterInteractions.$inferSelect;
export type InsertVoterInteraction = z.infer<typeof insertVoterInteractionSchema>;
export type RealTimePolling = typeof realTimePolling.$inferSelect;
export type InsertRealTimePolling = z.infer<typeof insertRealTimePollingSchema>;
export type CampaignContent = typeof campaignContent.$inferSelect;
export type InsertCampaignContent = z.infer<typeof insertCampaignContentSchema>;
export type CandidateSubscription = typeof candidateSubscriptions.$inferSelect;
export type InsertCandidateSubscription = z.infer<typeof insertCandidateSubscriptionSchema>;