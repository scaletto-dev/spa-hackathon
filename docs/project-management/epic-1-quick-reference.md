# Epic 1: Quick Reference Card 🚀

**Print this page and keep it visible during development!**

---

## 📋 Epic 1 Overview

**Goal:** Foundation & Core Infrastructure  
**Duration:** 7-9 days  
**Team:** 3 developers  
**Stories:** 10 total (1.1 → 1.10)

---

## 👥 Team Roles

| Dev | Role | Primary Focus |
|-----|------|---------------|
| **Dev 1** | Frontend Lead | React, Tailwind, UI |
| **Dev 2** | Backend - Database | Prisma, Supabase, Schema |
| **Dev 3** | Backend - API | Express, REST, Endpoints |

---

## 🌊 Wave Schedule

### **Wave 0: Foundation** 📦
**Duration:** 1-1.5 days | **Parallelism:** ❌ Sequential (1 dev)

| Story | Owner | Status |
|-------|-------|--------|
| 1.1 Monorepo Setup | Dev 3 (Senior) | ⏸️ Start |

**⚠️ CRITICAL:** Must complete before Wave 1 starts!

---

### **Wave 1: Infrastructure** 🏗️
**Duration:** 1-2 days | **Parallelism:** ✅ Full (3 devs)

| Story | Owner | Dependencies | Status |
|-------|-------|--------------|--------|
| 1.2 Tailwind/shadcn | Dev 1 (FE) | 1.1 ✅ | ⏸️ |
| 1.3 Prisma Schema | Dev 2 (BE-DB) | 1.1 ✅ | ⏸️ |
| 1.5 Express API | Dev 3 (BE-API) | 1.1 ✅ | ⏸️ |

---

### **Wave 2: Core Features** 🔄
**Duration:** 1-2 days | **Parallelism:** ✅ Full (3 devs)

| Story | Owner | Dependencies | Status |
|-------|-------|--------------|--------|
| 1.8 React Router | Dev 1 (FE) | 1.2 ✅ | ⏸️ |
| 1.4 Supabase | Dev 2 (BE-DB) | 1.3 ✅ | ⏸️ |
| 1.6 Services API | Dev 3 (BE-API) | 1.3 ✅, 1.5 ✅ | ⏸️ |

---

### **Wave 3: UI & Data** 🎨
**Duration:** 1 day | **Parallelism:** ⚠️ Partial (2 devs)

| Story | Owner | Dependencies | Status |
|-------|-------|--------------|--------|
| 1.9 Homepage | Dev 1 (FE) | 1.8 ✅, 1.2 ✅ | ⏸️ |
| 1.7 Seed Data | Dev 2 (BE-DB) | 1.3 ✅, 1.4 ✅ | ⏸️ |
| 💤 Rest/Review | Dev 3 (BE-API) | - | - |

---

### **Wave 4: Integration** ✅
**Duration:** 0.5 day | **Parallelism:** 🤝 Team (all 3)

| Story | Owner | Dependencies | Status |
|-------|-------|--------------|--------|
| 1.10 Integration | All Team | ALL ✅ | ⏸️ |

---

## 🎯 Daily Checklist

### **Morning (9:00 AM) - Standup**
- [ ] What did I complete yesterday?
- [ ] What will I complete today?
- [ ] Any blockers or dependencies?
- [ ] Update Slack #epic1-progress

### **Throughout Day**
- [ ] Pull latest from `main` every 2-3 hours
- [ ] Commit frequently (every feature/subtask)
- [ ] Push to branch at least once per day
- [ ] Test your changes locally before pushing
- [ ] Ask for help if stuck >1 hour

### **End of Day (5:00 PM)**
- [ ] Push all uncommitted work
- [ ] Update story status in tracking board
- [ ] Post progress summary in Slack
- [ ] Review tomorrow's tasks

---

## 📞 Communication Protocol

### **For Questions:**
```
1. Check documentation first (README, PRD, Architecture)
2. Ask in Slack #epic1-questions
3. Tag relevant person: @dev1, @dev2, @dev3
4. If urgent: Direct message
```

### **For Blockers:**
```
1. Post immediately in #epic1-blockers
2. Tag @team and explain issue
3. Continue on other tasks if possible
4. Escalate to PM if blocked >2 hours
```

### **For Merge Conflicts:**
```
1. Pull latest main: git pull origin main
2. Resolve conflicts locally
3. Test app still runs: npm run dev
4. Commit resolved conflicts
5. Ask for review before pushing
```

---

## 🔥 Critical Commands

### **Start Both Apps**
```bash
npm run dev
```

### **Reset Database (Dev only!)**
```bash
npx prisma migrate reset
npx prisma db seed
```

### **View Database**
```bash
npx prisma studio
```

### **Check Lint Errors**
```bash
npm run lint
```

### **Format Code**
```bash
npm run format
```

### **Git Workflow**
```bash
# Create branch
git checkout -b epic1/1.X-story-name

# Commit work
git add .
git commit -m "feat(1.X): description"

# Push branch
git push origin epic1/1.X-story-name

# Update from main
git pull origin main
```

