#!/bin/bash
set -e

echo "🔐 Iniciando Configuración SSL de ApexDrive..."

# 1. Instalar Cert-Manager (si no existe)
echo "📦 Instalando Cert-Manager..."
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.2/cert-manager.yaml

# 2. Esperar a que el deployment esté listo
echo "⏳ Esperando a que Cert-Manager esté operativo (puede tardar 1-2 min)..."
kubectl wait --for=condition=available --timeout=300s deployment/cert-manager-webhook -n cert-manager

# 3. Aplicar el ClusterIssuer
echo "🎫 Configurando el Emisor de Let's Encrypt..."
kubectl apply -f infrastructure/k8s/manifests/ssl/cluster-issuer.yaml

# 4. Aplicar el Ingress con TLS
echo "🚀 Activando el candadito en el Ingress..."
kubectl apply -f infrastructure/k8s/manifests/ssl/ingress-ssl.yaml

echo "✅ ¡Todo listo! Let's Encrypt está procesando tu certificado."
echo "💡 Usá 'kubectl get certificate' para ver el progreso."
