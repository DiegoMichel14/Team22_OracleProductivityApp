#!/bin/bash

# Validate Wallet Setup in Docker Container
# This script helps validate if the wallet is properly configured in a Docker container

# Usage: ./validate-wallet.sh <container_id_or_name>

CONTAINER_NAME=$1

if [ -z "$CONTAINER_NAME" ]; then
  echo "❌ ERROR: No container name or ID provided"
  echo "Usage: $0 <container_id_or_name>"
  exit 1
fi

echo "🔍 Validating wallet setup in container: $CONTAINER_NAME"

# Check if container exists and is running
if ! docker ps | grep -q "$CONTAINER_NAME"; then
  echo "❌ ERROR: Container $CONTAINER_NAME not found or not running"
  echo "Available containers:"
  docker ps
  exit 1
fi

echo "✅ Container is running"

# Check if wallet directory exists in container
echo "📂 Checking wallet directory..."
if ! docker exec $CONTAINER_NAME ls -la /tmp/wallet/ >/dev/null 2>&1; then
  echo "❌ ERROR: /tmp/wallet/ directory not found in container"
  exit 1
fi

echo "✅ Wallet directory exists"

# Check if tnsnames.ora exists and is readable
echo "📄 Checking tnsnames.ora..."
if ! docker exec $CONTAINER_NAME test -r /tmp/wallet/tnsnames.ora; then
  echo "❌ ERROR: tnsnames.ora not found or not readable in container"
  echo "Files in /tmp/wallet/:"
  docker exec $CONTAINER_NAME ls -la /tmp/wallet/
  exit 1
fi

echo "✅ tnsnames.ora exists and is readable"

# Check if the Java application can access the wallet
echo "☕ Checking if Java can access wallet..."
docker exec $CONTAINER_NAME echo $'import java.io.File;\npublic class WalletTest {\n  public static void main(String[] args) {\n    File f = new File("/tmp/wallet/tnsnames.ora");\n    System.out.println("tnsnames.ora exists: " + f.exists());\n    System.out.println("tnsnames.ora can read: " + f.canRead());\n  }\n}' > /tmp/WalletTest.java
docker cp /tmp/WalletTest.java $CONTAINER_NAME:/tmp/
docker exec $CONTAINER_NAME javac /tmp/WalletTest.java
docker exec $CONTAINER_NAME java -cp /tmp WalletTest

echo "✅ Wallet validation complete"

# Check environment variables related to the wallet
echo "🔐 Environment variables related to wallet:"
docker exec $CONTAINER_NAME bash -c "env | grep -i wallet"
docker exec $CONTAINER_NAME bash -c "env | grep -i db_"

echo "📋 Connection details:"
docker exec $CONTAINER_NAME bash -c "cat /tmp/wallet/tnsnames.ora | grep -i reacttodoia9ge"

echo "✅ All checks passed"
