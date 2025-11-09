# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LTI (Talent Tracking System) is a full-stack application for managing candidate information with a React frontend and Express/TypeScript backend using Prisma ORM with PostgreSQL.

## Development Environment

### Required Versions
- **Node.js**: v22.20.0 (or compatible LTS version)
- **npm**: 10.9.3 (or compatible version)

The project uses TypeScript 4.9.5 for backend and 5.9.3 for root-level configuration.

## Architecture

### Backend Architecture (Layered Architecture)
- **Presentation Layer** (`src/presentation/`): Controllers that handle HTTP requests/responses
- **Application Layer** (`src/application/`): Business logic and services (candidateService, fileUploadService)
- **Domain Layer** (`src/domain/`): Domain models and entities
- **Routes** (`src/routes/`): API route definitions
- **Infrastructure**: Prisma ORM for database access (PostgreSQL)

The backend uses dependency injection pattern - Prisma client is attached to Express Request object via middleware in `src/index.ts`.

### Frontend Architecture
- React application (Create React App)
- Components in `src/components/`: AddCandidateForm, FileUploader, RecruiterDashboard
- Services in `src/services/`: API client for backend communication
- Uses React Bootstrap for UI components

## Development Commands

### Initial Setup
```bash
# Install dependencies for both frontend and backend
cd frontend && npm install
cd ../backend && npm install

# Start PostgreSQL database
docker-compose up -d

# Generate Prisma client and apply migrations
cd backend
npx prisma generate
npx prisma migrate dev
```

### Backend Development
```bash
cd backend

# Development mode with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production server
npm start

# Run tests
npm test
```

### Frontend Development
```bash
cd frontend

# Start development server (runs on http://localhost:3000)
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Database Management
```bash
cd backend

# Initialize Prisma (if needed)
npm run prisma:init

# Generate Prisma client after schema changes
npm run prisma:generate

# Create and apply new migration
npx prisma migrate dev

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Docker Commands
```bash
# Start PostgreSQL container
docker-compose up -d

# Stop PostgreSQL container
docker-compose down

# View container logs
docker-compose logs -f
```

## Key Configuration

### Ports
- Backend API: `http://localhost:3010`
- Frontend: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

### Environment Variables
Backend requires `.env` file in `backend/` directory with:
- `DATABASE_URL`: PostgreSQL connection string

Root `.env` file contains Docker environment variables:
- `DB_PASSWORD`, `DB_USER`, `DB_NAME`, `DB_PORT`

### API Endpoints
- `POST /candidates`: Create new candidate with educations, workExperiences, and CV
- `GET /candidates`: List all candidates
- `POST /upload`: Upload files

## Database Schema

Main entities (see `backend/prisma/schema.prisma`):
- **Candidate**: firstName, lastName, email, phone, address
- **Education**: institution, title, startDate, endDate (linked to Candidate)
- **WorkExperience**: company, position, description, startDate, endDate (linked to Candidate)
- **Resume**: CV file metadata (linked to Candidate)

## Testing

The project uses Jest for testing:
- Root level: Jest and ts-jest configured for TypeScript
- Backend: Jest with ts-jest
- Frontend: Jest with React Testing Library

Run tests from respective directories using `npm test`.

## Important Notes

- Backend compiles TypeScript from `src/` to `dist/`
- Prisma schema is located at `backend/prisma/schema.prisma`
- Frontend uses TypeScript and JavaScript files (transitioning to TypeScript)
- CORS is configured to allow requests from `http://localhost:3000`
- File uploads are handled via multer service
