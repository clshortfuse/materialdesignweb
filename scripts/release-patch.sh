#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting release patch process...${NC}"

# Ensure we're on main branch
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "main" ]; then
  echo -e "${RED}Error: Not on main branch. Currently on: $current_branch${NC}"
  exit 1
fi

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${YELLOW}Working directory is not clean. Stashing changes...${NC}"
  git stash -u
  STASHED=true
else
  echo -e "${GREEN}Working directory is clean.${NC}"
  STASHED=false
fi

# Fetch latest changes
echo -e "${GREEN}Fetching latest changes from remote...${NC}"
git fetch origin

# Check if local branch is behind remote
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})
BASE=$(git merge-base @ @{u})

if [ $LOCAL = $REMOTE ]; then
  echo -e "${GREEN}Local branch is up to date.${NC}"
elif [ $LOCAL = $BASE ]; then
  echo -e "${YELLOW}Local branch is behind remote. Pulling changes...${NC}"
  git pull
elif [ $REMOTE = $BASE ]; then
  echo -e "${YELLOW}Local branch is ahead of remote.${NC}"
else
  echo -e "${RED}Error: Local and remote branches have diverged.${NC}"
  exit 1
fi

# Get current version from package.json
current_version=$(node -p "require('./package.json').version")
echo -e "${GREEN}Current version: ${current_version}${NC}"

# Compute next version/tag and ensure it doesn't already exist
next_version=$(node -e "const v=require('./package.json').version.split('.');if(v.length<3)process.exit(1);const [ma,mi,pa]=v;console.log([ma,mi,Number(pa)+1].join('.'));")
next_tag="v${next_version}"
if git rev-parse -q --verify "refs/tags/${next_tag}" >/dev/null; then
  echo -e "${RED}Error: Tag ${next_tag} already exists. Aborting release.${NC}"
  exit 1
fi

# Run npm version patch
# This will:
# - Bump package.json and package-lock.json
# - Create a git commit
# - Create a git tag
echo -e "${GREEN}Running npm version patch...${NC}"
npm version patch -m "chore(release): %s"

new_version=$(node -p "require('./package.json').version")
new_tag="v${new_version}"

echo -e "${GREEN}✓ Release patch complete!${NC}"
echo -e "${GREEN}Created tag: ${new_tag}${NC}"
echo -e "${YELLOW}Review the changes and then push with:${NC}"
echo -e "  git push origin main && git push origin --tags"
echo ""
echo -e "${YELLOW}To abandon this release:${NC}"
echo -e "  git reset --soft HEAD~1  # Undo commit, keep changes staged"
echo -e "  git tag -d v\$(node -p \"require('./package.json').version\")   # Delete the tag"

# Restore stashed changes if any
if [ "$STASHED" = true ]; then
  echo ""
  echo -e "${YELLOW}Note: Your previous changes were stashed. Restore with: git stash pop${NC}"
fi
