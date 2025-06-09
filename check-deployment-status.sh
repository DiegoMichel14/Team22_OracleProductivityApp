#!/bin/bash
# Quick deployment status check for TodoList App

echo "============================================"
echo "TODOLIST APP CI/CD PIPELINE STATUS CHECK"
echo "============================================"

# Check if we're in the right directory
if [[ ! -f "complete-deployment.yaml" ]]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "✅ Project files found"

# Check git status
echo ""
echo "🔍 Git Status:"
echo "Current branch: $(git branch --show-current)"
echo "Last commit: $(git log -1 --oneline)"
echo "Remote status:"
git status -s

# Check configuration files
echo ""
echo "🔍 Configuration Files Status:"
echo "✅ build_spec.yaml - $(wc -l < build_spec.yaml) lines"
echo "✅ deploy_spec.yaml - $(wc -l < deploy_spec.yaml) lines" 
echo "✅ complete-deployment.yaml - $(wc -l < complete-deployment.yaml) lines"

# Check parameter alignment
echo ""
echo "🔍 Parameter Configuration Check:"
if grep -q "%REGION%" complete-deployment.yaml && grep -q "%REGION%" deploy_spec.yaml; then
    echo "✅ REGION parameter aligned in both files"
else
    echo "❌ REGION parameter mismatch detected"
fi

if grep -q "%TODO_PDB_NAME%" complete-deployment.yaml && grep -q "%TODO_PDB_NAME%" deploy_spec.yaml; then
    echo "✅ TODO_PDB_NAME parameter aligned in both files"
else
    echo "❌ TODO_PDB_NAME parameter mismatch detected"
fi

if grep -q "%UI_USERNAME%" complete-deployment.yaml && grep -q "%UI_USERNAME%" deploy_spec.yaml; then
    echo "✅ UI_USERNAME parameter aligned in both files"
else
    echo "❌ UI_USERNAME parameter mismatch detected"
fi

# Check image reference
echo ""
echo "🔍 Image Configuration:"
if grep -q "\${IMAGE_FULL_NAME}" complete-deployment.yaml; then
    echo "✅ IMAGE_FULL_NAME parameter placeholder found"
else
    echo "❌ IMAGE_FULL_NAME parameter placeholder missing"
fi

echo ""
echo "🔍 Next Steps:"
echo "1. Monitor Oracle Cloud Console → DevOps → Build Pipelines"
echo "2. Check build pipeline execution after git push"
echo "3. Verify deployment pipeline triggers automatically"
echo "4. Run diagnostics in Cloud Shell: ./cloudshell-diagnostics.sh"

echo ""
echo "📋 Oracle Cloud Parameters Should Be Set To:"
echo "   TODO_PDB_NAME: mtdrpdb"
echo "   REGION: mx-queretaro-1"
echo "   UI_USERNAME: admin"
echo "   IMAGE_FULL_NAME: mx-queretaro-1.ocir.io/axvteqzybmr1/taskmanager/todolistapp-springboot:v1"

echo ""
echo "============================================"
echo "STATUS CHECK COMPLETE"
echo "============================================"
