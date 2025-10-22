#!/bin/bash
# Run these commands AFTER you've renamed master→main on GitHub

echo "Fetching latest from origin..."
git fetch origin

echo "Updating local main to track origin/main..."
git branch -u origin/main main

echo "Cleaning up old remote references..."
git remote prune origin

echo "Current branch status:"
git branch -vv

echo ""
echo "✅ Local repository updated!"
echo "You are now on the 'main' branch tracking origin/main"
echo ""
echo "Optional cleanup:"
echo "  git branch -D claude/tech-stack-audit-011CUNcyakvZwUuqAAk2eP2f  # Delete feature branch"
