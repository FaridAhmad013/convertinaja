#!/usr/bin/env bash
set -euo pipefail

echo "=== ConvertinAja Local Container Launch ==="

# Build and launch all services in detached mode
docker compose up -d --build

echo "=== Health checking services ==="
docker compose ps

echo "ConvertinAja is available at http://localhost"
