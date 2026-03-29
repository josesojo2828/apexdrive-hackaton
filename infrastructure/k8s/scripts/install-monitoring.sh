#!/bin/bash
# install-monitoring.sh
# 🏎️ Monitoreo para ApexDrive // QuanticArch Hackaton Edition

echo "📈 Instalando Helm..."
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# 🗝️ Indicarle a Helm dónde está el cluster de K3s
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
chmod 644 /etc/rancher/k3s/k3s.yaml

echo "📊 Agregando repositorios de Prometheus..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

echo "🚀 Desplegando Kube-Prometheus-Stack (Lanzamiento Lite para 4GB RAM)..."
kubectl create namespace monitoring
helm install apex-monitor prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --set grafana.adminPassword=apex_admin_2026 \
  --set prometheus.prometheusSpec.resources.requests.memory=400Mi \
  --set prometheus.prometheusSpec.resources.limits.memory=800Mi \
  --set prometheus.prometheusSpec.retention=2h \
  --set grafana.resources.requests.memory=100Mi \
  --set grafana.resources.limits.memory=300Mi

echo "⏳ Esperando pods de monitoreo..."
kubectl get pods -n monitoring

echo "🏁 Monitoreo Desplegado!"
echo "💡 Para entrar a Grafana sin Ingress: kubectl port-forward -n monitoring svc/apex-monitor-grafana 3000:80"
echo "👤 User: admin | Pass: apex_admin_2026"
