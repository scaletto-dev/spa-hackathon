# Database Seeding Guide

## Overview

This document explains how to seed the database with sample data for development and testing purposes.

## What Data is Seeded?

The seed script (`prisma/seed.ts`) populates the following tables:

### 1. **Service Categories** (4 records)
- Facial Treatments
- Laser Treatments  
- Body Treatments
- Anti-Aging

### 2. **Services** (8 records)
- AI Skin Analysis Facial (Featured)
- Deep Cleansing Facial
- Hydrating Facial (Featured)
- Laser Hair Removal - Full Body (Featured)
- Laser Skin Rejuvenation (Featured)
- Full Body Massage
- Body Scrub & Wrap
- Collagen Boost Treatment (Featured)

### 3. **Branches** (3 records)
- Beauty Clinic Downtown (District 1)
- Beauty Clinic Binh Thanh
- Beauty Clinic District 7

### 4. **Reviews** (8 records)
- 5 customer reviews for various services
- Mix of approved reviews with and without admin responses
- Ratings from 4-5 stars

### 5. **Blog Categories** (4 records)
- Skincare Tips
- Treatment Guides
- Beauty Trends
- Wellness & Lifestyle

### 6. **Blog Posts** (5 records)
- "10 Essential Skincare Tips for Radiant Skin"
- "AI-Powered Skin Analysis: The Future of Personalized Skincare"
- "Complete Guide to Laser Hair Removal: What to Expect"
- "The Power of Collagen: Anti-Aging Benefits Explained"
- "Self-Care Sunday: Creating Your Perfect At-Home Spa Routine"

### 7. **Admin User** (1 record)
- Email: admin@beautyclinic.vn
- Role: ADMIN
- Used as author for blog posts

## How to Run

### Run Seed Script

```bash
npm run prisma:seed
```

This command will:
1. Clean existing data from all seeded tables
2. Create fresh sample data
3. Display a summary of created records

### Full Database Reset + Seed

If you want to completely reset your database and apply migrations:

```bash
# Reset database (WARNING: Deletes ALL data)
npx prisma migrate reset

# This will automatically:
# - Drop the database
# - Recreate the database
# - Run all migrations
# - Run the seed script
```

### Seed Only (Without Reset)

```bash
npm run prisma:seed
```

This is safe to run multiple times. The script clears seeded tables before inserting new data.

## Important Notes

### ⚠️ Development Only
This seed data is for **development and testing only**. Do not run in production!

### 🔄 Idempotent
The seed script is idempotent - it clears existing data before seeding, so you can run it multiple times safely.

### 🔗 Foreign Key Dependencies
The script respects foreign key relationships and creates data in the correct order:
1. Service Categories → Services
2. Branches
3. Admin User
4. Reviews (references Services and User)
5. Blog Categories → Blog Posts (references Categories and User)

### 📸 Images
All images use Unsplash URLs. In production, these should be replaced with images stored in Supabase Storage.

### 💰 Pricing
Prices are in Vietnamese Dong (VND):
- Facials: 1.2M - 2.5M VND
- Laser treatments: 3.5M - 5M VND  
- Body treatments: 1.8M - 2M VND
- Anti-aging: 3M VND

## Customization

To customize the seed data:

1. Edit `prisma/seed.ts`
2. Modify the data objects in each section
3. Run `npm run prisma:seed` to apply changes

### Example: Adding a New Service

```typescript
prisma.service.create({
  data: {
    name: 'My New Service',
    slug: 'my-new-service',
    description: 'Full description...',
    excerpt: 'Short description',
    duration: 60,
    price: 1000000,
    categoryId: categories[0].id, // Use existing category
    images: ['https://example.com/image.jpg'],
    featured: false,
    active: true,
    beforeAfterPhotos: [],
    faqs: [
      { question: 'Q1?', answer: 'A1' }
    ],
  },
})
```

## Verification

After seeding, verify the data:

### Using Prisma Studio

```bash
npx prisma studio
```

This opens a web interface to browse your database.

### Using SQL

```sql
-- Check counts
SELECT 'ServiceCategory' as table_name, COUNT(*) as count FROM "ServiceCategory"
UNION ALL
SELECT 'Service', COUNT(*) FROM "Service"
UNION ALL
SELECT 'Branch', COUNT(*) FROM "Branch"
UNION ALL
SELECT 'Review', COUNT(*) FROM "Review"
UNION ALL
SELECT 'BlogCategory', COUNT(*) FROM "BlogCategory"
UNION ALL
SELECT 'BlogPost', COUNT(*) FROM "BlogPost"
UNION ALL
SELECT 'User', COUNT(*) FROM "User";
```

Expected counts:
- ServiceCategory: 4
- Service: 8
- Branch: 3
- Review: 8
- BlogCategory: 4
- BlogPost: 5
- User: 1

## Troubleshooting

### Error: "Cannot find module '@prisma/client'"

```bash
npx prisma generate
npm run prisma:seed
```

### Error: Database connection failed

Check your `.env` file has correct `DATABASE_URL`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

### Error: Foreign key constraint failed

The seed script should handle this automatically by creating data in the correct order. If this happens:

1. Make sure migrations are up to date: `npx prisma migrate dev`
2. Try resetting: `npx prisma migrate reset`

## Related Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create a migration
npx prisma migrate dev --name your_migration_name

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Reset database and re-seed
npx prisma migrate reset
```

## Script Location

- **Seed Script**: `prisma/seed.ts`
- **Package Script**: Defined in root `package.json`
- **Command**: `npm run prisma:seed`

---

**Last Updated**: October 29, 2025  
**Author**: Beauty Clinic Development Team
