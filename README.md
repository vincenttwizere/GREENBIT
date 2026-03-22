## Green Bit Foundation

Full-stack food redistribution platform connecting restaurants and hotels with verified collectors for redistributing surplus food and tracking environmental impact.

### Overview

- **Backend**: Node.js + Express, Sequelize ORM, MySQL, JWTauth, bcrypt hashing.
- **Frontend**: React + Vite, React Router, Axios, context-based auth, responsive UI.

### Goals

- Reduce food waste by matching surplus inventory with local collection partners.
- Support role-based workflows: restaurant, collector, admin.
- Provide simple metrics (e.g., meals saved, CO₂ avoided).

---

## Getting Started

### Prerequisites

- Node.js v16+ and npm
- MySQL server (or compatible SQL).
- Git client for cloning repository.

### 1) Clone repository

```bash
git clone https://github.com/<your-org>/GREENBIT.git
cd GREENBIT
```

### 2) Backend Setup

```bash
cd Backend
npm install
```

- Copy `.env.example` to `.env`.
- Fill in app-specific values only. Example keys (do not commit secrets):
  - `PORT`
  - `DB_HOST`
  - `DB_NAME`
  - `DB_USER`
  - `DB_PASSWORD`
  - `JWT_SECRET`

- Apply database migrations and seed data as needed. You can run any included setup or seed script (see `utils/seed.js`).

- Start backend:

```bash
npm run dev
```

### 3) Frontend Setup

```bash
cd ../Fronted
npm install
```

- Copy `.env.example` to `.env`.
- Set `VITE_API_URL` to your backend base URL, e.g. `http://localhost:5000/api`.

- Start frontend:

```bash
npm run dev
```

---

## Environment Variables

**Do not include real credentials, tokens, or secret keys in source control.**
Use a `.env` file managed outside Git and add `.env` to `.gitignore`.

Backend environment variables should include:
- `PORT`
- `DB_HOST`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`

Frontend environment variables should include:
- `VITE_API_URL`

---

## Security notes

- Replace all default seeds and credentials for production use.
- Use strong, random `JWT_SECRET` and database password.
- Avoid putting any email/password, port, or sensitive strings into the repository.

---

## Usage

- Register as restaurant/collector via UI.
- Admin role management and approval flow is available under `/admin`.
- Restaurant can create surplus entries and track status.
- Collector can accept and complete pickups.

---

## Common Commands

From `Backend`:
- `npm run dev` (development server)
- `npm run start` (production)

From `Fronted`:
- `npm run dev`
- `npm run build`

---

## Contribution

- Create feature branches from `main`.
- Add tests where applicable.
- Open PR for review; do not include `.env` or secrets.

---

## Notes

Sensitive information (user passwords, emails, database credentials, port numbers, etc.) belongs in secure configuration (`.env`) not in `README.md` or git history.


