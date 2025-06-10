#!/bin/bash
echo "=== Debugging TodoList Login Issues ==="
echo "Checking live deployment at http://localhost:8080"
echo ""

echo "1. Testing application health:"
curl -s http://localhost:8080/health | jq . 2>/dev/null || curl -s http://localhost:8080/health

echo ""
echo "2. Testing application status (with environment info):"
curl -s http://localhost:8080/status | jq . 2>/dev/null || curl -s http://localhost:8080/status

echo ""
echo "3. Testing a simple endpoint (developers list):"
curl -s http://localhost:8080/developers | head -200

echo ""
echo "4. Testing the failing login endpoint directly:"
echo "Testing login with known credentials (3121539670 / contrasenaSegura1):"
curl -s -w "\nHTTP Status: %{http_code}\n" "http://localhost:8080/login?telefono=3121539670&contrasena=contrasenaSegura1"

echo ""
echo "5. Testing another credential set (4776467654 / contrasenaSegura4):"
curl -s -w "\nHTTP Status: %{http_code}\n" "http://localhost:8080/login?telefono=4776467654&contrasena=contrasenaSegura4"

echo ""
echo "=== End Debug ==="
