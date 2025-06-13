#!/bin/bash

echo "🚨 EMERGENCY FIX: ORACLE DEVOPS USING WRONG ARTIFACT"
echo "====================================================="

echo ""
echo "❌ PROBLEM IDENTIFIED:"
echo "Oracle DevOps is using a stored inline artifact instead of our pipeline!"
echo "The artifact contains a basic manifest with:"
echo "  - NO health probes (causing deployment hang)"
echo "  - NO environment variables (no DB config)"
echo "  - NO wallet mounting (database connection fails)"
echo ""

echo "✅ SOLUTION: Force deployment with correct configuration"
echo ""

echo "Step 1: Create emergency deployment with proper configuration..."

# Get timestamp for unique deployment
TIMESTAMP=$(date +'%Y%m%d-%H%M%S')

cat > emergency-deployment-${TIMESTAMP}.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agile-deployment
spec:
  replicas: 1
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: agile-app
  template:
    metadata:
      labels:
        app: agile-app
        version: v1
    spec:
      containers:
        - name: agile-container
          image: mx-queretaro-1.ocir.io/axvteqzybmr1/taskmanager/todolistapp-springboot:latest
          imagePullPolicy: Always
          env:
            - name: db_user
              value: "TODOUSER"
            - name: db_url
              value: "jdbc:oracle:thin:@reacttodoia9ge_tp?TNS_ADMIN=/tmp/wallet"
            - name: todo.table.name
              value: "todoitem"
            - name: driver_class_name
              value: "oracle.jdbc.OracleDriver"
            - name: OCI_REGION
              value: "mx-queretaro-1"
            - name: dbpassword
              valueFrom:
                secretKeyRef:
                  name: dbuser
                  key: dbpassword
                  optional: true
            - name: ui_username
              value: "admin"
            - name: ui_password
              valueFrom:
                secretKeyRef:
                  name: frontendadmin
                  key: password
                  optional: true
          volumeMounts:
            - name: creds
              mountPath: /tmp/wallet
          ports:
            - containerPort: 8080
          readinessProbe:
            httpGet:
              path: /test-simple
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 3
            timeoutSeconds: 2
            failureThreshold: 2
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 15
            periodSeconds: 10
            timeoutSeconds: 2
            failureThreshold: 2
          startupProbe:
            httpGet:
              path: /test-simple
              port: 8080
            initialDelaySeconds: 2
            periodSeconds: 2
            timeoutSeconds: 2
            failureThreshold: 15
      restartPolicy: Always
      volumes:
        - name: creds
          secret:
            secretName: db-wallet-secret
---
apiVersion: v1
kind: Service
metadata:
  name: agile-service
  annotations:
    oci.oraclecloud.com/loadbalancer-policy: "IP_HASH"
spec:
  type: LoadBalancer
  externalTrafficPolicy: Cluster
  ports:
    - port: 80
      protocol: TCP
      targetPort: 8080
  selector:
    app: agile-app
EOF

echo "✅ Emergency deployment created: emergency-deployment-${TIMESTAMP}.yaml"

echo ""
echo "Step 2: Creating wallet secret (if missing)..."
kubectl delete secret db-wallet-secret --ignore-not-found=true
kubectl create secret generic db-wallet-secret \
  --from-file=MtdrSpring/backend/wallet/ || echo "⚠️ Wallet creation failed - check if files exist"

echo ""
echo "Step 3: Applying emergency deployment..."
kubectl apply -f emergency-deployment-${TIMESTAMP}.yaml

if [ $? -eq 0 ]; then
    echo "✅ Emergency deployment applied!"
    
    echo ""
    echo "Step 4: Monitoring rollout (SHOULD COMPLETE IN 30 SECONDS)..."
    timeout 60s kubectl rollout status deployment/agile-deployment || echo "⚠️ Rollout timeout - checking pod status"
    
    echo ""
    echo "Step 5: Current status..."
    echo "Pods:"
    kubectl get pods -l app=agile-app -o wide
    echo ""
    echo "Service:"
    kubectl get svc agile-service -o wide
    
    echo ""
    echo "Step 6: Getting Load Balancer IP (wait 30 seconds)..."
    sleep 30
    EXTERNAL_IP=$(kubectl get svc agile-service -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    
    if [ -n "$EXTERNAL_IP" ]; then
        echo "🌐 Load Balancer IP: $EXTERNAL_IP"
        echo "🎯 Test URL: http://$EXTERNAL_IP"
        
        echo ""
        echo "Testing /test-simple endpoint (should work immediately)..."
        sleep 10
        curl -I "http://$EXTERNAL_IP/test-simple" 2>/dev/null || echo "Not ready yet"
    else
        echo "⚠️ LoadBalancer IP not assigned yet, check with:"
        echo "   kubectl get svc agile-service --watch"
    fi
    
else
    echo "❌ Emergency deployment failed!"
    kubectl describe deployment agile-deployment
fi

echo ""
echo "🔍 NEXT STEPS TO FIX ORACLE DEVOPS ARTIFACT:"
echo "1. This emergency deployment should work in ~30 seconds"
echo "2. Oracle DevOps needs artifact reconfiguration to use our pipeline"
echo "3. The stored inline artifact must be updated or replaced"
echo "4. Consider updating deployment artifact in Oracle Console"

echo ""
echo "💡 KEY INSIGHT:"
echo "The deployment hangs because Oracle DevOps artifact has NO health probes."
echo "Kubernetes waits indefinitely for pods that never report ready status."
echo "This emergency deployment has proper probes and should complete quickly."
