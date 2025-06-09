#!/bin/bash

echo "🔍 MONITORING AUTOMATED WALLET SECRET PIPELINE"
echo "=============================================="

# This script helps monitor the CI/CD pipeline to ensure the 
# automated wallet secret creation is working correctly

echo ""
echo "📊 Pipeline Monitoring Guide:"
echo "----------------------------"

echo ""
echo "1. 🔗 Check CI/CD Pipeline Status:"
echo "   - Go to your OCI DevOps dashboard"
echo "   - Look for the latest build/deployment triggered by commit: 1b1373d"
echo "   - Monitor the build and deployment stages"

echo ""
echo "2. 🔍 Key Log Messages to Look For:"
echo ""
echo "   In the BUILD stage:"
echo "   ✅ 'Build completed successfully'"
echo "   ✅ 'Container image pushed'"
echo ""
echo "   In the DEPLOY stage - 'Create Database Wallet Secret' step:"
echo "   ✅ '🔧 Creating database wallet secret for Oracle connectivity...'"
echo "   ✅ '✅ All required wallet files found'"
echo "   ✅ '✅ Database wallet secret created successfully!'"
echo "   ✅ '🎯 Wallet secret is ready for use by the application'"
echo ""
echo "   In the DEPLOY stage - 'Deploy to OKE' step:"
echo "   ✅ 'Deployment applied successfully'"
echo "   ✅ 'Successfully deployed version: [image-name]'"
echo ""
echo "   In the DEPLOY stage - 'Verify deployment' step:"
echo "   ✅ 'Load Balancer External IP: [IP]'"
echo "   ✅ '✅ Application /status endpoint is responding (HTTP 200)'"
echo "   ✅ '✅ Database connectivity test passed (HTTP 200/302)'"
echo "   ✅ '🎉 Deployment successful with working database connection!'"

echo ""
echo "3. ❌ Error Messages to Watch For:"
echo ""
echo "   Wallet-related errors:"
echo "   ❌ '❌ ERROR: Wallet directory not found'"
echo "   ❌ '❌ ERROR: Missing required wallet files'"
echo "   ❌ '❌ ERROR: Failed to create database wallet secret'"
echo ""
echo "   Application errors:"
echo "   ❌ 'Deployment failed!'"
echo "   ❌ '⚠️ Database connectivity test failed'"

echo ""
echo "4. 🧪 Manual Testing After Deployment:"

# Check if we can get the current external IP
echo ""
echo "   Once deployment completes, test the application:"

cat << 'EOF'
   
   # Get the external IP
   kubectl get svc agile-service -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
   
   # Test application health
   curl http://[EXTERNAL_IP]/status
   
   # Test database connectivity (login endpoint)
   curl -v -X POST \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "telefono=3121539670&contrasena=contrasenaSegura1" \
     http://[EXTERNAL_IP]/login
   
   # Expected results:
   # - /status should return HTTP 200 with JSON
   # - /login should return HTTP 200 or 302 (NOT 500!)

EOF

echo ""
echo "5. 🔧 Troubleshooting Commands:"

cat << 'EOF'

   # Check wallet secret exists
   kubectl get secret db-wallet-secret -o yaml
   
   # Verify wallet files in pods
   kubectl get pods -l app=agile-app
   kubectl exec -it [POD_NAME] -- ls -la /tmp/wallet/
   
   # Check pod logs for errors
   kubectl logs -l app=agile-app --tail=50
   
   # Check deployment status
   kubectl get deployment agile-deployment
   kubectl describe deployment agile-deployment

EOF

echo ""
echo "6. 📈 Success Criteria:"
echo "   ✅ Pipeline completes without errors"
echo "   ✅ Wallet secret created automatically"
echo "   ✅ Application pods start successfully"
echo "   ✅ Database endpoints return HTTP 200/302 (not 500)"
echo "   ✅ Login functionality works correctly"

echo ""
echo "🕐 Estimated Pipeline Time: 5-10 minutes"
echo ""
echo "💡 Tip: If you see any wallet-related errors, the pipeline will"
echo "   fail fast and provide clear error messages. This prevents"
echo "   deploying a broken application."

echo ""
echo "📚 For complete documentation, see: WALLET_SECRET_AUTOMATION.md"

# Optional: Auto-check current status if kubectl is available
if command -v kubectl &> /dev/null; then
    echo ""
    echo "🔍 Current Cluster Status (if available):"
    echo "----------------------------------------"
    
    # Check if we can connect to cluster
    if kubectl cluster-info &> /dev/null; then
        echo "✅ Connected to Kubernetes cluster"
        
        # Check current deployment status
        DEPLOYMENT_STATUS=$(kubectl get deployment agile-deployment -o jsonpath='{.status.readyReplicas}' 2>/dev/null || echo "0")
        TOTAL_REPLICAS=$(kubectl get deployment agile-deployment -o jsonpath='{.spec.replicas}' 2>/dev/null || echo "0")
        
        if [ "$DEPLOYMENT_STATUS" = "$TOTAL_REPLICAS" ] && [ "$TOTAL_REPLICAS" != "0" ]; then
            echo "✅ Current deployment: $DEPLOYMENT_STATUS/$TOTAL_REPLICAS pods ready"
        else
            echo "🔄 Current deployment: $DEPLOYMENT_STATUS/$TOTAL_REPLICAS pods ready (updating...)"
        fi
        
        # Check wallet secret
        if kubectl get secret db-wallet-secret &> /dev/null; then
            echo "✅ Wallet secret exists"
        else
            echo "❌ Wallet secret not found (will be created by pipeline)"
        fi
        
    else
        echo "⚠️  Not connected to Kubernetes cluster"
        echo "   (Normal if monitoring from local machine)"
    fi
else
    echo ""
    echo "ℹ️  kubectl not available - monitoring from pipeline logs only"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Monitor your CI/CD pipeline dashboard"
echo "2. Wait for the 'Create Database Wallet Secret' step to complete"
echo "3. Verify successful deployment"
echo "4. Test the application at the load balancer IP"
echo "5. Confirm no more HTTP 500 login errors!"
