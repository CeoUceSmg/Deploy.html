# ViraForce Marketplace — Dedicated Deployment Management (`deploy.html`)

A dedicated, production-grade deployment operations workspace (`deploy.html`) extracted and redesigned from `vendor.html`, providing vendors with a centralized dashboard, product deployment workspace, independent V1 private content configuration, V2 buyer release-content manager, live preview, local draft auto-recovery, and verified Firestore deployment operations with seamless vendor login gating.

### User Review & Critical Decisions

> [!IMPORTANT]
> The vendor deployment architecture is separated into distinct operational workflows while strictly preserving the existing ViraForce Firebase project configuration, collections, field schemas, and vendor authorization rules.

- **Confirmed Decision 1 (Page Integration & Auth Gate)**: `deploy.html` is established as the primary deployment workstation. When an unauthenticated visitor or unverified vendor opens the page, an authentication clearance gate activates, prompting them with a clean in-line login modal to authenticate with their vendor email and password. Once authenticated and verified (`isVendor === true`), full access to their deployment workspace and product catalog is unlocked without redirect loops.
- **Confirmed Decision 2 (V1 vs. V2 Content Separation)**: V1 (vendor private deployment setup, access instructions, download archives, external repositories) and V2 (post-purchase release deliverables for buyers) remain strictly partitioned into dedicated workspaces. Each sub-workspace features a dedicated **Save & Return** control that saves drafts locally without prematurely publishing or releasing private assets to buyers.
- **Confirmed Decision 3 (Spark Plan Storage & Data Integrity)**: In accordance with Firebase Spark free-tier quotas and the 1 MiB Firestore document limit, media and digital deliverables are processed via client-side compression (< 800 KB base64 payloads) and external access URLs. Heavy binaries are never stored raw in document fields.

---

### 1. Overview & Core Concept

- **What It Does**: Enables verified marketplace sellers to manage product deployments across all delivery models (V1 instant digital asset, V2 manual custom service / work, V3 physical delivery, V4 physical with logistics), configure deliverable assets across 11 deployment subtypes, preview listings, retain safe offline drafts, and execute atomic Firestore deployments.
- **Target Audience / Persona**: ViraForce Marketplace vendors who need an organized, professional command center to stage, configure, preview, and deploy products without cluttering their everyday order fulfillment and chat dashboards.
- **Key Value**: Eliminates accidental exposure of unreleased deliverables, prevents draft data loss through structured local caching, and provides clear separation between vendor staging (V1) and customer vault fulfillment (V2).

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Security Clearance & Vendor Login*: System verifies Firebase auth state. If not signed in or not cleared, an interactive clearance gate with a modal login form appears. Upon login, vendor identity and store documents (`users/{uid}`) are loaded.
  2. *Deployment Dashboard*: Summarizes active statistics (Total Deployments, Active Listings, Drafts, Incomplete/Pending, Deliverables Staged), recent updates, and rapid action shortcuts.
  3. *Deploy New Listing*: Select an existing vendor product or initialize a new listing ID (`PID-XXXXXX-VFA`), binding the deployment to the existing catalog.
  4. *Product Deployment Workspace*: Central hub for the active deployment, showing status badges, product identifiers, and dedicated entry points to V1 and V2.
  5. *V1 Deployment Content Configuration*: Fullscreen sub-workspace with a multi-select deployment type selector (Account/Access, Course/Drive, WhatsApp/Community, Service, Digital Files, Software/APK, Physical Goods, Custom). Features live preview and concludes with a prominent **Save & Return** action.
  6. *V2 Release Content Configuration*: Dedicated sub-workspace for configuring the exact deliverable payload intended for purchased orders. Concludes with **Save & Return**.
  7. *Main Deploy Verification*: Reconciles local drafts, validates required fields, updates Firestore (`listings` and `deployments`), verifies cloud response, and confirms live deployment.

- **Visual Identity & Theme**:
  - *Canvas & Surfaces*: Premium VFA cyber-luxury theme. Deep space obsidian background (`#03040B`), radial ambient glows, glassmorphic panels (`rgba(10, 13, 20, 0.75)` with 1px border `rgba(255, 255, 255, 0.08)`).
  - *Accent Palette*: ViraForce Cyan (`#00E5FF`) for primary interactive deployment actions, VFA Gold (`#F5C000`) for tier clearance and status badges, Emerald (`#00FF9D`) for cleared states, and Pink (`#FF007F`) for warnings and validation alerts.
  - *Typography*: `Plus Jakarta Sans` for titles and section kickers, `Inter` for clean body labels, and `JetBrains Mono` with `tabular-nums` for identifiers, prices, and timestamps.
  - *Viewport & Layout*: Comprehensive desktop presence with a collapsible 260px sidebar navigation, mobile-responsive layout, zero two-line wrapping on action buttons, and touch-friendly controls.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Page Standalone HTML with Applet Mirroring**:
  - *Chosen Approach*: Deliver `deploy.html` as a complete, self-contained HTML page and configure `App.tsx` / `index.html` to load the full deployment interface natively on root (`/`) as well as `/deploy.html`.
  - *Why*: Satisfies both the user's explicit directive ("Do not build multiple pages. Only deploy.html full page please") and ensures the AI Studio preview loads `deploy.html` immediately upon boot.
