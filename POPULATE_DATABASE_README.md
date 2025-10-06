# Database Population Script

## Overview

This script populates the critical empty database tables that are causing broken modal popups in the Election Countdown Platform.

## What It Fixes

- ✅ **candidate_profiles** - Biography data for 6 major candidates
- ✅ **candidate_positions** - 29 policy positions across major issues
- ✅ **candidate_data_sources** - 11 source attributions for transparency

## Candidates Included

### Detroit Mayoral Candidates
1. **James Craig** (ID: 294) - Republican
2. **Mary Sheffield** (ID: 293) - Democratic
3. **Mike Duggan** (ID: 292) - Democratic (Incumbent)
4. **Saunteel Jenkins** (ID: 295) - Democratic

### Nashville Mayoral Candidates
5. **Freddie O'Connell** (ID: 300) - Democratic (Incumbent)
6. **David Briley** (ID: 302) - Democratic

## How to Execute in Replit

### Step 1: Open Replit Shell
In your Replit project, open the Shell tab.

### Step 2: Run the Script
```bash
npx tsx populate_all_tables.ts
```

### Step 3: Verify Success
You should see output like:
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

### Step 4: Test the Platform
1. Visit your live platform URL
2. Navigate to Detroit or Nashville mayoral elections
3. Click on any candidate name
4. Verify modal popup displays complete information

## Expected Results

After running the script, modal popups will display:
- Complete candidate biographies
- Education history
- Professional background
- Policy positions on major issues
- Data source attributions

## Data Included

### For Each Candidate Profile:
- Full name and preferred name
- Age, birthplace, current residence
- Current occupation
- Education history (with institutions, degrees, fields, years)
- Political experience
- Positions on economy, healthcare, education, criminal justice, infrastructure
- Campaign website and slogan
- Key accomplishments (where applicable)
- Data completeness score (65-85%)
- Verification status

### Policy Position Categories:
- Economy & Jobs
- Healthcare
- Education
- Public Safety
- Housing & Development
- Infrastructure
- Criminal Justice
- Social Justice
- Transportation
- Government Services

### Data Sources:
- Ballotpedia
- Wikipedia
- Official government websites
- Campaign websites
- City records

## Safety Features

- **Idempotent**: Can be run multiple times without creating duplicates
- **Conflict Handling**: Uses `onConflictDoNothing()` to skip existing records
- **Error Handling**: Continues processing even if individual inserts fail
- **Verification**: Automatically verifies row counts after insertion

## Troubleshooting

### Error: "DATABASE_URL must be set"
**Cause**: Script is not running in Replit environment
**Solution**: Must run in Replit Shell where DATABASE_URL is automatically available

### Error: "Cannot find module"
**Cause**: Script not in correct directory
**Solution**: Ensure you're in the project root directory

### Modal popups still empty after running
**Solutions**:
1. Clear browser cache and hard refresh (Ctrl+Shift+R)
2. Check browser console for JavaScript errors
3. Verify data was inserted by checking database directly
4. Ensure candidate IDs match between candidates and candidate_profiles tables

## Next Steps

### To Expand to All 179 Candidates:
1. Use this script as a template
2. Research additional candidates from your elections
3. Follow the same data structure
4. Run the script again with new data

### To Populate Other Empty Tables:
- election_results (historical election data)
- campaign_accounts (campaign portal access)
- campaign_content (campaign materials)
- voter_interactions (engagement metrics)
- real_time_polling (polling data)

## Technical Details

- **Language**: TypeScript
- **Execution**: tsx (TypeScript executor)
- **Database**: PostgreSQL via Drizzle ORM
- **Connection**: Uses existing db connection from server/db.ts
- **Tables Modified**: candidate_profiles, candidate_positions, candidate_data_sources

## Commit Information

- **Commit**: 751c92f
- **Branch**: main
- **Repository**: https://github.com/rblake2320/ElectionsCountDown.git
- **Status**: ✅ Pushed to GitHub

## Support

If you encounter issues:
1. Check Replit console logs
2. Verify DATABASE_URL is set in Replit environment
3. Ensure database tables exist (run `npm run db:push` if needed)
4. Check that candidate IDs (292-295, 300, 302) exist in candidates table
