# Pull Request Checklist

**Use this checklist before creating and during PR review**

---

## 📋 Pre-PR Checklist (Author)

**Complete ALL items before creating PR:**

### **1. Code Quality**

- [ ] **No debug code**: Removed all `console.log()`, `debugger`, `TODO` comments
- [ ] **No commented code**: Deleted unused code instead of commenting
- [ ] **TypeScript strict**: No `any` types (use proper types or `unknown`)
- [ ] **Linter passes**: `npm run lint` returns no errors
- [ ] **Formatter applied**: `npm run format` or Prettier ran
- [ ] **No warnings**: Address ESLint warnings (or add suppression comments with explanation)
- [ ] **Imports organized**: Remove unused imports, group by type (external → internal → relative)
- [ ] **File structure**: Files in correct directories per architecture doc

---

### **2. Testing**

- [ ] **App runs**: `npm run dev` starts both frontend and backend successfully
- [ ] **Manual testing**: Tested changed features in browser
- [ ] **No console errors**: Browser DevTools Console shows no errors
- [ ] **Network calls work**: DevTools Network tab shows successful API calls (200, 201)
- [ ] **Responsive tested**: Checked mobile (375px), tablet (768px), desktop (1280px) viewports
- [ ] **Unit tests pass**: `npm run test` passes (if tests exist)
- [ ] **New tests added**: Created tests for new features (if testable)
- [ ] **Regression tested**: Verified existing features still work

---

### **3. Dependencies**

- [ ] **Branch updated**: Merged latest `main` into feature branch
- [ ] **No merge conflicts**: All conflicts resolved and tested
- [ ] **Dependencies installed**: `npm install` ran successfully after merge
- [ ] **Lock file committed**: `package-lock.json` changes included if dependencies changed

---

### **4. Security**

- [ ] **No secrets**: No API keys, passwords, tokens in code
- [ ] **Environment variables**: Used `.env` for configuration
- [ ] **Input validation**: All user inputs validated (frontend AND backend)
- [ ] **SQL injection safe**: Used Prisma parameterized queries (no raw SQL with user input)
- [ ] **XSS safe**: User content sanitized/escaped
- [ ] **.env not committed**: Verified `.env` file excluded from git

---

### **5. Performance**

- [ ] **No memory leaks**: Cleaned up subscriptions, event listeners, timers
- [ ] **Images optimized**: Images compressed, lazy loaded
- [ ] **Database queries optimized**: No N+1 queries, proper indexes used
- [ ] **Bundle size checked**: Frontend build size reasonable (<500KB for main bundle)
- [ ] **No infinite loops**: Verified all loops and recursion terminate

---

### **6. Acceptance Criteria**

- [ ] **All AC met**: Every acceptance criterion from story checked off
- [ ] **Story complete**: All story requirements implemented
- [ ] **Out of scope excluded**: Didn't add features not in story
- [ ] **Edge cases handled**: Considered empty states, error states, loading states

---

### **7. Documentation**

- [ ] **Code comments**: Complex logic documented
- [ ] **README updated**: If setup/config changed
- [ ] **API docs updated**: If new endpoints or changed contracts
- [ ] **Environment variables documented**: Updated `.env.example` if added new vars
- [ ] **Architecture doc updated**: If made architectural changes

---

### **8. Git Hygiene**

- [ ] **Commits logical**: Each commit is coherent unit of work
- [ ] **Commit messages follow convention**: `feat(1.X): description`
- [ ] **Branch named correctly**: `epic1/1.X-story-name` format
- [ ] **No unnecessary files**: No IDE config, OS files committed
- [ ] **PR size reasonable**: <500 lines changed (if larger, explain why)

---

### **9. Build & Deploy**

- [ ] **Production build succeeds**: `npm run build` completes without errors
- [ ] **Build warnings reviewed**: Addressed or documented if acceptable
- [ ] **Environment-agnostic**: Code works in dev, will work in production
- [ ] **Database migrations**: Included if schema changed
- [ ] **Backwards compatible**: Changes don't break existing functionality

