# Renaming Master to Main - Step by Step Guide

This guide walks you through renaming the `master` branch to `main` and setting it as the default branch.

## Prerequisites

- Admin access to the GitHub repository
- All team members should be notified before the change

## Step 1: Rename the Branch Locally

```bash
# Make sure you're on the master branch
git checkout master

# Rename master to main
git branch -m master main

# Push the new main branch to remote
git push -u origin main
```

## Step 2: Change Default Branch on GitHub

### Option A: Using GitHub Web UI (Easiest)

1. Go to your repository on GitHub: https://github.com/kossoy/comp-a-tron
2. Click **Settings** (top right)
3. Click **Branches** in the left sidebar
4. Under "Default branch", click the switch icon (⇄) or pencil icon
5. Select `main` from the dropdown
6. Click **Update** and confirm by clicking **I understand, update the default branch**

### Option B: Using GitHub CLI (if available)

```bash
# Set main as default branch
gh repo edit --default-branch main
```

## Step 3: Update Any CI/CD and Integrations

Check and update references to `master` in:

- [ ] GitHub Actions workflows (`.github/workflows/*.yml`)
- [ ] README.md or documentation links
- [ ] Deployment scripts
- [ ] Branch protection rules
- [ ] Webhooks
- [ ] Third-party integrations (Vercel, Netlify, etc.)

## Step 4: (Optional) Delete Old Master Branch

⚠️ **Only do this after confirming main is the default!**

```bash
# Delete the remote master branch
git push origin --delete master
```

## Step 5: Update Local Repositories (For Team Members)

Send these instructions to all team members:

```bash
# Fetch all branches
git fetch origin

# Switch to the new main branch
git checkout main

# Set upstream to origin/main
git branch -u origin/main main

# Delete local master branch
git branch -d master

# Optional: Clean up any stale remote-tracking branches
git remote prune origin
```

## Verification Checklist

After completing the rename:

- [ ] Repository default branch is set to `main` on GitHub
- [ ] New clones use `main` by default
- [ ] CI/CD pipelines work correctly
- [ ] Deployment processes work correctly
- [ ] All team members have updated their local repositories
- [ ] Branch protection rules are applied to `main`
- [ ] Old `master` branch is deleted (optional)

## Common Issues and Solutions

### Issue: "The default branch cannot be deleted"

**Solution:** You're trying to delete master while it's still the default. Change the default to `main` first (Step 2).

### Issue: Pull requests still target master

**Solution:** On GitHub, go to the PR and change the base branch to `main`.

### Issue: Deployment still uses master

**Solution:** Update your deployment platform settings:
- **Vercel:** Project Settings → Git → Production Branch → Change to `main`
- **Netlify:** Site Settings → Build & Deploy → Deploy contexts → Production branch → Change to `main`
- **Railway:** Settings → Branch → Change to `main`

### Issue: GitHub Actions fail after rename

**Solution:** Update `.github/workflows/*.yml` files:

```yaml
# Change this:
on:
  push:
    branches: [ master ]

# To this:
on:
  push:
    branches: [ main ]
```

## Rollback Plan

If something goes wrong:

```bash
# On GitHub, change default branch back to master
# Then delete the main branch:
git push origin --delete main

# Locally:
git checkout master
git branch -D main
```

## Why Rename Master to Main?

The tech industry has moved toward more inclusive terminology:
- GitHub now creates `main` as the default branch for new repositories
- Many major projects have migrated (Git, Linux kernel, etc.)
- It's the new standard and expected convention

## Timeline Recommendation

1. **Day 0**: Announce the change to all team members
2. **Day 1**: Create and push `main` branch
3. **Day 2**: Change default branch on GitHub
4. **Day 3-7**: Give team members time to update
5. **Day 7**: Delete `master` branch (after confirming all is well)

## Current Status

✅ **Ready to Execute**

Your repository is prepared for the migration:
- All latest changes are on the feature branch
- Feature branch has been rebased onto master
- Pull request is ready to merge
- Once merged, follow this guide to rename master → main

## Quick Reference Commands

```bash
# Full migration in one go (after backing up!)
git checkout master
git branch -m master main
git push -u origin main
# Then change default on GitHub UI
git push origin --delete master
```

---

**Need Help?**

If you encounter any issues during the migration, you can:
1. Check GitHub's official guide: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/renaming-a-branch
2. Restore from backup if needed
3. Contact your team's Git administrator

Co-Authored-By: Claude <noreply@anthropic.com>
