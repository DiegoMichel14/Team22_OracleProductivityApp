#!/bin/bash

# Script to set up Oracle wallet files in OCI Cloud Shell
# This script fixes the "ORA-12154: TNS:could not resolve the connect identifier specified" error

echo "Setting up Oracle wallet files in Cloud Shell..."

# Create the wallet directory in /tmp
mkdir -p /tmp/wallet

# Copy the wallet files from the repository
echo "Copying wallet files from repository to /tmp/wallet..."
cp -v ./MtdrSpring/backend/wallet/* /tmp/wallet/

# Set correct permissions
echo "Setting permissions on wallet files..."
chmod -R 755 /tmp/wallet/

# Verify the wallet files exist
echo "Verifying wallet files..."
ls -la /tmp/wallet/

# Check for tnsnames.ora
if [ -f "/tmp/wallet/tnsnames.ora" ]; then
    echo "Found tnsnames.ora:"
    echo "Available connection identifiers:"
    grep -i "reacttodoia9ge" /tmp/wallet/tnsnames.ora | cut -d "=" -f 1
    echo ""
    echo "You can now connect to the database using:"
    echo "sqlplus TODOUSER/WELcome__12345@reacttodoia9ge_tp"
else
    echo "WARNING: tnsnames.ora not found!"
fi

# Set the TNS_ADMIN environment variable
export TNS_ADMIN=/tmp/wallet
echo "Set TNS_ADMIN environment variable to /tmp/wallet"
echo "You can verify with: echo \$TNS_ADMIN"

echo "Wallet setup complete!"
