# Ì≤é Beauty Clinic Care Website

**Hackathon EES AI 2025** | **Team: Scaletto Dev** | **October 31, 2025**

> Spa booking platform with AI-powered features - React + Node.js + PostgreSQL + Gemini AI

---

## Ì∫Ä Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Run development servers (Frontend + Backend)
npm run dev
```

**Access:**
- Ìºê Frontend: http://localhost:5173
- Ì¥ß Backend: http://localhost:3000/api/health

---

## Ì≥ö Full Documentation

**Ì±â [docs/](./docs/) - Complete documentation package**

### Quick Links:

1. **[00-START-HERE/](./docs/00-START-HERE/)** ‚≠ê **Start Here for Judges**
   - [Setup Guide](./docs/00-START-HERE/setup.md) - Installation & running
   - [Feature Overview](./docs/00-START-HERE/FEATURE_OVERVIEW.md) - All implemented features
   - [Submission Checklist](./docs/00-START-HERE/SUBMISSION_CHECKLIST.md) - Evaluation criteria

2. **[01-FOR-JUDGES/](./docs/01-FOR-JUDGES/)** Ì≥ã **Product & Architecture**
   - System architecture, PRD, UI/UX design
   - [KIEN_TRUC_TONG_THE.md](./docs/01-FOR-JUDGES/KIEN_TRUC_TONG_THE.md) - Vietnamese architecture doc

3. **[02-TECHNICAL-SPECS/](./docs/02-TECHNICAL-SPECS/)** Ì¥ß **API & Technical Docs**
   - Complete API reference (150+ endpoints)
   - Frontend routes map (40+ routes)
   - Database schema documentation

4. **[03-DEVELOPMENT-DOCS/](./docs/03-DEVELOPMENT-DOCS/)** Ì±®‚ÄçÌ≤ª **Development**
   - AI features implementation
   - Project management & QA docs

---

## ‚ú® Key Features

- ‚úÖ **6-Step Booking Flow** - Intuitive service booking with guest & member support
- ‚úÖ **AI Chat Assistant** - Gemini-powered chatbot for customer support
- ‚úÖ **Payment Integration** - VNPay sandbox payment gateway
- ‚úÖ **Admin Dashboard** - Full CRUD management for services, bookings, staff
- ‚úÖ **Authentication** - Email/Password + Google OAuth via Supabase
- ‚úÖ **Email Notifications** - Booking confirmations via Resend API
- ‚úÖ **Multilingual** - Vietnamese + English i18n support
- ‚úÖ **Responsive Design** - Mobile-first with Tailwind CSS

---

## Ìª†Ô∏è Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite + React Router v6
- Tailwind CSS + shadcn/ui
- i18next (multilingual)

**Backend:**
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL (Supabase)
- JWT Authentication
- Google Gemini AI

**Infrastructure:**
- Monorepo structure
- Supabase (Database + Auth)
- VNPay (Payment)
- Resend (Email)

---

## Ì≥ä Project Statistics

| Metric | Count |
|--------|-------|
| Total API Endpoints | 150+ |
| Frontend Routes | 40+ |
| Database Tables | 13 |
| AI Features | 8 |
| Pages Implemented | 30+ |
| Languages Supported | 2 (vi, en) |

---

## Ì±• Demo Accounts

```
Admin:
Email: doanhaiduydev@gmail.com
Password: haiduy10

Member:
Email: getsdtfree4@gmail.com
Password: baolol123
```

**Ì≤° Tip:** Register a new account with your real email to test full booking flow with email notifications!

---

## Ì∑ÇÔ∏è Project Structure

```
spa-hackathon/
‚îú‚îÄ‚îÄ apps/
‚îÇ   ‚îú‚îÄ‚îÄ frontend/        # React + Vite application
‚îÇ   ‚îî‚îÄ‚îÄ backend/         # Express + Prisma API
‚îú‚îÄ‚îÄ docs/                # Ì≥ö Complete documentation
‚îÇ   ‚îú‚îÄ‚îÄ 00-START-HERE/   # ‚≠ê Start here for judges
‚îÇ   ‚îú‚îÄ‚îÄ 01-FOR-JUDGES/   # Product & architecture
‚îÇ   ‚îú‚îÄ‚îÄ 02-TECHNICAL-SPECS/  # API & technical docs
‚îÇ   ‚îî‚îÄ‚îÄ 03-DEVELOPMENT-DOCS/ # Development docs
‚îî‚îÄ‚îÄ package.json         # Monorepo root
```

---

## Ì≥û Support

**Team:** Scaletto Dev  
**GitHub:** https://github.com/scaletto-dev/spa-hackathon  
**Contact:** doanhaiduydev@gmail.com

---

## ÌæØ For Judges

**Evaluation Path (15-20 minutes):**

1. Read [docs/00-START-HERE/FEATURE_OVERVIEW.md](./docs/00-START-HERE/FEATURE_OVERVIEW.md) (3 min)
2. Follow [docs/00-START-HERE/setup.md](./docs/00-START-HERE/setup.md) to run (5-7 min)
3. Test booking flow: http://localhost:5173/booking (5 min)
4. Review architecture: [docs/01-FOR-JUDGES/architecture.md](./docs/01-FOR-JUDGES/architecture.md) (3 min)
5. Browse API docs: [docs/02-TECHNICAL-SPECS/api/BE_API_OVERVIEW.md](./docs/02-TECHNICAL-SPECS/api/BE_API_OVERVIEW.md) (2 min)

**Full documentation navigation:** [docs/README.md](./docs/README.md)

---

**‚≠ê Thank you for evaluating our project!**