---

### **10. Final Checks**

- [ ] **Self-reviewed**: Reviewed own code on GitHub before requesting review
- [ ] **Files reviewed**: Checked all changed files make sense
- [ ] **PR description complete**: Used template, filled all sections
- [ ] **Linked issues**: Added "Closes #XX" or "Part of #XX"
- [ ] **Screenshots added**: Included for UI changes
- [ ] **Reviewers assigned**: Tagged appropriate reviewers

---

## 📝 PR Description Template

**Copy this template when creating PR:**

```markdown
## 📖 Story
Story [X.X]: [Title from PRD]

## 🎯 Summary
[2-3 sentence summary of what this PR does and why]

## 🔧 Changes
<!-- List main changes made -->
- ✅ [Change 1]
- ✅ [Change 2]
- ✅ [Change 3]
- ⚠️ [Optional/Future: Change 4]

## 🧪 Testing
<!-- Describe how you tested -->
- [x] Tested manually in browser
- [x] Ran `npm run dev` - both apps start successfully
- [x] Ran `npm run lint` - no errors
- [x] Ran `npm run build` - build succeeds
- [x] Tested on mobile viewport (375px)
- [x] Tested on desktop (1280px)
- [x] No console errors in DevTools
- [x] All API calls succeed (checked Network tab)
- [ ] Unit tests added/updated (if applicable)
- [ ] Integration tests pass (if applicable)

## 📸 Screenshots
<!-- Add screenshots for UI changes -->
<!-- Use markdown: ![alt text](url) -->
<!-- Or drag-and-drop images into PR description -->

**Before:**
[Screenshot or N/A]

**After:**
[Screenshot]

**Mobile View:**
[Screenshot if relevant]

## ✅ Acceptance Criteria
<!-- Copy from story and check off -->
- [x] AC1: [Description]
- [x] AC2: [Description]
- [x] AC3: [Description]
- [x] AC4: [Description]
- [x] AC5: [Description]
- [x] AC6: [Description]
- [x] AC7: [Description]
- [x] AC8: [Description]
- [x] AC9: [Description]
- [x] AC10: [Description]

**All 10 acceptance criteria met ✅**

## 🔗 Related Issues
<!-- Link related issues/stories -->
Closes #[issue-number]
Part of Epic 1
Related to #[issue-number]

## 👀 Reviewer Notes
<!-- Highlight specific areas for review or context needed -->
- ⚠️ **Focus on**: [Specific file or logic to review carefully]
- 💡 **Context**: [Background info reviewers should know]
- ❓ **Question**: [Any uncertainties or areas you want feedback on]
- 🎨 **UI**: [Specific UI behavior to test]

## 🚀 Deploy Notes
<!-- Any special deployment considerations -->
- [ ] **Environment variables**: [Added VARIABLE_NAME to .env.example]
- [ ] **Database migrations**: [Run `npx prisma migrate dev`]
- [ ] **Dependencies**: [Run `npm install` after merge]
- [ ] **Breaking changes**: [None / Description]
- [ ] **Rollback plan**: [How to rollback if issues]

## 📋 Pre-PR Checklist
<!-- Confirm you completed the checklist -->
- [x] All items in "Pre-PR Checklist" completed
- [x] Self-reviewed code on GitHub
- [x] No merge conflicts
- [x] Branch up-to-date with main
- [x] Tests pass locally
- [x] No console errors

## 📊 Metrics (Optional)
<!-- If relevant -->
- **Lines Changed**: +XXX / -XXX
- **Files Changed**: XX
- **Bundle Size Impact**: +XX KB / No change
- **Test Coverage**: XX% → XX% (if measured)
```

---

## 🔍 Code Review Checklist (Reviewer)

**Complete these checks when reviewing PR:**

### **1. Functionality**

- [ ] **Code does what PR says**: Implementation matches description
- [ ] **Acceptance criteria met**: All AC from story completed
- [ ] **No regressions**: Existing features still work
- [ ] **Edge cases handled**: Empty states, error states, boundary conditions
- [ ] **User experience good**: Intuitive, responsive, no jankiness

