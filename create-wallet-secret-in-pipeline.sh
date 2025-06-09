#!/bin/bash

echo "🔧 ADDING WALLET SECRET TO CI/CD PIPELINE"
echo "========================================"

# This script should be run as part of your CI/CD deployment
# Add this to your build_spec.yaml or deploy_spec.yaml

echo "Creating wallet secret from repository files..."

# Check if secret exists, delete if it does
kubectl delete secret db-wallet-secret --ignore-not-found=true

# Create the secret with all wallet files
kubectl create secret generic db-wallet-secret \
  --from-file=cwallet.sso=MtdrSpring/backend/wallet/cwallet.sso \
  --from-file=ewallet.p12=MtdrSpring/backend/wallet/ewallet.p12 \
  --from-file=keystore.jks=MtdrSpring/backend/wallet/keystore.jks \
  --from-file=ojdbc.properties=MtdrSpring/backend/wallet/ojdbc.properties \
  --from-file=sqlnet.ora=MtdrSpring/backend/wallet/sqlnet.ora \
  --from-file=tnsnames.ora=MtdrSpring/backend/wallet/tnsnames.ora \
  --from-file=truststore.jks=MtdrSpring/backend/wallet/truststore.jks

echo "✅ Wallet secret created successfully!"

# Verify the secret was created
kubectl get secret db-wallet-secret -o yaml | head -20
