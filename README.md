# 🏎️ ApexDrive: El Ecosistema de Hiperdeportivos del Futuro

[![License: MIT](https://img.shields.io/badge/Licencia-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Framework: NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E?style=flat&logo=nestjs)](https://nestjs.com/)
[![Framework: Next.js 15](https://img.shields.io/badge/Frontend-Next.js%2015-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![Database: PostgreSQL](https://img.shields.io/badge/Base_de_Datos-PostgreSQL-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Infrastructure: Docker](https://img.shields.io/badge/Infra-Docker-2496ED?style=flat&logo=docker)](https://www.docker.com/)
[![Infrastructure: Kubernetes](https://img.shields.io/badge/Infra-Kubernetes-326CE5?style=flat&logo=kubernetes)](https://kubernetes.io/)
[![Infrastructure: Traefik](https://img.shields.io/badge/Ingress-Traefik-24A1C1?style=flat&logo=traefik)](https://traefik.io/)
[![Storage: MinIO](https://img.shields.io/badge/Storage-MinIO-C72C48?style=flat&logo=minio)](https://min.io/)
[![RealTime: Socket.io](https://img.shields.io/badge/RealTime-Socket.io-010101?style=flat&logo=socket.io)](https://socket.io/)
[![AI: Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-8E75B2?style=flat&logo=google-gemini)](https://ai.google.dev/)
[![ORM: Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)

---

![Arquitectura apexDrive](documentation/architecture.png)

---

**ApexDrive** es un ecosistema digital de alto rendimiento para hiperdeportivos, que combina subastas en tiempo real, generación de activos por IA y un cimiento Web3 a prueba de futuro. Diseñado para la Hackatón CubePath 2026.

---

## 🚀 Características Clave

### 💎 Marketplace Exclusivo
Explora y adquiere los vehículos más elitistas del mundo con una interfaz minimalista y de alta fidelidad.

### ⏱️ Subastas en Tiempo Real
Participa en guerras de pujas en vivo potenciadas por **WebSockets**. Experimenta latencia de milisegundos para ofertas competitivas.

### 🤖 Generación de Imágenes con IA
Generación dinámica de activos de vehículos utilizando **Gemini 1.5 Flash**. Crea fotografía de nivel de estudio profesional de configuraciones personalizadas al instante.

### ⛓️ Trazabilidad Web3 (Próximamente)
Cada vehículo será acuñado como un **NFT único**, proporcionando un registro inmutable de propiedad, historial de servicio y métricas de rendimiento.

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Estilos**: Vanilla CSS & Tailwind CSS (Diseño Atómico)
- **Gestión de Estado**: Zustand & React Context
- **Animaciones**: Framer Motion

### Backend
- **Núcleo**: NestJS (Arquitectura Modular)
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL
- **Tiempo Real**: Socket.io (WebSockets)
- **Almacenamiento**: MinIO (Compatible con S3)
- **Motor de IA**: Google Generative AI (Gemini)

### Infraestructura
- **Contenerización**: Docker & Docker Compose
- **Orquestación**: Kubernetes
- **Ingress**: Traefik
- **CI/CD**: Flujos automatizados con Makefile

---

## 🏗️ Arquitectura

El proyecto sigue una **Arquitectura Modular **Basada** en Características (Feature-Based Architecture)**, asegurando alta escalabilidad y mantenibilidad.

> [!TIP]
> Puedes encontrar los diagramas detallados en este README. Para editarlos, puedes usar el código Mermaid original en **Excalidraw** a través de la herramienta "Mermaid to Excalidraw".

---

## 🏁 Comenzando

### Requisitos Previos
- Docker & Docker Compose
- Node.js 20+

### Instalación
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/josesojo2828/apexdrive-hackaton.git
   cd apexdrive-hackaton
   ```

2. Configurar las variables de entorno:
   ```bash
   cp .env.example .env
   ```

3. Levantar la infraestructura:
   ```bash
   make up
   ```

---

## 🗺️ Roadmap: La Evolución Web3

![Evolución Web3](documentation/web3-arch.png)

### ¿Qué hace cada componente?
1.  **Capa de Smart Contracts (EVM)**: Maneja la lógica de negocio descentralizada.
    - **Auction Escrow**: Retiene los fondos de los pujadores en un contrato inteligente, asegurando que el vendedor reciba el pago y el comprador reciba el activo (o su dinero de vuelta si pierde).
    - **Car Passport NFT (ERC-721)**: Convierte cada vehículo en un activo digital único. Sus metadatos contienen el historial inmutable de propiedad y servicios.
2.  **Integración de IA & Metadatos Avanzados**:
    - **Advanced AI Node**: Genera configuraciones visuales (tuning) que se guardan como atributos permanentes.
    - **IPFS (Pinata)**: Almacenamiento descentralizado para las imágenes y metadatos, garantizando que el NFT sea persistente y no dependa únicamente de nuestros servidores.
3.  **Registro On-Chain**: Todos los servicios técnicos, ventas y cambios de propiedad se registran como eventos en la blockchain, creando un historial a prueba de manipulaciones.

---

**Desarrollado con ❤️ para QuanticArch para la Hackatón CubePath 2026.**
