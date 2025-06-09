#!/bin/bash

echo "🔍 KUBERNETES WALLET SECRET DIAGNOSTIC"
echo "====================================="

echo "1. Checking if db-wallet-secret exists..."
kubectl get secrets | grep db-wallet || echo "❌ db-wallet-secret not found"

echo ""
echo "2. If secret exists, checking its contents..."
kubectl describe secret db-wallet-secret 2>/dev/null || echo "❌ Secret doesn't exist or can't be accessed"

echo ""
echo "3. Checking if wallet files are mounted in running pods..."
POD=$(kubectl get pods -l app=agile-app -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
if [ ! -z "$POD" ]; then
    echo "Checking pod: $POD"
    kubectl exec $POD -- ls -la /tmp/wallet/ 2>/dev/null || echo "❌ /tmp/wallet directory not found or empty in pod"
else
    echo "❌ No running pods found"
fi

echo ""
echo "4. Checking deployment volume mounts..."
kubectl get deployment agile-deployment -o yaml | grep -A 10 -B 5 "volumeMounts\|volumes" || echo "❌ Deployment not found"

echo ""
echo "🎯 DIAGNOSIS COMPLETE"
echo "If you see errors above, the wallet secret is missing or incorrectly mounted."
