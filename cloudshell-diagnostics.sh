#!/bin/bash
# OCI Cloud Shell Diagnostics Script
# Run this after kubectl is configured

echo "============================================"
echo "TODOLIST APP DEPLOYMENT DIAGNOSTICS"
echo "============================================"

# Step 1: Check Kubernetes connection
echo "🔍 Step 1: Testing kubectl connection..."
kubectl cluster-info

echo ""
echo "🔍 Step 2: Check TodoList app deployment status..."
kubectl get deployments -l app=todolistapp-springboot
kubectl get pods -l app=todolistapp-springboot
kubectl get services -l app=todolistapp-springboot

echo ""
echo "🔍 Step 3: Check Load Balancer Service Details..."
kubectl describe service todolistapp-springboot-service || echo "Service not found"

echo ""
echo "🔍 Step 4: Check Load Balancers in OCI..."
echo "Finding load balancers..."
COMPARTMENT_ID=$(oci iam compartment list --query "data[?contains(name, 'root')] | [0].id" --raw-output)
oci lb load-balancer list --compartment-id $COMPARTMENT_ID --query "data[].{Name:displayName,IP:ipAddresses[0].ipAddress,Status:lifecycleState}" --output table

echo ""
echo "🔍 Step 5: Test connectivity from Cloud Shell..."
echo "Testing direct IP (220.158.67.237):"
curl -I http://220.158.67.237 || echo "Direct IP not accessible from Cloud Shell"

echo "Testing load balancer IP (159.54.140.95):"
curl -I http://159.54.140.95 || echo "Load balancer IP not accessible from Cloud Shell"

echo ""
echo "🔍 Step 6: Check Build and Deploy Pipeline Status..."
echo "Recent build runs:"
oci devops build-run list --build-pipeline-id $(oci devops build-pipeline list --compartment-id $COMPARTMENT_ID --query "data[0].id" --raw-output) --limit 5 --query "data[].{Status:lifecycleState,TimeCreated:timeCreated}" --output table || echo "No build pipeline found"

echo ""
echo "============================================"
echo "DIAGNOSTIC COMPLETE"
echo "============================================"
