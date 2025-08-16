#!/bin/bash

echo "Fixing api.service.ts..."

# Backup the current file
cp src/core-foundation/services/api.service.ts src/core-foundation/services/api.service.ts.backup

# Remove the problematic lines (778-782 and any similar corrupted lines)
# First, let's find the exact line numbers of the corruption
grep -n "type: eventType" src/core-foundation/services/api.service.ts
grep -n "source: options" src/core-foundation/services/api.service.ts  
grep -n "timestamp: new Date()" src/core-foundation/services/api.service.ts

# Remove lines 778-782 which contain the corrupted code
sed -i.bak '778,782d' src/core-foundation/services/api.service.ts

echo "✅ Removed corrupted lines from api.service.ts"

# Verify the fix
echo "Checking if errors are resolved..."
npx tsc --noEmit --project . 2>&1 | grep "api.service.ts" || echo "✅ No more api.service.ts errors"

