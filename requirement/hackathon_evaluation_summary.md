# 🧩 EES AI Hackathon 2025 – Evaluation & Project Requirement Summary

**Project:** Beauty Clinic Care Website  
**Type:** Monorepo (Fullstack)  
**Date:** October 31, 2025  
**Version:** 1.0  

---

## 🤓 1. Evaluation Matrix (Total 100 Points + 10 Bonus)

| Category | Description | Max Points |
|-----------|--------------|------------|
| **A. Functionality** | 10 core features × 5 pts each | **50** |
| **B. Code Quality** | 4 coding standards × 5 pts each | **20** |
| **C. Documentation** | 6 design docs × 5 pts each | **30** |
| **D. Bonus** | Creativity, UX polish, performance | **+10** |

---

### 🧩 A. FUNCTIONALITY (50 pts)

| Feature | Requirement Summary | Max | Scoring Rule |
|----------|--------------------|------|---------------|
| **Homepage** | Banner intro, featured services, quick booking button | 5 | Full = 5, Partial = 2–4, Broken = 0 |
| **Services** | Grid list, clear categories, detail page per service | 5 | Full = 5, Partial = 2–4, Broken = 0 |
| **Booking** | 6-step form (service → branch → time → info → payment → confirm), guest+member supported | 5 | Full = 5, Partial = 2–4, Broken = 0 |
| **Membership** | Register (name/email/password/OTP), Login, Dashboard (profile, history, offers) | 5 | Full = 5, Partial = 2–4, Broken = 0 |
| **Branches** | Branch list (name, address, photo), map with working hours | 5 | Full = 5, Partial = 2–4, Broken = 0 |
| **Contact** | Contact form + info + Google Maps | 5 | Full = 5, Partial = 2–4, Broken = 0 |
| **Multilingual** | Language switcher (vi/en), translation coverage, auto-detect browser language | 5 | Full = 5, Partial = 2–4, Broken = 0 |
| **Blog/News** | Blog list (image/title/desc), detail view, topic filter | 5 | Full = 5, Partial = 2–4, Broken = 0 |
| **Reviews/Feedback** | Review form + display, admin approval flow | 5 | Full = 5, Partial = 2–4, Broken = 0 |
| **Live Chat/Chatbot** | Chat widget + AI FAQ + booking suggestion | 5 | Full = 5, Partial = 2–4, Broken = 0 |

---

### 🤍 B. CODE QUALITY (20 pts)

| Criterion | Details | Max | Scoring Guide |
|------------|----------|------|----------------|
| **Style & Convention** | Consistent naming, lint rules, formatting | 5 | Perfect 5 / Mostly OK 3–4 / Messy 1–2 |
| **Structure & Modularity** | Clean folder separation, DRY, reusable components | 5 | Excellent 5 / Moderate 3–4 / Poor 0–2 |
| **Readability & Comments** | Clear naming, comments for complex logic | 5 | Well-documented 5 / Some 3–4 / None 0–2 |
| **Error Handling & Optimization** | Try/catch, validation, no leaks, efficient code | 5 | Full coverage 5 / Partial 3–4 / Missing 0–2 |

---

### 📘 C. DOCUMENTATION (30 pts)

| File | Purpose | Max | Scoring Guide |
|------|----------|------|----------------|
| **Architecture Doc** | System diagram + component flow | 5 | Clear & complete = 5 |
| **Database Doc** | ERD + table schema + relations | 5 | Complete = 5 / Partial = 2–4 |
| **API Doc** | List of endpoints, input/output | 5 | Complete = 5 / Partial = 2–4 |
| **UI/UX Doc** | User flows + design rationale + screenshots | 5 | Complete = 5 / Partial = 2–4 |
| **Testing Plan** | Test cases, methods, expected results | 5 | Complete = 5 / Partial = 2–4 |
| **Deployment Guide (setup.md)** | How to run, build, deploy | 5 | Works = 5 / Partial = 2–4 |

---

### 💡 D. BONUS (Max +10 pts)

| Category | Description |
|-----------|-------------|
| **UX Polish** | Smooth animation, responsive, accessible |
| **Creativity** | AI integrations (Gemini, i18n automation, etc.) |
| **Performance** | Optimized build, fast interaction |
| **Cost Efficiency** | Free-tier optimization (Supabase, Gemini, etc.) |

---

## ⚙️ 2. PROJECT REQUIREMENTS OVERVIEW (Beauty Clinic Care Website)

### Backend
- Node.js 20 + Express + Prisma + PostgreSQL (Supabase)
- Authentication (Supabase Auth)
- API routes grouped by module (auth, booking, service, etc.)
- VNPay integration, Redis caching
- Socket.IO for chat support

### Frontend
- React 18 + Vite + TypeScript + Tailwind
- React Router v6 + ProtectedRoute
- State: Context API + custom hooks
- i18next (vi/en)
- API Adapters (mock + live)
- Framer Motion (animation), Recharts (charts)

### Core Modules
| Module | Key Features |
|---------|---------------|
| **Auth** | Login/Register/Google OAuth |
| **Services** | List + detail + filter |
| **Booking** | Wizard (6 steps) + quick mode |
| **Member Dashboard** | Profile + History |
| **Admin** | CRUD for all entities + Charts |
| **AI Chatbot** | Gemini integration |
| **i18n** | vi/en translations |
| **Payments** | VNPay mock & real |
| **Blog** | CMS + Public View |
| **Reviews** | Public + Admin moderation |

---

## 📊 3. DOCUMENTATION EXPECTATIONS

To achieve **30/30 documentation points**, ensure:
1. ✅ `docs/setup.md` → clear step-by-step installation & run guide (both mock + full).
2. ✅ `docs/ui-ux.md` → page flows, layout structure, accessibility, color/theme usage.
3. ✅ `docs/qa/test-plan.md` → functional test matrix, smoke tests, i18n, negative cases.
4. ✅ `docs/architecture/high-level-architecture.md` → updated diagram of FE+BE+DB.
5. ✅ `docs/architecture/data-models.md` → ERD & Prisma schema overview.
6. ✅ `docs/api-spec/` → updated endpoints + mapping FE ↔ API.

---

## 🚀 4. COMPLETENESS CHECKLIST (Before Submit)

| Area | Required | Status |
|------|-----------|--------|
| Homepage | Banner, CTA, featured services | ✅ |
| Service Detail | `/services/:slug` exists & links work | ✅ |
| Booking Flow | Step-by-step booking + quick mode | ✅ |
| Member Dashboard | Profile + History + Protected routes | ✅ |
| Reviews | Public view + form + admin moderation | ✅ |
| Blog | List + detail + topic filter | ✅ |
| i18n | vi/en fully covered | ⚠️ Re-scan for missing literals |
| Chatbot | AI works (fallback if key missing) | ✅ |
| Setup.md | Runs both mock & full | ⚠️ To be generated |
| UI/UX.md | Flow + screenshots | ⚠️ To be generated |
| QA Plan | Smoke + i18n tests | ⚠️ To be generated |

---

## 🧩 5. AI Agent Instruction Summary

> When reading this document:
> - Treat it as the **reference spec + scoring matrix** for EES Hackathon.
> - Prioritize generating `setup.md`, `ui-ux.md`, and `qa/test-plan.md` aligned with this rubric.
> - Follow exact file naming and placement (`/docs/`).
> - Format in Markdown for human readability and Copilot compatibility.
> - Focus on clarity, not verbosity. Use copy-paste-ready code blocks.

---

✅ **Place this file at:** `/docs/hackathon-evaluation-summary.md`  
Then run the BMAD prompt for auto-generation of required docs.

