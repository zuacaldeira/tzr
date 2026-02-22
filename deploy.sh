#!/bin/bash
set -euo pipefail

# TZR Blog Deploy Script
# Usage: ./deploy.sh [staging] [user@host] [version]
# Examples:
#   ./deploy.sh                              # deploy production (latest)
#   ./deploy.sh staging                      # deploy staging
#   ./deploy.sh root@217.154.2.230 v1.0.0    # deploy production with version
#   ./deploy.sh staging root@217.154.2.230   # deploy staging to specific server

ENV="prod"
if [[ "${1:-}" == "staging" ]]; then
    ENV="staging"
    shift
fi

SERVER="${1:-root@217.154.2.230}"
VERSION="${2:-latest}"

if [[ "$ENV" == "staging" ]]; then
    PROJECT_DIR="/opt/tzr-blog-staging"
    COMPOSE_FILE="docker-compose.staging.yml"
    ENV_FILE=".env.staging"
    APP_CONTAINER="tzr-blog-staging-app"
    DB_CONTAINER="tzr-blog-staging-db"
    APP_URL="https://staging.tzr.zuacaldeira.com"
    DIRECT_PORT="8084"
    VERSION="${VERSION:-staging}"
else
    PROJECT_DIR="/opt/tzr-blog"
    COMPOSE_FILE="docker-compose.prod.yml"
    ENV_FILE=".env.prod"
    APP_CONTAINER="tzr-blog-app"
    DB_CONTAINER="tzr-blog-db"
    APP_URL="https://tzr.zuacaldeira.com"
    DIRECT_PORT="8083"
fi

echo "=== TZR Blog ${ENV^} Deploy ==="
echo "Target: $SERVER:$PROJECT_DIR"
echo "Version: $VERSION"
echo ""

# 1. Ensure project directory exists
echo "[1/5] Setting up project directory..."
ssh "$SERVER" "mkdir -p $PROJECT_DIR"

# 2. Copy compose and env files
echo "[2/5] Syncing configuration..."
scp "$COMPOSE_FILE" "$SERVER:$PROJECT_DIR/$COMPOSE_FILE"

if [ -f "$ENV_FILE" ]; then
    scp "$ENV_FILE" "$SERVER:$PROJECT_DIR/.env"
else
    echo "WARNING: No $ENV_FILE found. Make sure .env exists on the server."
fi

# 3. Pull latest image from GHCR
echo "[3/5] Pulling image from GHCR..."
ssh "$SERVER" "cd $PROJECT_DIR && export VERSION=$VERSION && docker compose -f $COMPOSE_FILE pull app"

# 4. Start/restart containers
echo "[4/5] Starting containers..."
ssh "$SERVER" "cd $PROJECT_DIR && export VERSION=$VERSION && docker compose -f $COMPOSE_FILE up -d"

# 5. Verify health
echo "[5/5] Verifying deployment..."
sleep 20

ssh "$SERVER" "cd $PROJECT_DIR && docker compose -f $COMPOSE_FILE ps"

echo ""
echo "=== Deployment complete (version: $VERSION) ==="
echo "App: $APP_URL (via nginx reverse proxy)"
echo "Direct: http://217.154.2.230:$DIRECT_PORT"
