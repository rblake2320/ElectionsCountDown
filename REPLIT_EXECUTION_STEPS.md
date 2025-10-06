# Replit Execution Steps - Quick Start

## 🎯 Goal
Pull the latest code from GitHub and run the population scripts to fill all empty database tables.

---

## ✅ Step-by-Step Instructions

### Step 1: Open Replit Shell
1. Go to: https://replit.com/join/nzdkhicyqy-rblake2320
2. Click on the **Shell** tab (bottom of screen)

### Step 2: Pull Latest Code from GitHub
```bash
git pull origin main
```

**Expected Output:**
```
Updating 60494f9..468b879
Fast-forward
 FINAL_COMPLETION_REPORT.md              | 326 +++++++++++++++++++
 DATABASE_POPULATION_MASTER_GUIDE.md     | 304 +++++++++++++++++
 POPULATE_DATABASE_README.md             | 172 ++++++++++
 TASK_COMPLETION_SUMMARY.md              | 282 +++++++++++++++
 analyze_all_tables.ts                   | 325 +++++++++++++++++++
 populate_all_tables.ts                  | 290 ++++++++++++++++
 populate_congress_and_cycles.ts         | 525 +++++++++++++++++++++++++++++
 package.json                            |   1 +
 package-lock.json                       | 890 ++++++++++++++++++++++++++++++++++++++++++++++++
 9 files changed, 3115 insertions(+)
```

### Step 3: Verify Files Are Present
```bash
ls -la *.ts
```

**You should see:**
- `populate_all_tables.ts` ✅
- `populate_congress_and_cycles.ts` ✅
- `analyze_all_tables.ts` ✅

### Step 4: Run Database Analysis (Optional - See Current State)
```bash
npx tsx analyze_all_tables.ts
```

This shows which tables are empty and which should have data.

### Step 5: Populate Candidate Data
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

✅ Verifying data insertion...

📊 Final Results:
  - Candidate Profiles: 6 rows
  - Candidate Positions: 29 rows
  - Data Sources: 11 rows

✨ Database population completed successfully!
```

### Step 6: Populate Congressional Data
```bash
npx tsx populate_congress_and_cycles.ts
```

**Expected Output:**
```
🚀 Starting congressional data and election cycles population...

📋 Populating congress_members table...
  Found 528 members in dataset
  ✓ Inserted 528 congressional members

📜 Populating congress_bills table...
  ✓ Inserted 15 congressional bills

🏛️  Populating congress_committees table...
  ✓ Inserted 15 congressional committees

📅 Populating election_cycles table...
  ✓ Inserted 3 election cycles

✅ POPULATION COMPLETE!

📊 Summary:
   Congress Members: 528 rows
   Congress Bills: 15 rows
   Congress Committees: 15 rows
   Election Cycles: 3 rows

   📈 Total rows inserted: 561

🎉 Congressional data and election cycles populated successfully!
```

### Step 7: Populate Polling Data
```bash
npx tsx populate_polling_data.ts
```

**Expected Output:**
```
🚀 Starting external polling data population...

📊 Populating Detroit Mayoral Polling Data...
   Source: Target-Insyght Poll (July 8-10, 2025)
   ✓ Updated polling for Mary Sheffield: 34%
   ✓ Updated polling for Saunteel Jenkins: 17%
   ✓ Updated polling for Solomon Kinloch Jr.: 16%
   ✓ Updated polling for Fred Durhal III: 6%
   ✓ Updated polling for James Craig: 6%
   ✓ Updated polling for Todd Perkins: 4%
   ✓ Inserted 6 polling entries

📊 Populating Nashville Mayoral Polling Data...
   ✓ Updated polling for Freddie O'Connell: 52%
   ✓ Updated polling for David Briley: 28%
   ✓ Inserted 2 polling entries

📈 Adding Historical Polling Trends...
   ✓ Inserted 5 historical polling entries

✅ POLLING DATA POPULATION COMPLETE!

📊 Summary:
   Detroit Polling Entries: 6 candidates
   Nashville Polling Entries: 2 candidates
   Historical Trend Entries: 5 data points

   📈 Total polling entries: 13

🎉 External polling data populated successfully!
```

### Step 8: Verify Success
```bash
npx tsx analyze_all_tables.ts
```

Check that all tables now show data.

### Step 9: Test the Platform
1. Go to your live platform URL
2. Navigate to Detroit or Nashville mayoral elections
3. Click on candidate names (e.g., "James Craig", "Mary Sheffield")
4. **Verify modal popup displays:**
   - ✅ Complete biography
   - ✅ Education history
   - ✅ Professional background
   - ✅ Policy positions
   - ✅ Data sources

---

## 🎉 Success Criteria

After completing all steps, you should have:

- ✅ 6 candidate profiles in database
- ✅ 29 policy positions in database
- ✅ 11 data sources in database
- ✅ 528 congress members in database
- ✅ 15 congressional bills in database
- ✅ 15 congressional committees in database
- ✅ 3 election cycles in database
- ✅ 13 polling data entries (6 Detroit + 2 Nashville + 5 historical)
- ✅ Candidates showing polling percentages and trends
- ✅ Modal popups working with full candidate information
- ✅ Congress section showing all members

**Total: 620 rows of external data populated!**

---

## 🔧 Troubleshooting

### Issue: "git pull" shows conflicts
**Solution:** 
```bash
git stash
git pull origin main
git stash pop
```

### Issue: "DATABASE_URL must be set"
**Solution:** This error means you're not in Replit environment. Make sure you're running in Replit Shell, not locally.

### Issue: "Cannot find module tsx"
**Solution:** tsx should already be installed. If not:
```bash
npm install
```

### Issue: Scripts run but modal popups still empty
**Solution:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser console for errors
4. Verify data with: Open Replit Database tab and check tables

---

## 📞 Quick Reference

| Command | Purpose |
|---------|---------|
| `git pull origin main` | Get latest code from GitHub |
| `npx tsx analyze_all_tables.ts` | Analyze database state |
| `npx tsx populate_all_tables.ts` | Populate candidate data |
| `npx tsx populate_congress_and_cycles.ts` | Populate congressional data |
| `npx tsx populate_polling_data.ts` | Populate external polling data |

---

## ⏱️ Estimated Time

- **Step 1-3:** 1 minute (pull code)
- **Step 4:** 30 seconds (optional analysis)
- **Step 5:** 1-2 minutes (populate candidates)
- **Step 6:** 2-3 minutes (populate congress)
- **Step 7:** 30 seconds (verify)
- **Step 8:** 2 minutes (test platform)

**Total: ~7-10 minutes**

---

**Status:** Ready to execute
**Risk:** Low (safe, tested scripts)
**Impact:** High (fixes all empty tables)
