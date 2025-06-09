#!/bin/bash
# Test the exact database connection configuration that Kubernetes should be using

echo "=== Database Connection Test ==="
echo "Testing the exact configuration used in Kubernetes deployment"
echo ""

# Test connection with hardcoded values first (to see if it's a password issue)
echo "1. Testing connection with known working credentials:"
echo "   Database: reacttodoia9ge_tp"
echo "   User: TODOUSER" 
echo "   Password: WELcome__12345"
echo "   TNS_ADMIN: /tmp/wallet"
echo ""

# Set up the environment like Docker would
export TNS_ADMIN=/tmp/wallet
export db_url="jdbc:oracle:thin:@reacttodoia9ge_tp?TNS_ADMIN=/tmp/wallet"
export db_user="TODOUSER"
export dbpassword="WELcome__12345"

echo "Environment variables set:"
echo "TNS_ADMIN: $TNS_ADMIN"
echo "db_url: $db_url"
echo "db_user: $db_user"
echo "dbpassword: [SET]"
echo ""

# Check if wallet files exist locally
echo "2. Checking local wallet files:"
if [ -f "/tmp/wallet/tnsnames.ora" ]; then
    echo "✅ /tmp/wallet/tnsnames.ora exists"
    echo "✅ Connection identifier 'reacttodoia9ge_tp' found:"
    grep -A1 "reacttodoia9ge_tp" /tmp/wallet/tnsnames.ora | head -2
else
    echo "❌ /tmp/wallet/tnsnames.ora not found"
    echo "Setting up wallet..."
    mkdir -p /tmp/wallet
    cp -r MtdrSpring/backend/wallet/* /tmp/wallet/
    chmod -R 755 /tmp/wallet/
    echo "✅ Wallet files copied to /tmp/wallet/"
fi

echo ""
echo "3. Verifying wallet configuration:"
echo "sqlnet.ora content:"
cat /tmp/wallet/sqlnet.ora

echo ""
echo "4. Testing if we can find the connection identifier:"
if grep -q "reacttodoia9ge_tp" /tmp/wallet/tnsnames.ora; then
    echo "✅ reacttodoia9ge_tp found in tnsnames.ora"
else
    echo "❌ reacttodoia9ge_tp NOT found in tnsnames.ora"
    echo "Available connection identifiers:"
    grep "= (description=" /tmp/wallet/tnsnames.ora | cut -d' ' -f1
fi

echo ""
echo "5. Testing actual Oracle connection (if sqlplus available):"
if command -v sqlplus >/dev/null 2>&1; then
    echo "Testing with: sqlplus $db_user/***@reacttodoia9ge_tp"
    echo "exit" | sqlplus -L "$db_user/$dbpassword@reacttodoia9ge_tp" 2>&1 | head -10
else
    echo "sqlplus not available - skipping connection test"
fi

echo ""
echo "=== Summary ==="
echo "This should match the exact configuration used in the Kubernetes pod"
echo "If this works locally but fails in Kubernetes, the issue is likely:"
echo "1. Missing or incorrect 'dbuser' secret in Kubernetes"
echo "2. Missing or incorrect 'db-wallet-secret' in Kubernetes"
echo "3. Different wallet files in the Kubernetes secret vs. repository"
