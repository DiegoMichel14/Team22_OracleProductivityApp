#!/bin/bash

# Frontend Visibility Test Script
# This script tests that the frontend is properly visible and accessible

echo "🔍 Testing Frontend Visibility - Oracle Productivity App"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to test URL accessibility
test_url() {
    local url=$1
    local description=$2
    echo -n "Testing $description... "
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
        echo -e "${GREEN}✅ SUCCESS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

# Function to test content presence
test_content() {
    local url=$1
    local expected_content=$2
    local description=$3
    echo -n "Testing $description... "
    
    if curl -s "$url" | grep -q "$expected_content"; then
        echo -e "${GREEN}✅ SUCCESS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

# Get service IP/URL
echo -e "${BLUE}🔍 Finding service endpoint...${NC}"
kubectl get service agile-service -o jsonpath='{.status.loadBalancer.ingress[0].ip}' > /tmp/service_ip 2>/dev/null

if [ -s /tmp/service_ip ]; then
    SERVICE_IP=$(cat /tmp/service_ip)
    BASE_URL="http://$SERVICE_IP"
    echo "Service URL: $BASE_URL"
else
    echo -e "${RED}❌ Could not find service LoadBalancer IP${NC}"
    echo "Please check if the service is deployed:"
    echo "kubectl get service agile-service"
    exit 1
fi

echo ""
echo -e "${BLUE}🧪 Running Frontend Tests...${NC}"

# Test 1: Root path accessibility
test_url "$BASE_URL/" "Root path accessibility"

# Test 2: Frontend content presence
test_content "$BASE_URL/" "MY TODO LIST" "Main app title presence"

# Test 3: React app loading
test_content "$BASE_URL/" "<div id=\"root\">" "React app container"

# Test 4: JavaScript bundle loading
test_content "$BASE_URL/" "main.*\.js" "JavaScript bundle reference"

# Test 5: API endpoints (should return data, not 500)
echo ""
echo -e "${BLUE}🔗 Testing API Endpoints...${NC}"
test_url "$BASE_URL/health" "Health endpoint"
test_url "$BASE_URL/status" "Status endpoint"
test_url "$BASE_URL/developers" "Developers API"

# Test 6: Static resources
echo ""
echo -e "${BLUE}📁 Testing Static Resources...${NC}"
test_url "$BASE_URL/static/css/main.8582a22a.css" "CSS stylesheet"
test_url "$BASE_URL/manifest.json" "App manifest"

echo ""
echo -e "${BLUE}📱 Testing Navigation Routes...${NC}"

# Since these are client-side routes, they should all return the same index.html
test_url "$BASE_URL/developer" "Developer route"
test_url "$BASE_URL/manager" "Manager route"
test_url "$BASE_URL/login" "Login route"

echo ""
echo "=================================================="
echo -e "${GREEN}✅ Frontend Visibility Test Complete!${NC}"
echo ""
echo "🌐 Access your application at: $BASE_URL"
echo ""
echo "Available routes:"
echo "  • $BASE_URL/          - Main Dashboard (Default)"
echo "  • $BASE_URL/developer - Developer View"
echo "  • $BASE_URL/manager   - Manager View"
echo "  • $BASE_URL/login     - Login Page"
echo ""
echo "If all tests passed, your frontend should now be visible!"

# Cleanup
rm -f /tmp/service_ip
