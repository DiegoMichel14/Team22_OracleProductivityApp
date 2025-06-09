#!/bin/bash

echo "🚀 TESTING AUTOMATED WALLET SECRET PIPELINE FIX"
echo "=============================================="

# This script tests the new automated wallet secret creation
# integrated into the CI/CD pipeline

echo ""
echo "📋 Pre-deployment Checklist:"
echo "----------------------------"

# Check if wallet files exist
WALLET_DIR="MtdrSpring/backend/wallet"
REQUIRED_FILES=("cwallet.sso" "ewallet.p12" "keystore.jks" "ojdbc.properties" "sqlnet.ora" "tnsnames.ora" "truststore.jks")
MISSING_FILES=()

echo "🔍 Checking wallet files in $WALLET_DIR..."

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$WALLET_DIR/$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (MISSING)"
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo ""
    echo "❌ ERROR: Missing required wallet files!"
    echo "The automated pipeline will fail without these files."
    echo "Missing files: ${MISSING_FILES[*]}"
    exit 1
fi

echo ""
echo "✅ All wallet files present - pipeline should succeed!"

# Check if deploy_spec.yaml has the new step
echo ""
echo "🔍 Checking if deploy_spec.yaml includes wallet automation..."

if grep -q "Create Database Wallet Secret" deploy_spec.yaml; then
    echo "✅ Found wallet automation step in deploy_spec.yaml"
else
    echo "❌ Wallet automation step not found in deploy_spec.yaml"
    echo "Please ensure the 'Create Database Wallet Secret' step is added"
    exit 1
fi

# Check if complete-deployment.yaml uses proper secret references
echo ""
echo "🔍 Checking if complete-deployment.yaml uses proper secret references..."

if grep -q "secretKeyRef:" complete-deployment.yaml; then
    echo "✅ Found proper secret references in complete-deployment.yaml"
else
    echo "⚠️  Warning: No secret references found - may be using hardcoded values"
fi

echo ""
echo "🚀 Ready to Test Automated Pipeline!"
echo "==================================="
echo ""
echo "To test the fix:"
echo "1. Commit and push your changes to trigger the CI/CD pipeline"
echo "2. Monitor the pipeline logs for these key messages:"
echo "   - '🔧 Creating database wallet secret for Oracle connectivity...'"
echo "   - '✅ Database wallet secret created successfully!'"
echo "   - '🎉 Deployment successful with working database connection!'"
echo ""
echo "3. After deployment, test the application:"
echo "   - Check health: curl http://[EXTERNAL_IP]/status"
echo "   - Test login: curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' \\"
echo "                      -d 'telefono=3121539670&contrasena=contrasenaSegura1' \\"
echo "                      http://[EXTERNAL_IP]/login"
echo ""
echo "Expected results:"
echo "✅ No HTTP 500 errors on database endpoints"
echo "✅ Login returns HTTP 200 or 302 (redirect)"
echo "✅ Application fully functional"
echo ""

# Optional: Trigger the pipeline if in CI/CD context
if [ "$1" = "deploy" ]; then
    echo "🚀 Triggering deployment..."
    
    # Add a commit to trigger the pipeline
    git add -A
    git commit -m "Apply automated wallet secret pipeline fix

- Added wallet secret creation to CI/CD pipeline
- Restored proper secret references in deployment
- Added comprehensive deployment validation
- This should resolve HTTP 500 login errors permanently"
    
    git push origin main
    
    echo ""
    echo "✅ Changes pushed! Monitor your CI/CD pipeline for results."
    echo "The automated wallet secret creation should prevent HTTP 500 errors."
fi

echo ""
echo "📚 For more details, see: WALLET_SECRET_AUTOMATION.md"
