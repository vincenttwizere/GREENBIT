## Green Bit Foundation

Full-stack food redistribution platform that connects hotels and restaurants with verified collectors to redistribute surplus food and track environmental impact.

### Stack

- **Backend**: Node.js, Express.js, MySQL, Sequelize, JWT, bcryptjs
- **Frontend**: React (Vite), React Router, Axios, Context API, custom CSS

### Prerequisites

- Node.js and npm installed
- MySQL server running locally

### Backend Setup

1. Navigate to the backend folder:

   ```bash
   cd Backend
   ```

2. Create a `.env` file (or edit the existing one) based on `.env.example`:

   ```bash
   PORT=5000
   DB_HOST=localhost
   DB_NAME=greenbit_db
   DB_USER=root
   DB_PASSWORD=YOUR_DB_PASSWORD_HERE
   JWT_SECRET=CHANGE_ME_TO_A_STRONG_SECRET
   ```

3. Ensure the `greenbit_db` database exists in MySQL:

   ```sql
   CREATE DATABASE greenbit_db;
   ```

4. Install dependencies (already done once, but safe to re-run):

   ```bash
   npm install
   ```

5. Start the backend in development mode:

   ```bash
   npm run dev
   ```

   The server will:

   - Connect to MySQL and sync models
   - Seed one admin, one restaurant, and one verified collector user
   - Expose the API at `http://localhost:5000/api`

### Frontend Setup

1. Navigate to the frontend folder:

   ```bash
   cd Fronted
   ```

2. Configure the API base URL by creating `.env` from `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Adjust `VITE_API_URL` if your backend runs on a different host/port.

3. Install dependencies (already done once, but safe to re-run):

   ```bash
   npm install
   ```

4. Start the frontend dev server:

   ```bash
   npm run dev
   ```

5. Open the URL printed by Vite (typically `http://localhost:5173`) in your browser.

### Default Seeded Users

- **Admin**
  - Email: `admin@greenbit.org`
  - Password: `AdminPass123!`

- **Restaurant**
  - Email: `restaurant@greenbit.org`
  - Password: `Restaurant123!`

- **Collector (verified)**
  - Email: `collector@greenbit.org`
  - Password: `Collector123!`

### Key Features

- Role-based dashboards for **restaurant**, **collector**, and **admin**
- JWT-based auth with protected routes on both backend and frontend
- Restaurant: report surplus, view surplus list, impact summary (meals & CO₂ saved)
- Collector: available pickups, assigned pickups, confirm pickup & delivery, history
- Admin: manage users, verify collectors, monitor surplus, analytics with simple chart
- Green-focused design system using Tailwind, with smooth, responsive UI

