# VERITY — Payment-Truth and Financial-Failure Intelligence Engine

> **VERITY is a payment-truth and financial-failure intelligence engine.**

It ingests payment observations across multiple providers (Merchant, Gateway, Bank, Webhook delivery) and determines the **safest defensible financial interpretation** without making unsafe financial commitments.

---

## Key Invariants & Guarantees

1. **I1 Idempotency**: Replaying duplicate events creates zero additional financial effects.
2. **I2 Deterministic Simulation**: `generate(scenario, seed)` yields byte-identical event sequences and resolutions.
3. **I3 & I7 Safe Ambiguity**: `POTENTIAL_DUPLICATE`, `CONFLICTING_STATE`, `INSUFFICIENT_EVIDENCE`, and `MANUAL_REVIEW` can **never** auto-create a financial transaction. Safe refusal (`MANUAL_REVIEW`) is a successful outcome.
4. **I4 One Transaction Per Intent**: Database `UNIQUE(intent_id)` constraint on `financial_transactions`.
5. **I5 Immutable Events**: `payment_events` table is append-only.
6. **I8 & I9 Single Ledger Write Path**: ONLY `create_financial_transaction(db, intent_id, attempt_id)` is authorized to write to `financial_transactions`.

---

## Architecture & Technology Stack

* **Backend Framework**: FastAPI (Python 3.12 / 3.13) - Port `8000`
* **Frontend Framework**: Next.js (React 18, Tailwind CSS) - Port `3000`
* **Database**: PostgreSQL 16 with SQLAlchemy 2.0 ORM & Alembic Migrations
* **Validation**: Pydantic v2 schemas
* **Testing**: Pytest & Hypothesis (Property-Based Testing)
* **Containerization**: Docker & Docker Compose

---

## Quickstart & Running Locally

### 1. Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL database running on `127.0.0.1:5432` with database `verity_db` created (or Docker).

### 2. Run with Docker Compose (Recommended)
Start database, backend (port 8000), and frontend (port 3000) simultaneously:
```bash
docker-compose up --build
```

### 3. Running Services Individually

#### Start Backend (Port 8000):
```bash
py -3.12 -m uvicorn app.main:app --reload --port 8000
```

#### Start Frontend (Port 3000):
```bash
npm run dev
# or inside /frontend directory:
cd frontend && npm run dev
```

---

## API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Application health check |
| `POST` | `/api/events` | Ingest raw payment observation webhook |
| `GET` | `/api/events` | List ingested payment events |
| `GET` | `/api/transactions` | List committed financial transactions |
| `GET` | `/api/transactions/:id` | Get transaction or intent details |
| `GET` | `/api/transactions/:id/timeline` | Get reconstructed chronological event timeline |
| `GET` | `/api/transactions/:id/analysis` | Get incident analysis & naive comparison |
| `POST` | `/api/transactions/:id/explain` | Generate natural language explanation |
| `GET` | `/api/incidents` | List financial incidents requiring review |
| `GET` | `/api/incidents/:id` | Get full incident detail |
| `POST` | `/api/incidents/:id/review` | Submit reviewer decision (`CONFIRM_ATTEMPT` / `MARK_DUPLICATE`) |
| `POST` | `/api/simulations` | Create simulation run |
| `POST` | `/api/simulations/:id/run` | Execute deterministic simulation scenario |
| `GET` | `/api/dashboard` | Get dashboard exposure metrics and summaries |

---

## Canonical Scenario Verification

Run the canonical network timeout retry scenario:

```bash
curl -X POST "http://localhost:8000/api/simulations/CANONICAL_DEMO/run?seed=42"
```

Expected Interpretation:
* **Observed Exposure**: ₹4,000
* **Candidate Legitimate Amount**: ₹2,000
* **Committed Ledger Amount**: ₹0
* **Aggregate State**: `POTENTIAL_DUPLICATE` / `MANUAL_REVIEW`
