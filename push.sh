#!/usr/bin/env bash
# Argus Cybersecurity Platform - Automated Git Push Script
# Proprietary Code - Not for use without owner permission and contracts

set -e

# Color definitions
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}====================================================${NC}"
echo -e "${CYAN}        Argus Security Platform - Git Push          ${NC}"
echo -e "${CYAN}====================================================${NC}"

# Detect current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo -e "Active Branch: ${YELLOW}${BRANCH}${NC}"

# Check for modified or untracked files
if [ -z "$(git status --porcelain)" ]; then
  echo -e "${GREEN}Working tree clean. Nothing to commit or push.${NC}"
  exit 0
fi

# Determine commit message
COMMIT_MSG="$1"
if [ -z "$COMMIT_MSG" ]; then
  TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
  COMMIT_MSG="feat: update Argus SOC platform frontend & components [$TIMESTAMP]"
fi

echo -e "\n${YELLOW}Staging files...${NC}"
git add -A

echo -e "\n${YELLOW}Committing changes with message:${NC} \"$COMMIT_MSG\""
git commit -m "$COMMIT_MSG"

echo -e "\n${YELLOW}Pushing to origin/${BRANCH}...${NC}"
git push origin "$BRANCH"

echo -e "\n${GREEN}✓ Successfully committed and pushed to origin/${BRANCH}!${NC}"
