import { db } from "./db";
import {
  interactionLogs,
  engagementMetrics,
  userPreferences,
  userDemographics,
  nonVoterTracking,
  type InsertInteractionLog,
  type InsertEngagementMetrics,
  type InsertUserPreferences,
  type InsertUserDemographics,
  type InsertNonVoterTracking,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export class AnalyticsService {
  // Track user interactions with GDPR compliance
  async logInteraction(data: InsertInteractionLog): Promise<void> {
    try {
      // Anonymize IP address for privacy compliance
      if (data.ipAddress) {
        data.ipAddress = this.anonymizeIpAddress(data.ipAddress);
      }

      await db.insert(interactionLogs).values(data);
    } catch (error) {
      console.error("Error logging interaction:", error);
    }
  }

  // Track page engagement metrics
  async recordEngagement(data: InsertEngagementMetrics): Promise<void> {
    try {
      await db.insert(engagementMetrics).values(data);
    } catch (error) {
      console.error("Error recording engagement:", error);
    }
  }

  // Save user preferences with consent tracking
  async updateUserPreferences(
    userId: number,
    preferences: Partial<InsertUserPreferences>,
  ): Promise<void> {
    try {
      const existingPrefs = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId));

      if (existingPrefs.length > 0) {
        await db
          .update(userPreferences)
          .set({ ...preferences, updatedAt: new Date() })
          .where(eq(userPreferences.userId, userId));
      } else {
        await db.insert(userPreferences).values({
          userId,
          ...preferences,
          consentGiven: true,
          consentDate: new Date(),
        });
      }
    } catch (error) {
      console.error("Error updating user preferences:", error);
    }
  }

  // Save user demographics data
  async updateUserDemographics(
    userId: number,
    demographics: Partial<InsertUserDemographics>,
  ): Promise<void> {
    try {
      const existing = await db
        .select()
        .from(userDemographics)
        .where(eq(userDemographics.userId, userId));

      if (existing.length > 0) {
        await db
          .update(userDemographics)
          .set({ ...demographics, updatedAt: new Date() })
          .where(eq(userDemographics.userId, userId));
      } else {
        await db.insert(userDemographics).values({ userId, ...demographics });
      }
    } catch (error) {
      console.error("Error updating user demographics:", error);
    }
  }

  // Track non-voter engagement
  async updateNonVoterTracking(
    userId: number,
    data: Partial<InsertNonVoterTracking>,
  ): Promise<void> {
    try {
      const existing = await db
        .select()
        .from(nonVoterTracking)
        .where(eq(nonVoterTracking.userId, userId));

      if (existing.length > 0) {
        await db
          .update(nonVoterTracking)
          .set({ ...data, updatedAt: new Date() })
          .where(eq(nonVoterTracking.userId, userId));
      } else {
        await db.insert(nonVoterTracking).values({ userId, ...data });
      }
    } catch (error) {
      console.error("Error updating non-voter tracking:", error);
    }
  }

  // Get analytics insights (aggregated data only)
  async getEngagementInsights(electionCycleId?: number) {
    try {
      // This would return aggregated, anonymized insights
      // Implementation would depend on specific analytics needs
      return {
        totalUsers: 0,
        averageTimeOnPage: 0,
        mostViewedElections: [],
        peakUsageTimes: [],
      };
    } catch (error) {
      console.error("Error getting engagement insights:", error);
      return null;
    }
  }

  // GDPR compliance: anonymize IP addresses
  private anonymizeIpAddress(ip: string): string {
    const parts = ip.split(".");
    if (parts.length === 4) {
      // Replace last octet with 0 for IPv4
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
    // For IPv6, keep only first 64 bits
    if (ip.includes(":")) {
      const segments = ip.split(":");
      return segments.slice(0, 4).join(":") + "::";
    }
    return ip;
  }

  // GDPR compliance: data export for user
  async exportUserData(userId: number) {
    try {
      const [preferences] = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId));

      const [demographics] = await db
        .select()
        .from(userDemographics)
        .where(eq(userDemographics.userId, userId));

      const [nonVoter] = await db
        .select()
        .from(nonVoterTracking)
        .where(eq(nonVoterTracking.userId, userId));

      return {
        preferences: preferences || null,
        demographics: demographics || null,
        nonVoterData: nonVoter || null,
        exportDate: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error exporting user data:", error);
      return null;
    }
  }

  // GDPR compliance: delete user data
  async deleteUserData(userId: number): Promise<boolean> {
    try {
      await Promise.all([
        db.delete(userPreferences).where(eq(userPreferences.userId, userId)),
        db.delete(userDemographics).where(eq(userDemographics.userId, userId)),
        db.delete(nonVoterTracking).where(eq(nonVoterTracking.userId, userId)),
        db.delete(interactionLogs).where(eq(interactionLogs.userId, userId)),
        db
          .delete(engagementMetrics)
          .where(eq(engagementMetrics.userId, userId)),
      ]);

      return true;
    } catch (error) {
      console.error("Error deleting user data:", error);
      return false;
    }
  }
}

export const analyticsService = new AnalyticsService();
