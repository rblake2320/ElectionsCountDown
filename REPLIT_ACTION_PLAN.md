# 🚀 Replit Action Plan - Complete Testing & Deployment Guide

## Overview
This guide provides step-by-step instructions to deploy fixes, populate data, and test the Election Countdown Platform.

---

## ✅ What's Been Fixed (Already in GitHub)

### Critical Fixes Committed:
1. **API Endpoint Fix** - Now queries correct `candidate_profiles` table
2. **Data Transformation** - Properly maps database fields to frontend format
3. **Verification Scripts** - Tools to diagnose and test the platform
4. **Election Level Scripts** - Fix for "0 local elections" filter issue

### Commits Pushed:
- `1071de6` - CRITICAL FIX: Use correct table name candidateProfiles
- `d04d0db` - Add comprehensive verification scripts and deployment guide
- `02d8471` - Fix API endpoint to transform database response
- Earlier commits with population scripts

---

## 📋 STEP-BY-STEP EXECUTION PLAN

### PHASE 1: Deploy Latest Code (5 minutes)

#### 1.1 Open Replit Project
```
https://replit.com/join/nzdkhicyqy-rblake2320
```

#### 1.2 Open Shell Tab
Click on "Shell" tab in Replit interface

#### 1.3 Pull Latest Changes
```bash
git pull origin main
```

**Expected Output:**
```
Updating d04d0db..1071de6
Fast-forward
 server/routes.ts | 83 ++++++++++++++++++++++++++++++++++++++++++++
 verify-database.ts | 10 +++---
 check-election-levels.ts | 95 ++++++++++++++++++++++++++++++++++++++++++++++++
 fix-election-levels.ts | 68 +++++++++++++++++++++++++++++++++++
 4 files changed, 251 insertions(+), 5 deletions(-)
 create mode 100644 check-election-levels.ts
 create mode 100644 fix-election-levels.ts
```

#### 1.4 Verify Server Restart
- Watch the console for "Server started" or similar message
- If server doesn't auto-restart, run: `npm run dev`

---

### PHASE 2: Populate Database (10 minutes)

#### 2.1 Run Population Scripts

**Script 1: Candidate Profiles & Positions**
```bash
npx tsx populate_all_tables.ts
```

**Expected Output:**
```
🚀 Starting comprehensive database population...

📝 Populating candidate_profiles table...
  ✓ Inserted profile for James E. Craig
  ✓ Inserted profile for Mary Sheffield
  ✓ Inserted profile for Michael Edward Duggan
  ✓ Inserted profile for Saunteel Jenkins
  ✓ Inserted profile for Freddie O'Connell
  ✓ Inserted profile for David Briley

📋 Populating candidate_positions table...
  ✓ Inserted 29 policy positions

🔗 Populating candidate_data_sources table...
  ✓ Inserted 11 data sources

📊 Final Results:
  - Candidate Profiles: 6 rows
  - Candidate Positions: 29 rows
  - Data Sources: 11 rows

✨ Database population completed successfully!
```

**Script 2: Congressional Data**
```bash
npx tsx populate_congress_and_cycles.ts
```

**Expected Output:**
```
✅ Populated congress members, bills, committees, and election cycles
```

**Script 3: Polling Data**
```bash
npx tsx populate_polling_data.ts
```

**Expected Output:**
```
✅ Populated polling data for Detroit and Nashville elections
```

---

### PHASE 3: Verify Database (5 minutes)

#### 3.1 Run Database Verification
```bash
npx tsx verify-database.ts
```