- **Decision 2: Interactive In-Modal Login Gate**:
  - *Chosen Approach*: Replace hard redirect loops with an integrated clearance gate containing email and password fields, error toasts, and instant clearance verification.
  - *Why*: Allows vendors to log in directly on `deploy.html` without bouncing to external pages while maintaining zero unauthorized access to vendor data.
- **Decision 3: Dual-Layer Persistence (LocalStorage Draft + Firestore Document)**:
  - *Chosen Approach*: Cache working configuration in `localStorage` under `vfa_deploy_draft_${vendorId}_${productId}` on every input change and Save & Return action; write to Firestore only when the user explicitly clicks the main "EXECUTE DEPLOYMENT" button.
  - *Why*: Protects against tab closures, accidental navigation, and mobile disconnects while preventing runaway Firestore write costs on the free Spark tier.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Vendor Authentication Gate                      │
│      (Check auth.currentUser -> users/{uid} isVendor -> Login Modal)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Authorized
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     deploy.html Root Architecture                      │
│                                                                        │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │   Collapsible Sidebar   │  │   Sticky Topbar & Status Bar        │  │
│  │   • Dashboard           │  │   • Active Product Indicator        │  │
│  │   • New Deployment      │  │   • Draft Saving State              │  │
│  │   • Manage Deployments  │  │   • Vendor Tier Badge               │  │
│  │   • Return to Hub       │  └─────────────────────────────────────┘  │
│  └─────────────────────────┘                                           │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Active Viewport Switcher                      │  │
│  │                                                                  │  │
│  │  [View: Dashboard] ──> Statistics, Status Breakdown, Quick Actions│  │
│  │  [View: Deploy New] ──> Product Selector, Model Picker (V1-V4)   │  │
│  │  [View: Manage Deployments] ──> Searchable Table & Edit Actions  │  │
│  │  [View: Workspace] ──> Selected Product Hub                     │  │
│  │     ├─ Sub-View: V1 Content Workspace ─> Multi-Type Form & Prev  │  │
│  │     │                       └─ [SAVE & RETURN TO WORKSPACE]      │  │
│  │     ├─ Sub-View: V2 Release Workspace ─> Deliverable Config      │  │
│  │     │                       └─ [SAVE & RETURN TO WORKSPACE]      │  │
│  │     └─ Main Actions: Live Preview Modal & [EXECUTE DEPLOYMENT]   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Data Persistence & Reconciler                      │
│   • Local Storage Drafts: `vfa_deploy_draft_${uid}_${pid}`             │
│   • Firestore Collections: `listings`, `deployments`, `users`          │
│   • Compression: Canvas JPEG (max 800px, 0.7 quality) < 800KB          │
└────────────────────────────────────────────────────────────────────────┘
```

- **Data Models**:
  - `listings/{listingId}`: Preserves existing marketplace fields (`businessName`, `shortDescription`, `category`, `subCategory`, `normalPrice`, `promoPrice`, `deliveryModel`, `v1Payloads`, `specificDetails`, `imageUrl`, `searchTags`, `vendorId`, `verificationStatus`, `createdAt`, `updatedAt`).
  - `deployments/{deploymentId}`: Tracks deployment-specific metadata (`productId`, `vendorId`, `status`, `v1Config`, `v2ReleasePayload`, `lastSavedAt`, `deployedAt`).
  - `localStorage`: Auto-saves `vfa_deploy_draft_${uid}_${pid}` with timestamp and uncommitted form delta.

- **Interactive Handlers Checklist**:
  - `window.handleVendorLogin(e)`: Authenticates user credentials via Firebase Auth.
  - `window.switchDeployTab(tabId)`: Seamlessly switches views without reloading.
  - `window.selectProductForDeploy(pid)`: Binds deployment workspace to chosen product, checking for existing draft or cloud deployment.
  - `window.addDeploymentType(type)` / `window.removeDeploymentType(type)`: Dynamically mounts and unmounts specialized form panels.
  - `window.saveAndReturnV1()`: Validates V1 fields, commits to localStorage draft, and returns to workspace.
  - `window.saveAndReturnV2()`: Validates V2 deliverables, commits to localStorage draft, and returns to workspace.
  - `window.executeMainDeployment()`: Reconciles draft, executes Firestore update, handles network/permission errors, and shows verified toast.
  - `window.downloadChatPDF()` / `window.copyToClipboard()`: Android/browser-safe utilities.
