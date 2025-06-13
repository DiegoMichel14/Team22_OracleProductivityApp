#!/bin/bash

echo "🔧 FIXING DEPLOYMENT LOOP - QUICK DEPLOYMENT FIX"
echo "==============================================="

echo ""
echo "Step 1: Creating wallet secret..."
kubectl delete secret db-wallet-secret --ignore-not-found=true
kubectl create secret generic db-wallet-secret \
  --from-file=MtdrSpring/backend/wallet/

if [ $? -eq 0 ]; then
    echo "✅ Wallet secret created successfully!"
else
    echo "❌ Failed to create wallet secret!"
    exit 1
fi

echo ""
echo "Step 2: Creating fixed deployment manifest..."

# Get the latest image from OCIR (you may need to update this)
LATEST_IMAGE="mx-queretaro-1.ocir.io/axvteqzybmr1/taskmanager/todolistapp-springboot:latest"

cat > fixed-deployment-manual.yaml << EOF
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
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agile-deployment
spec:
  selector:
    matchLabels:
      app: agile-app
  replicas: 2
  template:
    metadata:
      labels:
        app: agile-app
        version: v1
    spec:
      containers:
        - name: agile-container
          image: ${LATEST_IMAGE}
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
              readOnly: true
          ports:
            - containerPort: 8080
          readinessProbe:
            httpGet:
              path: /test-simple
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 60
            periodSeconds: 30
            timeoutSeconds: 5
            failureThreshold: 3
      restartPolicy: Always
      volumes:
        - name: creds
          secret:
            secretName: db-wallet-secret
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: kubernetes.io/hostname 
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              app: agile-app
EOF

echo "✅ Fixed deployment manifest created: fixed-deployment-manual.yaml"

echo ""
echo "Step 3: Applying fixed deployment..."
kubectl apply -f fixed-deployment-manual.yaml

if [ $? -eq 0 ]; then
    echo "✅ Deployment applied successfully!"
    
    echo ""
    echo "Step 4: Waiting for rollout..."
    kubectl rollout status deployment/agile-deployment --timeout=300s
    
    echo ""
    echo "Step 5: Checking status..."
    kubectl get pods -l app=agile-app
    kubectl get services -l app=agile-app
    
    # Get external IP
    EXTERNAL_IP=$(kubectl get svc agile-service -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    if [ -n "$EXTERNAL_IP" ]; then
        echo ""
        echo "🌐 External IP: $EXTERNAL_IP"
        echo "🎯 Application URL: http://$EXTERNAL_IP"
        
        echo ""
        echo "Testing endpoints in 30 seconds..."
        sleep 30
        
        echo "Testing /status endpoint..."
        curl -s "http://$EXTERNAL_IP/status" || echo "Status endpoint not ready yet"
        
        echo ""
        echo "Testing /login endpoint..."
        curl -s -X POST -H "Content-Type: application/x-www-form-urlencoded" \
             -d "telefono=3121539670&contrasena=contrasenaSegura1" \
             "http://$EXTERNAL_IP/login" || echo "Login endpoint not ready yet"
    fi
    
    echo ""
    echo "🎉 Deployment should be working now!"
    echo "The restart loop should be fixed."
    
else
    echo "❌ Deployment failed!"
    kubectl get pods -l app=agile-app
    kubectl describe deployment agile-deployment
fi
