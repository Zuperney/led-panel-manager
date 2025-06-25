#!/bin/bash

# Build script para Railway
echo "Iniciando build para produção..."

# Instalar dependências do frontend
npm install

# Build do frontend
npm run build

# Instalar dependências do backend
cd backend
npm install

echo "Build concluído!"
