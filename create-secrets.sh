#!/bin/bash

echo "=== Creating Required Kubernetes Secrets for Default Namespace ==="

# 1. Create the Oracle wallet secret
echo "Creating db-wallet-secret..."
kubectl create secret generic db-wallet-secret \
  --from-file=MtdrSpring/backend/wallet/ \
  -n default

# 2. Create the database user secret
echo "Creating dbuser secret..."
kubectl create secret generic dbuser \
  --from-literal=dbpassword=WELcome__12345 \
  -n default

# 3. Create the frontend admin secret (using same password for simplicity)
echo "Creating frontendadmin secret..."
kubectl create secret generic frontendadmin \
  --from-literal=password=WELcome__12345 \
  -n default

echo "=== Verifying created secrets ==="
kubectl get secrets -n default

echo ""
echo "=== IMPORTANT: Secrets have been created with the provided credentials ==="
echo "Database User: TODOUSER"
echo "Database Password: WELcome__12345"
echo "UI Admin Password: WELcome__12345"
echo ""
echo "If you need to update these passwords later, use:"
echo "kubectl patch secret dbuser -n default -p='{\"data\":{\"dbpassword\":\"$(echo -n 'NEW_PASSWORD' | base64)\"}}'"
echo "kubectl patch secret frontendadmin -n default -p='{\"data\":{\"password\":\"$(echo -n 'NEW_PASSWORD' | base64)\"}}'"