---

### **2. Code Quality**

- [ ] **Readable**: Code is clear and self-documenting
- [ ] **Well-structured**: Good separation of concerns
- [ ] **Follows conventions**: Matches project style and patterns
- [ ] **No duplication**: DRY principle followed
- [ ] **Naming clear**: Variables, functions, files well-named
- [ ] **Comments appropriate**: Complex logic explained, no obvious comments
- [ ] **TypeScript types**: Proper types, no `any`
- [ ] **Error handling**: Errors caught and handled gracefully

---

### **3. Architecture**

- [ ] **Follows architecture doc**: Adheres to project structure
- [ ] **Component placement**: Files in correct directories
- [ ] **Proper abstractions**: Appropriate use of components, services, utils
- [ ] **API contracts**: Follows REST conventions, consistent with existing APIs
- [ ] **Database design**: Schema changes make sense, relationships correct

---

### **4. Performance**

- [ ] **No obvious bottlenecks**: No unnecessary re-renders, loops, queries
- [ ] **Database queries optimized**: Proper indexes, no N+1 queries
- [ ] **Images optimized**: Compressed, lazy loaded
- [ ] **Bundle impact acceptable**: No massive dependencies added
- [ ] **Caching used**: Redis cache used for appropriate data

---

### **5. Security**

- [ ] **No secrets exposed**: No API keys, passwords in code
- [ ] **Input validated**: All user inputs sanitized
- [ ] **Auth checks present**: Protected routes require authentication
- [ ] **SQL injection safe**: Using Prisma, not raw SQL
- [ ] **XSS safe**: User content escaped

---

### **6. Testing**

- [ ] **Manually tested**: Checked out branch and tested locally
- [ ] **Works as expected**: Features function correctly
- [ ] **No errors**: No console errors, API errors
- [ ] **Responsive**: Tested mobile and desktop
- [ ] **Tests adequate**: Sufficient test coverage (if tests exist)

---

### **7. Documentation**

- [ ] **Code documented**: Complex logic has comments
- [ ] **README updated**: Setup instructions current
- [ ] **API docs updated**: Endpoint documentation accurate
- [ ] **Comments helpful**: Not stating obvious, explain "why" not "what"

---

### **8. Git & Process**

- [ ] **Commits logical**: Each commit makes sense
- [ ] **Commit messages good**: Follow convention
- [ ] **Branch up-to-date**: Merged latest main
- [ ] **No merge conflicts**: Clean merge possible
- [ ] **PR size reasonable**: Not too large (or justified)
- [ ] **Linked to issues**: Closes/references correct issues

---

### **9. Feedback**

- [ ] **Feedback provided**: Left constructive comments
- [ ] **Severity marked**: Used [BLOCKER], [SUGGESTION], [QUESTION] tags
- [ ] **Specific**: Comments are actionable and clear
- [ ] **Positive feedback**: Praised good patterns/code

---

### **10. Approval**

- [ ] **Ready to merge**: All concerns addressed
- [ ] **Tested locally**: Pulled branch and verified
- [ ] **Confident**: Code improves codebase quality

---

## 💬 Review Comment Tags

**Use these tags in review comments:**

### **[BLOCKER] 🔴**
**Must be fixed before merge**

Example:
```
[BLOCKER] This creates a SQL injection vulnerability. 
Use Prisma's parameterized queries instead of raw SQL.
```

---

### **[CRITICAL] 🟠**
**Should be fixed before merge (can merge if time-sensitive with plan to fix)**

Example:
```
[CRITICAL] This API endpoint is missing authentication. 
Anyone can access sensitive user data. Add auth middleware.
```

---

### **[SUGGESTION] 🟡**
**Nice to have, can be addressed now or later**

Example:
```
[SUGGESTION] Consider extracting this logic into a separate hook.
Would improve reusability. Can be done in future refactor if preferred.
```

---

### **[QUESTION] 🔵**
**Asking for clarification**