**Expected Output:**
```
🔍 Starting Database Verification...

📊 Checking candidate_profiles table...
   ✅ Found 6 profile entries
   Sample entries:
      - Candidate ID 294: James E. Craig
      - Candidate ID 293: Mary Sheffield
      - Candidate ID 292: Michael Edward Duggan
      - Candidate ID 295: Saunteel Jenkins
      - Candidate ID 300: Freddie O'Connell
      - Candidate ID 301: David Briley

📊 Checking candidate_positions table...
   ✅ Found 29 position entries
   Sample entries:
      - Candidate ID 294: 5 positions
      - Candidate ID 293: 5 positions
      - Candidate ID 292: 5 positions
      - Candidate ID 295: 5 positions
      - Candidate ID 300: 5 positions
      - Candidate ID 301: 4 positions

📊 Checking for Detroit mayoral election...
   ✅ Found 1 Detroit mayoral elections
   Election: 2025 Detroit Mayoral Election (ID: XXX)
   ✅ Found 6 candidates

📊 Checking for Nashville mayoral election...
   ✅ Found 1 Nashville mayoral elections
   Election: 2025 Nashville Mayoral Election (ID: XXX)
   ✅ Found 4 candidates

📊 SUMMARY:
   - Total profiles: 6
   - Total positions: 29
   - Detroit elections: 1
   - Nashville elections: 1
   - Candidates with complete data: 6

✅ Database verification complete!
```

#### 3.2 Test API Endpoint
```bash
npx tsx test-api-endpoint.ts
```

**Expected Output:**
```
🧪 Testing /api/candidates/detailed endpoint...

🔍 Testing Candidate: Mary Sheffield (ID: 293)
   ✅ API Response received
   📊 Data Structure Check:
      - Has preferredName: ✅
      - Has fullName: ✅
      - Has background: ✅
      - Has currentOccupation: ✅
      - Has education: ✅ (1 entries)
      - Has employmentHistory: ✅ (0 entries)
      - Has topPriorities: ✅ (5 entries)
      - Has policyPositions: ✅
      - Data Source: Local Database
      - Has Authentic Data: ✅
   🎉 SUCCESS: Using local database data!
```

---

### PHASE 4: Fix Local Elections Filter (5 minutes)

#### 4.1 Check Election Levels
```bash
npx tsx check-election-levels.ts
```

**Expected Output (if broken):**
```
📊 All Mayoral Elections:
   Found 50 mayoral elections
   ✅ Correctly categorized as 'local': 0
   ❌ NOT categorized as 'local': 50

💡 RECOMMENDATION:
   Run the fix script to update election levels:
   npx tsx fix-election-levels.ts
```

#### 4.2 Fix Election Levels
```bash
npx tsx fix-election-levels.ts
```

**Expected Output:**
```
🔧 Fixing election level categorization...

📊 Found 50 mayoral elections to fix:

   Fixing: 2025 Detroit Mayoral Election
      Current level: state
      ✅ Updated to: local

   Fixing: 2025 Nashville Mayoral Election
      Current level: state
      ✅ Updated to: local

   ... (more elections) ...

✅ Successfully updated 50 elections to 'local' level!

🔍 Verifying fix...
   ✅ 50 of 50 mayoral elections are now 'local'

🎉 SUCCESS! All mayoral elections are now correctly categorized!
```

---

### PHASE 5: Manual Browser Testing (10 minutes)

#### 5.1 Open Live Platform
```
https://61d708f8-536c-456b-b628-19504ff7d54a-00-20vd971bkgzji.picard.replit.dev/
```

#### 5.2 Open Browser DevTools
- Press `F12` or Right-click → "Inspect"
- Go to "Console" tab

#### 5.3 Test Local Elections Filter
1. Click "Local" filter button
2. **Expected:** Should show "50 of 604 elections" (or similar)
3. **Before Fix:** Showed "0 of 604 elections"

#### 5.4 Find Detroit Election
1. Search for "Detroit" or scroll to find "2025 Detroit Mayoral Election"
2. Should see candidates: James Craig, Mary Sheffield, Mike Duggan, Saunteel Jenkins

#### 5.5 Test Candidate Modal
1. Click on "Mary Sheffield" name
2. **Check Console:** Should see `✅ Using local database data for candidate: Mary Sheffield`
3. **Check Modal:** Should display:
   - ✅ Full name and preferred name
   - ✅ Background/biography section
   - ✅ Current Occupation: "Detroit City Council President"
   - ✅ Education: University of Michigan-Dearborn
   - ✅ Campaign Priorities section with 5 priorities
   - ✅ Policy Positions section

