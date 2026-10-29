# CinePak — Cinema Booking UI Prototype

A responsive Pakistani cinema discovery and seat booking prototype:
- React + Vite frontend, with shared state managed by `CinemaContext` and `useReducer`
- Context-aware page components, so shared cinema state/actions do not need prop drilling
- Tailwind CSS via CDN
- City and cinema filters, featured movie carousel, showtimes, and interactive seat map
- Simulated checkout and booking references stored in browser local storage
- Node.js + Express backend (MVC-style routes/controllers)
- PostgreSQL schema and seed data

## Requirements
- Node.js 18+
- npm

## Quick start: show the frontend
From the project folder, open PowerShell and run:

```powershell
cd .\frontend
npm.cmd install
npm.cmd run dev
```

Open http://localhost:5173 in Chrome. The cinema listings, showtimes, seat availability, and booking flow are illustrative demo data. The frontend does not currently call the Express API. Tailwind and the sample movie artwork load from external URLs, so an internet connection is needed for those assets. Tailwind's CDN is convenient for this prototype; compile Tailwind locally and serve the assets yourself before production deployment.

Shared UI state and booking persistence live in `frontend\src\CinemaContext.jsx`; sample movie and cinema data is in `frontend\src\cinemaData.js`.

## Run with the backend and PostgreSQL
Install PostgreSQL 14+, create a database named `seatflow`, then run these commands from the project folder:

```powershell
psql -U postgres -d seatflow -f .\backend\db\schema.sql
psql -U postgres -d seatflow -f .\backend\db\seed.sql
cd .\backend
Copy-Item .env.example .env
```

Update `DB_USER` / `DB_PASSWORD` in `backend\.env`, then start the backend:

```powershell
npm.cmd install
npm.cmd run dev
```

The backend runs at http://localhost:5000; its health check is http://localhost:5000/api/health. It remains a separate starter service and is not connected to the CinePak interface.

## Demo notes
- Payment is intentionally MOCK only; it does not charge a card or transfer money.
- Demo bookings and occupied seats are saved in this browser's local storage; customer contact details are not saved.
- The checkout, availability, pricing, and QR-style ticket are simulated. The decorative QR placeholder is not scannable.
- The sample schedule is not live cinema inventory. Connect a cinema partner's API and payment gateway before accepting real bookings.
- Authentication, email verification, real payment gateway integration, and production security should be added before real-world use.
