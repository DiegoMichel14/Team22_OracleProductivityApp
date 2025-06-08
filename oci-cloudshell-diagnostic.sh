#!/bin/bash
# RUN THIS SCRIPT IN OCI CLOUD SHELL

echo "============================================"
echo "OCI CLOUD SHELL DIAGNOSTIC & FIX SCRIPT"
echo "============================================"

# Set your region (based on your registry)
export OCI_CLI_REGION="mx-queretaro-1"

echo "🔍 Step 1: Check OKE Cluster Status"
echo "Finding OKE clusters..."
oci ce cluster list --compartment-id $(oci iam compartment list --query "data[?contains(name, 'root')] | [0].id" --raw-output)

echo ""
echo "🔍 Step 2: Check Load Balancers"
echo "Finding load balancers..."
oci lb load-balancer list --compartment-id $(oci iam compartment list --query "data[?contains(name, 'root')] | [0].id" --raw-output)

echo ""
echo "🔍 Step 3: Test from inside OCI network"
echo "Testing direct connection to working IP..."
curl -I http://220.158.67.237 || echo "Direct IP still not accessible from OCI"

echo ""
echo "🔍 Step 4: Check Security Lists"
echo "Note: You'll need to check these manually in the OCI Console:"
echo "1. Go to Networking → Virtual Cloud Networks"
echo "2. Find your VCN → Security Lists"
echo "3. Check Load Balancer subnet security list"
echo "4. Ensure ingress rule exists: Source 0.0.0.0/0, TCP, Port 80"

echo ""
echo "🛠️ Step 5: Kubectl Commands (if cluster is accessible)"
if command -v kubectl >/dev/null 2>&1; then
    echo "Setting up kubectl for OKE..."
    # You'll need to configure kubectl for your specific cluster
    echo "Run: oci ce cluster create-kubeconfig --cluster-id YOUR_CLUSTER_ID --file ~/.kube/config"
    echo ""
    echo "Then check service status:"
    echo "kubectl get svc todolistapp-springboot -o wide"
    echo "kubectl get pods -l app=todolistapp-springboot"
    echo "kubectl describe svc todolistapp-springboot"
fi

echo ""
echo "============================================"
echo "MANUAL CHECKS NEEDED IN OCI CONSOLE:"
echo "============================================"
echo "1. Networking → Load Balancers → Find LB with IP 159.54.140.95"
echo "2. Check Backend Set health status"
echo "3. Check Listener configuration (Port 80)"
echo "4. Check Security Lists for Load Balancer subnet"
echo "5. Verify Route Tables"
echo "============================================"
