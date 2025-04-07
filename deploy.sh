#!/bin/bash

echo "Building application for deployment..."
npm run build

echo "Setting up environment for deployment..."
# Create a production-ready start script
echo "Starting application in production mode..."
node dist/index.js