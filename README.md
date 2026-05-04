# AI UGC Generator

A full-stack application for generating **UGC-style product images and videos** using AI.

This project combines:

- a React + Vite frontend,
- an Express + TypeScript backend,
- Prisma + PostgreSQL,
- Clerk authentication, Webhook,
- Google GenAI (Gemini/Veo),
- Cloudinary media storage.
  
![home](https://i.imgur.com/xJ8cyTv.png)
![home](https://i.imgur.com/sWiO9Uw.png)
Watch demo
[![Watch demo](https://i.imgur.com/m2MfxZI.png)](https://i.imgur.com/CE3ABHE.mp4)


## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Documentation](#documentation)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1) Clone repository](#1-clone-repository)
  - [2) Install dependencies](#2-install-dependencies)
  - [3) Configure environment variables](#3-configure-environment-variables)
  - [4) Setup database](#4-setup-database)
  - [5) Run in development](#5-run-in-development)
  - [6) Build for production](#6-build-for-production)
- [Environment Variables](#environment-variables)
  - [Backend variables](#backend-variables)
  - [Frontend variables](#frontend-variables)
- [Credits & Plans Logic](#credits--plans-logic)
- [Common Issues / Troubleshooting](#common-issues--troubleshooting)
- [Deployment Notes](#deployment-notes)

---

## Overview

**AI UGC Generator** helps users create product marketing assets quickly:

1. Upload product + model images.
2. Generate one realistic product image via Gemini.
3. Generate a short UGC video from that image via Veo.
4. Save and manage projects in a dashboard.

The app includes user authentication, plan/credit logic, publication toggles, and project filtering/search.

---

## Core Features

- Clerk-based authentication and protected routes
- User profile and credits management
- Create project with 2 source images
- AI image generation (Gemini)
- AI video generation (Veo flow + clip merge)
- Cloudinary upload for source and generated media
- Project library with:
  - pagination
  - search
  - filters (type/date/aspect ratio/publish state)
  - sorting
- Publish/unpublish generated projects
- Webhook handling for Clerk user lifecycle and payment updates

---

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Clerk React SDK
- Axios
- Tailwind CSS 4
- Framer Motion

### Backend

- Node.js + Express 5
- TypeScript
- Prisma ORM + PostgreSQL
- Clerk Express SDK + webhook verification
- Google GenAI (`@google/genai`)
- Cloudinary
- Multer (uploads)
- FFmpeg (video frame extraction/merge helpers)

---

## Monorepo Structure

```text
AI-UGC-Generator/
├─ backend/
│  ├─ prisma/
│  │  ├─ schema.prisma
│  │  └─ migrations/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ constants/
│  │  ├─ controllers/
│  │  ├─ middlewares/
│  │  ├─ routes/
│  │  ├─ services/ai.services/
│  │  ├─ types/
│  │  └─ utils/
│  └─ package.json
├─ frontend/
│  ├─ src/
│  │  ├─ axios/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ pages/
│  │  └─ App.tsx
│  └─ package.json
└─ README.md
```

---

## Documentation

To keep the root README concise, technical details are split into dedicated docs:

- Generation flow and rollback behavior: [docs/generation-flow.md](docs/generation-flow.md)
- API documentation: [docs/api-reference.md](docs/api-reference.md)
- Database schema summary: [docs/database-schema.md](docs/database-schema.md)

---

## Getting Started

## Prerequisites

- Node.js 20+ (recommended)
- npm 10+
- PostgreSQL database
- Clerk account + project
- Google AI API key
- Cloudinary account

## 1) Clone repository

```bash
git clone https://github.com/<your-account>/AI-UGC-Generator.git
cd AI-UGC-Generator
```

## 2) Install dependencies

Install backend deps:

```bash
cd backend
npm install
```

Install frontend deps:

```bash
cd ../frontend
npm install
```

## 3) Configure environment variables

Create `.env` files for both apps.

- `backend/.env`
- `frontend/.env`

See [Environment Variables](#environment-variables) section below.

## 4) Setup database

From `backend/`:

```bash
npx prisma generate
npx prisma migrate dev
```

If you already have migration history and only need schema sync:

```bash
npx prisma db push
```

## 5) Run in development

Start backend:

```bash
cd backend
npm run dev
```

Start frontend:

```bash
cd frontend
npm run dev
```

## 6) Build for production

Backend:

```bash
cd backend
npm run build
npm start
```

Frontend:

```bash
cd frontend
npm run build
npm run preview
```

---

## Environment Variables

## Backend variables

Create `backend/.env` with at least:

```env
# Server

# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME

# Google AI
GOOGLE_CLOUD_API_KEY=your_google_ai_api_key

# Cloudinary (choose one style)
# Option A: full URL
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME

# Option B: explicit keys
# CLOUDINARY_CLOUD_NAME=...
# CLOUDINARY_API_KEY=...
# CLOUDINARY_API_SECRET=...

# Clerk (required by @clerk/express)
CLERK_SECRET_KEY=your_clerk_secret_key
# Used for webhook signature verification
CLERK_WEBHOOK_SIGNING_SECRET=your_webhook_signing_secret
```

## Frontend variables

Create `frontend/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Choose one depending on environment strategy
VITE_BACKEND_URL=http://localhost:5000
VITE_BACKEND_URL_DEVELOPMENT=http://localhost:5000
```

---

## Credits & Plans Logic

Configured in backend constants:

- Image generation cost: **3 credits**
- Video generation cost: **5 credits**
- Free plan video resolution: **720p**
- Pro plan video resolution: **1080p**

Webhook payment updates can increase user credits based on plan slug.

---

## Common Issues / Troubleshooting

### 1) Prisma `process` type error in `prisma.config.ts`

If TypeScript says `Cannot find name 'process'`:

- ensure `@types/node` is installed in backend,
- ensure backend `tsconfig.json` includes `"types": ["node"]`,
- or switch to Prisma `env("DATABASE_URL")` helper in `prisma.config.ts`.

### 2) 401 Unauthorized on API

Check:

- Clerk is correctly initialized on frontend and backend.
- Axios interceptor is attaching Bearer token.
- Request is made after user session is loaded.

### 3) Webhook verification fails

Check:

- Backend route uses raw body for `/api/webhooks`.
- `CLERK_WEBHOOK_SIGNING_SECRET` is correct.

### 4) AI generation timeout/failure

Check:

- `GOOGLE_CLOUD_API_KEY` is valid.
- API quota/rate limits are not exceeded.
- Prompt/image payload sizes are reasonable.

### 5) Media upload errors

Check Cloudinary credentials and account limits.

---

## Deployment Notes

- Keep frontend and backend environment variables separate.
- Configure CORS allowed origins in backend `src/server.ts`.
- Use managed PostgreSQL in production.
- Store secrets in deployment platform secret manager (not in Git).

---
