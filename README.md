# Food Ordering Platform (MERN)

A full-stack starter project for the Skyrovix Task 5 — Food Ordering Platform.

## Features
- Responsive React food-ordering UI with category filters, search, menu cards and cart.
- Add/remove items, change quantities, subtotal, delivery fee and total.
- Checkout form with customer details and order confirmation.
- Express REST API for menu items and orders.
- MongoDB support with graceful demo mode when `MONGO_URI` is not configured.
- Seeded sample menu data in demo mode.
- Basic input validation and order status tracking endpoint.

## Requirements
- Node.js 18+ (Node LTS recommended)
- MongoDB local or MongoDB Atlas (optional for demo mode)

## Run locally (Windows PowerShell)
Open two terminals.

### 1. Backend
```powershell
cd server
npm.cmd install
Copy-Item .env.example .env
npm.cmd run dev
```
Backend runs at `http://localhost:5000`.

To persist data, edit `server/.env` and set `MONGO_URI` to your MongoDB connection string. If it is blank, the API uses in-memory demo data for the current server session.

### 2. Frontend
```powershell
cd client
npm.cmd install
npm.cmd run dev
```
Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

## API
- `GET /api/health` — health check
- `GET /api/menu` — list menu items; optional `?category=Pizza` and `?q=cheese`
- `POST /api/orders` — create an order
- `GET /api/orders/:id` — get order details
- `PATCH /api/orders/:id/status` — update status (`Placed`, `Preparing`, `Out for delivery`, `Delivered`, `Cancelled`)

## Project structure
```text
Food_Ordering_Platform_MERN/
  client/
    src/
      components/
      App.jsx
      main.jsx
      styles.css
    package.json
    vite.config.js
  server/
    models/
    routes/
    server.js
    package.json
    .env.example
  README.md
```

## Notes
This is a learning/submission starter, not a production payment system. It does not collect card details or integrate a payment gateway. Add authentication, rate limiting, payment integration and deployment secrets before production use.
