#!/bin/bash

echo "======================================"
echo "OCI CONNECTIVITY DIAGNOSTIC SCRIPT"
echo "======================================"
echo "Date: $(date)"
echo ""

# Test basic connectivity to both IPs
echo "🔍 Testing Load Balancer IP Connectivity..."
echo "Load Balancer IP: 159.54.140.95"
echo "Testing HTTP (port 80):"
timeout 10 curl -I http://159.54.140.95 2>&1 || echo "❌ HTTP connection failed"
echo ""
echo "Testing HTTPS (port 443):"
timeout 10 curl -I https://159.54.140.95 2>&1 || echo "❌ HTTPS connection failed"
echo ""
echo "Testing ping:"
timeout 5 ping -c 3 159.54.140.95 || echo "❌ Ping failed"
echo ""

echo "🔍 Testing Direct IP Connectivity..."
echo "Direct IP: 220.158.67.237"
echo "Testing HTTP (port 80):"
timeout 10 curl -I http://220.158.67.237 2>&1 || echo "❌ HTTP connection failed"
echo ""
echo "Testing custom port 8080:"
timeout 10 curl -I http://220.158.67.237:8080 2>&1 || echo "❌ Port 8080 connection failed"
echo ""
echo "Testing ping:"
timeout 5 ping -c 3 220.158.67.237 || echo "❌ Ping failed"
echo ""

# Check if kubectl is available locally
echo "🔍 Checking Kubernetes Configuration..."
if command -v kubectl >/dev/null 2>&1; then
    echo "kubectl found - checking cluster access:"
    kubectl cluster-info 2>&1 || echo "❌ No cluster access from local environment"
    echo ""
    echo "Checking if todolistapp-springboot service exists:"
    kubectl get svc todolistapp-springboot -n default 2>&1 || echo "❌ Service not found or no cluster access"
    echo ""
    echo "Checking pods:"
    kubectl get pods -l app=todolistapp-springboot 2>&1 || echo "❌ Pods not found or no cluster access"
else
    echo "❌ kubectl not found in local environment"
fi
echo ""

# Check OCI region from build spec
echo "🔍 OCI Configuration from build_spec.yaml:"
echo "Registry: mx-queretaro-1.ocir.io"
echo "Namespace: axvteqzybmr1" 
echo "This suggests Mexico (Queretaro) region"
echo ""

# Check network tools availability
echo "🔍 Available Network Diagnostic Tools:"
command -v nmap >/dev/null && echo "✅ nmap available" || echo "❌ nmap not available"
command -v telnet >/dev/null && echo "✅ telnet available" || echo "❌ telnet not available"
command -v nc >/dev/null && echo "✅ netcat available" || echo "❌ netcat not available"
command -v nslookup >/dev/null && echo "✅ nslookup available" || echo "❌ nslookup not available"
echo ""

echo "======================================"
echo "NEXT STEPS:"
echo "1. If all connections fail, the issue is likely OCI network configuration"
echo "2. Run this same diagnostic from OCI Cloud Shell for internal perspective"
echo "3. Check OCI Console for Security Lists and Load Balancer configuration"
echo "======================================"