---

## 📍 Key URLs

| Resource | URL | Access |
|----------|-----|--------|
| Frontend Dev | http://localhost:5173 | Browser |
| Backend API | http://localhost:3000 | Postman |
| Health Check | http://localhost:3000/api/health | Browser |
| Prisma Studio | http://localhost:5555 | Browser (after `npx prisma studio`) |
| Supabase Dashboard | https://app.supabase.com | Login required |

---

## 🚨 Emergency Contacts

| Issue | Contact | Method |
|-------|---------|--------|
| **Critical Blocker** | @pm-john | Slack DM + Phone |
| **Tech Question** | @team | #epic1-questions |
| **Git Conflicts** | Dev 3 (BE-API) | #epic1-help |
| **Infrastructure Issue** | Dev 2 (BE-DB) | #epic1-help |
| **After Hours Emergency** | Team Lead | Phone only |

---

## ✅ Wave Completion Gates

### **Wave 0 → Wave 1 Gate**
- [ ] Both apps start with `npm run dev`
- [ ] TypeScript compiles without errors
- [ ] README has setup instructions
- [ ] `.env` files excluded from git (test: `git add .env` fails)
- [ ] All 3 devs can run project successfully

### **Wave 1 → Wave 2 Gate**
- [ ] All 3 stories merged to main
- [ ] No merge conflicts
- [ ] Apps still run after merge
- [ ] Tailwind components render
- [ ] Database schema migrated
- [ ] Express server responds

### **Wave 2 → Wave 3 Gate**
- [ ] React Router navigation works
- [ ] Supabase connection successful
- [ ] Services API returns data
- [ ] Frontend can call backend (CORS works)
- [ ] All acceptance criteria met

### **Wave 3 → Wave 4 Gate**
- [ ] Homepage displays featured services
- [ ] Database has seed data
- [ ] Images load correctly
- [ ] Responsive design working
- [ ] No critical bugs

### **Epic 1 Complete Gate**
- [ ] All 10 stories merged ✅
- [ ] Verification checklist 100% ✅
- [ ] README tested by non-dev ✅
- [ ] Demo successful ✅
- [ ] Tagged: `epic1-complete` ✅

---

## 🐛 Common Issues & Solutions

### **Issue: Port Already in Use**
```bash
# Find process on port
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Kill process (Windows)
taskkill /PID <pid> /F

# Kill process (Mac/Linux)
kill -9 <pid>
```

### **Issue: Database Connection Failed**
```
1. Check DATABASE_URL in .env
2. Verify Supabase project is running
3. Test connection: npx prisma db pull
4. Check firewall/network settings
```

### **Issue: CORS Error**
```
1. Check CORS config in apps/api/src/server.ts
2. Verify frontend URL: http://localhost:5173
3. Restart backend server
4. Clear browser cache
```

### **Issue: Module Not Found**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Or specific workspace
cd apps/web
rm -rf node_modules
npm install
```

### **Issue: Prisma Client Out of Sync**
```bash
npx prisma generate
```

---

## 📊 Progress Tracking Template

**Copy this to Slack daily:**

```
📅 Day X - [Your Name]
Wave: [0/1/2/3/4]
Story: [1.X - Story Name]

✅ Completed:
- [Task 1 description]
- [Task 2 description]

🔄 In Progress:
- [Task 3 description] - 50% done

⏭️ Next:
- [Task 4 description]

🚧 Blockers:
- [None / Description of blocker]

⏱️ Estimated Completion: [End of day / Tomorrow / X hours]
```

---

## 🎯 Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Stories Completed | 10 | ___ |
| Days Elapsed | 7-9 | ___ |
| Critical Bugs | 0 | ___ |
| Test Coverage | >80% | ___% |
| Team Velocity | 0.4-0.5 stories/dev/day | ___ |

---

## 🎉 Celebration Milestones

- [ ] **Wave 0 Done:** Foundation complete! 🏗️
- [ ] **Wave 1 Done:** Infrastructure rocks! ⚡
- [ ] **Wave 2 Done:** Core features alive! 🔥
- [ ] **Wave 3 Done:** UI looks amazing! 🎨
- [ ] **Epic 1 Done:** SHIP IT! 🚀🎊

---

## 📚 Quick Links

- **Detailed Plan:** `docs/project-management/epic-1-parallel-execution-plan.md`
- **PRD:** `docs/prd/epic-1-foundation-core-infrastructure.md`
- **Architecture:** `docs/architecture/`
- **Git Strategy:** `docs/project-management/git-workflow.md`
- **PR Checklist:** `docs/project-management/pr-checklist.md`

---

**Last Updated:** 2025-10-28  
**Version:** 1.0  
**Keep this visible during Sprint! Print or bookmark it!** 🎯

---

## 🔖 Personal Notes Space

```
My assigned stories:
1. _______________
2. _______________
3. _______________

Key dependencies I need:
- _______________
- _______________

Questions to ask:
- _______________
- _______________

Personal blockers:
- _______________
```

---

**🚀 Let's ship Epic 1! Good luck, team!**

