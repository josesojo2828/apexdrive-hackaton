#!/bin/bash
# install-k3s.sh
# 🏎️ Proyecto ApexDrive // QuanticArch Hackaton Edition 
# K3s es liviano y ya viene con Traefik listo!

echo "🚀 Iniciando Instalación de K3s Cluster..."

# Instalar K3s (No instalamos ServiceLB para que Traefik use los puertos reales)
curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644

# Opcional: Esperar a que el nodo esté Ready
echo "⏳ Esperando que el nodo esté listo..."
sleep 15
kubectl get nodes

echo "🏁 K3s Instalado con éxito. Kubeconfig en /etc/rancher/k3s/k3s.yaml"
