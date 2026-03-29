#!/bin/bash
# build-and-push.sh
set -e

# 🎯 Detectar la raíz del proyecto
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$PROJECT_ROOT"

echo "🐳 Iniciando proceso de empaquetado desde: $PROJECT_ROOT"

# 1. Backend
echo "🧠 Construyendo Imagen del Backend..."
docker build -t localhost:5000/backend:latest ./backend
echo "🛰️ Subiendo Backend al Registry Local..."
docker push localhost:5000/backend:latest

# 2. Frontend
echo "🏎️ Construyendo Imagen del Frontend..."
docker build -t localhost:5000/frontend:latest ./frontend
echo "🛰️ Subiendo Frontend al Registry Local..."
docker push localhost:5000/frontend:latest

echo "🏁 PROCESO COMPLETADO!"
echo "🚀 Ahora podés desplegar en el cluster con: kubectl apply -f infrastructure/k8s/manifests/"
