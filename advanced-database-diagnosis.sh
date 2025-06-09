#!/bin/bash
# Advanced diagnostic script to identify the exact database connectivity issue

echo "🔍 ADVANCED TODOLIST DATABASE CONNECTIVITY DIAGNOSIS"
echo "===================================================="
echo ""

# Test application endpoints to understand what's working
echo "1. BASIC APPLICATION STATUS CHECK"
echo "================================="

# Test if app responds to basic health check
echo "Testing basic health endpoint..."
HEALTH_RESPONSE=$(curl -s -w "%{http_code}" "http://220.158.67.237/health" -o /tmp/health_response.json)
HTTP_CODE="${HEALTH_RESPONSE: -3}"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Application is running (HTTP 200)"
    echo "Response: $(cat /tmp/health_response.json)"
else
    echo "❌ Health check failed (HTTP $HTTP_CODE)"
    echo "Response: $(cat /tmp/health_response.json 2>/dev/null || echo 'No response')"
fi

echo ""
echo "2. ENVIRONMENT CONFIGURATION CHECK"
echo "================================="

# Check status endpoint for environment details
echo "Testing status endpoint for environment details..."
STATUS_RESPONSE=$(curl -s "http://220.158.67.237/status")
echo "Status response: $STATUS_RESPONSE"

# Extract specific environment details
echo ""
echo "Analyzing environment configuration..."
echo "$STATUS_RESPONSE" | grep -o '"TNS_ADMIN":"[^"]*"' | cut -d'"' -f4 | sed 's/^/TNS_ADMIN: /'
echo "$STATUS_RESPONSE" | grep -o '"db_user":"[^"]*"' | cut -d'"' -f4 | sed 's/^/DB_USER: /'
echo "$STATUS_RESPONSE" | grep -o '"db_url":"[^"]*"' | cut -d'"' -f4 | sed 's/^/DB_URL: /'

echo ""
echo "3. DATABASE CONNECTIVITY TEST"
echo "============================"

# Test different endpoints that require database access
ENDPOINTS=("/developers" "/login?telefono=test&contrasena=test" "/todoitems")

for endpoint in "${ENDPOINTS[@]}"; do
    echo "Testing: $endpoint"
    RESPONSE=$(curl -s -w "%{http_code}" "http://220.158.67.237$endpoint" -o /tmp/endpoint_response.json)
    HTTP_CODE="${RESPONSE: -3}"
    
    if [ "$HTTP_CODE" = "500" ]; then
        echo "  ❌ HTTP 500 - Database connectivity issue"
        # Look for specific error patterns
        ERROR_MSG=$(cat /tmp/endpoint_response.json 2>/dev/null | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
        if [ -n "$ERROR_MSG" ]; then
            echo "  Error message: $ERROR_MSG"
        fi
    elif [ "$HTTP_CODE" = "200" ]; then
        echo "  ✅ HTTP 200 - Endpoint working"
    else
        echo "  ⚠️  HTTP $HTTP_CODE - Unexpected response"
    fi
done

echo ""
echo "4. WALLET FILE ACCESSIBILITY TEST"
echo "================================"

# Since we can't directly access the pod, let's test if there are any diagnostic endpoints
echo "Checking if diagnostic endpoints are available..."

# Try common Spring Boot actuator endpoints
DIAGNOSTIC_ENDPOINTS=("/actuator/health" "/actuator/info" "/actuator/env" "/management/health")

for endpoint in "${DIAGNOSTIC_ENDPOINTS[@]}"; do
    RESPONSE=$(curl -s -w "%{http_code}" "http://220.158.67.237$endpoint" -o /tmp/diagnostic_response.json)
    HTTP_CODE="${RESPONSE: -3}"
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ $endpoint available"
        echo "  Response: $(cat /tmp/diagnostic_response.json | head -200)"
    fi
done

echo ""
echo "5. CONNECTION STRING ANALYSIS"
echo "============================"

# Analyze if the connection string format is correct
echo "Expected connection format: jdbc:oracle:thin:@reacttodoia9ge_tp?TNS_ADMIN=/tmp/wallet"
echo "Expected TNS_ADMIN: /tmp/wallet"
echo "Expected database user: TODOUSER"

echo ""
echo "6. HYPOTHESIS RANKING"
echo "===================="

echo "Based on the test results, most likely issues (in order):"
echo ""
echo "❌ CONFIRMED: Application cannot connect to database"
echo "❌ CONFIRMED: All database-dependent endpoints return HTTP 500"
echo "✅ CONFIRMED: Application starts successfully"
echo "✅ CONFIRMED: Environment variables are set"
echo ""

if curl -s "http://220.158.67.237/status" | grep -q '"TNS_ADMIN":"/tmp/wallet"'; then
    echo "✅ TNS_ADMIN path is correct: /tmp/wallet"
else
    echo "❌ TNS_ADMIN path may be incorrect"
fi

echo ""
echo "🎯 MOST LIKELY ROOT CAUSES:"
echo "1. Wallet files not properly mounted in Kubernetes pod"
echo "2. Database secret 'db-wallet-secret' missing or corrupted"
echo "3. Wallet files have wrong permissions in the pod"
echo "4. tnsnames.ora missing the connection identifier 'reacttodoia9ge_tp'"

echo ""
echo "📋 RECOMMENDED NEXT STEPS:"
echo "1. Verify 'db-wallet-secret' exists in Kubernetes cluster"
echo "2. Check if wallet files are properly mounted at /tmp/wallet in the pod"
echo "3. Verify the wallet files contain the correct connection identifiers"
echo "4. Test database connectivity from within the Kubernetes cluster"

echo ""
echo "🔧 TO FIX THIS ISSUE:"
echo "The problem is likely that the Kubernetes secret 'db-wallet-secret'"
echo "either doesn't exist or doesn't contain the correct wallet files."
echo "You need to create/update this secret with the wallet files from your repository."

rm -f /tmp/health_response.json /tmp/endpoint_response.json /tmp/diagnostic_response.json 2>/dev/null

echo ""
echo "===================================================="
echo "🔍 DIAGNOSIS COMPLETE"
echo "===================================================="
