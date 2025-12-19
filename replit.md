# Enquiry Admin

## Overview
A full-stack admin dashboard for managing enquiries with user authentication, plans, coupons, and ticketing system.

## Project Structure
- `/src` - Angular 17 frontend
  - `/app/Auth` - Authentication components (login, auth guard)
  - `/app/layout` - Layout components (header, sidebar, main)
  - `/app/Master` - Feature components (dashboard, users, coupons, plans, tickets, etc.)
- `/Server` - Node.js/Express backend
  - `/config` - Database & configuration setup
  - `/controller` - Request handlers
  - `/models` - MongoDB schemas
  - `/services` - Business logic
  - `/router` - API routes
  - `/middleware` - Auth & request processing

## Tech Stack
- **Frontend**: Angular 17, PrimeNG 17, RxJS, SCSS
- **Backend**: Express.js, MongoDB, Mongoose, Bcrypt, JWT
- **Payments**: Razorpay integration
- **Email**: Nodemailer for notifications

## Running the Project
Both workflows are configured and running:

**Frontend** (Port 5000):
```bash
npm run start
```

**Backend** (Port 3001):
```bash
cd Server && npm start
```

## Configuration
- Frontend API endpoint: `http://localhost:3001/` (in `src/environment/environment.ts`)
- Backend database: MongoDB (configured in `Server/config/config.js`)
- Firebase: Optional (disabled if service-account.json not present)

## Deployment
- Build: `npm run build`
- Output: `dist/enquiry-admin/browser`
