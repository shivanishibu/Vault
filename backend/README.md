# Vault Backend

JavaScript/Node.js API for the India-first Vault digital asset marketplace.

## Run

```powershell
npm install
npm run dev
```

The API runs at `http://localhost:8080/api` and accepts the Vite frontend at `http://localhost:5173`.

Seeded demo account:

- Email: `riya@northstar.in`
- Any non-empty password

## Included API groups

- Auth and registration
- Products and marketplace search
- Transactions and INR escrow payments
- PatentForge IP transfer status
- Messages and notifications
- Buyer, seller, and admin dashboards
- Product verification and AI safety reports
- Support tickets

This version uses an in-memory store for local development. Payments are simulated and never send data to a provider. For production, replace the store with PostgreSQL or MongoDB, add hashed passwords and signed JWT validation, and connect a PCI-compliant payment provider using environment variables.
