# Oracle Wallet Configuration Guide

This document explains how Oracle wallet files are configured in our application across different environments.

## Background

Our application connects to an Oracle Database using wallet files for secure connectivity. The wallet files need to be properly configured and accessible to the application regardless of the deployment environment (local development, Docker container, or Kubernetes pod).

## Wallet Locations

We maintain wallet files in two locations to ensure compatibility across all environments:

1. `/tmp/wallet` - Used by the application in local development and in Docker containers
2. `/mtdrworkshop/creds` - Used in the Kubernetes deployment

## How It Works

### Docker Environment

In our Dockerfile:

1. We create both directory paths:
   ```dockerfile
   RUN mkdir -p /tmp/wallet && \
       mkdir -p /mtdrworkshop/creds
   ```

2. We copy wallet files to both locations:
   ```dockerfile
   COPY wallet/ /tmp/wallet/
   COPY wallet/ /mtdrworkshop/creds/
   ```

3. We set proper permissions:
   ```dockerfile
   RUN chmod -R 755 /tmp/wallet/ && \
       chmod -R 755 /mtdrworkshop/creds/
   ```

4. We verify that wallet files are readable:
   ```dockerfile
   RUN test -r /tmp/wallet/tnsnames.ora || (echo "ERROR: tnsnames.ora not readable!" && exit 1)
   ```

5. We set environment variables to make Oracle JDBC driver recognize both wallet locations:
   ```dockerfile
   ENV TNS_ADMIN=/tmp/wallet
   ENV WALLET_LOCATION=/mtdrworkshop/creds
   ENV WALLET_LOCATION_ALT=/tmp/wallet
   ```

6. We add Java system properties for wallet locations at startup:
   ```
   -Doracle.net.tns_admin=/tmp/wallet -Doracle.net.wallet_location=/mtdrworkshop/creds
   ```

### Kubernetes Environment

In our Kubernetes deployment (todolistapp-springboot.yaml):

1. We mount wallet files as a Kubernetes Secret:
   ```yaml
   volumes:
     - name: creds
       secret:
         secretName: db-wallet-secret
   ```

2. We mount the secret at `/mtdrworkshop/creds`:
   ```yaml
   volumeMounts:
     - name: creds
       mountPath: /mtdrworkshop/creds
   ```

3. We set the database URL in environment variables:
   ```yaml
   env:
     - name: db_url
       value: "jdbc:oracle:thin:@%TODO_PDB_NAME%_tp?TNS_ADMIN=/mtdrworkshop/creds"
   ```

## Verification Tools

### Health Check Endpoints

We provide health check endpoints to verify wallet configuration and database connectivity:

- `GET /health/wallet` - Checks if wallet files exist and are readable
- `GET /health/db` - Verifies database connectivity

### Validation Scripts

We also provide two scripts for validating wallet configuration:

1. `validate-wallet.sh` - Validates wallet files in a Docker container
2. `setup-wallet-cloudshell.sh` - Sets up wallet files for local development in Oracle Cloud Shell

## Common Issues and Troubleshooting

### ORA-12154: TNS:could not resolve the connect identifier specified

This error usually indicates the wallet files are not accessible or properly configured.

**Solution:**
1. Check if wallet files exist in both locations:
   ```bash
   ls -la /tmp/wallet/
   ls -la /mtdrworkshop/creds/
   ```

2. Verify that `tnsnames.ora` contains the correct connection identifiers:
   ```bash
   cat /tmp/wallet/tnsnames.ora | grep -i reacttodoia9ge
   ```

3. Ensure environment variables are set correctly:
   ```bash
   echo $TNS_ADMIN
   echo $WALLET_LOCATION
   ```

### Connection refused or timeout

This may indicate a network issue or incorrect connection parameters.

**Solution:**
1. Verify that wallet files are configured correctly
2. Check that the database service is running
3. Validate network connectivity between the application and database

## Maintenance Guidelines

When updating wallet files:

1. Replace all files in the `/MtdrSpring/backend/wallet/` directory
2. Rebuild the Docker image to ensure new wallet files are included
3. Update any Kubernetes secrets if deploying to Kubernetes
