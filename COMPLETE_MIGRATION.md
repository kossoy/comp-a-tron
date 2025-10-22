# Complete the Master → Main Migration

## Current Status

✅ **Completed:**
- Pull request merged successfully
- Local master branch updated with all changes
- Local branch renamed to `main`

⚠️ **Blocked:**
- Cannot push `main` branch via CLI (403 error - git proxy restriction)

## Solution: Use GitHub Web Interface

GitHub makes it easy to rename branches directly in the web UI. Follow these steps:

---

## Step 1: Rename Branch on GitHub (2 minutes)

1. **Go to your repository:**
   ```
   https://github.com/kossoy/comp-a-tron
   ```

2. **Navigate to Settings → Branches:**
   - Click **Settings** (top navigation)
   - Click **Branches** (left sidebar)

3. **Rename the master branch:**
   - Find "master" in the branch list
   - Click the **pencil icon (✏️)** or **rename button**
   - Type: `main`
   - Click **Rename branch**
   - Confirm the warning by clicking **Rename branch** again

   GitHub will automatically:
   - ✅ Update the default branch to `main`
   - ✅ Update all pull requests
   - ✅ Update branch protection rules
   - ✅ Show a notice to collaborators
   - ✅ Keep all commit history intact

---

## Step 2: Update Your Local Repository

After GitHub completes the rename, run this script:

```bash
cd /home/user/comp-a-tron
./update-after-github-rename.sh
```

**Or run these commands manually:**

```bash
# Fetch the renamed branch from GitHub
git fetch origin

# Update local main to track origin/main
git branch -u origin/main main

# Clean up old remote references
git remote prune origin

# Verify everything is correct
git branch -vv
```

---

## Step 3: Cleanup (Optional)

Delete the feature branch we used:

```bash
git branch -D claude/tech-stack-audit-011CUNcyakvZwUuqAAk2eP2f
```

---

## Verification

After completing all steps, verify:

```bash
# Should show "main" with asterisk
git branch

# Should show origin/main (not origin/master)
git branch -vv

# Should show main as default
git remote show origin | grep "HEAD branch"
```

---

## What Just Happened?

1. ✅ Your PR was merged to master
2. ✅ Local `master` was renamed to `main`
3. ⏳ **YOU NEED TO DO:** Rename `master` to `main` on GitHub
4. ⏳ **THEN RUN:** `./update-after-github-rename.sh`

---

## Why the 403 Error?

The Claude Code git proxy restricts branch names for security. Branches must start with `claude/` to be pushed. However, GitHub's web interface has no such restriction and can rename any branch.

---

## Need Help?

If you encounter any issues:

1. Check that you're logged into GitHub
2. Verify you have admin access to the repository
3. See detailed guide: `BRANCH_MIGRATION_GUIDE.md`

---

**Ready?** Go to https://github.com/kossoy/comp-a-tron/settings/branches and rename master → main!
