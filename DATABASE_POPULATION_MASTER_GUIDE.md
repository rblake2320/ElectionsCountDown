# Database Population Master Guide

## Overview

This guide explains how to populate ALL database tables that should have data from external sources.

## 📊 Table Classification

### ✅ Tables That SHOULD Have Data (Populated by Scripts)

| Table | Source | Script | Priority |
|-------|--------|--------|----------|
| **elections** | Google Civic API, Ballotpedia | Already populated | HIGH |
| **candidates** | Google Civic API, FEC | Already populated | HIGH |
| **candidate_profiles** | Research, Ballotpedia | `populate_all_tables.ts` | HIGH |
| **candidate_positions** | Vote Smart, Campaign sites | `populate_all_tables.ts` | HIGH |
| **candidate_data_sources** | Attribution tracking | `populate_all_tables.ts` | MEDIUM |
| **congress_members** | JSON file / Congress API | `populate_congress_and_cycles.ts` | HIGH |
| **congress_bills** | Congress.gov API | `populate_congress_and_cycles.ts` | MEDIUM |
| **congress_committees** | Congress.gov API | `populate_congress_and_cycles.ts` | MEDIUM |
| **election_cycles** | Manual configuration | `populate_congress_and_cycles.ts` | LOW |
| **election_results** | State election offices | Future script | MEDIUM |

### ❌ Tables That Are Legitimately Empty (User/Campaign Generated)

| Table | Reason |
|-------|--------|
| **candidate_qa** | User-submitted questions - empty until users interact |
| **candidate_accounts** | Campaign portal registrations - empty until campaigns sign up |
| **candidate_subscriptions** | Subscription management - empty until campaigns subscribe |
| **campaign_accounts** | Campaign API accounts - empty until campaigns register |
| **campaign_content** | Campaign-created content - empty until campaigns post |
| **voter_interactions** | User engagement tracking - accumulates as users interact |
| **real_time_polling** | Platform analytics - accumulates from user interactions |
| **users** | User accounts - empty until users register |
| **watchlist** | User watchlists - empty until users add elections |
| **sessions** | Active user sessions - transient data |

---

## 🚀 Execution Order (In Replit)

### Step 1: Analyze Current State

```bash
npx tsx analyze_all_tables.ts
```

This will show you which tables are empty and which should have data.

### Step 2: Populate Candidate Data

```bash
npx tsx populate_all_tables.ts
```

**Populates:**
- 6 candidate profiles (Detroit & Nashville mayors)
- 29 policy positions
- 11 data source attributions

**Expected Output:**
```
✓ Inserted profile for James E. Craig
✓ Inserted profile for Mary Sheffield
✓ Inserted profile for Michael Edward Duggan
✓ Inserted profile for Saunteel Jenkins
✓ Inserted profile for Freddie O'Connell
✓ Inserted profile for David Briley
✓ Inserted 29 policy positions
✓ Inserted 11 data sources
```

### Step 3: Populate Congressional Data

```bash
npx tsx populate_congress_and_cycles.ts
```

**Populates:**
- Congress members (from JSON file - ~528 members)
- 15 congressional bills (119th Congress)
- 15 congressional committees (House & Senate)
- 3 election cycles (2024, 2025, 2026)

**Expected Output:**
```
✓ Inserted 528 congressional members
✓ Inserted 15 congressional bills
✓ Inserted 15 congressional committees
✓ Inserted 3 election cycles
```

### Step 4: Verify Completion

```bash
npx tsx analyze_all_tables.ts
```

Check that all high-priority tables now have data.

---

## 📋 Detailed Script Descriptions

### 1. `analyze_all_tables.ts`

**Purpose:** Analyze all database tables and identify which should have data

**Features:**
- Categorizes tables by priority (HIGH/MEDIUM/LOW/N/A)
- Shows current row counts
- Identifies data sources for each table
- Calculates completion percentage
- Distinguishes between external data and user-generated content

