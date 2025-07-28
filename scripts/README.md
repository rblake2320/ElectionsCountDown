# Scripts Directory

This directory contains utility scripts for database management, testing, and data synchronization.

## Database Scripts

- `bulk_insert_all_elections.js` - Bulk insert election data
- `bulk_restore_congress.js` - Restore congressional data
- `restore_congress_members.js` - Restore congress member data
- `reset_election_database.js` - Reset election database to clean state
- `analyze_missing_members.js` - Analyze missing congress members
- `missing-election-discovery.js` - Discover missing election data

## Data Population Scripts

- `populate-candidate-data.js` - Populate candidate information
- `load_june_elections.js` - Load June election data
- `2026_midterm_integration.js` - 2026 midterm election integration

## Testing Scripts

- `comprehensive-test-suite.js` - Full application test suite
- `test-all-systems.js` - System-wide integration tests
- `election-night-load-test.js` - Load testing for election night
- `comprehensive-election-audit.js` - Election data audit
- `real-time-election-audit.js` - Real-time election monitoring

## Usage

Run these scripts from the project root directory:

```bash
node scripts/[script-name].js
```

**Note:** Most scripts require database configuration and API keys to be set in environment variables.
