# SyllabusSync 🎓
### Complete Real-Time Collaborative Study Tracker for KTU B.Tech 2019 Scheme (S7)

[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Realtime-3ecf8e.svg)](https://supabase.com/)
[![Tests](https://img.shields.io/badge/Vitest-Acceptance_Tests_Passing-brightgreen.svg)](https://vitest.dev/)

**SyllabusSync** is a production-grade, collaborative syllabus tracking and examination intelligence web application custom-built for university students preparing for **APJ Abdul Kalam Technological University (KTU)** B.Tech Degree Examinations (2019 Scheme, Semester 7).

---

## 📌 1. University & Syllabus Alignment

SyllabusSync is structured around the authentic KTU S7 2019 Scheme curriculum extracted directly from the official university syllabus:

| Course Code | Subject Name | Modules | Lecture Hours | Verified Leaf Topics | Exam Marks |
|:---|:---|:---:|:---:|:---:|:---:|
| **CST401** | Artificial Intelligence (AI) | 5 Modules | 36 hrs | 36 Leaf Topics | 100 Marks |
| **ECT425** | Biomedical Instrumentation (BMI) | 5 Modules | 35 hrs | 35 Leaf Topics | 100 Marks |
| **CST433** | Security in Computing (SIC) | 5 Modules | 35 hrs | 36 Leaf Topics | 100 Marks |
| **Total** | **15 Modules** | **15 Modules** | **106 hrs** | **107 Leaf Topics** | **300 Marks** |

### Complete Module Coverage
- **CST401 (AI)**:
  - Module 1: Introduction to AI & Intelligent Agents (PEAS, Environment types, Agent structures)
  - Module 2: Problem Solving by Searching (BFS, DFS, Uniform-Cost, Iterative Deepening, A\*, Heuristics)
  - Module 3: Beyond Classical Search & Game Playing (Hill Climbing, Simulated Annealing, Genetic Algorithms, Minimax, Alpha-Beta Pruning)
  - Module 4: Knowledge Representation & Logic (Propositional Logic, First-Order Logic, Forward/Backward Chaining, Resolution)
  - Module 5: Planning & Learning (STRIPS, Partial Order Planning, Decision Trees, Supervised/Unsupervised Learning)
- **ECT425 (BMI)**:
  - Module 1: Bioelectric Signals & Electrodes (Action Potential, ECG, EEG, EMG, Electrode-tissue interface)
  - Module 2: Cardiovascular Measurements & Blood Pressure (ECG Lead Systems, Sphygmomanometer, Blood Flow Meters, Heart Sounds)
  - Module 3: Respiratory & Clinical Laboratory Equipment (Spirometers, Gas Analyzers, Blood Cell Counters, Spectrophotometry)
  - Module 4: Therapeutic Equipment (Cardiac Pacemakers, Defibrillators, Hemodialysis, Surgical Diathermy)
  - Module 5: Diagnostic Imaging & Electrical Safety (X-ray, CT, MRI, Ultrasound, Micro/Macroshock, Grounding, Isolation)
- **CST433 (SIC)**:
  - Module 1: Computer Security Concepts & Classical Encryption (CIA Triad, Attacks, Caesar, Playfair, Hill Cipher, Transposition)
  - Module 2: Symmetric Key Cryptography (DES, Triple-DES, AES, Block Cipher Modes: ECB, CBC, CFB, OFB, CTR)
  - Module 3: Asymmetric Key Cryptography & Key Management (RSA, Diffie-Hellman, Elliptic Curve, Key Distribution)
  - Module 4: Integrity, Authentication & Digital Signatures (SHA-512, MD5, HMAC, Digital Signature Algorithm)
  - Module 5: System & Network Security (Buffer Overflow, Firewalls, IDS/IPS, Malicious Software, Kerberos)

---

## ⚡ 2. Architecture & Dual-Mode Storage Engine

SyllabusSync uses a **dual-mode resilient architecture**:
1. **Native Cloud Supabase Mode**: Connects to Supabase PostgreSQL with Row Level Security (RLS), Supabase Auth, and Supabase Realtime Channels.
2. **Local Relational Database Engine (`src/services/localDatabase.ts`)**: When Supabase environment variables are unconfigured, the application runs on a local relational storage engine with multi-tab `BroadcastChannel` realtime synchronization, foreign-key cascade integrity, leaf-topic math calculation, and audit logging. **Zero mock data or hardcoded percentages.**

```
┌────────────────────────────────────────────────────────┐
│               SyllabusSync Frontend                     │
│         React 19 + TypeScript + Tailwind CSS           │
└──────────────────────────┬─────────────────────────────┘
                           │
                 [ src/services/api.ts ]
                 Dual-Mode Storage Router
                /                        \
      (If .env configured)        (Fallback / Local Mode)
              │                                  │
    ┌─────────▼────────┐               ┌─────────▼────────┐
    │  Cloud Supabase  │               │ Local Relational │
    │    PostgreSQL    │               │  Storage Engine  │
    │  Row Level Sec.  │               │ BroadcastChannel │
    │ Supabase Realtime│               │ Multi-tab Sync   │
    └──────────────────┘               └──────────────────┘
```

---

## 🧮 3. Key Mathematical Formulas

### Leaf-Level Completion Formula
To prevent parent modules from artificially inflating progress percentages, all subject, module, and overall progress is computed strictly from active leaf topics:

$$\text{Completion Percentage} = \left(\frac{\text{Completed Leaf Topics}}{\text{Total Active Leaf Topics}}\right) \times 100$$

- Parent topics reflect their children: checked if all leaf children are completed, indeterminate if partially completed.
- Empty categories render clean `0%` empty states without division-by-zero errors.

### Exam Readiness Score (Planning Heuristic)
The Exam Readiness indicator is an explicit, transparent study planning heuristic calculated as:

$$\text{Exam Readiness} = (0.45 \times \text{Overall Coverage}) + (0.35 \times \text{High-Priority Coverage}) + (0.20 \times \text{Revision Factor})$$

> **Disclaimer**: The Exam Readiness Score is a study planning heuristic designed to guide your revision schedule. It is not an official forecast or guarantee of university grades.

---

## 🔍 4. PYQ Intelligence Engine

Analyzes authentic KTU previous year examination papers across **Dec 2022, May 2023, Dec 2023, and Jan 2024**:
- **Exam Question Distribution**:
  - **Part A**: 10 questions $\times$ 3 marks = 30 marks (2 questions from each module)
  - **Part B**: 5 questions $\times$ 14 marks = 70 marks (1 question from each module with internal choice)
- **Question Frequency Tracking**: Flags questions appearing in $\ge 2$ university sessions with occurrence tags.
- **Repeated Algorithms & Diagrams Bank**: Highlighting compulsory questions like $A^*$ Search, Alpha-Beta Pruning, AES MixColumns, ECG 12-lead systems, and Cardiac Pacemaker circuitry.
- **Paper Uploader**: Allows uploading and previewing past question papers with metadata.

---

## 👥 5. Realtime Peer Collaboration & Friend Synergy

- **Instant Peer Synchronization**: When you check off a topic in one tab or device, authorized friends' dashboards update in real time.
- **Friend Comparison View**: Side-by-side completion comparison across all 3 subjects, showing shared mastered topics, exclusive topics, and collaborative synergy badges.
- **Study Groups**: Create private study groups with unique 6-character invite codes, group-level syllabus customization, and peer leaderboards.
- **Privacy Controls**: Switch visibility between **Public**, **Friends Only**, and **Private**.

---

## 🛡️ 6. Strict RBAC & Super-Admin Console

SyllabusSync enforces Role-Based Access Control (**User**, **Admin**, **Super-Admin**):
- **Regular Users**:
  - Cannot delete other users' accounts.
  - Cannot overwrite the official university syllabus (prompts them to add a personal custom topic).
  - Can edit and delete their own personal subtopics safely.
- **Super-Admin**:
  - Realtime user management console (`/admin`).
  - View user profiles, college affiliations, and progress.
  - Delete individual user accounts with foreign-key cascade cleanup.
  - Bulk select and delete accounts.
  - **Protected Mass Deletion**: Requires typing the exact security phrase `DELETE ALL USERS PERMANENTLY`. All regular accounts are wiped cleanly, while the Super-Admin account is strictly preserved.
  - Complete tamper-evident audit logging with one-click CSV export.

---

## 🚀 7. Quick Start & Local Development

### Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm or yarn

### 1. Clone & Install
```bash
git clone https://github.com/your-repo/SyllabusSync.git
cd SyllabusSync
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:5173`.

### 3. Run Automated Acceptance Test Suite
```bash
npm test -- --run
```
All 9 automated acceptance tests verify syllabus integrity, leaf calculation, peer sync, RBAC security, and mass deletion safeguards.

### 4. Build for Production
```bash
npm run build
```
Creates an optimized, minified production bundle in the `dist/` directory.

---

## 🔐 8. Pre-Seeded Demonstration Accounts

Use the **Switch Account** dropdown in the top navbar to instantly test multi-user collaboration:

| Role | Username | Email | Seed Progress | Purpose |
|:---|:---|:---|:---:|:---|
| **Super Admin** | `superadmin` | `admin@syllabussync.edu` | System Coordinator | Administrative controls, user deletion, audit logs |
| **Student 1** | `arif_ktu` | `arif@ktu.edu` | ~70% (AI focus) | Test friend tracking and comparison |
| **Student 2** | `kailas_s7` | `kailas@ktu.edu` | ~76% (SIC focus) | Test friend comparison & synergy badges |
| **Student 3** | `lini_s7` | `lini@ktu.edu` | ~78% (BMI focus) | Test group collaboration |

You can also register a brand new account via `/register` to test clean-slate zero-progress initial states.

---

## ☁️ 9. Cloud Supabase Configuration

To connect SyllabusSync to your live cloud Supabase project:

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Run the schema migration script:
   ```sql
   -- Found in supabase/migrations/20261112_init_schema.sql
   ```
4. Run the seed data script:
   ```sql
   -- Found in supabase/seed.sql
   ```
5. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
6. Restart Vite: `npm run dev`. SyllabusSync will automatically switch to your cloud PostgreSQL database.

---

## 🌐 10. Deployment

### Netlify Deployment
Configuration file `netlify.toml` is included:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
Simply connect your GitHub repository to Netlify and deploy.

### Vercel Deployment
Configuration file `vercel.json` is included with single-page routing rewrites:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
Run `vercel` or link your repository in the Vercel dashboard.

---

## 📄 License & Attribution
Curriculum structure based on APJ Abdul Kalam Technological University (KTU) B.Tech 2019 Scheme syllabus for S7 Computer Science & Engineering and Electronics & Biomedical Engineering.
Developed for university students preparing for their examinations.
