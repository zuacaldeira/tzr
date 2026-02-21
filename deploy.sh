#!/bin/bash
set -euo pipefail

# TZR Blog Production Deploy Script
# Usage: ./deploy.sh [user@host] [version]
# Example: ./deploy.sh root@217.154.2.230 v1.0.0

SERVER="${1:-root@217.154.2.230}"
VERSION="${2:-latest}"
PROJECT_DIR="/opt/tzr-blog"

echo "=== TZR Blog Production Deploy ==="
echo "Target: $SERVER:$PROJECT_DIR"
echo "Version: $VERSION"
echo ""

# 1. Ensure project directory exists
echo "[1/5] Setting up project directory..."
ssh "$SERVER" "mkdir -p $PROJECT_DIR"

# 2. Copy compose and env files
echo "[2/5] Syncing configuration..."
scp docker-compose.prod.yml "$SERVER:$PROJECT_DIR/docker-compose.prod.yml"

if [ -f .env.prod ]; then
    scp .env.prod "$SERVER:$PROJECT_DIR/.env"
else
    echo "WARNING: No .env.prod found. Make sure .env exists on the server."
fi

# 3. Pull latest image from GHCR
echo "[3/5] Pulling image from GHCR..."
ssh "$SERVER" "cd $PROJECT_DIR && export VERSION=$VERSION && docker compose -f docker-compose.prod.yml pull app"

# 4. Start/restart containers
echo "[4/5] Starting containers..."
ssh "$SERVER" "cd $PROJECT_DIR && export VERSION=$VERSION && docker compose -f docker-compose.prod.yml up -d"

# 5. Verify health
echo "[5/5] Verifying deployment..."
sleep 20

ssh "$SERVER" "cd $PROJECT_DIR && docker compose -f docker-compose.prod.yml ps"

echo ""
echo "=== Deployment complete (version: $VERSION) ==="
echo "App: https://tzr.zuacaldeira.com (via nginx reverse proxy)"
echo "Direct: http://217.154.2.230:8083"