#### 5.6 Test Multiple Candidates
Repeat for:
- James Craig (Detroit)
- Freddie O'Connell (Nashville)
- David Briley (Nashville)

---

## ✅ SUCCESS CRITERIA

### Database Population Success:
- [ ] verify-database.ts shows 6 profiles
- [ ] verify-database.ts shows 29 positions
- [ ] test-api-endpoint.ts shows "Using local database"
- [ ] No errors in Replit console

### Local Elections Filter Success:
- [ ] check-election-levels.ts shows all mayoral elections as 'local'
- [ ] Platform shows "50+ of 604 elections" when "Local" filter applied
- [ ] Detroit and Nashville elections appear in local filter

### Candidate Modal Success:
- [ ] Modal opens when clicking candidate names
- [ ] Modal displays complete biography
- [ ] Modal displays current occupation
- [ ] Modal displays education
- [ ] Modal displays 5 campaign priorities
- [ ] Modal displays policy positions
- [ ] Browser console shows "✅ Using local database data"
- [ ] No errors in browser console

---

## 🐛 Troubleshooting

### Problem: "Module not found" errors
**Solution:**
```bash
npm install
```

### Problem: Population script says "0 rows inserted"
**Possible Causes:**
1. Data already exists (script uses `.onConflictDoNothing()`)
2. Database connection issue

**Solution:**
```bash
# Check if data already exists
npx tsx verify-database.ts

# If no data, check DATABASE_URL is set in Replit Secrets
```

### Problem: API returns "Candidate has not supplied that info"
**Possible Causes:**
1. Population script hasn't been run
2. Candidate ID mismatch

**Solution:**
```bash
# Run population script
npx tsx populate_all_tables.ts

# Verify data exists
npx tsx verify-database.ts
```

### Problem: Local filter still shows "0 of 604"
**Possible Causes:**
1. fix-election-levels.ts hasn't been run
2. Frontend is caching old data

**Solution:**
```bash
# Run fix script
npx tsx fix-election-levels.ts

# Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
```

### Problem: Modal doesn't open
**Possible Causes:**
1. Frontend JavaScript error
2. API endpoint returning 500 error

**Solution:**
1. Check browser console for errors
2. Check Replit console for server errors
3. Check Network tab for failed API calls

---

## 📊 Current Status Summary

### ✅ Completed:
- API endpoint fix (queries correct table)
- Data transformation layer (maps fields correctly)
- Verification scripts (diagnose issues)
- Election level fix scripts (fix local filter)
- Population scripts (insert data)
- Comprehensive documentation

### ⏳ Awaiting Execution in Replit:
- Pull latest code (`git pull origin main`)
- Run population scripts
- Run verification scripts
- Run election level fix
- Manual browser testing

### 🎯 Expected Outcome:
- ✅ 6 candidates with complete profiles
- ✅ 29 policy positions displayed
- ✅ Local elections filter working
- ✅ Candidate modals displaying full information
- ✅ No errors in console
- ✅ Platform 100% functional for Detroit and Nashville elections

---

## 🚀 Next Steps After Success

Once everything is working:

1. **Expand Candidate Coverage**
   - Add more Detroit candidates
   - Add more Nashville candidates
   - Add candidates from other elections

2. **Complete Congressional Data**
   - Populate congressional bills
   - Populate congressional committees
   - Add voting records

3. **Expand Polling Data**
   - Add more polling sources
   - Add historical polling trends
   - Integrate real-time polling APIs

4. **Platform Enhancements**
   - Add candidate comparison feature
   - Add election alerts/notifications
   - Add voter registration integration

---

## 📞 Need Help?

If you encounter issues:
1. Check Replit console for error messages
2. Check browser console for frontend errors
3. Run verification scripts to diagnose
4. Review this guide's troubleshooting section
5. Check commit history on GitHub for recent changes

---

**Last Updated:** October 6, 2025
**Commit Hash:** 1071de6
**Status:** Ready for Deployment
