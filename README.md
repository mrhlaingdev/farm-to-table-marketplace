# farm-to-table-marketplace
# Product Requirements Document (PRD) & Technical Specification
## Project: Farm-to-Table Marketplace (Mandalay to Yangon)

### 1. Overview & Objective
A direct-to-restaurant marketplace connecting organic farms outside Mandalay to restaurants in Yangon, eliminating middlemen and cutting out 40% margins.

### 2. User Roles
1. **Farm Admin:** Manages produce inventory, price, stock, and order fulfillment.
2. **Restaurant Buyer:** Browses seasonal produce, places bulk orders, and tracks status.
3. **Delivery Tracker:** Updates dispatch and delivery milestones in real-time.

### 3. Core Features
- **Product Catalog:** Filter by seasonality, bulk availability, and farm origin.
- **Order Management:** Multi-item ordering with dynamic total calculations.
- **Inventory Management:** Real-time stock reduction upon confirmed orders.
- **Delivery Tracking:** Status flow (`Pending` -> `Dispatched` -> `In Transit` -> `Delivered`).

### 4. System Architecture & Tech Stack Decisions
- **Frontend & Backend:** Next.js (App Router) / React with Tailwind CSS
- **Database:** PostgreSQL (via Supabase) / Prisma ORM
- **Deployment:** Vercel
