# Resource Reservation Management System

A full-stack Next.js application for managing shared facilities and reservations in a growing organization. It helps coordinators track resources, prevent scheduling conflicts, and maintain a clear view of availability and booking history.

## Features

- Manage a catalog of shared resources such as meeting rooms, labs, equipment, and event spaces
- Create bookings with date, time range, purpose, and booker details
- Prevent overlapping reservations for the same resource
- Surface dashboard metrics for active resources, bookings today, and upcoming reservations
- Persist data in PostgreSQL via Prisma ORM
- Run locally using Docker for PostgreSQL or connect to a local PostgreSQL instance

## Tech stack

- Next.js App Router
- TypeScript
- Prisma ORM
- PostgreSQL
- CSS Modules / plain CSS

## Local setup

1. Copy `.env.example` to `.env` and update the database connection string if needed.
2. Start PostgreSQL:
   ```bash
   npm run db:up
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Generate Prisma client and create the schema:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
5. Start the application:
   ```bash
   npm run dev
   ```
6. Open http://localhost:3000

## PostgreSQL with Docker

The repository includes a `docker-compose.yml` file with a Postgres service so the app can run locally without any manual database installation.

## Demo behavior

The app includes sample data when no database is configured, so the dashboard can still render in a clean local setup before the PostgreSQL service is running.
