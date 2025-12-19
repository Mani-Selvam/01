# Enquiry Admin

## Overview
An Angular 17-based admin dashboard application for managing enquiries. Built with PrimeNG UI components and connects to an external backend API.

## Project Structure
- `/src` - Angular frontend source code
  - `/app/Auth` - Authentication components
  - `/app/layout` - Layout components (header, sidebar, main)
  - `/app/Master` - Main feature components (dashboard, users, coupons, plans, etc.)
- `/Server` - Node.js/Express backend (uses external MongoDB)

## Tech Stack
- **Frontend**: Angular 17, PrimeNG 17, PrimeFlex, SCSS
- **Backend**: Node.js/Express with MongoDB (external API)
- **UI Components**: PrimeNG tables, forms, dialogs

## Development
- Frontend runs on port 5000
- Start: `npm run start`
- Build: `npm run build`

## Environment
The frontend connects to an external API defined in `src/environment/environment.ts`