Example:
```
[QUESTION] Why are we using setTimeout here instead of useEffect cleanup?
Is there a specific reason or should we refactor?
```

---

### **[NITPICK] ⚪**
**Minor style/preference issue, can ignore**

Example:
```
[NITPICK] Personal preference: I'd use a ternary here.
But current code is fine. Up to you!
```

---

### **[PRAISE] 🟢**
**Good code worth highlighting**

Example:
```
[PRAISE] Great error handling here! Clear messages and proper status codes.
Exactly how we should do it across the codebase.
```

---

## 🎯 Review Response Guide (Author)

### **Responding to Feedback**

**For each comment:**

1. **Read carefully**: Understand the feedback
2. **Respond**: Acknowledge or ask clarifying questions
3. **Take action**:
   - Fix blockers immediately
   - Discuss critical issues
   - Consider suggestions
   - Answer questions
4. **Mark resolved**: After addressing
5. **Re-request review**: If changes made

---

### **Response Templates**

**Accepting feedback:**
```
✅ Good catch! Fixed in [commit-hash].
```

**Asking for clarification:**
```
❓ Can you clarify what you mean by "extract this logic"? 
Do you mean move it to a separate function or a custom hook?
```

**Providing context:**
```
💡 The reason I did it this way is because [explanation].
However, I'm open to the suggested approach if you think it's better.
```

**Agreeing to defer:**
```
👍 Agreed this would be better. Created #XX to track refactoring.
Will address in future PR to avoid blocking this one.
```

**Politely disagreeing:**
```
🤔 I understand your concern, but I think the current approach is better because [reason].
What do you think? Open to discussion.
```

---

## 📊 PR Size Guidelines

### **Ideal PR Size**

| Lines Changed | Status | Action |
|---------------|--------|--------|
| 0-100 | ✅ Small | Perfect size, fast review |
| 100-300 | ✅ Medium | Good size, most PRs should be here |
| 300-500 | ⚠️ Large | Acceptable, but consider splitting |
| 500-1000 | ⚠️ Very Large | Should split if possible, add justification |
| 1000+ | 🔴 Huge | Must split or provide strong justification |

---

### **When Large PRs are OK**

- [ ] Boilerplate code (e.g., Story 1.1 monorepo setup)
- [ ] Third-party library integration
- [ ] Database migrations with many tables
- [ ] Code generation
- [ ] Justified in PR description

**If large, add note:**
```
⚠️ **Large PR Notice**: This PR is XXX lines because [reason].
I've organized commits by feature for easier review:
- Commit 1: Setup
- Commit 2: Core logic
- Commit 3: Tests
- Commit 4: Documentation
```

---

## ⏱️ Review Turnaround Time

### **SLA Expectations**

| PR Size | Initial Review | Final Approval |
|---------|----------------|----------------|
| Small (0-100) | 2 hours | 4 hours |
| Medium (100-300) | 4 hours | 8 hours |
| Large (300-500) | 8 hours | 1 day |
| Very Large (500+) | 1 day | 2 days |

**Note:** These are guidelines. Critical/blocking PRs can be prioritized.

---

### **Review Priority**

**High Priority (review immediately):**
- [ ] Blocks other developers
- [ ] Critical bug fix
- [ ] Tagged as "urgent"
- [ ] End of sprint

**Normal Priority (review within SLA):**
- [ ] Regular story completion
- [ ] Scheduled work

**Low Priority (review when available):**
- [ ] Documentation only
- [ ] Refactoring
- [ ] Non-critical improvements

---

## 🚀 Merge Process

### **Before Merging**

**Verify:**
- [ ] All reviewers approved
- [ ] All [BLOCKER] comments resolved
- [ ] All conversations resolved
- [ ] CI/CD checks pass (green checkmarks)
- [ ] Branch up-to-date with main
- [ ] No merge conflicts

---

### **Merge Methods**

**Use Squash and Merge** (default):
- ✅ Cleans up commit history
- ✅ One commit per story
- ✅ Easy to revert
- Use for: Most feature branches

