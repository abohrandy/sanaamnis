# Sana Amnis Luxury eCommerce Platform

Sana Amnis is a premium, production-grade, CMS-powered eCommerce platform built with Next.js 15, PostgreSQL, and Better Auth.

---

## 1. Technological Stack

* **Core Engine**: Next.js 15, TypeScript, Tailwind CSS v4
* **Database & ORM**: PostgreSQL (Railway), Drizzle ORM, Drizzle Kit migrations
* **Security & Auth**: Better Auth (Email & Password, Google OAuth SSO, RBAC middleware route protection)
* **eCommerce Functions**: Paystack payment gateway, Resend transactional emails, Zustand cart stores
* **Editorial Engine**: Headless CMS layout builder, Amnis Journal Blog, client FAQ accordions

---

## 2. Launching Locally

Configure your environment variables in a local `.env` file, and then run the following development commands:

```bash
# 1. Install project dependencies
npm install

# 2. Compile migrations files and apply schemas
npx drizzle-kit generate
npx drizzle-kit push

# 3. Seed default mock products and settings
npx tsx src/db/seed.ts

# 4. Start the local development server
npm run dev
```

---

## 3. Operational Guides
* **[Platform Architecture Plan](file:///C:/Users/admin/.gemini/antigravity/brain/428603e2-9d29-41d6-bfea-33f485b29f36/implementation_plan.md)**
* **[Railway Deployment Guide](file:///c:/Work/Chika%20Sana%20Amnis/DEPLOYMENT.md)**
* **[Platform walkthrough Logs](file:///C:/Users/admin/.gemini/antigravity/brain/428603e2-9d29-41d6-bfea-33f485b29f36/walkthrough.md)**
