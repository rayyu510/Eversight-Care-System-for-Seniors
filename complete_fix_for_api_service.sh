# COMPLETE FIX FOR API SERVICE
# The corrupted code is still in lines 778-782

echo "🔧 Fixing api.service.ts completely..."

# First, let's see what's around those lines
echo "Current problematic lines:"
sed -n '775,785p' src/core-foundation/services/api.service.ts

echo ""
echo "The issue is that lines 778-782 contain corrupted code that should be removed."
echo "These lines are remnants of the mixed-up code:"
echo "778:       type: eventType,"
echo "779:         source: options?.source || 'unknown',"
echo "780:           target: options?.target,"
echo "782:             timestamp: new Date(), ');"

# Create a script to fix this
cat > fix_api_service.sh << 'EOF'
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

EOF

chmod +x fix_api_service.sh

# Alternative manual fix approach
echo ""
echo "🎯 MANUAL FIX APPROACH:"
echo "========================"
echo ""
echo "1. Open the file:"
echo "   nano src/core-foundation/services/api.service.ts"
echo ""
echo "2. Go to lines 778-782 and DELETE these exact lines:"
echo "   778:       type: eventType,"
echo "   779:         source: options?.source || 'unknown',"
echo "   780:           target: options?.target,"
echo "   781:             payload,"
echo "   782:             timestamp: new Date(), ');"
echo ""
echo "3. Also look for and remove any other similar corrupted lines"
echo ""
echo "4. Make sure the escapeRegExp function ends properly with just:"
echo "   }"
echo ""
echo "5. Save and test with: npx tsc --noEmit"

# Quick one-liner fix
echo ""
echo "🚀 QUICK ONE-LINER FIX:"
echo "======================="
echo ""
echo "Run this command to remove the corrupted lines:"
echo ""
echo "sed -i.backup '778,782d' src/core-foundation/services/api.service.ts"
echo ""
echo "Then test with:"
echo "npx tsc --noEmit"

# Show what the file should look like around that area
echo ""
echo "📋 WHAT THE FILE SHOULD LOOK LIKE:"
echo "=================================="
echo ""
echo "Around line 775-780, you should have something like:"
echo ""
cat << 'EXAMPLE'
  /**
   * Escape string for regex
   */
  private escapeRegExp(string: string): string {
    return string.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
  }
}
EXAMPLE

echo ""
echo "NOT corrupted lines with 'type: eventType' etc."