**Use Rebase and Merge** (alternative):
- ✅ Preserves commit history
- ✅ Linear history
- Use for: Well-organized commits with clear history

**Avoid Merge Commit**:
- ❌ Creates complex history
- ❌ Harder to track
- Only use: If specifically required

---

### **After Merge**

**Immediately:**
- [ ] Delete remote branch (GitHub auto-deletes usually)
- [ ] Pull latest main: `git checkout main && git pull`
- [ ] Delete local branch: `git branch -d epic1/1.X-story`
- [ ] Close linked issues
- [ ] Update team in Slack: "Story 1.X merged! ✅"

**Verification:**
- [ ] Pull main on different machine and test
- [ ] Verify app still runs
- [ ] Run smoke tests

---

## 📅 PR Lifecycle

```
1. Create PR
   ↓
2. Self-Review (fix obvious issues)
   ↓
3. Assign Reviewers
   ↓
4. Initial Review (within SLA)
   ↓
5. Address Feedback (author fixes issues)
   ↓
6. Re-Review (reviewer checks fixes)
   ↓
7. Approval ✅
   ↓
8. Merge (squash and merge)
   ↓
9. Cleanup (delete branch)
   ↓
10. Celebrate! 🎉
```

---

## 🎓 Tips for Better PRs

### **For Authors**

1. **Self-review first**: Review your own PR on GitHub before requesting review
2. **Small PRs**: Keep PRs small and focused on one story
3. **Good descriptions**: Write clear PR descriptions with context
4. **Screenshots**: Always include for UI changes
5. **Test thoroughly**: Don't rely on reviewers to find bugs
6. **Respond quickly**: Address feedback within same day if possible
7. **Be gracious**: Thank reviewers for their time
8. **Learn from feedback**: Apply patterns to future work

---

### **For Reviewers**

1. **Review promptly**: Don't let PRs sit for days
2. **Be constructive**: Focus on improving code, not criticizing
3. **Be specific**: Vague feedback isn't helpful
4. **Explain why**: Don't just say "change this", explain reasoning
5. **Praise good code**: Positive feedback motivates
6. **Test locally**: Don't just read code, run it
7. **Consider context**: Understand constraints (time, scope)
8. **Be reasonable**: Distinguish "must fix" from "nice to have"

---

## 📞 When to Ask for Help

**Ask immediately if:**
- [ ] PR blocked for >4 hours without review
- [ ] Reviewer feedback unclear
- [ ] Disagreement on approach
- [ ] Technical blocker discovered
- [ ] Need pair programming on complex issue
- [ ] Breaking change discovered

**How to ask:**
```
🆘 Hey @reviewer, I'm stuck on your feedback about [topic].
Can we do a quick call to discuss? Available [time slots]?
```

---

## ✅ Final Checklist Summary

**Before creating PR:**
- [ ] ✅ All Pre-PR checklist items completed
- [ ] ✅ Self-reviewed code
- [ ] ✅ PR description filled out
- [ ] ✅ Screenshots added (if UI)
- [ ] ✅ Reviewers assigned

**Before approving PR:**
- [ ] ✅ All Code Review checklist items completed
- [ ] ✅ Tested locally
- [ ] ✅ Feedback provided
- [ ] ✅ Confident in changes

**Before merging PR:**
- [ ] ✅ All approvals received
- [ ] ✅ All comments resolved
- [ ] ✅ CI checks pass
- [ ] ✅ No merge conflicts

---

## 📚 Related Documents

- **Git Workflow**: `docs/project-management/git-workflow.md`
- **Epic 1 Plan**: `docs/project-management/epic-1-parallel-execution-plan.md`
- **Quick Reference**: `docs/project-management/epic-1-quick-reference.md`
- **Architecture**: `docs/architecture/`
- **PRD**: `docs/prd/`

---

**Version:** 1.0  
**Last Updated:** 2025-10-28  
**Maintained By:** Dev Team

---

**🚀 Quality code through quality reviews!**

