# Core Foundation Integrity Check Guide
# Run these commands step by step to verify your codebase

echo "🔍 Starting Core Foundation Integrity Check..."
echo "=================================================="

# STEP 1: File Structure Verification
echo ""
echo "📁 STEP 1: Checking File Structure"
echo "----------------------------------"

echo "Checking main directories..."
for dir in types constants utils services hooks middleware validators; do
    if [ -d "src/core-foundation/$dir" ]; then
        echo "✅ $dir directory exists"
    else
        echo "❌ $dir directory missing"
    fi
done

echo ""
echo "Checking required files..."

# Check main files
files=(
    "src/core-foundation/index.ts"
    "src/core-foundation/CoreFoundation.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

echo ""
echo "📊 File count summary:"
echo "Types: $(find src/core-foundation/types -name "*.ts" 2>/dev/null | wc -l) files"
echo "Constants: $(find src/core-foundation/constants -name "*.ts" 2>/dev/null | wc -l) files"
echo "Utils: $(find src/core-foundation/utils -name "*.ts" 2>/dev/null | wc -l) files"
echo "Services: $(find src/core-foundation/services -name "*.ts" 2>/dev/null | wc -l) files"
echo "Hooks: $(find src/core-foundation/hooks -name "*.ts" 2>/dev/null | wc -l) files"
echo "Tests: $(find src/core-foundation/__tests__ -name "*.ts" 2>/dev/null | wc -l) files"

# STEP 2: TypeScript Compilation Check
echo ""
echo "🔧 STEP 2: TypeScript Compilation Check"
echo "---------------------------------------"

echo "Checking if TypeScript can compile without errors..."
if npx tsc --noEmit --project . 2>/dev/null; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    echo "Running detailed check..."
    npx tsc --noEmit --project . || true
fi

# STEP 3: Import Resolution Check
echo ""
echo "📦 STEP 3: Import Resolution Check"
echo "----------------------------------"

echo "Testing core-foundation imports..."

# Create temporary test file
cat > temp_import_test.js << 'EOF'
try {
    // Test main imports
    const foundation = require('./src/core-foundation/index.ts');
    
    console.log('✅ Main index.ts imports successfully');
    
    // Check for key exports
    const expectedExports = [
        'DateUtils', 'ValidationUtils', 'Logger', 'EventBusService', 
        'APIService', 'StorageService', 'useAuth', 'usePermissions'
    ];
    
    let missingExports = [];
    expectedExports.forEach(exportName => {
        if (foundation[exportName]) {
            console.log(`✅ ${exportName} exported`);
        } else {
            console.log(`❌ ${exportName} missing`);
            missingExports.push(exportName);
        }
    });
    
    if (missingExports.length === 0) {
        console.log('✅ All critical exports available');
    } else {
        console.log(`❌ Missing exports: ${missingExports.join(', ')}`);
    }
    
} catch (error) {
    console.log('❌ Import test failed:', error.message);
}
EOF

node temp_import_test.js 2>/dev/null || echo "❌ Import resolution test failed"
rm -f temp_import_test.js

# STEP 4: Jest Configuration Check
echo ""
echo "🧪 STEP 4: Jest Configuration Check"
echo "-----------------------------------"

echo "Checking Jest configuration files..."
for config in jest.unit.config.js jest.integration.config.js jest.config.js; do
    if [ -f "$config" ]; then
        echo "✅ $config exists"
        # Check for syntax errors
        if node -c "$config" 2>/dev/null; then
            echo "✅ $config syntax valid"
        else
            echo "❌ $config has syntax errors"
        fi
    else
        echo "❌ $config missing"
    fi
done

echo ""
echo "Checking test setup file..."
if [ -f "src/test-setup.ts" ]; then
    echo "✅ test-setup.ts exists"
else
    echo "❌ test-setup.ts missing"
fi

# STEP 5: Dependency Check
echo ""
echo "📋 STEP 5: Dependency Check"
echo "---------------------------"

echo "Checking package.json dependencies..."

# Check if package.json exists
if [ -f "package.json" ]; then
    echo "✅ package.json exists"
    
    # Check for required dependencies
    dependencies=(
        "react" "date-fns" "@testing-library/jest-dom" 
        "@testing-library/react" "jest" "ts-jest"
    )
    
    for dep in "${dependencies[@]}"; do
        if npm list "$dep" &>/dev/null; then
            echo "✅ $dep installed"
        else
            echo "❌ $dep missing"
        fi
    done
else
    echo "❌ package.json missing"
fi

# STEP 6: Test Execution Check
echo ""
echo "🎯 STEP 6: Test Execution Check"
echo "-------------------------------"

echo "Running Jest tests..."
if npm test &>/dev/null; then
    echo "✅ All tests passing"
else
    echo "❌ Some tests failing"
    echo "Running detailed test output..."
    npm test 2>&1 | head -20
fi

# STEP 7: Code Quality Check
echo ""
echo "📊 STEP 7: Code Quality Check"
echo "-----------------------------"

echo "Checking for common issues..."

# Check for console.log statements (should be minimal in production)
console_logs=$(grep -r "console\.log" src/core-foundation/ 2>/dev/null | wc -l)
echo "Console.log statements: $console_logs (should be minimal)"

# Check for TODO/FIXME comments
todos=$(grep -r "TODO\|FIXME" src/core-foundation/ 2>/dev/null | wc -l)
echo "TODO/FIXME comments: $todos"

# Check for any .js files (should be .ts/.tsx)
js_files=$(find src/core-foundation -name "*.js" 2>/dev/null | wc -l)
if [ "$js_files" -eq 0 ]; then
    echo "✅ No .js files found (all TypeScript)"
else
    echo "⚠️  Found $js_files .js files (should be .ts/.tsx)"
fi

# STEP 8: Module Size Check
echo ""
echo "📏 STEP 8: Module Size Check"
echo "----------------------------"

total_lines=$(find src/core-foundation -name "*.ts" -o -name "*.tsx" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}')
echo "Total lines of code: $total_lines"

if [ "$total_lines" -lt 15000 ]; then
    echo "✅ Within 15k line limit"
else
    echo "⚠️  Exceeds 15k line limit"
fi

# Breakdown by directory
echo ""
echo "Lines by directory:"
for dir in types constants utils services hooks middleware validators; do
    if [ -d "src/core-foundation/$dir" ]; then
        lines=$(find "src/core-foundation/$dir" -name "*.ts" -o -name "*.tsx" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' 2>/dev/null || echo "0")
        echo "  $dir: $lines lines"
    fi
done

# STEP 9: Security Check
echo ""
echo "🔒 STEP 9: Security Check"
echo "-------------------------"

echo "Checking for potential security issues..."

# Check for hardcoded passwords/secrets
secrets=$(grep -ri "password\|secret\|key.*=" src/core-foundation/ 2>/dev/null | grep -v "\.test\." | wc -l)
if [ "$secrets" -eq 0 ]; then
    echo "✅ No obvious hardcoded secrets"
else
    echo "⚠️  Found $secrets potential hardcoded secrets (review needed)"
fi

# Check for eval usage
evals=$(grep -r "eval\(" src/core-foundation/ 2>/dev/null | wc -l)
if [ "$evals" -eq 0 ]; then
    echo "✅ No eval() usage"
else
    echo "⚠️  Found $evals eval() usage (security risk)"
fi

# STEP 10: Performance Check
echo ""
echo "⚡ STEP 10: Performance Check"
echo "----------------------------"

echo "Checking for potential performance issues..."

# Check for large files
large_files=$(find src/core-foundation -name "*.ts" -o -name "*.tsx" | xargs wc -l | awk '$1 > 500 {print $2 " (" $1 " lines)"}')
if [ -z "$large_files" ]; then
    echo "✅ No excessively large files (>500 lines)"
else
    echo "⚠️  Large files found:"
    echo "$large_files"
fi

# Check for potential memory leaks (setTimeout/setInterval without clear)
timeouts=$(grep -r "setTimeout\|setInterval" src/core-foundation/ 2>/dev/null | wc -l)
clears=$(grep -r "clearTimeout\|clearInterval" src/core-foundation/ 2>/dev/null | wc -l)
echo "Timers created: $timeouts, Timers cleared: $clears"

# FINAL SUMMARY
echo ""
echo "🎉 INTEGRITY CHECK COMPLETE"
echo "==========================="

echo ""
echo "📋 Summary Checklist:"
echo "□ File structure complete"
echo "□ TypeScript compilation successful"
echo "□ Import resolution working"
echo "□ Jest configuration valid"
echo "□ Dependencies installed"
echo "□ Tests passing"
echo "□ Code quality acceptable"
echo "□ Module size within limits"
echo "□ No security issues"
echo "□ Performance looks good"

echo ""
echo "Next steps:"
echo "1. Review any ❌ or ⚠️  items above"
echo "2. Fix critical issues before proceeding"
echo "3. Run: npm test -- --coverage for detailed test coverage"
echo "4. Ready to build Guardian Protect module!"

# Generate detailed report
echo ""
echo "📄 Generating detailed report..."
echo "================================"

cat > integrity-check-report.md << EOF
# Core Foundation Integrity Check Report
Generated: $(date)

## File Structure
- Total TypeScript files: $(find src/core-foundation -name "*.ts" -o -name "*.tsx" | wc -l)
- Total lines of code: $total_lines
- Test files: $(find src/core-foundation -name "*.test.ts" -o -name "*.spec.ts" | wc -l)

## Dependencies Status
$(npm list --depth=0 2>/dev/null | grep -E "(react|date-fns|jest|typescript)" || echo "Run 'npm list' to see dependencies")

## Test Results
$(npm test 2>&1 | tail -5 || echo "Run 'npm test' for test results")

## Issues Found
- Console.log statements: $console_logs
- TODO/FIXME comments: $todos
- JavaScript files: $js_files (should be 0)

## Recommendations
1. Keep total lines under 15,000 for this module
2. Maintain test coverage above 80%
3. Address any failing tests before proceeding
4. Review and minimize console.log usage
EOF

echo "✅ Report saved to: integrity-check-report.md"