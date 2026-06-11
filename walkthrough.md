# Project Walkthrough - InterviewAce AI

We have completed the complete architectural implementation of **InterviewAce AI: AI-Powered Interview Preparation Ecosystem**. The platform features a high-performance Java 21 Spring Boot 3 backend alongside an interactive React / Next.js 14 frontend, styled with premium glassmorphic UI elements and synchronized using Lenis smooth scrolling.

---

## Technical Stack & Architecture

### Backend: Java 21 + Spring Boot 3
- **Authentication:** Stateless JWT configuration with token rotation (Access Token: 1 hour, Refresh Token: 7 days).
- **Core Modules:** Resume uploads handling parser, dynamic keyword scanner seeding database skill entries, and technical assessment evaluator.
- **AI Core:** Integrated OpenAI Chat Completion REST client with offline rule-based fallback handlers to run immediately at zero cost.
- **WebSocket Broker:** Configured STOMP broker for chat broadcasting and async follow-up queries typing simulations.
- **Playground Sandbox:** Safe syntactical compiler validating brace matches and printing console logs.

### Frontend: React + Next.js 14 + Tailwind CSS
- **Design System:** Custom theme mapping brand-blacks, charcoal panels, glowing borders, and neon effects.
- **Smooth Scrolling:** Integrated Lenis scrolling providers.
- **Interactive Pages:**
  1. **Home (`/`):** Cupertino-style hero sections, stats counters, and learning roadmaps.
  2. **Features (`/features`):** Interactive resume analyzers and target-job checklists.
  3. **Mock Console (`/mock`):** WebSocket-simulated chat loops and coding sandbox panels.
  4. **Analytics (`/dashboard`):** Skills progress radar tracking and coaching insights.
  5. **Enterprise Recruiter (`/enterprise`):** Candidate talent pool filters, ratings, and invite triggers.
  6. **Pricing (`/pricing`):** Premium SaaS tiers and collapse FAQs.

---

## Verification & Build Validation

### 1. Backend Compilation
We verified that the entire backend compiles without any errors on JDK 26 using Maven:
- **Command:** `mvn clean compile` inside `/backend`
- **Result:** `[INFO] BUILD SUCCESS` (compiling 39 source files including security mappings, WebSocket broker hooks, and JPA model classes).

### 2. Frontend Compilation
We compiled the Next.js production build to verify TypeScript typing safety and server-side pre-render checks:
- **Command:** `npm run build` inside `/frontend`
- **Result:** `✓ Compiled successfully` (generating static pages for `/`, `/features`, `/mock`, `/dashboard`, `/enterprise`, and `/pricing` with zero errors).

---

## Launch Instructions

Since Docker is not configured on the local host path, you can run the entire database-connected stack directly on Windows:

### Step 1: Ensure local PostgreSQL is active
- Make sure PostgreSQL is listening on port `5432` with username `postgres` and password `postgres`.
- Ensure the database `interviewacedb` is created.

### Step 2: Start the Spring Boot Backend
Open a terminal in `backend/` and run the cached Maven boot command:
```powershell
C:\Users\dexte\.m2\wrapper\dists\apache-maven-3.9.16-bin\5grr65jo27hi51sujmtcldfovl\apache-maven-3.9.16\bin\mvn.cmd spring-boot:run
```
Tomcat will start on port `8080` and auto-initialize the database schema tables.

### Step 3: Start the Next.js Frontend
Open a separate terminal in `frontend/` and run the Node dev server:
```powershell
npm.cmd run dev
```
The server will start on port `3000`. Open your browser to [http://localhost:3000](http://localhost:3000).

---

## Visual Design Showcase

Below is a generated visual mock-up of the premium dark-mode cinematic interface built for **InterviewAce AI**:

![InterviewAce AI Cinematic Interface Preview](C:\Users\dexte\.gemini\antigravity\brain\742fc510-aa72-4157-bf70-b989c7e7463c\interview_ace_homepage_ui_1781127992400.png)

