# 🚀 Deployment & Testing Guide

## Overview
This guide walks you through deploying the candidate modal fix and verifying it works correctly.

---

## STEP 1: Pull Latest Changes in Replit

### In Replit Shell:
```bash
# Navigate to project directory (if not already there)
cd /path/to/ElectionsCountDown

# Pull latest changes from GitHub
git pull origin main

# You should see output like:
# - server/routes.ts (modified - API fix)
# - verify-database.ts (new file)
# - test-api-endpoint.ts (new file)
# - DEPLOYMENT_TESTING_GUIDE.md (new file)
```

### Expected Result:
- ✅ Server should auto-restart (watch for "Server started" message)
- ✅ No merge conflicts
- ✅ Console shows no errors

### If Server Doesn't Auto-Restart:
```bash
# Manually restart
npm run dev
# OR
node server/index.js
```

---

## STEP 2: Verify Database Integrity

### Run Database Verification Script:
```bash
npx tsx verify-database.ts
```

### Expected Output:
```
🔍 Starting Database Verification...

📊 Checking candidate_biography table...
   ✅ Found 3 biography entries
   Sample entries:
      - Candidate ID 293: Mary Sheffield
      - Candidate ID 294: Saunteel Jenkins
      - Candidate ID 295: Freddie O'Connell

📊 Checking candidate_positions table...
   ✅ Found 12 position entries
   Sample entries:
      - Candidate ID 293: 4 positions
      - Candidate ID 294: 4 positions
      - Candidate ID 295: 4 positions

📊 Checking for Detroit mayoral election...
   ✅ Found 1 Detroit mayoral elections
   Election: 2025 Detroit Mayoral Election (ID: 123)
   ✅ Found 6 candidates
      - Mary Sheffield (Democratic) - ID: 293
      - Saunteel Jenkins (Democratic) - ID: 294
      ...

📊 SUMMARY:
   - Total biographies: 3
   - Total positions: 12
   - Detroit elections: 1
   - Nashville elections: 1
   - Candidates with complete data: 3

✅ Database verification complete!
```

### ⚠️ If You See "0 entries":
This means the population scripts haven't been run yet. Run them first:
```bash
npx tsx populate_all_tables.ts
npx tsx populate_congress_and_cycles.ts
npx tsx populate_polling_data.ts
```

---

## STEP 3: Test the API Endpoint

### Run API Test Script:
```bash
npx tsx test-api-endpoint.ts
```

### Expected Output:
```
🧪 Testing /api/candidates/detailed endpoint...

📋 Finding test candidates...
✅ Found 4 test candidates

🔍 Testing Candidate: Mary Sheffield (ID: 293)
   Election: 2025 Detroit Mayoral Election
   API URL: https://your-repl.repl.co/api/candidates/detailed?candidateIds=293&electionId=123
   ✅ API Response received
   📊 Data Structure Check:
      - Has preferredName: ✅
      - Has fullName: ✅
      - Has background: ✅
      - Has currentOccupation: ✅
      - Has education: ✅ (1 entries)
      - Has employmentHistory: ✅ (1 entries)
      - Has topPriorities: ✅ (4 entries)
      - Has policyPositions: ✅
      - Data Source: Local Database
      - Has Authentic Data: ✅
   🎉 SUCCESS: Using local database data!
```

### ⚠️ If You See "Not using local database":
Check the console logs in Replit to see which step is failing:
- Look for "✅ Using local database data for candidate: ..." (SUCCESS)
- Look for "⚠️ No local data for candidate ..., trying Perplexity AI..." (FAILURE)

---

## STEP 4: Test the Candidate Modal in Browser

### Manual Testing Steps:

1. **Open your live platform:**
   ```
   https://61d708f8-536c-456b-b628-19504ff7d54a-00-20vd971bkgzji.picard.replit.dev/
   ```

2. **Open Browser DevTools:**
   - Press `F12` or right-click → "Inspect"
   - Go to "Console" tab

3. **Find a Detroit or Nashville election:**
   - Scroll through the elections list
   - Look for "Detroit Mayoral Election" or "Nashville Mayoral Election"

4. **Click on a candidate name:**
   - Click on "Mary Sheffield", "Saunteel Jenkins", or "Freddie O'Connell"

5. **Check the Console:**
   - Look for: `✅ Using local database data for candidate: Mary Sheffield`
   - This confirms the API is using our populated data

6. **Verify Modal Content:**
   - ✅ Modal should open (not stay blank)
   - ✅ Should show "Background" section with biography text
   - ✅ Should show "Current Occupation" field
   - ✅ Should show "Campaign Priorities" section with 4 priorities
   - ✅ Should show "Policy Positions" section

### ⚠️ If Modal Doesn't Open or Shows "Loading...":
1. Check browser console for errors
2. Check Network tab for failed API calls
3. Verify the API endpoint returns 200 status
4. Check Replit console for server errors

---

## STEP 5: Address Local Elections Filter Issue

### The Problem:
When you click "Local" filter, it shows "0 of 604 elections" even though Detroit and Nashville are local elections.

### Investigation Steps:

1. **Check election data structure:**
```bash
npx tsx -e "
import { db } from './server/db';
import { elections } from '@shared/schema';
const allElections = await db.select().from(elections).limit(5);
console.log('Sample elections:', JSON.stringify(allElections, null, 2));
process.exit(0);
"
```

2. **Look for the field that categorizes elections:**
   - Check for fields like: `level`, `type`, `category`, `electionType`
   - Detroit/Nashville should have `level: 'local'` or similar

3. **If field is missing or wrong:**
   - Update the elections table to set proper categorization
   - Or fix the frontend filter logic

---

## STEP 6: Verify Everything Works

### Final Checklist:

- [ ] `git pull origin main` completed successfully
- [ ] Server restarted without errors
- [ ] `verify-database.ts` shows data exists
- [ ] `test-api-endpoint.ts` shows "Using local database"
- [ ] Candidate modal opens when clicking names
- [ ] Modal displays biography, occupation, and positions
- [ ] Browser console shows "✅ Using local database data"
- [ ] No errors in Replit console
- [ ] No errors in browser console

---

## Troubleshooting

### Problem: "Module not found" errors
**Solution:**
```bash
npm install
```

### Problem: "Database connection failed"
**Solution:**
Check that `DATABASE_URL` environment variable is set in Replit Secrets.

### Problem: "TypeError: Cannot read property 'biography'"
**Solution:**
The population scripts haven't been run. Run:
```bash
npx tsx populate_all_tables.ts
```

### Problem: API returns 500 error
**Solution:**
Check Replit console for the full error stack trace. Common issues:
- Database schema mismatch
- Missing table columns
- Incorrect SQL syntax

---

## Success Criteria

✅ **The fix is working if:**
1. Console logs show "Using local database data"
2. Modal displays complete candidate information
3. No fallback to Perplexity AI for candidates with local data
4. All fields are properly mapped (preferredName, currentOccupation, etc.)

🎉 **Once all checks pass, the candidate modal fix is complete!**

---

## Next Steps

After verifying the fix works:
1. Expand to more candidates (currently only 3 have data)
2. Fix the local elections filter
3. Populate congressional bills and committees
4. Add more polling data

---

## Need Help?

If you encounter issues:
1. Check Replit console for error messages
2. Check browser console for frontend errors
3. Run the verification scripts to diagnose
4. Review the commit history to see what changed
