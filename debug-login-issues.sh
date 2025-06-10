#!/bin/bash
# Debug script for login issues in the deployed TodoList application

echo "=== TodoList Application Login Debug ==="
echo "Application URL: http://localhost:8080"
echo "Issue: HTTP 500 errors on login attempts"
echo ""

echo "1. Checking pod status..."
kubectl get pods -l app=agile-app -o wide

echo ""
echo "2. Checking service status..."
kubectl get svc agile-service

echo ""
echo "3. Getting recent pod logs..."
POD_NAME=$(kubectl get pods -l app=agile-app -o jsonpath='{.items[0].metadata.name}')
if [ -n "$POD_NAME" ]; then
    echo "Logs from pod: $POD_NAME"
    echo "--- Last 50 lines ---"
    kubectl logs $POD_NAME --tail=50
    
    echo ""
    echo "--- Searching for ERROR/EXCEPTION logs ---"
    kubectl logs $POD_NAME | grep -i -E "(error|exception|failed|cannot|timeout)" | tail -20
else
    echo "No pods found with label app=agile-app"
fi

echo ""
echo "4. Checking database secrets..."
kubectl get secrets | grep -E "(dbuser|frontendadmin|db-wallet)"

echo ""
echo "5. Checking database secret contents (encoded)..."
kubectl get secret dbuser -o yaml 2>/dev/null || echo "dbuser secret not found"

echo ""
echo "6. Checking wallet secret..."
kubectl get secret db-wallet-secret -o yaml 2>/dev/null || echo "db-wallet-secret not found"

echo ""
echo "7. Checking environment variables in pod..."
if [ -n "$POD_NAME" ]; then
    echo "Environment variables in $POD_NAME:"
    kubectl exec $POD_NAME -- printenv | grep -E "(db_|OCI_|ui_|TODO)" | sort
fi

echo ""
echo "8. Testing database connectivity from pod..."
if [ -n "$POD_NAME" ]; then
    echo "Testing TNS_ADMIN directory:"
    kubectl exec $POD_NAME -- ls -la /mtdrworkshop/creds/ 2>/dev/null || echo "Wallet directory not accessible"
    
    echo "Testing database connection:"
    kubectl exec $POD_NAME -- sh -c 'echo "SELECT 1 FROM DUAL;" | sqlplus -s $db_user/$dbpassword@$db_url' 2>/dev/null || echo "Database connection test failed or sqlplus not available"
fi

echo ""
echo "9. Checking for application-specific logs..."
if [ -n "$POD_NAME" ]; then
    echo "Spring Boot application logs:"
    kubectl logs $POD_NAME | grep -i -E "(spring|application|started|failed|todo)" | tail -10
fi

echo ""
echo "=== Debug complete ==="
echo "Common issues to check:"
echo "- Database user password in 'dbuser' secret"
echo "- Database connection string (TODO_PDB_NAME parameter)"
echo "- Wallet files in db-wallet-secret"
echo "- Application startup errors in pod logs"
