# Sana Amnis — Railway Deployment Guide

This document outlines the steps to deploy the **Sana Amnis** platform securely on **Railway** with a production-grade PostgreSQL database, secure OAuth authentication, and Paystack transactions integration.

---

## 1. Required Railway Environment Variables

Before deploying, ensure you configure the following variables in your Railway Service settings:

| Variable | Description | Production Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string (provided by Railway PG Plugin) | `postgresql://postgres:password@host:port/railway` |
| `BETTER_AUTH_SECRET` | Random high-entropy signing key (minimum 32 characters) | `a8f89...6a81` |
| `BETTER_AUTH_URL` | Canonical URL of your deployed application | `https://sanaamnis-production.up.railway.app` |
| `GOOGLE_CLIENT_ID` | Google OAuth credentials ID (for Social Sign-In) | `12345-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET`| Google OAuth client secret key | `GOCSPX-abc123xyz` |
| `PAYSTACK_SECRET_KEY` | Paystack merchant API private key | `sk_live_abc123...` |
| `RESEND_API_KEY` | Resend SMTP transaction private key | `re_abc123...` |
| `PORT` | Listening port for the Next.js server (Default matches Railway config) | `3000` |

---

## 2. Docker & Next.js Configurations

We deploy using the multi-stage **[Dockerfile](file:///c:/Work/Chika%20Sana%20Amnis/Dockerfile)**:
* **Standalone Output**: Standalone trace bundling reduces build sizes by discarding unused dependencies.
* **Security Headers**: Standard Next.js frame and origin protections are enforced inside **[next.config.ts](file:///c:/Work/Chika%20Sana%20Amnis/next.config.ts)**.
* **Liveness Checks**: Railway relies on **[railway.json](file:///c:/Work/Chika%20Sana%20Amnis/railway.json)** to query `/api/health` before routing live client requests.

---

## 3. Database Migration Steps

Once the database variables are configured, run the following commands to synchronize the database schema:

```bash
# Push schema updates directly to the database
npx drizzle-kit push

# Seed default mock products and RBAC roles
npx tsx src/db/seed.ts
```

---

## 4. Launching the Deployed Application

1. Connect your **GitHub Repository** to a new project inside the Railway Dashboard.
2. Railway will automatically read `railway.json`, fetch the `Dockerfile`, compile the production build, verify liveness check paths, and deploy the application.
