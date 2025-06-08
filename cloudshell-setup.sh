#!/bin/bash
# OCI Cloud Shell Setup Script
# Run this first in Cloud Shell

echo "============================================"
echo "OCI CLOUD SHELL SETUP FOR TODOLIST PROJECT"
echo "============================================"

# Step 1: Set region based on your registry
export OCI_CLI_REGION="mx-queretaro-1"
echo "✅ Set region to: $OCI_CLI_REGION"

# Step 2: Get your compartment ID (root compartment)
export COMPARTMENT_ID=$(oci iam compartment list --query "data[?contains(name, 'root')] | [0].id" --raw-output)
echo "✅ Compartment ID: $COMPARTMENT_ID"

# Step 3: Find your OKE cluster
echo ""
echo "🔍 Finding OKE clusters..."
oci ce cluster list --compartment-id $COMPARTMENT_ID --query "data[].{Name:name,Status:lifecycleState,ID:id}" --output table

# Step 4: Get cluster details and set up kubectl
echo ""
echo "📝 To configure kubectl, you'll need to run:"
echo "oci ce cluster create-kubeconfig --cluster-id <YOUR_CLUSTER_ID> --file ~/.kube/config --region $OCI_CLI_REGION --token-version 2.0.0"
echo ""
echo "Replace <YOUR_CLUSTER_ID> with the actual cluster ID from the list above"

echo ""
echo "============================================"
echo "NEXT: Copy the cluster ID and run the setup"
echo "============================================"
