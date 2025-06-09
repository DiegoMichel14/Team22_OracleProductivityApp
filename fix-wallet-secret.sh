#!/bin/bash

echo "🔧 FIXING KUBERNETES WALLET SECRET"
echo "=================================="

# Check if the secret exists
echo "1. Checking if db-wallet-secret exists..."
kubectl get secret db-wallet-secret -o yaml || echo "❌ Secret doesn't exist"

echo ""
echo "2. Creating/updating the wallet secret with correct files..."

# Create the secret with the wallet files from your repository
kubectl delete secret db-wallet-secret --ignore-not-found=true

kubectl create secret generic db-wallet-secret \
  --from-file=MtdrSpring/backend/wallet/tnsnames.ora \
  --from-file=MtdrSpring/backend/wallet/sqlnet.ora \
  --from-file=MtdrSpring/backend/wallet/cwallet.sso \
  --from-file=MtdrSpring/backend/wallet/ewallet.p12 \
  --from-file=MtdrSpring/backend/wallet/keystore.jks \
  --from-file=MtdrSpring/backend/wallet/ojdbc.properties \
  --from-file=MtdrSpring/backend/wallet/truststore.jks

echo ""
echo "3. Verifying the secret was created..."
kubectl get secret db-wallet-secret -o yaml

echo ""
echo "4. Restarting the deployment to pick up the new wallet..."
kubectl rollout restart deployment agile-deployment

echo ""
echo "5. Waiting for deployment to complete..."
kubectl rollout status deployment agile-deployment

echo ""
echo "✅ WALLET SECRET FIXED!"
echo "The application should now be able to connect to the database."
echo "Test the login endpoint: curl 'http://220.158.67.237/login?telefono=3121539670&contrasena=contrasenaSegura1'"
