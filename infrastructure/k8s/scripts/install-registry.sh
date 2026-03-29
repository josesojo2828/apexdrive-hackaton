#!/bin/bash
# install-registry.sh
# 🏁 Local Registry para ApexDrive // QuanticArch Hackaton Edition

echo "🧪 Levantando Docker Registry Local..."
docker run -d \
  -p 5000:5000 \
  --restart always \
  --name apexdrive-registry \
  registry:2

echo "🚔 Configurando K3s para aceptar el Registry Local..."
# Creamos el archivo de configuración de K3s para registries
sudo mkdir -p /etc/rancher/k3s
sudo tee /etc/rancher/k3s/registries.yaml > /dev/null <<EOF
mirrors:
  "localhost:5000":
    endpoint:
      - "http://localhost:5000"
EOF

echo "🔄 Reiniciando K3s para aplicar cambios..."
sudo systemctl restart k3s

echo "🏁 Registry Local Listo en localhost:5000"
echo "💡 Para usarlo: 
1. docker tag tu-imagen localhost:5000/tu-imagen
2. docker push localhost:5000/tu-imagen
3. Usar 'localhost:5000/tu-imagen' en tus YAML de K8s."
