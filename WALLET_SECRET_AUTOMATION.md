# Database Wallet Secret Automation - Long-term Fix

## Overview

This document describes the automated solution implemented to prevent HTTP 500 login errors caused by missing Oracle wallet secrets in Kubernetes deployments.

## Problem Summary

The application was failing with HTTP 500 errors on all database-dependent endpoints (`/login`, `/developers`) when deployed to Kubernetes, despite working perfectly locally. The root cause was identified as a missing Kubernetes secret `db-wallet-secret` containing Oracle wallet files required for database connectivity.

## Solution Implemented

### 1. Automated Wallet Secret Creation

The CI/CD pipeline now automatically creates the `db-wallet-secret` Kubernetes secret before deploying the application. This is implemented in `deploy_spec.yaml` as a new step: **"Create Database Wallet Secret"**.

#### What it does:
- Validates that all required wallet files exist in the repository
- Deletes any existing wallet secret to ensure it's up to date
- Creates a new secret with all wallet files from `MtdrSpring/backend/wallet/`
- Verifies the secret was created successfully
- Fails the deployment if wallet creation fails

#### Required wallet files:
- `cwallet.sso`
- `ewallet.p12`
- `keystore.jks`
- `ojdbc.properties`
- `sqlnet.ora`
- `tnsnames.ora`
- `truststore.jks`

### 2. Enhanced Deployment Validation

Added comprehensive testing to the deployment verification step:

- Tests application health endpoints
- Validates database connectivity through `/login` endpoint
- Verifies wallet files are properly mounted in pods
- Provides clear success/failure feedback

### 3. Proper Secret References Restored

Removed hardcoded credentials and restored proper Kubernetes secret references:
- `dbpassword` → references `dbuser` secret
- `ui_password` → references `frontendadmin` secret

## Files Modified

### Primary Changes:
1. **`deploy_spec.yaml`** - Added wallet secret creation and enhanced validation
2. **`complete-deployment.yaml`** - Restored proper secret references

### Configuration Files (Previously Updated):
3. **`application.yaml`** - Uses environment variables
4. **`application.properties`** - Uses environment variables with fallbacks
5. **`MtdrSpring/backend/wallet/`** - Contains proper wallet configuration

## How It Prevents Future Issues

### Automatic Execution
- The wallet secret creation runs automatically on every deployment
- No manual intervention required
- Fails fast if wallet files are missing or invalid

### Self-Healing
- Always recreates the secret to ensure it's current
- Handles cases where secrets might be accidentally deleted
- Validates success before proceeding with application deployment

### Clear Error Messages
- Provides detailed logging of what's happening
- Lists missing files if validation fails
- Gives specific guidance when issues occur

## Monitoring and Maintenance

### Pipeline Logs
Look for these messages in CI/CD pipeline logs:

**Success indicators:**
```
✅ All required wallet files found
✅ Database wallet secret created successfully!
🎯 Wallet secret is ready for use by the application
🎉 Deployment successful with working database connection!
```

**Failure indicators:**
```
❌ ERROR: Wallet directory not found
❌ ERROR: Missing required wallet files
❌ ERROR: Failed to create database wallet secret
```

### Verification Commands
After deployment, you can verify the setup:

```bash
# Check if wallet secret exists
kubectl get secret db-wallet-secret -o yaml

# Verify secret contents
kubectl get secret db-wallet-secret -o jsonpath='{.data}' | jq 'keys'

# Check if wallet files are mounted in pods
kubectl exec -it <pod-name> -- ls -la /tmp/wallet/

# Test application endpoints
curl http://<load-balancer-ip>/status
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" \
     -d "telefono=3121539670&contrasena=contrasenaSegura1" \
     http://<load-balancer-ip>/login
```

## Rollback Plan

If issues occur with the automated wallet creation:

### Quick Fix
Use the manual fix script:
```bash
./fix-wallet-secret.sh
```

### Disable Automation
Comment out or remove the "Create Database Wallet Secret" step in `deploy_spec.yaml` and use manual secret creation.

### Restore Hardcoded Values (Emergency Only)
As a last resort, temporarily hardcode values in `complete-deployment.yaml`:
```yaml
- name: dbpassword
  value: "WELcome__12345"
- name: ui_password
  value: "admin123"
```

## Future Enhancements

### Potential Improvements:
1. **Wallet Validation**: Add actual database connectivity testing using wallet
2. **Secret Versioning**: Track wallet secret versions for better auditing
3. **Multi-Environment Support**: Handle different wallet files for dev/staging/prod
4. **Backup Strategy**: Automatically backup wallet files to secure storage

### Security Considerations:
1. **Wallet File Security**: Ensure wallet files in repository are properly secured
2. **Secret Rotation**: Implement periodic wallet credential rotation
3. **Access Control**: Limit who can modify wallet files in the repository

## Testing the Fix

### End-to-End Test
1. Trigger a new deployment through the CI/CD pipeline
2. Monitor logs for wallet secret creation messages
3. Verify application starts successfully
4. Test login functionality with known credentials
5. Confirm no HTTP 500 errors on database endpoints

### Expected Results
- Application deploys successfully
- Login endpoint returns HTTP 200 or 302 (redirect)
- No HTTP 500 errors on `/login` or `/developers` endpoints
- Database connectivity working as expected

## Contact and Support

If you encounter issues with this solution:

1. Check the pipeline logs for error messages
2. Verify wallet files exist and are properly formatted
3. Ensure Kubernetes cluster has necessary permissions
4. Use the diagnostic scripts in the repository:
   - `diagnose-wallet-secret.sh`
   - `test-live-app.sh`
   - `debug-login-issues.sh`

This automated solution ensures robust, reliable deployments with proper database connectivity, eliminating the HTTP 500 login errors that previously occurred when wallet secrets were missing.