**When to Run:**
- Before populating data (to see what's missing)
- After populating data (to verify success)
- Anytime you want to check database status

### 2. `populate_all_tables.ts`

**Purpose:** Populate candidate profiles, positions, and data sources

**Data Included:**
- **6 Candidate Profiles:**
  - James Craig (Detroit, Republican)
  - Mary Sheffield (Detroit, Democratic)
  - Mike Duggan (Detroit, Democratic, Incumbent)
  - Saunteel Jenkins (Detroit, Democratic)
  - Freddie O'Connell (Nashville, Democratic, Incumbent)
  - David Briley (Nashville, Democratic)

- **29 Policy Positions** covering:
  - Economy & Jobs
  - Healthcare
  - Education
  - Public Safety
  - Housing & Development
  - Infrastructure
  - Criminal Justice
  - Social Justice
  - Transportation

- **11 Data Sources:**
  - Ballotpedia
  - Wikipedia
  - Official government websites
  - Campaign websites
  - City records

**Safety Features:**
- Idempotent (can run multiple times)
- Uses `onConflictDoNothing()` to prevent duplicates
- Error handling for individual inserts
- Verification of row counts

### 3. `populate_congress_and_cycles.ts`

**Purpose:** Populate congressional data and election cycles

**Data Included:**
- **Congress Members:**
  - Reads from `./attached_assets/congress_members_complete.json`
  - ~528 members of 119th Congress (2025-2026)
  - Both House and Senate members
  - Includes bioguide IDs, party, state, district, chamber

- **15 Congressional Bills:**
  - Recent bills from 119th Congress
  - Mix of House and Senate bills
  - Includes sponsors, status, and latest actions
  - Examples: Lower Energy Costs Act, For the People Act, Secure the Border Act

- **15 Congressional Committees:**
  - Major House and Senate committees
  - Includes subcommittees
  - Examples: Appropriations, Armed Services, Judiciary, Finance

- **3 Election Cycles:**
  - 2024 General Election (complete)
  - 2025 Special Elections (active)
  - 2026 Midterm Elections (active)

**Requirements:**
- Requires `./attached_assets/congress_members_complete.json` file
- If file not found, skips congress members but continues with bills/committees

---

## 🎯 Expected Results

After running all scripts, you should have:

| Table | Expected Rows | Status |
|-------|---------------|--------|
| elections | 601+ | ✅ Already populated |
| candidates | 179+ | ✅ Already populated |
| candidate_profiles | 6 | ✅ After populate_all_tables.ts |
| candidate_positions | 29 | ✅ After populate_all_tables.ts |
| candidate_data_sources | 11 | ✅ After populate_all_tables.ts |
| congress_members | 528 | ✅ After populate_congress_and_cycles.ts |
| congress_bills | 15 | ✅ After populate_congress_and_cycles.ts |
| congress_committees | 15 | ✅ After populate_congress_and_cycles.ts |
| election_cycles | 3 | ✅ After populate_congress_and_cycles.ts |

---

## 🧪 Testing

### Test Candidate Modal Popups
1. Go to platform URL
2. Navigate to Detroit or Nashville mayoral elections
3. Click on candidate names
4. Verify modal displays:
   - Biography
   - Education
   - Professional background
   - Policy positions
   - Data sources

### Test Congress Section
1. Navigate to Congress section
2. Verify 528 members are displayed
3. Check that bills and committees are accessible
4. Verify member details load correctly

---

## 🔧 Troubleshooting

### Script fails with "DATABASE_URL must be set"
**Solution:** Must run in Replit environment where DATABASE_URL is configured

### Congress members not populating
**Solution:** Ensure `./attached_assets/congress_members_complete.json` file exists

### Candidate IDs don't match
**Solution:** Verify candidate IDs (292-295, 300, 302) exist in candidates table

### Modal popups still empty
**Solutions:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check browser console for errors
4. Verify data with: `SELECT * FROM candidate_profiles;`

---

## 📈 Future Enhancements

### To Complete All 179 Candidates
1. Use `populate_all_tables.ts` as template
2. Research remaining candidates
3. Follow established data structure
4. Run script with expanded data

### To Add Election Results
1. Create `populate_election_results.ts`
2. Fetch historical data from state election offices
3. Populate for past elections only

### To Integrate Live APIs
1. Set up ProPublica Congress API key
2. Create automated sync scripts
3. Schedule regular updates

---

## 📞 Support

### Common Issues

**Q: Can I run scripts multiple times?**
A: Yes! All scripts use `onConflictDoNothing()` to prevent duplicates.

**Q: What if I only want to populate some tables?**
A: Run individual scripts as needed. They're independent.

**Q: How do I update existing data?**
A: Modify the script data and re-run. Conflicts will be ignored, so you may need to delete old data first.

**Q: Where do I get more congressional data?**
A: Use congress.gov API or ProPublica Congress API with proper API keys.

---

## ✅ Completion Checklist

- [ ] Run `analyze_all_tables.ts` to see current state
- [ ] Run `populate_all_tables.ts` for candidate data
- [ ] Run `populate_congress_and_cycles.ts` for congressional data
- [ ] Run `analyze_all_tables.ts` again to verify
- [ ] Test candidate modal popups on platform
- [ ] Test Congress section functionality
- [ ] Verify no console errors
- [ ] Check data quality in database

---

**Last Updated:** October 6, 2025
**Scripts Version:** 1.0
**Status:** ✅ Ready for Production Use
