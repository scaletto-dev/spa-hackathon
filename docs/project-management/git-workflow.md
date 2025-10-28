# Git Workflow & Branching Strategy

**Project:** Beauty Clinic Care Website  
**Team Size:** 3 Developers  
**Strategy:** Feature Branch Workflow with Epic-Based Organization  
**Version:** 1.0  
**Last Updated:** 2025-10-28

---

## 📋 Table of Contents

1. [Branch Naming Convention](#branch-naming-convention)
2. [Git Workflow Overview](#git-workflow-overview)
3. [Detailed Step-by-Step Guide](#detailed-step-by-step-guide)
4. [Commit Message Convention](#commit-message-convention)
5. [Pull Request Process](#pull-request-process)
6. [Merge Conflict Resolution](#merge-conflict-resolution)
7. [Git Best Practices](#git-best-practices)
8. [Common Git Commands](#common-git-commands)
9. [Troubleshooting](#troubleshooting)

---

## 🌳 Branch Naming Convention

### **Main Branches**

```
main (or master)
├── Production-ready code
└── Protected branch (requires PR approval)
```

**Rules:**
- ✅ Always deployable
- ✅ Protected (cannot push directly)
- ✅ All changes via Pull Requests
- ✅ Linear history (squash or rebase merges)

---

### **Feature Branches**

**Format:** `epic{N}/{story-id}-{short-description}`

**Examples:**
```
epic1/1.1-monorepo-setup
epic1/1.2-tailwind-shadcn
epic1/1.3-prisma-schema
epic1/1.4-supabase-integration
epic1/1.5-express-api-foundation
epic1/1.6-services-api
epic1/1.7-database-seed
epic1/1.8-react-router-layout
epic1/1.9-homepage
epic1/1.10-integration

epic2/2.1-services-listing
epic2/2.2-service-detail-page
...
```

**Naming Rules:**
- ✅ All lowercase
- ✅ Hyphens (not underscores or spaces)
- ✅ Story ID prefix (1.1, 1.2, etc.)
- ✅ Short but descriptive
- ✅ Max 50 characters
- ❌ No special characters except hyphens

---

### **Supporting Branches**

```
hotfix/{issue-description}     # Emergency production fixes
bugfix/{bug-description}        # Non-critical bug fixes
docs/{doc-description}          # Documentation only
chore/{task-description}        # Build, config, cleanup
```

**Examples:**
```
hotfix/cors-error-production
bugfix/service-card-layout
docs/update-setup-instructions
chore/upgrade-dependencies
```

---

## 🔄 Git Workflow Overview

### **Visual Flow**

```
                    main
                     │
                     │ (protected)
                     ├──────────────────────────────────►
                     │
         ┌───────────┴─────────┐
         │                     │
    epic1/1.1-monorepo    epic1/1.2-tailwind
         │                     │
    [Dev 3 work]         [Dev 1 work]
         │                     │
         └──► PR ──► Review ──► Merge
                     │
                     └──► main (updated)
```

---

### **Workflow States**

```
1. CREATE BRANCH    →  2. DEVELOP       →  3. COMMIT
         ↓                                      ↓
4. PUSH BRANCH     ←  5. PULL MAIN  ←   6. TEST LOCALLY
         ↓
7. CREATE PR       →  8. CODE REVIEW  →  9. MERGE
         ↓
    10. DELETE BRANCH & CELEBRATE 🎉
```

---

## 📖 Detailed Step-by-Step Guide

### **Phase 1: Starting a New Story**

#### **Step 1.1: Ensure main is up-to-date**

```bash
# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# Verify you're on main with latest code
git status
git log --oneline -5
```

**Expected Output:**
```
On branch main
Your branch is up to date with 'origin/main'.
```

---

#### **Step 1.2: Create your feature branch**

```bash
# Create and switch to new branch
git checkout -b epic1/1.X-story-name

# Example for Story 1.2
git checkout -b epic1/1.2-tailwind-shadcn

# Verify branch created
git branch
```

**Expected Output:**
```
  main
* epic1/1.2-tailwind-shadcn
```

---

#### **Step 1.3: Set up upstream tracking (first push)**

```bash
# Push branch and set upstream
git push -u origin epic1/1.2-tailwind-shadcn
```

**Expected Output:**
```
Branch 'epic1/1.2-tailwind-shadcn' set up to track remote branch 'epic1/1.2-tailwind-shadcn' from 'origin'.
```

---

### **Phase 2: Development & Committing**

#### **Step 2.1: Make changes and check status**

```bash
# See what files changed
git status

# See exact changes
git diff

# See changes for specific file
git diff apps/web/src/App.tsx
```

---

#### **Step 2.2: Stage changes**

**Stage all changes:**
```bash
git add .
```

**Stage specific files:**
```bash
git add apps/web/src/App.tsx
git add apps/web/src/components/Button.tsx
```

**Stage by pattern:**
```bash
git add apps/web/src/components/*.tsx
```

**Interactive staging (recommended):**
```bash
git add -p
```

---

#### **Step 2.3: Commit with proper message**

```bash
# Commit with message
git commit -m "feat(1.2): install and configure Tailwind CSS"

# Commit with detailed message
git commit -m "feat(1.2): configure shadcn/ui components

- Install shadcn/ui CLI
- Add Button, Card, Input components
- Configure theme colors
- Add component showcase page"
```

**See:** [Commit Message Convention](#commit-message-convention) below

---

#### **Step 2.4: Push commits to remote**

```bash
# Push to your feature branch
git push

# Or explicitly
git push origin epic1/1.2-tailwind-shadcn
```

---

### **Phase 3: Staying Up-to-Date**

#### **Step 3.1: Pull latest changes from main (DAILY)**

```bash
# Save your work first
git add .
git commit -m "wip: save progress"

# Switch to main and update
git checkout main
git pull origin main

# Switch back to your branch
git checkout epic1/1.2-tailwind-shadcn

# Merge main into your branch
git merge main
```

**Alternative: Rebase (cleaner history)**
```bash
# On your feature branch
git fetch origin
git rebase origin/main

# If conflicts, resolve and continue
git add <resolved-files>
git rebase --continue
```

---

#### **Step 3.2: Resolve merge conflicts (if any)**

**If merge conflicts occur:**

1. Git will tell you which files have conflicts:
   ```
   CONFLICT (content): Merge conflict in apps/web/src/App.tsx
   ```

2. Open the file and look for conflict markers:
   ```typescript
   <<<<<<< HEAD
   // Your changes
   const MyComponent = () => { ... }
   =======
   // Changes from main
   const MyComponent = () => { ... }
   >>>>>>> main
   ```

3. Manually resolve by choosing correct code:
   ```typescript
   // Keep the correct version or merge both
   const MyComponent = () => { ... }
   ```

4. Stage the resolved files:
   ```bash
   git add apps/web/src/App.tsx
   ```

5. Complete the merge:
   ```bash
   git commit -m "merge: resolve conflicts from main"
   ```

6. Test that everything still works:
   ```bash
   npm run dev
   npm run lint
   ```

**See:** [Merge Conflict Resolution](#merge-conflict-resolution) section

---

### **Phase 4: Creating Pull Request**

#### **Step 4.1: Pre-PR checklist**

**Before creating PR, verify:**

```bash
# 1. All changes committed
git status
# Should show: "nothing to commit, working tree clean"

# 2. Branch is up-to-date with main
git fetch origin
git log HEAD..origin/main --oneline
# If any commits shown, merge main first!

# 3. Tests pass (if any)
npm run test

# 4. Linting passes
npm run lint

# 5. App runs successfully
npm run dev
# Visit http://localhost:5173 and test your changes

# 6. Build succeeds (frontend)
cd apps/web
npm run build

# 7. No console errors in browser
# Open DevTools, check Console and Network tabs
```

---

#### **Step 4.2: Push final changes**

```bash
# Push all commits
git push origin epic1/1.2-tailwind-shadcn
```

---

#### **Step 4.3: Create Pull Request on GitHub/GitLab**

**GitHub:**
1. Go to repository on GitHub
2. You'll see: "Compare & pull request" button → Click it
3. Fill in PR details (see template below)
4. Assign reviewer
5. Click "Create pull request"

**PR Title Format:**
```
[Epic 1] Story 1.2: Configure Tailwind CSS and shadcn/ui Component System
```

**PR Description Template:**
```markdown
## Story
Story 1.2: Configure Tailwind CSS and shadcn/ui Component System

## Changes
- ✅ Installed Tailwind CSS 3.4+ with PostCSS
- ✅ Configured custom color palette
- ✅ Installed shadcn/ui components (Button, Card, Input, Label, Select)
- ✅ Created component showcase page
- ✅ Configured responsive breakpoints
- ✅ Production CSS bundle <50KB gzipped

## Testing
- [x] App runs successfully (`npm run dev`)
- [x] All components render correctly
- [x] Responsive design tested (mobile, tablet, desktop)
- [x] Production build succeeds
- [x] No console errors

## Screenshots
[Add screenshots if UI changes]

## Acceptance Criteria
- [x] AC1: Tailwind CSS 3+ installed and configured
- [x] AC2: Custom color palette defined
- [x] AC3: shadcn/ui CLI initialized
- [x] AC4: 5 base components installed
- [x] AC5: Global CSS configured
- [x] AC6: Typography plugin installed
- [x] AC7: Responsive breakpoints configured
- [x] AC8: Component showcase page created
- [x] AC9: Dark mode architecture in place
- [x] AC10: Build CSS <50KB gzipped ✅ (actual: 42KB)

## Related Issues
- Closes #12
- Part of Epic 1

## Reviewer Notes
- Please test responsive design on mobile viewport
- Check color contrast in showcase page

## Deploy Notes
None (no env var changes)
```

---

### **Phase 5: Code Review & Merge**

#### **Step 5.1: Respond to review feedback**

**If changes requested:**

```bash
# Make the requested changes
# ... edit files ...

# Commit changes
git add .
git commit -m "fix(1.2): address review feedback - adjust button padding"

# Push to update PR
git push
```

**PR automatically updates with new commits!**

---

#### **Step 5.2: Merge PR**

**After approval:**

1. **Squash and Merge** (recommended for feature branches)
   - Combines all commits into one
   - Cleaner main branch history
   - Use for most PRs

2. **Rebase and Merge** (alternative)
   - Keeps individual commits
   - Linear history
   - Use if commits are well-organized

3. **Merge Commit** (not recommended)
   - Creates merge commit
   - More complex history
   - Avoid unless necessary

**Click "Squash and merge" button on GitHub**

---

#### **Step 5.3: Clean up branch**

```bash
# Switch back to main
git checkout main

# Pull the merged changes
git pull origin main

# Delete local branch
git branch -d epic1/1.2-tailwind-shadcn

# Delete remote branch (if not auto-deleted)
git push origin --delete epic1/1.2-tailwind-shadcn

# Verify branches
git branch -a
```

---

## 💬 Commit Message Convention

### **Format**

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

---

### **Type**

| Type | Usage | Example |
|------|-------|---------|
| `feat` | New feature | `feat(1.2): add Tailwind CSS configuration` |
| `fix` | Bug fix | `fix(1.6): resolve 404 error in services API` |
| `docs` | Documentation only | `docs: update README with setup instructions` |
| `style` | Code formatting (no logic change) | `style: format code with Prettier` |
| `refactor` | Code restructuring (no behavior change) | `refactor(1.5): extract middleware to separate files` |
| `test` | Add or update tests | `test(1.6): add unit tests for services API` |
| `chore` | Build, deps, config | `chore: upgrade React to 18.2.0` |
| `perf` | Performance improvement | `perf(1.6): add database indexes` |
| `ci` | CI/CD changes | `ci: add GitHub Actions workflow` |
| `revert` | Revert previous commit | `revert: revert "feat(1.2): add dark mode"` |
| `wip` | Work in progress (temporary) | `wip: save progress on homepage layout` |

---

### **Scope**

Story ID or feature area:
- `(1.1)`, `(1.2)`, `(1.3)` - Story IDs
- `(api)`, `(ui)`, `(db)` - Feature areas
- `(auth)`, `(booking)`, `(admin)` - Module names

---

### **Subject**

- ✅ Use imperative mood ("add", not "added" or "adds")
- ✅ Don't capitalize first letter
- ✅ No period at end
- ✅ Max 50 characters
- ✅ Be specific and descriptive

**Good:**
```
feat(1.2): install and configure Tailwind CSS
fix(1.6): handle null category in services API
docs(1.1): add monorepo setup instructions
```

**Bad:**
```
feat(1.2): updated stuff
fix: fixed bug
docs: changes
```

---

### **Body (Optional)**

Use for complex changes:
```
feat(1.3): implement Prisma database schema

- Add User, Service, Branch, Booking models
- Define relationships between entities
- Add indexes for frequently queried fields
- Create initial migration

This establishes the complete data model for MVP.
```

---

### **Footer (Optional)**

```
feat(1.9): implement homepage with featured services

Closes #42
Resolves #43
Related to #41
```

---

### **Examples**

```bash
# Simple feature
git commit -m "feat(1.2): add Button component from shadcn/ui"

# Bug fix
git commit -m "fix(1.6): return 404 when service not found"

# Documentation
git commit -m "docs(1.1): add environment setup instructions"

# Complex feature with body
git commit -m "feat(1.8): implement React Router with layout

- Create root layout with header and footer
- Define all routes from PRD
- Add 404 page for invalid routes
- Implement mobile navigation drawer

All acceptance criteria for Story 1.8 completed."

# With issue reference
git commit -m "fix(1.5): resolve CORS error blocking API calls

Closes #56"
```

---

## 🔍 Pull Request Process

### **PR Template**

```markdown
## Story
[Story ID and Title]

## Changes
- [x] Change 1
- [x] Change 2
- [ ] Change 3 (optional/future)

## Testing
- [x] Checklist item 1
- [x] Checklist item 2

## Screenshots
[If applicable]

## Acceptance Criteria
- [x] AC1: Description
- [x] AC2: Description
...

## Related Issues
Closes #XX

## Reviewer Notes
[Any specific areas to focus on]

## Deploy Notes
[Environment variables, migrations, etc.]
```

---

### **Review Checklist (For Reviewers)**

**Code Quality:**
- [ ] Code follows project style guide
- [ ] No commented-out code
- [ ] No console.log statements (unless intentional)
- [ ] Error handling present
- [ ] TypeScript types defined (no `any`)

**Functionality:**
- [ ] Code does what PR description says
- [ ] All acceptance criteria met
- [ ] No regressions (old features still work)
- [ ] Edge cases considered

**Testing:**
- [ ] Tests written (if applicable)
- [ ] Manual testing performed
- [ ] No linter errors

**Documentation:**
- [ ] Code comments where needed
- [ ] README updated (if needed)
- [ ] API docs updated (if applicable)

**Performance:**
- [ ] No obvious performance issues
- [ ] Database queries optimized
- [ ] Images optimized

**Security:**
- [ ] No secrets in code
- [ ] Input validation present
- [ ] Auth checks in place

---

### **Review Response Guidelines**

**For PR Author:**
- ✅ Respond to all comments
- ✅ Mark conversations resolved after addressing
- ✅ Thank reviewers for feedback
- ✅ Ask questions if feedback unclear
- ❌ Don't take feedback personally
- ❌ Don't merge without addressing critical issues

**For Reviewers:**
- ✅ Be constructive and specific
- ✅ Explain "why" for suggestions
- ✅ Distinguish between "must fix" and "nice to have"
- ✅ Praise good code
- ❌ Don't be vague ("this is bad")
- ❌ Don't nitpick minor style issues (use linter instead)

**Comment Types:**
```
[BLOCKER] This must be fixed before merge
[SUGGESTION] Consider this improvement
[QUESTION] Can you explain this?
[NITPICK] Minor style issue (can ignore)
[PRAISE] Great work on X!
```

---

## 🔧 Merge Conflict Resolution

### **Prevention**

```bash
# Pull from main DAILY
git checkout main
git pull origin main
git checkout your-branch
git merge main

# Or rebase
git fetch origin
git rebase origin/main
```

---

### **Resolution Steps**

**1. Identify conflicts:**
```bash
git status
# Shows files with conflicts
```

**2. Open conflicted file:**
```typescript
<<<<<<< HEAD (your changes)
const API_URL = 'http://localhost:3000';
=======
const API_URL = import.meta.env.VITE_API_URL;
>>>>>>> main (changes from main)
```

**3. Resolve conflict manually:**
```typescript
// Choose correct version or merge both
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

**4. Mark as resolved:**
```bash
git add <resolved-file>
```

**5. Complete merge:**
```bash
git commit -m "merge: resolve conflicts from main"
```

**6. Test thoroughly:**
```bash
npm run dev
npm run lint
npm run test
```

---

### **Complex Conflicts**

**If conflicts are too complex:**

```bash
# Abort merge and try rebase instead
git merge --abort
git rebase origin/main

# Or ask for help
# Tag teammate in Slack: "@dev3 I need help with merge conflicts"
```

---

### **Tools for Conflict Resolution**

**VS Code:**
- Built-in merge conflict UI
- Shows "Accept Current Change" / "Accept Incoming Change" / "Accept Both"

**Command-line:**
```bash
# Use merge tool
git mergetool

# Use VS Code as merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
```

---

## ✅ Git Best Practices

### **Do's ✅**

1. **Commit Often**
   - Commit after completing each subtask
   - Aim for 5-10 commits per day
   - Each commit should be a logical unit

2. **Write Descriptive Messages**
   - Use conventional commit format
   - Explain "what" and "why"

3. **Pull from Main Daily**
   - Start of day: `git pull origin main`
   - End of day: `git pull origin main`
   - Reduces merge conflicts

4. **Keep Branches Small**
   - One story = one branch
   - Merge within 1-2 days
   - Max 500 lines changed per PR

5. **Test Before Pushing**
   - Run `npm run dev`
   - Run `npm run lint`
   - Check browser console

6. **Review Your Own Code**
   - Run `git diff` before committing
   - Read through changes on GitHub after pushing

7. **Use .gitignore**
   - Never commit `.env` files
   - Never commit `node_modules/`
   - Never commit build artifacts

8. **Communicate**
   - Post in Slack when pushing
   - Tag reviewers on PRs
   - Ask for help if stuck

---

### **Don'ts ❌**

1. **Don't Commit to Main Directly**
   - Always use feature branches
   - Always create PR

2. **Don't Push Broken Code**
   - Test locally first
   - Fix linter errors
   - No syntax errors

3. **Don't Commit Secrets**
   - No API keys
   - No passwords
   - No tokens
   - Use environment variables

4. **Don't Use Generic Messages**
   - ❌ "fix stuff"
   - ❌ "updates"
   - ❌ "changes"

5. **Don't Force Push (Usually)**
   - `git push --force` can lose work
   - Only use if you know what you're doing
   - Never on shared branches

6. **Don't Ignore Merge Conflicts**
   - Resolve immediately
   - Test after resolving
   - Ask for help if needed

7. **Don't Let Branches Get Stale**
   - Merge within 1-2 days
   - Update from main daily
   - Don't keep branches for weeks

8. **Don't Merge Your Own PRs Without Review**
   - Wait for at least 1 approval
   - Address all comments
   - Exception: Documentation-only changes (can merge after 4 hours if no response)

---

## 📚 Common Git Commands

### **Branch Management**

```bash
# List all branches
git branch -a

# Create new branch
git checkout -b branch-name

# Switch branches
git checkout branch-name

# Delete local branch
git branch -d branch-name

# Delete local branch (force)
git branch -D branch-name

# Delete remote branch
git push origin --delete branch-name

# Rename current branch
git branch -m new-name
```

---

### **Committing**

```bash
# Stage all changes
git add .

# Stage specific file
git add path/to/file

# Stage by pattern
git add "*.ts"

# Commit staged changes
git commit -m "message"

# Commit with detailed message
git commit -m "title" -m "body"

# Amend last commit
git commit --amend

# Amend without changing message
git commit --amend --no-edit
```

---

### **Syncing**

```bash
# Fetch from remote
git fetch origin

# Pull from remote (fetch + merge)
git pull origin main

# Pull with rebase
git pull --rebase origin main

# Push to remote
git push origin branch-name

# Push and set upstream
git push -u origin branch-name

# Force push (dangerous!)
git push --force origin branch-name
```

---

### **Viewing History**

```bash
# Show commit history
git log

# Show last 5 commits
git log -5

# Show compact history
git log --oneline

# Show graph
git log --graph --oneline --all

# Show commits by author
git log --author="John"

# Show changes in commit
git show <commit-hash>
```

---

### **Viewing Changes**

```bash
# Show unstaged changes
git diff

# Show staged changes
git diff --staged

# Show changes in specific file
git diff path/to/file

# Show changes between branches
git diff branch1..branch2
```

---

### **Undoing Changes**

```bash
# Discard changes in file (unstaged)
git checkout -- path/to/file

# Unstage file (keep changes)
git reset HEAD path/to/file

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes - dangerous!)
git reset --hard HEAD~1

# Revert commit (creates new commit)
git revert <commit-hash>
```

---

### **Stashing**

```bash
# Save changes temporarily
git stash

# Save with message
git stash save "WIP: homepage layout"

# List stashes
git stash list

# Apply most recent stash
git stash apply

# Apply specific stash
git stash apply stash@{1}

# Apply and delete stash
git stash pop

# Delete stash
git stash drop stash@{0}

# Delete all stashes
git stash clear
```

---

### **Cleaning**

```bash
# Show what would be deleted
git clean -n

# Delete untracked files
git clean -f

# Delete untracked files and directories
git clean -fd

# Delete ignored files too
git clean -fxd
```

---

## 🐛 Troubleshooting

### **Problem: "fatal: not a git repository"**

**Solution:**
```bash
# You're not in project directory
cd /path/to/beauty-clinic-website

# Or initialize git (if new project)
git init
```

---

### **Problem: "Your branch is behind 'origin/main'"**

**Solution:**
```bash
# Pull latest changes
git pull origin main
```

---

### **Problem: "Your branch is ahead of 'origin/main'"**

**Solution:**
```bash
# You have unpushed commits
git push origin your-branch
```

---

### **Problem: "Changes not staged for commit"**

**Solution:**
```bash
# Stage the changes
git add .

# Then commit
git commit -m "message"
```

---

### **Problem: "Merge conflict"**

**Solution:**
See [Merge Conflict Resolution](#merge-conflict-resolution) section above.

---

### **Problem: "Permission denied (publickey)"**

**Solution:**
```bash
# Set up SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add key to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Add public key to GitHub
# Copy key: cat ~/.ssh/id_ed25519.pub
# Go to GitHub Settings → SSH Keys → Add
```

---

### **Problem: "Accidentally committed to main"**

**Solution:**
```bash
# If not pushed yet
git reset --soft HEAD~1
git checkout -b epic1/1.X-story-name
git commit -m "message"

# If already pushed (contact team lead)
```

---

### **Problem: "Accidentally committed .env file"**

**Solution:**
```bash
# Remove from git but keep locally
git rm --cached .env

# Add to .gitignore
echo ".env" >> .gitignore

# Commit
git commit -m "chore: remove .env from git"

# Push
git push

# Note: File is still in history!
# For sensitive data, contact team lead about git history rewrite
```

---

### **Problem: "Need to undo last commit completely"**

**Solution:**
```bash
# Undo commit but keep changes
git reset --soft HEAD~1

# Undo commit and discard changes (careful!)
git reset --hard HEAD~1
```

---

### **Problem: "Branch diverged from remote"**

**Solution:**
```bash
# See divergence
git status

# Pull with rebase
git pull --rebase origin branch-name

# Or force push (if you're sure)
git push --force origin branch-name
```

---

### **Problem: "Detached HEAD state"**

**Solution:**
```bash
# Create branch from current state
git checkout -b recovery-branch

# Or go back to main
git checkout main
```

---

## 📊 Git Workflow Diagram

```
Developer Workflow
══════════════════

1. Start New Story
   ↓
   git checkout main
   git pull origin main
   git checkout -b epic1/1.X-story

2. Develop
   ↓
   [Make changes]
   git add .
   git commit -m "feat(1.X): description"
   git push

3. Stay Updated (Daily)
   ↓
   git checkout main
   git pull origin main
   git checkout epic1/1.X-story
   git merge main

4. Create PR
   ↓
   [Push final changes]
   [Create PR on GitHub]
   [Assign reviewer]

5. Code Review
   ↓
   [Address feedback]
   git commit -m "fix(1.X): review feedback"
   git push

6. Merge
   ↓
   [Squash and merge on GitHub]
   git checkout main
   git pull origin main
   git branch -d epic1/1.X-story

7. Celebrate! 🎉
```

---

## 🎓 Quick Reference

### **Daily Routine**

```bash
# Morning: Start work
git checkout main
git pull origin main
git checkout your-branch
git merge main

# Throughout day: Save progress
git add .
git commit -m "feat(1.X): description"
git push

# End of day: Sync
git pull origin main
git merge main
```

---

### **Starting New Story**

```bash
git checkout main
git pull origin main
git checkout -b epic1/1.X-story-name
git push -u origin epic1/1.X-story-name
```

---

### **Creating PR**

```bash
git add .
git commit -m "feat(1.X): complete story implementation"
git push
# Then go to GitHub and create PR
```

---

### **After PR Merged**

```bash
git checkout main
git pull origin main
git branch -d epic1/1.X-story-name
```

---

## 📞 Need Help?

**Git Issues:**
- Ask in #epic1-help Slack channel
- Tag @dev3 (Git expert on team)
- Share exact error message

**Merge Conflicts:**
- Don't panic!
- Ask for pair programming session
- Tag @team in Slack

**Emergency:**
- If you broke something badly
- Tag @team-lead immediately
- Don't try to fix by force pushing

---

**Version:** 1.0  
**Last Updated:** 2025-10-28  
**Maintained By:** Dev Team

---

**🚀 Happy Committing!**

