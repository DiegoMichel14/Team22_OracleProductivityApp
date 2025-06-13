#!/bin/bash

echo "=== Creating Required Kubernetes Secrets for Team22 (Default Namespace) ==="

# 1. Create the Oracle wallet secret with team22 prefix
echo "Creating team22-db-wallet-secret..."
kubectl create secret generic team22-db-wallet-secret \
  --from-file=MtdrSpring/backend/wallet/ \
  -n default

# 2. Create the database user secret with team22 prefix
echo "Creating team22-dbuser secret..."
kubectl create secret generic team22-dbuser \
  --from-literal=dbpassword=WELcome__12345 \
  -n default

# 3. Create the frontend admin secret with team22 prefix
echo "Creating team22-frontendadmin secret..."
kubectl create secret generic team22-frontendadmin \
  --from-literal=password=WELcome__12345 \
  -n default

echo "=== Verifying created secrets ==="
kubectl get secrets -n default | grep team22

echo ""
echo "=== Team22 Secrets Created Successfully ==="
echo "✅ team22-db-wallet-secret (Oracle wallet files)"
echo "✅ team22-dbuser (Database password)"  
echo "✅ team22-frontendadmin (UI admin password)"
echo ""
echo "Database User: TODOUSER"
echo "Database Password: WELcome__12345"
echo "UI Admin Password: WELcome__12345"
echo ""
echo "🎯 These secrets are uniquely named and won't conflict with other deployments!"
echo "If you need to update these passwords later, use:"
echo "kubectl patch secret dbuser -n default -p='{\"data\":{\"dbpassword\":\"$(echo -n 'NEW_PASSWORD' | base64)\"}}'"
echo "kubectl patch secret frontendadmin -n default -p='{\"data\":{\"password\":\"$(echo -n 'NEW_PASSWORD' | base64)\"}}'"
