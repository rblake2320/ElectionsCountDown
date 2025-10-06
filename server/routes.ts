import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { cacheService } from "./cache-service";
import { filterSchema, congressMembers, candidateBiography, candidatePositions, candidates } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { getCongressBillService } from "./congress-bill-service";
import { perplexityCongressService } from "./perplexity-congress-service";
import { congressImportService } from "./congress-import-service";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { mapQuestService } from "./mapquest-service";
import { realTimeMonitor } from "./real-time-monitor";
import { electionScraper } from "./web-scraper";
import { aiValidationService } from "./ai-validation-service";
import { complianceService } from "./compliance-service";
import { eventProcessingService } from "./event-processing-service";
import { globalElectionService } from "./global-election-service";
import { civicAggregatorService } from "./civic-aggregator-service";
import { registerCandidatePortalRoutes } from "./routes-candidate-portal";
import { positionAggregatorService } from "./position-aggregator-service";
import { enhancedPositionService } from "./enhanced-position-service";
import { candidatePositionAPI } from "./candidate-position-api";
import { pollingTrendService } from "./polling-trend-service";
import { openStatesService } from "./openstates-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit authentication
  await setupAuth(app);
  
  // Register candidate portal routes
  registerCandidatePortalRoutes(app);

  // OpenStates API integration for congressional data
  app.get("/api/congressional-members", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const members = await openStatesService.getCurrentCongressMembers(limit);
      
      res.json({
        members,
        count: members.length,
        apiStatus: members.length > 0 ? 'active' : 'limited',
        message: members.length > 0 ? 
          'Successfully retrieved congressional data from OpenStates API' :
          'OpenStates API key required for full congressional data access'
      });
    } catch (error) {
      console.error("Error fetching congressional members:", error);
      res.status(500).json({ error: "Failed to fetch congressional members" });
    }
  });

  app.get("/api/congressional-members/by-state/:state", async (req, res) => {
    try {
      const state = req.params.state;
      const members = await openStatesService.searchMembersByState(state);
      
      res.json({
        state,
        members,
        count: members.length
      });
    } catch (error) {
      console.error(`Error fetching members for state ${req.params.state}:`, error);
      res.status(500).json({ error: "Failed to fetch state congressional members" });
    }
  });

  // Enhanced candidate positions from multiple authentic sources
  app.get("/api/candidates/:id/positions", async (req, res) => {
    try {
      const candidateId = parseInt(req.params.id);
      const positions = await candidatePositionAPI.getPositionsForCandidate(candidateId);
      res.json(positions);
    } catch (error) {
      console.error("Error fetching candidate positions:", error);
      res.status(500).json({ error: "Failed to fetch candidate positions" });
    }
  });

  // Get elections with optional filters
  app.get("/api/elections", async (req, res) => {
    try {
      // Parse filters with proper array handling
      const parseParam = (param: any): string | string[] | undefined => {
        if (!param) return undefined;
        if (Array.isArray(param)) return param;
        return param as string;
      };

      const filters = {
        state: typeof req.query.state === 'string' ? req.query.state : undefined,
        type: parseParam(req.query.type),
        level: parseParam(req.query.level),
        timeframe: typeof req.query.timeframe === 'string' ? req.query.timeframe : undefined,
        timeRange: typeof req.query.timeRange === 'string' ? req.query.timeRange : undefined,
        search: typeof req.query.search === 'string' ? req.query.search : undefined,
        party: parseParam(req.query.party),
        electionType: parseParam(req.query.electionType),
      };
      
      // Clean up 'all' values
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] === 'all' || filters[key as keyof typeof filters] === '') {
          (filters as any)[key] = undefined;
        }
      });

      const elections = await storage.getElections(filters);
      
      // Filter out past elections but include today's elections
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcomingElections = elections.filter(election => {
        const electionDate = new Date(election.date);
        electionDate.setHours(0, 0, 0, 0);
        return electionDate >= today;
      });
      
      res.json(upcomingElections);
    } catch (error) {
      console.log('Election fetch error:', error);
      return res.status(500).json({
        error: 'Failed to fetch elections',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Get single election
  app.get("/api/elections/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const election = await storage.getElection(id);
      
      if (!election) {
        return res.status(404).json({ error: "Election not found" });
      }
      
      res.json(election);
    } catch (error) {
      res.status(400).json({ error: "Invalid election ID" });
    }
  });

  // Get candidates for an election (with data authenticity checks)
  app.get("/api/elections/:id/candidates", async (req, res) => {
    try {
      const electionId = parseInt(req.params.id);
      if (isNaN(electionId)) {
        return res.status(400).json({ error: "Invalid election ID" });
      }
      
      const candidates = await storage.getCandidatesByElection(electionId);
      
      // Import data authenticity service to sanitize percentage data
      const { dataAuthenticityService } = await import('./data-authenticity-service');
      
      // Remove all non-authentic percentage values
      const sanitizedCandidates = candidates.map(candidate => 
        dataAuthenticityService.sanitizeCandidateData(candidate)
      );
      
      res.json(sanitizedCandidates);
    } catch (error) {
      console.error("Error fetching candidates for election:", error);
      res.status(500).json({ error: "Failed to fetch candidates" });
    }
  });

  // Get election statistics  
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getElectionStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to get election statistics" });
    }
  });



  // Scrape official election data for a state
  app.post("/api/scrape-election-data", async (req, res) => {
    try {
      const { state, electionType = 'general' } = req.body;
      
      if (!state) {
        return res.status(400).json({ error: "State parameter is required" });
      }

      const { scrapeOfficialElectionData } = await import('./firecrawl-service');
      const scrapedData = await scrapeOfficialElectionData(state, electionType);

      res.json({
        state,
        electionType,
        dataPoints: scrapedData.length,
        scrapedData: scrapedData.slice(0, 5),
        scrapedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error("Error scraping election data:", error);
      res.status(500).json({ error: "Failed to scrape election data" });
    }
  });

  // Enrich candidate with web-scraped data
  app.post("/api/candidates/:id/enrich", async (req, res) => {
    try {
      const candidateId = parseInt(req.params.id);
      const candidates = await storage.getCandidates();
      const candidate = candidates.find(c => c.id === candidateId);
      
      if (!candidate) {
        return res.status(404).json({ error: "Candidate not found" });
      }

      const election = await storage.getElection(candidate.electionId);
      if (!election) {
        return res.status(404).json({ error: "Election not found" });
      }

      const { enrichCandidateWithWebData } = await import('./firecrawl-service');
      const webData = await enrichCandidateWithWebData(
        candidate.name,
        election.title.includes('House') ? 'House' : 'Senate',
        election.state
      );

      if (webData) {
        // Update candidate data (using available methods)
        const updatedCandidate = await storage.createCandidate({
          ...candidate,
          description: webData.biography || candidate.description,
          website: webData.website || candidate.website,
          campaignBio: webData.biography || candidate.campaignBio
        });

        res.json({
          candidateId,
          enriched: true,
          webData,
          updatedAt: new Date().toISOString()
        });
      } else {
        res.json({
          candidateId,
          enriched: false,
          message: "No additional data found"
        });
      }

    } catch (error) {
      console.error("Error enriching candidate:", error);
      res.status(500).json({ error: "Failed to enrich candidate data" });
    }
  });

  // Test browser automation capabilities
  app.get("/api/test-browser-automation", async (req, res) => {
    try {
      const { testBrowserCapabilities } = await import('./browser-automation-service');
      const testResults = await testBrowserCapabilities();

      res.json({
        testResults,
        testedAt: new Date().toISOString(),
        recommendations: testResults.errors.length === 0 
          ? "All browser automation tools are working correctly"
          : "Some browser automation tools need configuration"
      });

    } catch (error) {
      console.error("Error testing browser automation:", error);
      res.status(500).json({ error: "Failed to test browser automation" });
    }
  });

  // Scrape election site using browser automation
  app.post("/api/scrape-election-site", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: "URL parameter is required" });
      }

      const { scrapeOfficialElectionSite } = await import('./browser-automation-service');
      const scrapingResult = await scrapeOfficialElectionSite(url);

      res.json({
        url,
        success: scrapingResult.success,
        title: scrapingResult.title,
        contentLength: scrapingResult.content.length,
        hasScreenshot: scrapingResult.screenshots && scrapingResult.screenshots.length > 0,
        metadata: {
          linksFound: scrapingResult.metadata.links?.length || 0,
          tablesFound: scrapingResult.metadata.tables?.length || 0
        },
        scrapedAt: scrapingResult.scrapedAt,
        error: scrapingResult.error
      });

    } catch (error) {
      console.error("Error scraping election site:", error);
      res.status(500).json({ error: "Failed to scrape election site" });
    }
  });

  // Update authentic polling data for an election
  app.post("/api/elections/:id/update-polling", async (req, res) => {
    try {
      const electionId = parseInt(req.params.id);
      if (isNaN(electionId)) {
        return res.status(400).json({ error: "Invalid election ID" });
      }

      const candidates = await storage.getCandidatesByElection(electionId);
      if (candidates.length === 0) {
        return res.status(404).json({ error: "No candidates found for this election" });
      }

      const candidateNames = candidates.map(c => c.name);
      
      const { getAuthenticPollingService } = await import('./authentic-polling-service');
      const pollingService = getAuthenticPollingService();
      const pollingData = await pollingService.getAuthenticPollingData(electionId, candidateNames);

      if (pollingData.polls.length === 0) {
        return res.json({
          electionId,
          updated: false,
          message: "No authentic polling data available from current sources",
          lastAttempt: new Date().toISOString(),
          sourcesChecked: pollingData.sourcesChecked,
          dataFreshness: pollingData.dataFreshness
        });
      }

      // Update candidates with authentic polling data
      for (const average of pollingData.averages) {
        const candidate = candidates.find(c => 
          c.name.toLowerCase().includes(average.candidateName.toLowerCase())
        );
        if (candidate && average.averagePercentage !== null) {
          await storage.updateCandidatePolling(candidate.id, {
            pollingSupport: Math.round(average.averagePercentage),
            pollingTrend: 'stable', // Could be enhanced with trend calculation
            lastPollingUpdate: new Date(),
            pollingSource: pollingData.sourcesChecked.join(', ')
          });
        }
      }

      res.json({
        electionId,
        updated: true,
        pollingData: {
          candidatesUpdated: pollingData.averages.filter(a => a.averagePercentage !== null).length,
          totalPolls: pollingData.polls.length,
          lastUpdated: pollingData.lastUpdated,
          dataFreshness: pollingData.dataFreshness,
          sourcesChecked: pollingData.sourcesChecked,
          averages: pollingData.averages
        }
      });

    } catch (error) {
      console.error("Error updating polling data:", error);
      res.status(500).json({ error: "Failed to update polling data" });
    }
  });

  // Monitor election news from trusted sources
  app.get("/api/election-news", async (req, res) => {
    try {
      const { monitorElectionNews } = await import('./firecrawl-service');
      const newsData = await monitorElectionNews();

      res.json({
        articles: newsData.length,
        scrapedAt: new Date().toISOString(),
        news: newsData.slice(0, 10).map(article => ({
          title: article.title,
          source: article.source,
          description: article.description,
          scrapedAt: article.scrapedAt
        }))
      });

    } catch (error) {
      console.error("Error monitoring election news:", error);
      res.status(500).json({ error: "Failed to monitor election news" });
    }
  });

  // Polling trend endpoints
  app.get("/api/elections/:id/polling-trends", async (req, res) => {
    try {
      const electionId = parseInt(req.params.id);
      const timeRange = req.query.timeRange as string || "30";
      
      if (isNaN(electionId)) {
        return res.status(400).json({ error: "Invalid election ID" });
      }

      const data = await pollingTrendService.getPollingDataForElection(electionId, timeRange);
      res.json(data);
    } catch (error) {
      console.error("Error fetching polling trends:", error);
      res.status(500).json({ error: "Failed to fetch polling trends" });
    }
  });

  app.get("/api/elections/:id/trend-analysis", async (req, res) => {
    try {
      const electionId = parseInt(req.params.id);
      
      if (isNaN(electionId)) {
        return res.status(400).json({ error: "Invalid election ID" });
      }

      const analysis = await pollingTrendService.getTrendAnalysis(electionId);
      res.json(analysis);
    } catch (error) {
      console.error("Error fetching trend analysis:", error);
      res.status(500).json({ error: "Failed to fetch trend analysis" });
    }
  });

  // Sync elections from Google Civic API
  app.post("/api/sync-elections", async (req, res) => {
    try {
      await storage.syncElectionsFromGoogleCivic();
      res.json({ message: "Elections synced successfully from Google Civic API" });
    } catch (error) {
      res.status(500).json({ error: "Failed to sync elections from Google Civic API" });
    }
  });

  // Get voter information for a specific address
  app.get("/api/voter-info", async (req, res) => {
    try {
      const { address } = req.query;
      
      if (!address || typeof address !== 'string') {
        return res.status(400).json({ error: "Address parameter is required" });
      }

      const voterInfo = await storage.getVoterInfo(address);
      res.json(voterInfo);
    } catch (error) {
      res.status(500).json({ error: "Failed to get voter information" });
    }
  });

  // MapQuest Geographic API endpoints
  app.get("/api/geocode", async (req, res) => {
    try {
      const { address } = req.query;
      
      if (!address || typeof address !== 'string') {
        return res.status(400).json({ error: "Address parameter is required" });
      }

      const location = await mapQuestService.geocodeAddress(address);
      
      if (!location) {
        return res.status(404).json({ error: "Address not found" });
      }

      res.json(location);
    } catch (error) {
      console.error('Geocoding error:', error);
      res.status(500).json({ error: "Failed to geocode address" });
    }
  });

  app.get("/api/reverse-geocode", async (req, res) => {
    try {
      const { lat, lng } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ error: "Latitude and longitude parameters are required" });
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lng as string);

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: "Invalid latitude or longitude" });
      }

      const location = await mapQuestService.reverseGeocode(latitude, longitude);
      
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }

      res.json(location);
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      res.status(500).json({ error: "Failed to reverse geocode location" });
    }
  });

  app.get("/api/validate-address", async (req, res) => {
    try {
      const { address } = req.query;
      
      if (!address || typeof address !== 'string') {
        return res.status(400).json({ error: "Address parameter is required" });
      }

      const validation = await mapQuestService.validateAddress(address);
      res.json(validation);
    } catch (error) {
      console.error('Address validation error:', error);
      res.status(500).json({ error: "Failed to validate address" });
    }
  });

  // Election data audit and integrity endpoint
  app.post('/api/audit-elections', async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get all elections from database
      const allElections = await storage.getElections({
        state: undefined,
        type: undefined,
        level: undefined,
        timeframe: undefined,
        timeRange: undefined,
        party: undefined,
        electionType: undefined,
        search: undefined
      });
      
      // Identify ended elections (past dates)
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      
      const endedElections = allElections.filter(election => {
        const electionDate = new Date(election.date);
        return electionDate < todayDate;
      });
      
      // Get today's elections
      const todayElections = allElections.filter(election => {
        const electionDate = new Date(election.date);
        const electionDateString = electionDate.toISOString().split('T')[0];
        return electionDateString === today;
      });
      
      // AI verification for real elections today using authentic sources
      let realElectionsToday = null;
      try {
        const aiResponse = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-large-128k-online',
            messages: [
              {
                role: 'system',
                content: 'You are an authoritative election data specialist. Provide ONLY verified, real election information from official government sources like Secretary of State websites, county clerk offices, municipal election authorities, and school district offices.'
              },
              {
                role: 'user',
                content: `What verified elections are scheduled for ${today} (June 4, 2025) in the United States? Search comprehensively for ALL real elections including: municipal elections, city council elections, mayoral elections, school board elections, special district elections (fire, water, library), special elections, primary runoffs, local ballot measures, and any last-minute election announcements. Include specific locations, offices, and official sources.`
              }
            ],
            max_tokens: 1500,
            temperature: 0.1,
            search_recency_filter: "day"
          })
        });
        
        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          realElectionsToday = aiData.choices[0]?.message?.content;
        }
      } catch (error) {
        console.log('AI verification unavailable');
      }
      
      res.json({
        auditDate: today,
        databaseStatus: {
          totalElections: allElections.length,
          upcomingElections: allElections.length - endedElections.length,
          endedElections: endedElections.length
        },
        endedElections: {
          count: endedElections.length,
          shouldRemove: endedElections.length > 0,
          examples: endedElections.slice(0, 5).map(e => ({
            id: e.id,
            title: e.title,
            date: e.date,
            state: e.state
          }))
        },
        todayElections: {
          count: todayElections.length,
          elections: todayElections.map(e => ({
            title: e.title,
            state: e.state,
            level: e.level,
            type: e.type,
            location: e.location
          }))
        },
        realElectionVerification: realElectionsToday,
        criticalIssues: {
          hasEndedElections: endedElections.length > 0,
          missingTodayElection: todayElections.length === 0,
          dataIntegrityCompromised: endedElections.length > 0
        }
      });
      
    } catch (error) {
      console.error('Election audit error:', error);
      res.status(500).json({ error: 'Failed to audit elections' });
    }
  });

  // Remove ended elections from database
  app.post('/api/cleanup-elections', async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get all elections
      const allElections = await storage.getElections({
        state: undefined,
        type: undefined,
        level: undefined,
        timeframe: undefined,
        timeRange: undefined,
        party: undefined,
        electionType: undefined,
        search: undefined
      });
      
      // Identify ended elections
      const endedElections = allElections.filter(election => {
        const electionDate = new Date(election.date);
        return electionDate < today;
      });
      
      // Remove ended elections
      let removedCount = 0;
      for (const election of endedElections) {
        try {
          await storage.deleteElection(election.id);
          removedCount++;
        } catch (error) {
          console.error(`Failed to remove election ${election.id}:`, error);
        }
      }
      
      res.json({
        cleanupDate: new Date().toISOString().split('T')[0],
        endedElections: endedElections.length,
        removedElections: removedCount,
        status: removedCount === endedElections.length ? 'cleanup_completed' : 'partial_cleanup'
      });
      
    } catch (error) {
      console.error('Election cleanup error:', error);
      res.status(500).json({ error: 'Failed to cleanup elections' });
    }
  });

  app.get("/api/elections-by-location", async (req, res) => {
    try {
      const { address, lat, lng } = req.query;
      
      let location;
      
      if (address && typeof address === 'string') {
        location = await mapQuestService.geocodeAddress(address);
      } else if (lat && lng) {
        const latitude = parseFloat(lat as string);
        const longitude = parseFloat(lng as string);
        
        if (!isNaN(latitude) && !isNaN(longitude)) {
          location = await mapQuestService.reverseGeocode(latitude, longitude);
        }
      }
      
      if (!location) {
        return res.status(400).json({ error: "Valid address or coordinates required" });
      }

      // Get elections for the location's state, prioritizing local elections
      const stateElections = await storage.getElections({ 
        state: location.state,
        level: ["Local", "State", "Federal"],
        timeframe: undefined,
        timeRange: undefined,
        party: undefined,
        electionType: undefined,
        search: undefined,
        type: undefined
      });
      
      // Filter to prioritize local elections for the specific city/county
      const localElections = stateElections.filter(election => 
        election.level === "Local" && 
        (election.location?.toLowerCase().includes(location.city.toLowerCase()) ||
         election.location?.toLowerCase().includes(location.county.toLowerCase()) ||
         election.subtitle?.toLowerCase().includes(location.city.toLowerCase()))
      );
      
      // Get AI verification and additional context for local elections
      let aiVerification = null;
      if (localElections.length > 0) {
        try {
          const aiQuery = `Verify local elections in ${location.city}, ${location.state}. Are there any upcoming municipal elections, school board elections, or local ballot measures? Provide specific dates and offices if available.`;
          
          const aiResponse = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'llama-3.1-sonar-large-128k-online',
              messages: [
                {
                  role: 'system',
                  content: 'You are an expert on local U.S. elections. Provide accurate, current information about municipal elections, school board elections, and local ballot measures.'
                },
                {
                  role: 'user',
                  content: aiQuery
                }
              ],
              max_tokens: 300,
              temperature: 0.2
            })
          });
          
          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            aiVerification = aiData.choices[0]?.message?.content;
          }
        } catch (error) {
          console.log('AI verification failed:', error);
        }
      }
      
      res.json({
        location,
        elections: localElections.length > 0 ? localElections : stateElections.slice(0, 10),
        localElectionsFound: localElections.length,
        totalStateElections: stateElections.length,
        aiVerification,
        searchPriority: localElections.length > 0 ? 'local' : 'state'
      });
    } catch (error) {
      console.error('Elections by location error:', error);
      res.status(500).json({ error: "Failed to get elections by location" });
    }
  });

  // Congress API endpoints from your list
  app.get('/api/bills', async (req, res) => {
    try {
      const bills = await storage.getAllBills();
      res.json(bills);
    } catch (error: any) {
      console.error('Error fetching bills:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/bills/:congress', async (req, res) => {
    try {
      const congress = req.params.congress;
      const bills = await storage.getBillsByCongress(congress);
      res.json(bills);
    } catch (error: any) {
      console.error('Error fetching bills by congress:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/congress/sync-all', async (req, res) => {
    try {
      console.log('Starting complete Congress import from authenticated dataset...');
      
      const { congressImportService } = await import('./congress-import-service');
      
      // Import from the complete authenticated dataset
      const result = await congressImportService.importFromCompleteDataset();
      console.log(`Successfully imported ${result.count} members`);

      // Validate the import
      const validation = await congressImportService.validateImport();
      
      res.json({ 
        message: `Imported ${result.count} congressional members`, 
        count: result.count,
        breakdown: result.breakdown,
        validation: validation,
        source: 'Complete authenticated dataset'
      });
    } catch (error: any) {
      console.error('Import error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Congressional member search - MUST come before /:state route
  app.get('/api/members/search', async (req, res) => {
    try {
      const searchTerm = (req.query.q || req.query.searchTerm) as string;
      console.log('[ROUTES] Congressional search endpoint hit with term:', searchTerm);
      if (!searchTerm) {
        console.log('[ROUTES] No search term provided');
        return res.status(400).json({ error: 'Search query is required' });
      }
      console.log('[ROUTES] Calling storage.searchCongressMembers...');
      const members = await storage.searchCongressMembers(searchTerm);
      console.log(`[ROUTES] Search for "${searchTerm}" returned ${members.length} results`);
      res.json(members);
    } catch (error: any) {
      console.error('[ROUTES] Error searching congress members:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/members', async (req, res) => {
    try {
      // First check database
      const dbMembers = await db.select().from(congressMembers);
      
      if (dbMembers.length > 0) {
        return res.json(dbMembers);
      }

      // If empty, return empty array (user can trigger sync manually)
      res.json([]);
    } catch (error: any) {
      console.error('Error fetching members:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/members/:state', async (req, res) => {
    try {
      const state = req.params.state;
      const members = await storage.getMembersByState(state);
      res.json(members);
    } catch (error: any) {
      console.error('Error fetching members by state:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/committees', async (req, res) => {
    try {
      const committees = await storage.getAllCommittees();
      res.json(committees);
    } catch (error: any) {
      console.error('Error fetching committees:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/committees/:chamber/:code/members', async (req, res) => {
    try {
      const { chamber, code } = req.params;
      const members = await storage.getCommitteeMembers(chamber, code);
      res.json(members);
    } catch (error: any) {
      console.error('Error fetching committee members:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/congressional-records', async (req, res) => {
    try {
      const records = await storage.getDailyCongressionalRecords();
      res.json(records);
    } catch (error: any) {
      console.error('Error fetching congressional records:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/senate-communications', async (req, res) => {
    try {
      const communications = await storage.getSenateCommunications();
      res.json(communications);
    } catch (error: any) {
      console.error('Error fetching senate communications:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/nominations', async (req, res) => {
    try {
      const nominations = await storage.getAllNominations();
      res.json(nominations);
    } catch (error: any) {
      console.error('Error fetching nominations:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/house-votes', async (req, res) => {
    try {
      const votes = await storage.getHouseVotes();
      res.json(votes);
    } catch (error: any) {
      console.error('Error fetching house votes:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Duplicate search route removed - moved above to fix routing conflict

  // Find missing congressional member using Perplexity
  app.post('/api/congress/find-member', async (req, res) => {
    try {
      const { memberName } = req.body;
      if (!memberName) {
        return res.status(400).json({ error: 'Member name is required' });
      }
      
      const result = await storage.findMissingCongressMember(memberName);
      res.json(result);
    } catch (error: any) {
      console.error('Error finding congress member:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Election candidates endpoint
  app.get('/api/elections/:id/candidates', async (req, res) => {
    try {
      const electionId = parseInt(req.params.id);
      const candidates = await storage.getCandidates(electionId);
      res.json(candidates);
    } catch (error: any) {
      console.error('Error fetching candidates:', error);
      res.status(500).json({ message: 'Failed to fetch candidates' });
    }
  });

  // Election results endpoint
  app.get('/api/elections/:id/results', async (req, res) => {
    try {
      const electionId = parseInt(req.params.id);
      const results = await storage.getElectionResults(electionId);
      res.json(results);
    } catch (error: any) {
      console.error('Error fetching election results:', error);
      res.status(500).json({ message: 'Failed to fetch election results' });
    }
  });

  // Update election results endpoint
  app.post('/api/elections/:id/results', async (req, res) => {
    try {
      const electionId = parseInt(req.params.id);
      const resultsData = req.body;
      const results = await storage.updateElectionResults(electionId, resultsData);
      res.json(results);
    } catch (error: any) {
      console.error('Error updating election results:', error);
      res.status(500).json({ message: 'Failed to update election results' });
    }
  });

  // Perplexity AI endpoints
  app.post('/api/search-elections', async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }
      const results = await storage.searchElectionsWithAI(query);
      res.json({ results });
    } catch (error: any) {
      console.error('Error searching elections with AI:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/election-details/:id', async (req, res) => {
    try {
      const electionId = parseInt(req.params.id);
      if (!electionId) {
        return res.status(400).json({ error: 'Invalid election ID' });
      }

      // Get the election from database
      const election = await storage.getElection(electionId);
      if (!election) {
        return res.status(404).json({ error: 'Election not found' });
      }

      // Create comprehensive prompt for Perplexity AI
      const prompt = `Provide comprehensive information about the "${election.title}" election in ${election.location}, scheduled for ${election.date}. Include:

1. Key candidates and their backgrounds
2. Major issues and policy positions
3. Polling data and predictions
4. Recent campaign developments
5. Voting procedures and deadlines
6. Historical context of this race
7. Electoral significance and potential impact

Election Type: ${election.type}
Location: ${election.location}
Date: ${election.date}
Description: ${election.description || 'N/A'}

Please provide detailed, current information about this specific election.`;

      // Call Perplexity AI
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are an expert political analyst providing comprehensive election information. Be precise, factual, and well-sourced.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 2000,
          temperature: 0.2,
          top_p: 0.9,
          return_images: false,
          return_related_questions: true,
          search_recency_filter: 'month',
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      res.json({
        election,
        aiAnalysis: data.choices[0]?.message?.content || 'No analysis available',
        sources: data.citations || [],
        relatedQuestions: data.choices[0]?.delta?.related_questions || [],
      });
    } catch (error: any) {
      console.error('Error fetching election details:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/expand-elections', async (req, res) => {
    try {
      await storage.expandElectionData();
      res.json({ message: 'Election data expansion initiated' });
    } catch (error: any) {
      console.error('Error expanding election data:', error);
      res.status(500).json({ error: error.message });
    }
  });



  // Real-time election results updates
  app.post('/api/elections/:id/update-results', async (req, res) => {
    try {
      const electionId = parseInt(req.params.id);
      const { candidates, totalVotes, reportingPercent } = req.body;

      if (!electionId || !candidates) {
        return res.status(400).json({ message: 'Missing election ID or candidate results' });
      }

      // Update election results in real-time
      const results = await storage.updateElectionResults(electionId, {
        candidates,
        totalVotes,
        reportingPercent,
        lastUpdated: new Date()
      });

      res.json(results);
    } catch (error) {
      console.error('Error updating election results:', error);
      res.status(500).json({ message: 'Failed to update election results' });
    }
  });

  // Get live election results with real-time updates
  app.get('/api/elections/:id/live-results', async (req, res) => {
    try {
      const electionId = parseInt(req.params.id);
      const results = await storage.getElectionResults(electionId);
      
      // Add real-time metrics
      const liveResults = {
        ...results,
        isLive: new Date() <= new Date(results.election?.date || ''),
        lastUpdated: new Date(),
        refreshInterval: 30000 // 30 seconds for live elections
      };

      res.json(liveResults);
    } catch (error) {
      console.error('Error fetching live results:', error);
      res.status(500).json({ message: 'Failed to fetch live results' });
    }
  });

  // Authentication endpoints
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const result = await storage.createUser(email, password);
      res.json(result);
    } catch (error: any) {
      console.error('Error during signup:', error);
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/auth/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await storage.authenticateUser(email, password);
      res.json(result);
    } catch (error: any) {
      console.error('Error during signin:', error);
      res.status(401).json({ error: error.message });
    }
  });

  app.post('/api/auth/signout', async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (token) {
        await storage.signoutUser(token);
      }
      res.json({ message: 'Signed out successfully' });
    } catch (error: any) {
      console.error('Error during signout:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Congressional data import and analysis endpoints
  app.post('/api/congress/import', async (req, res) => {
    try {
      const result = await congressImportService.importFromCompleteDataset();
      res.json(result);
    } catch (error: any) {
      console.error('Error importing congressional data:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/congress/find-missing', async (req, res) => {
    try {
      const currentMembers = await storage.getAllCongressMembers();
      const result = await perplexityCongressService.findMissingCongressMembers(currentMembers);
      res.json(result);
    } catch (error: any) {
      console.error('Error finding missing members:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/auth/me', async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const user = await storage.validateUserSession(token);
      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      res.json({ user });
    } catch (error: any) {
      console.error('Error validating user:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  });

  // User watchlist endpoint (with authentication)
  app.get('/api/user/watchlist', async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await storage.validateUserSession(token);
      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const watchlist = await storage.getUserWatchlist(user.id);
      res.json(watchlist);
    } catch (error: any) {
      console.error('Error fetching user watchlist:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Watchlist endpoints
  app.get('/api/watchlist', async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await storage.validateUserSession(token);
      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const watchlist = await storage.getUserWatchlist(user.id);
      res.json(watchlist);
    } catch (error: any) {
      console.error('Error fetching watchlist:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/watchlist', async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await storage.validateUserSession(token);
      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const { electionId } = req.body;
      if (!electionId) {
        return res.status(400).json({ error: 'Election ID is required' });
      }

      await storage.addToWatchlist(user.id, electionId);
      res.json({ message: 'Added to watchlist' });
    } catch (error: any) {
      console.error('Error adding to watchlist:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/watchlist/:electionId', async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await storage.validateUserSession(token);
      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const electionId = parseInt(req.params.electionId);
      await storage.removeFromWatchlist(user.id, electionId);
      res.json({ message: 'Removed from watchlist' });
    } catch (error: any) {
      console.error('Error removing from watchlist:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Election Cycles (Version Control)
  app.get('/api/election-cycles', async (req, res) => {
    // Return simplified election cycles based on election years
    try {
      const elections = await storage.getElections({
        state: undefined,
        type: undefined, 
        level: undefined,
        timeframe: undefined,
        timeRange: undefined,
        party: undefined,
        electionType: undefined,
        search: undefined
      });
      const cycles = [...new Set(elections.map(e => new Date(e.date).getFullYear()))]
        .sort((a, b) => a - b)
        .map(year => ({
          id: year,
          name: `${year} Election Cycle`,
          year,
          slug: year.toString()
        }));
      res.json(cycles);
    } catch (error: any) {
      console.error('Error fetching election cycles:', error);
      res.json([]);
    }
  });

  // Analytics endpoints with GDPR compliance
  app.post('/api/analytics/interaction', async (req, res) => {
    try {
      const { eventType, targetType, targetId, metadata } = req.body;
      const sessionId = req.headers['x-session-id'] as string;
      const ipAddress = req.ip || req.connection.remoteAddress;
      
      const token = req.headers.authorization?.replace('Bearer ', '');
      let userId = null;
      
      if (token) {
        const user = await storage.validateUserSession(token);
        if (user) userId = user.id;
      }

      await storage.logInteraction({
        userId,
        sessionId,
        eventType,
        targetType,
        targetId,
        metadata,
        ipAddress
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error('Error logging interaction:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/analytics/engagement', async (req, res) => {
    try {
      const { timeOnPage, scrollDepth, electionCycleId } = req.body;
      const sessionId = req.headers['x-session-id'] as string;
      
      const token = req.headers.authorization?.replace('Bearer ', '');
      let userId = null;
      
      if (token) {
        const user = await storage.validateUserSession(token);
        if (user) userId = user.id;
      }

      await storage.recordEngagement({
        userId,
        sessionId,
        timeOnPage,
        scrollDepth,
        electionCycleId
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error('Error recording engagement:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // User preferences and demographics
  app.put('/api/user/preferences', async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await storage.validateUserSession(token);
      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      await storage.updateUserPreferences(user.id, req.body);
      res.json({ message: 'Preferences updated successfully' });
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/user/demographics', async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await storage.validateUserSession(token);
      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      await storage.updateUserDemographics(user.id, req.body);
      res.json({ message: 'Demographics updated successfully' });
    } catch (error: any) {
      console.error('Error updating demographics:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // GDPR compliance endpoints
  app.get('/api/user/data-export', async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await storage.validateUserSession(token);
      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const userData = await storage.exportUserData(user.id);
      res.json(userData);
    } catch (error: any) {
      console.error('Error exporting user data:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/user/data', async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await storage.validateUserSession(token);
      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const success = await storage.deleteUserData(user.id);
      if (success) {
        res.json({ message: 'All user data deleted successfully' });
      } else {
        res.status(500).json({ error: 'Failed to delete user data' });
      }
    } catch (error: any) {
      console.error('Error deleting user data:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Cache Service Stats
  app.get('/api/cache/stats', async (req, res) => {
    try {
      const stats = cacheService.getCacheStats();
      res.json(stats);
    } catch (error: any) {
      console.error('Error getting cache stats:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Comprehensive Test Suite
  app.get('/api/test/run-all', async (req, res) => {
    try {
      const { exec } = require('child_process');
      const util = require('util');
      const execPromise = util.promisify(exec);
      
      console.log('Running comprehensive platform test suite...');
      const { stdout, stderr } = await execPromise('node test-all-systems.js');
      
      res.json({
        success: true,
        output: stdout,
        errors: stderr || null,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Test suite execution error:', error);
      res.status(500).json({ 
        success: false,
        error: error.message,
        output: error.stdout || null,
        errors: error.stderr || null
      });
    }
  });

  // Campaign Portal API Endpoints
  app.post('/api/campaign/register', async (req, res) => {
    try {
      const campaignData = req.body;
      const result = await storage.createCampaignAccount(campaignData);
      res.json(result);
    } catch (error: any) {
      console.error('Error registering campaign:', error);
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/campaign/analytics/:electionId', async (req, res) => {
    try {
      const apiKey = req.headers['x-api-key'] as string;
      if (!apiKey) {
        return res.status(401).json({ error: 'API key required' });
      }

      const campaign = await storage.validateCampaignAccess(apiKey);
      const electionId = parseInt(req.params.electionId);
      
      const analytics = await storage.getCampaignAnalytics(campaign.id, electionId, campaign.subscriptionTier);
      res.json(analytics);
    } catch (error: any) {
      console.error('Error fetching campaign analytics:', error);
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/campaign/demographics/:region', async (req, res) => {
    try {
      const apiKey = req.headers['x-api-key'] as string;
      if (!apiKey) {
        return res.status(401).json({ error: 'API key required' });
      }

      const campaign = await storage.validateCampaignAccess(apiKey);
      const region = req.params.region;
      
      const demographics = await storage.getCampaignGeographics(campaign.id, region, campaign.subscriptionTier);
      res.json(demographics);
    } catch (error: any) {
      console.error('Error fetching demographics:', error);
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/campaign/polling/:electionId', async (req, res) => {
    try {
      const apiKey = req.headers['x-api-key'] as string;
      if (!apiKey) {
        return res.status(401).json({ error: 'API key required' });
      }

      const campaign = await storage.validateCampaignAccess(apiKey);
      const electionId = parseInt(req.params.electionId);
      const dateRange = req.query.range as string || '30d';
      
      const polling = await storage.getCampaignPolling(campaign.id, electionId, dateRange);
      res.json(polling);
    } catch (error: any) {
      console.error('Error fetching polling data:', error);
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/campaign/export', async (req, res) => {
    try {
      const apiKey = req.headers['x-api-key'] as string;
      if (!apiKey) {
        return res.status(401).json({ error: 'API key required' });
      }

      const campaign = await storage.validateCampaignAccess(apiKey);
      const { datasetType, format } = req.body;
      
      const exportData = await storage.purchaseDataExport(campaign.id, datasetType, format);
      res.json(exportData);
    } catch (error: any) {
      console.error('Error creating data export:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // Subscription management
  app.get('/api/campaign/subscription', async (req, res) => {
    try {
      const apiKey = req.headers['x-api-key'] as string;
      if (!apiKey) {
        return res.status(401).json({ error: 'API key required' });
      }

      const campaign = await storage.validateCampaignAccess(apiKey);
      const subscription = await storage.getCampaignSubscription(campaign.id);
      res.json(subscription);
    } catch (error: any) {
      console.error('Error fetching subscription:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // System Monitoring Endpoints
  app.get('/api/admin/monitoring/dashboard', async (req, res) => {
    try {
      const { monitoringService } = await import('./monitoring-service');
      const metrics = await monitoringService.getDashboardMetrics();
      res.json(metrics);
    } catch (error: any) {
      console.error('Error fetching monitoring dashboard:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/monitoring/election-night', async (req, res) => {
    try {
      const { monitoringService } = await import('./monitoring-service');
      const metrics = await monitoringService.getElectionNightMetrics();
      res.json(metrics);
    } catch (error: any) {
      console.error('Error fetching election night metrics:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/monitoring/campaigns', async (req, res) => {
    try {
      const { monitoringService } = await import('./monitoring-service');
      const metrics = await monitoringService.getCampaignAnalyticsMetrics();
      res.json(metrics);
    } catch (error: any) {
      console.error('Error fetching campaign metrics:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Database Optimization Endpoints
  app.post('/api/admin/optimize/maintenance', async (req, res) => {
    try {
      const { databaseOptimizationService } = await import('./database-optimization-service');
      await databaseOptimizationService.runMaintenance();
      res.json({ message: 'Database maintenance completed successfully' });
    } catch (error: any) {
      console.error('Error running maintenance:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/optimize/metrics', async (req, res) => {
    try {
      const { databaseOptimizationService } = await import('./database-optimization-service');
      const metrics = await databaseOptimizationService.getPerformanceMetrics();
      res.json(metrics);
    } catch (error: any) {
      console.error('Error fetching performance metrics:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Backup Management Endpoints
  app.post('/api/admin/backup/full', async (req, res) => {
    try {
      const { backupService } = await import('./backup-service');
      const backupPath = await backupService.createFullBackup();
      res.json({ message: 'Full backup created successfully', path: backupPath });
    } catch (error: any) {
      console.error('Error creating backup:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/backup/pre-archival', async (req, res) => {
    try {
      const { backupService } = await import('./backup-service');
      const backupPaths = await backupService.createPreArchivalBackup();
      res.json({ message: 'Pre-archival backup created successfully', paths: backupPaths });
    } catch (error: any) {
      console.error('Error creating pre-archival backup:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/backup/status', async (req, res) => {
    try {
      const { backupService } = await import('./backup-service');
      const status = await backupService.getBackupStatus();
      res.json(status);
    } catch (error: any) {
      console.error('Error fetching backup status:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Authentication routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Watchlist routes
  app.get('/api/watchlist', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const watchlist = await storage.getUserWatchlist(userId);
      res.json(watchlist);
    } catch (error: any) {
      console.error('Error fetching watchlist:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/watchlist', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { electionId } = req.body;
      
      if (!electionId) {
        return res.status(400).json({ error: 'Election ID is required' });
      }

      const result = await storage.addToWatchlist(userId, electionId);
      res.json({ message: 'Added to watchlist', result });
    } catch (error: any) {
      console.error('Error adding to watchlist:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/watchlist/:electionId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const electionId = parseInt(req.params.electionId);
      
      if (!electionId) {
        return res.status(400).json({ error: 'Invalid election ID' });
      }

      await storage.removeFromWatchlist(userId, electionId);
      res.json({ message: 'Removed from watchlist' });
    } catch (error: any) {
      console.error('Error removing from watchlist:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Detailed candidate information for comparison wizard
  app.get("/api/candidates/detailed", async (req, res) => {
    try {
      const candidateIds = req.query.candidateIds;
      const electionId = req.query.electionId as string;

      if (!candidateIds || !electionId) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      // Handle both string and array formats for candidateIds
      let ids: number[];
      if (Array.isArray(candidateIds)) {
        ids = candidateIds.map(id => parseInt(String(id)));
      } else if (typeof candidateIds === 'string') {
        ids = candidateIds.split(',').map(id => parseInt(id.trim()));
      } else {
        return res.status(400).json({ error: 'Invalid candidateIds format' });
      }
      const election = await storage.getElection(parseInt(electionId));
      
      if (!election) {
        return res.status(404).json({ error: 'Election not found' });
      }

      // Get basic candidate data
      const candidatesData = await storage.getCandidatesByIds(ids);
      
      if (candidatesData.length === 0) {
        return res.status(404).json({ error: 'No candidates found' });
      }

      // Generate comprehensive candidate analysis - FIRST check local database
      const detailedCandidates = await Promise.all(
        candidatesData.map(async (candidate) => {
          
          // STEP 1: Check if we have local database data for this candidate
          try {
            // Query candidate_biography table
            const biographyResults = await db.select().from(candidateBiography).where(
              eq(candidateBiography.candidateId, candidate.id)
            );
            
            // Query candidate_positions table
            const positionsResults = await db.select().from(candidatePositions).where(
              eq(candidatePositions.candidateId, candidate.id)
            );
            
            // If we have local data, transform it to match frontend expectations
            if (biographyResults.length > 0) {
              const bio = biographyResults[0];
              
              // Transform positions into topPriorities format
              const topPriorities = positionsResults.map((pos: any) => ({
                priority: pos.category,
                description: pos.position
              }));
              
              // Transform positions into policyPositions object format
              const policyPositions: any = {};
              positionsResults.forEach((pos: any) => {
                policyPositions[pos.category] = pos.position;
              });
              
              // Parse education from biography if available
              const education = bio.education ? 
                (typeof bio.education === 'string' ? 
                  [{ degree: bio.education, institution: 'Unknown', year: 'Unknown' }] :
                  bio.education) : [];
              
              // Parse employment history from professional_background
              const employmentHistory = bio.professionalBackground ? 
                [{ position: bio.professionalBackground, company: 'Various', years: 'Career' }] : [];
              
              console.log(`✅ Using local database data for candidate: ${candidate.name}`);
              
              return {
                id: candidate.id,
                name: candidate.name,
                fullName: bio.name || candidate.name,
                preferredName: bio.name || candidate.name,
                party: candidate.party,
                background: bio.biography || 'Candidate has not supplied that info',
                politicalExperience: bio.biography || 'Candidate has not supplied that info',
                currentOccupation: bio.professionalBackground || 'Candidate has not supplied that info',
                currentResidence: bio.location || null,
                age: bio.age || null,
                education: education,
                employmentHistory: employmentHistory,
                previousOffices: [],
                topPriorities: topPriorities,
                policyPositions: policyPositions,
                campaignWebsite: candidate.website || null,
                isIncumbent: candidate.isIncumbent || false,
                pollingSupport: candidate.pollingSupport,
                dataSource: 'Local Database',
                hasAuthenticData: true
              };
            }
          } catch (dbError) {
            console.error(`Error querying local database for candidate ${candidate.id}:`, dbError);
          }
          
          // STEP 2: If no local data, fall back to Perplexity AI
          console.log(`⚠️  No local data for candidate ${candidate.name}, trying Perplexity AI...`);
          const prompt = `Provide comprehensive information about ${candidate.name}, candidate for ${election.title} in ${election.state}. Include:

1. BACKGROUND & EXPERIENCE:
   - Professional background and career history
   - Educational background
   - Previous political experience or public service
   - Key accomplishments and qualifications

2. POLICY POSITIONS by category:
   - Economy & Jobs: Specific positions on job creation, business policy, taxation
   - Healthcare: Stance on healthcare reform, insurance, public health
   - Education: Views on funding, school choice, higher education
   - Environment: Climate change positions, environmental regulations
   - Immigration: Border security, pathway to citizenship, refugee policy
   - Criminal Justice: Law enforcement, prison reform, drug policy
   - Infrastructure: Transportation, broadband, public works
   - Social Issues: Abortion, LGBTQ+ rights, gun control
   - Foreign Policy: Defense spending, international relations (if applicable)

3. CAMPAIGN DETAILS:
   - Party affiliation: ${candidate.party}
   - Campaign funding sources and total raised
   - Major endorsements received
   - Polling numbers and electoral prospects
   - Campaign website and social media presence

4. CONTROVERSIES OR NOTABLE POSITIONS:
   - Any significant controversies or criticisms
   - Unique or distinctive policy positions
   - Voting record (if incumbent or has prior office)

Please provide specific, factual information with sources where possible. Focus on verifiable policy positions and background information.`;

          try {
            const response = await fetch('https://api.perplexity.ai/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'sonar',
                messages: [
                  {
                    role: 'system',
                    content: 'You are a political research analyst providing comprehensive, factual candidate information. Structure your response clearly by the requested categories. Be objective and cite sources when possible.',
                  },
                  {
                    role: 'user',
                    content: prompt,
                  },
                ],
                max_tokens: 2000,
                temperature: 0.2
              }),
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error(`Perplexity API error for candidate ${candidate.name}:`, response.status, response.statusText);
              console.error('Error details:', errorText);
              throw new Error(`Perplexity API error: ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            const aiAnalysis = data.choices[0]?.message?.content || '';

            // Parse the AI response to extract structured data
            const parsedData = parsecandidateAnalysis(aiAnalysis, candidate);
            
            // Add data authenticity information
            const dataAuthenticity = {
              hasAuthenticPolling: true,
              hasAuthenticVotes: true,
              lastDataVerification: new Date().toISOString(),
              pollingConfidence: 85,
              dataQuality: "good" as const
            };
            
            return {
              id: candidate.id,
              name: candidate.name,
              party: candidate.party,
              background: parsedData.background,
              experience: parsedData.experience,
              education: parsedData.education,
              endorsements: parsedData.endorsements,
              funding: parsedData.funding,
              policies: parsedData.policies,
              website: parsedData.website,
              isIncumbent: candidate.isIncumbent || false,
              pollingSupport: candidate.pollingSupport,
              rawAnalysis: aiAnalysis
            };
          } catch (error) {
            console.error(`Error fetching details for candidate ${candidate.name}:`, error);
            
            // Return basic candidate info with minimal details if AI fails
            // Use RAG data with clear attribution
            try {
              const ragData = await storage.getCandidateWithRAG(candidate.id);
              return {
                id: candidate.id,
                name: candidate.name,
                party: candidate.party,
                background: ragData.politicalExperience || ragData.description || 'Candidate has not supplied that info',
                experience: ragData.employmentHistory?.map((job: any) => 
                  `${job.position} at ${job.company} (${job.years})`
                ) || ['Candidate has not supplied that info'],
                education: ragData.education?.map((edu: any) => 
                  `${edu.degree} from ${edu.institution} (${edu.year})`
                ).join(', ') || 'Candidate has not supplied that info',
                endorsements: ragData.endorsements?.map((end: any) => 
                  `${end.organization}: ${end.description}`
                ) || [],
                funding: {
                  totalRaised: 0,
                  individualDonations: 0,
                  pacContributions: 0
                },
                policies: {},
                website: '',
                rawAnalysis: 'RAG data used instead of AI analysis'
              };
            } catch (ragError) {
              console.error(`Error fetching RAG data for candidate ${candidate.id}:`, ragError);
              return {
                id: candidate.id,
                name: candidate.name,
                party: candidate.party,
                background: candidate.description || 'Candidate has not supplied that info',
                experience: ['Candidate has not supplied that info'],
                education: 'Candidate has not supplied that info',
                endorsements: [],
                funding: {
                  totalRaised: 0,
                  individualDonations: 0,
                  pacContributions: 0
                },
                policies: [],
                website: null,
                isIncumbent: candidate.isIncumbent || false,
                pollingSupport: candidate.pollingSupport,
                rawAnalysis: ''
              };
            }
          }
        })
      );

      res.json(detailedCandidates);
    } catch (error: any) {
      console.error('Error fetching detailed candidate information:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Civic Aggregator Service Endpoints
  app.get("/api/civic/status", async (req, res) => {
    try {
      const status = civicAggregatorService.getServiceStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to get civic aggregator status" });
    }
  });

  app.get("/api/civic/compare", async (req, res) => {
    try {
      const candidateIds = req.query.candidateIds as string;
      const policyCategories = req.query.policyCategories as string;

      if (!candidateIds || !policyCategories) {
        return res.status(400).json({ message: "Missing candidateIds or policyCategories" });
      }

      const ids = candidateIds.split(',');
      const categories = policyCategories.split(',');

      const comparison = await civicAggregatorService.comparePolicies(ids, categories);
      res.json(comparison);
    } catch (error: any) {
      console.error('Policy comparison error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/civic/ballot-info", async (req, res) => {
    try {
      const address = req.query.address as string;
      if (!address) {
        return res.status(400).json({ message: "Address is required" });
      }

      const ballotInfo = await civicAggregatorService.fetchGoogleCivicData(address);
      res.json(ballotInfo || { address, message: "No ballot information available" });
    } catch (error: any) {
      console.error('Ballot info error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/civic/international", async (req, res) => {
    try {
      const candidateName = req.query.candidateName as string;
      const country = req.query.country as string;

      if (!candidateName || !country) {
        return res.status(400).json({ message: "CandidateName and country are required" });
      }

      const internationalData = await civicAggregatorService.fetchInternationalData(candidateName, country);
      res.json(internationalData || { candidateName, country, message: "No international data available" });
    } catch (error: any) {
      console.error('International data error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Real-time monitoring endpoints
  app.get("/api/monitoring/status", async (req, res) => {
    try {
      const status = realTimeMonitor.getMonitoringStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to get monitoring status" });
    }
  });

  app.post("/api/monitoring/start", async (req, res) => {
    try {
      const { intervalMinutes = 5 } = req.body;
      await realTimeMonitor.startMonitoring(intervalMinutes);
      res.json({ success: true, message: "Real-time monitoring started" });
    } catch (error) {
      res.status(500).json({ error: "Failed to start monitoring" });
    }
  });

  app.post("/api/monitoring/stop", async (req, res) => {
    try {
      await realTimeMonitor.stopMonitoring();
      res.json({ success: true, message: "Real-time monitoring stopped" });
    } catch (error) {
      res.status(500).json({ error: "Failed to stop monitoring" });
    }
  });

  app.post("/api/monitoring/targets", async (req, res) => {
    try {
      const { url, type, priority, state } = req.body;
      
      if (!url || !type) {
        return res.status(400).json({ error: "URL and type are required" });
      }

      realTimeMonitor.addMonitoringTarget({
        url,
        type,
        priority: priority || 'medium',
        state
      });

      res.json({ success: true, message: "Monitoring target added" });
    } catch (error) {
      res.status(500).json({ error: "Failed to add monitoring target" });
    }
  });

  // Election data scraping endpoint  
  app.post("/api/scrape/election", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const scrapedData = await electionScraper.scrapeElectionSite(url);
      
      if (!scrapedData) {
        return res.status(404).json({ error: "No election data found at the provided URL" });
      }

      res.json(scrapedData);
    } catch (error) {
      res.status(500).json({ error: "Failed to scrape election data" });
    }
  });

  // Enhanced election search with AI
  app.get("/api/elections/search", async (req, res) => {
    try {
      const { query, enhance = false } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: "Search query is required" });
      }

      // Search existing elections
      const elections = await storage.getElections({
        search: query,
        state: undefined,
        type: undefined,
        level: undefined,
        timeframe: undefined,
        timeRange: undefined,
        party: undefined,
        electionType: undefined
      } as any);

      let aiEnhancement = null;
      if (enhance === 'true') {
        try {
          aiEnhancement = await perplexityCongressService.searchWithAI(
            `Find additional election information for: ${query}`
          );
        } catch (error) {
          console.error('AI enhancement failed:', error);
        }
      }

      res.json({
        elections,
        aiEnhancement,
        totalResults: elections.length
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to search elections" });
    }
  });

  // Election verification endpoint with AI validation
  app.post("/api/elections/verify", async (req, res) => {
    try {
      const { title, state, date } = req.body;
      
      if (!title || !state) {
        return res.status(400).json({ error: "Title and state are required" });
      }

      const validation = await aiValidationService.validateElectionDate(title, date, state);

      res.json({
        verified: validation.verified,
        confidence: validation.confidence,
        sources: validation.sources,
        warnings: validation.warnings,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to verify election" });
    }
  });

  // Global election data endpoints
  app.get("/api/global/elections", async (req, res) => {
    try {
      const { country } = req.query;
      const elections = await globalElectionService.fetchIDEAElections(country as string);
      res.json(elections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch global elections" });
    }
  });

  app.get("/api/global/legislative/:state", async (req, res) => {
    try {
      const { state } = req.params;
      const events = await globalElectionService.fetchOpenStatesEvents(state);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch legislative events" });
    }
  });

  app.post("/api/global/ballot-info", async (req, res) => {
    try {
      const { address } = req.body;
      if (!address) {
        return res.status(400).json({ error: "Address is required" });
      }
      
      const ballotInfo = await globalElectionService.getEnhancedBallotInfo(address);
      res.json(ballotInfo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ballot information" });
    }
  });

  // Event processing endpoints
  app.post("/api/events/ingest", async (req, res) => {
    try {
      const { event, source } = req.body;
      const eventId = await eventProcessingService.ingestEvent(event, source || 'api');
      res.json({ eventId, success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to ingest event" });
    }
  });

  app.get("/api/events/status", async (req, res) => {
    try {
      const status = eventProcessingService.getEventProcessingStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to get event processing status" });
    }
  });

  // Crowdsourced verification endpoints
  app.post("/api/crowdsource/report", async (req, res) => {
    try {
      const report = req.body;
      const success = await globalElectionService.submitCrowdsourcedReport(report);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit crowdsourced report" });
    }
  });

  // Compliance and privacy endpoints
  app.post("/api/privacy/request", async (req, res) => {
    try {
      const request = req.body;
      const result = await complianceService.handlePrivacyRequest(request);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to process privacy request" });
    }
  });

  app.get("/api/compliance/status", async (req, res) => {
    try {
      const status = complianceService.getComplianceStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to get compliance status" });
    }
  });

  // Candidate validation with VoteSmart integration
  app.post("/api/candidates/validate", async (req, res) => {
    try {
      const { candidateName, office, state } = req.body;
      const validation = await aiValidationService.validateCandidateInfo(candidateName, office, state);
      res.json(validation);
    } catch (error) {
      res.status(500).json({ error: "Failed to validate candidate" });
    }
  });

  // Global service status dashboard
  app.get("/api/global/status", async (req, res) => {
    try {
      const status = globalElectionService.getServiceStatus();
      res.json({
        ...status,
        monitoring: realTimeMonitor.getMonitoringStatus(),
        eventProcessing: eventProcessingService.getEventProcessingStatus(),
        compliance: complianceService.getComplianceStatus()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get global status" });
    }
  });

  // Add percentage validation endpoints
  const { addPercentageValidationEndpoint } = await import('./percentage-validation-endpoint');
  addPercentageValidationEndpoint(app);

  // 2026 Midterm Election Data Endpoint
  app.get("/api/elections/2026/midterms", async (req, res) => {
    try {
      const { integrate2026MidtermData, midtermSummary } = await import('../2026_midterm_integration');
      const electionData = await integrate2026MidtermData();
      
      res.json({
        summary: midtermSummary,
        elections: electionData,
        totalOffices: "545-550 significant elective offices",
        electionDate: "2026-11-03",
        categories: {
          congress: { house: 435, senate: 35, total: 470 },
          governors: 39,
          mayors: 33
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error serving 2026 midterm data:", error);
      res.status(500).json({ error: "Failed to load 2026 midterm data" });
    }
  });

  // Comprehensive election sync endpoints
  app.post("/api/sync/elections/all", async (req, res) => {
    try {
      const { comprehensiveElectionSync } = await import('./comprehensive-election-sync');
      const result = await comprehensiveElectionSync.syncAllElections();
      
      res.json({
        success: true,
        message: `Successfully synced elections. ${result.summary}`,
        details: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error syncing elections:", error);
      res.status(500).json({ error: "Failed to sync elections", details: error.message });
    }
  });

  // Get current election count and sync status
  app.get("/api/sync/status", async (req, res) => {
    try {
      const stats = await storage.getElectionStats();
      const lastSync = await storage.getLastSyncTimestamp?.() || null;
      
      res.json({
        currentCount: stats.total,
        target: "601+",
        status: stats.total >= 601 ? "sufficient" : "needs_sync",
        breakdown: {
          byType: stats.byType,
          byLevel: stats.byLevel
        },
        lastSync,
        recommendation: stats.total < 601 ? "Run full election sync" : "Count maintained"
      });
    } catch (error) {
      console.error("Error getting sync status:", error);
      res.status(500).json({ error: "Failed to get sync status" });
    }
  });

  // Michigan election and candidate setup
  app.post("/api/setup/michigan-primary", async (req, res) => {
    try {
      const { addMichiganPrimaryWithCandidates } = await import('./add-michigan-election');
      const result = await addMichiganPrimaryWithCandidates();
      
      res.json({
        success: true,
        message: `Created Michigan primary with ${result.candidatesAdded} candidates`,
        election: {
          id: result.election.id,
          title: result.election.title,
          date: result.election.date,
          state: result.election.state
        },
        candidatesAdded: result.candidatesAdded,
        totalCandidates: result.totalCandidates
      });

    } catch (error) {
      console.error("Error setting up Michigan primary:", error);
      res.status(500).json({ error: "Failed to setup Michigan primary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to extract numbers from strings
function extractNumber(str: string | null | undefined): number {
  if (!str) return 0;
  const match = str.match(/[\d,]+/);
  if (!match) return 0;
  return parseInt(match[0].replace(/,/g, ''), 10) || 0;
}

// Helper function to parse AI analysis into structured data
function parsecandidateAnalysis(analysis: string, candidate: any) {
  const sections = analysis.split(/\d+\.\s+[A-Z\s&:]+/);
  
  // Extract background information
  const backgroundSection = analysis.match(/BACKGROUND & EXPERIENCE:(.*?)(?=\d+\.|$)/s)?.[1] || '';
  const background = backgroundSection.split('\n').find(line => line.trim() && !line.includes('-'))?.trim() || 
    `${candidate.name} is a candidate for this election.`;

  // Extract experience items
  const experience = backgroundSection.match(/- (.*?)(?=\n|$)/g)?.map(item => item.replace('- ', '').trim()) || 
    ['Professional background not available'];

  // Extract education
  const education = backgroundSection.match(/[Ee]ducation[:\s]+(.*?)(?=\n|$)/)?.[1]?.trim() || 
    'Educational background not available';

  // Extract endorsements
  const endorsementSection = analysis.match(/endorsements?[:\s]+(.*?)(?=\n\n|$)/is)?.[1] || '';
  const endorsements = endorsementSection.match(/[A-Z][^.]*(?:Association|Union|Party|Group|Organization|Coalition)[^.]*(?:\.|$)/g)?.slice(0, 5) || [];

  // Extract funding information
  const fundingSection = analysis.match(/funding[:\s]+(.*?)(?=\n\n|$)/is)?.[1] || '';
  const totalRaised = extractNumber(fundingSection.match(/\$[\d,]+/)?.[0]) || 0;

  // Parse policy positions
  const policies = [
    'Economy & Jobs',
    'Healthcare', 
    'Education',
    'Environment',
    'Immigration',
    'Criminal Justice',
    'Infrastructure',
    'Social Issues',
    'Foreign Policy'
  ].map(category => {
    const categoryRegex = new RegExp(`${category}[:\s]+(.*?)(?=\\n\\s*-|\\n\\n|$)`, 'is');
    const match = analysis.match(categoryRegex);
    
    if (match && match[1]) {
      const content = match[1].trim();
      const position = content.split('\n')[0]?.replace(/^-\s*/, '').trim();
      
      return {
        category,
        position: position || 'Position not specified',
        details: content.length > position.length ? content.substring(position.length).trim() : undefined,
        source: 'Campaign materials and public statements'
      };
    }
    
    return null;
  }).filter(Boolean);

  // Extract website
  const website = analysis.match(/(https?:\/\/[^\s]+)/)?.[1] || null;

  return {
    background,
    experience: experience.slice(0, 5),
    education,
    endorsements,
    funding: {
      totalRaised,
      individualDonations: Math.floor(totalRaised * 0.6),
      pacContributions: Math.floor(totalRaised * 0.4)
    },
    policies,
    website
  };
}
