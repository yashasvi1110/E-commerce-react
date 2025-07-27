#!/bin/bash

# Exit on any error
set -e

echo "Installing dependencies..."
npm install

echo "Building the application..."
npm run build

echo "Build completed successfully!" 