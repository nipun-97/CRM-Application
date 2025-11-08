# CRM Application

A full-stack CRM (Customer Relationship Management) application built with React, TypeScript, Express, and PostgreSQL. This application allows you to manage customer accounts with full CRUD (Create, Read, Update, Delete) operations.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL 15 (via Docker)
- **ORM**: Prisma
- **Testing**: Vitest (backend), Playwright (frontend e2e)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Docker** and **Docker Compose** (for running PostgreSQL database)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CRM-Application
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

### 4. Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crm_db?schema=public"
PORT=5000
```

Optionally, create a `.env` file in the `frontend` directory if you need to override the API URL:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Database Setup / Migration Steps

### 1. Start the Database

From the `backend` directory, start the PostgreSQL database using Docker Compose:

```bash
cd backend
docker-compose up -d
```

This will start a PostgreSQL container on port `5432` with:
- Database name: `crm_db`
- Username: `postgres`
- Password: `postgres`

### 2. Run Prisma Migrations

Generate the Prisma Client and apply database migrations:

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

This will:
- Generate the Prisma Client based on the schema
- Create the database tables according to the Prisma schema
- Apply any pending migrations

### 3. (Optional) View Database in Prisma Studio

To view and manage your database through a GUI:

```bash
cd backend
npx prisma studio
```

This will open Prisma Studio in your browser at `http://localhost:5555`.

## How to Run the Application

### Start the Database

Make sure the database is running:

```bash
cd backend
docker-compose up -d
```

### Start the Backend Server

From the `backend` directory:

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:5000` (or the port specified in your `.env` file).

### Start the Frontend Development Server

From the `frontend` directory (in a new terminal):

```bash
cd frontend
npm start
```

The frontend application will be available at `http://localhost:5173`.

### Access the Application

Open your browser and navigate to `http://localhost:5173` to use the CRM application.

## How to Run Tests

### Backend Tests

Backend tests are written using Vitest. To run the tests:

```bash
cd backend
npm test
```

To run tests in watch mode:

```bash
cd backend
npm test -- --watch
```

### Frontend E2E Tests

Frontend end-to-end tests are written using Playwright. To run the e2e tests:

```bash
cd frontend
npx playwright test
```

To run tests in headed mode (with browser UI):

```bash
cd frontend
npx playwright test --headed
```

To run tests in UI mode:

```bash
cd frontend
npx playwright test --ui
```

**Note**: Make sure both the frontend and backend servers are running before executing e2e tests, or configure Playwright to handle the API mocks as done in the test file.

## Project Structure

```
CRM-Application/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server entry point
│   │   ├── prisma.ts             # Prisma client configuration
│   │   ├── routes/
│   │   │   └── accounts.ts       # Account API routes
│   │   ├── services/
│   │   │   ├── AccountService.ts # Business logic
│   │   │   └── __tests__/        # Service tests
│   │   └── repositories/
│   │       └── AccountRepository.ts # Data access layer
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   ├── docker-compose.yml        # Database configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Main application component
│   │   ├── components/
│   │   │   ├── AccountsTable.tsx # Accounts list component
│   │   │   └── AccountForm.tsx   # Account form component
│   │   └── main.tsx              # React entry point
│   ├── tests/
│   │   └── e2e/
│   │       └── account-crud.spec.ts # E2E tests
│   └── package.json
└── README.md
```

## Brief Explanation of AI Workflow

This CRM application was developed using an AI-assisted workflow with Cursor IDE. The development process leveraged AI capabilities to:

1. **Rapid Prototyping**: AI assistance helped quickly scaffold the full-stack application structure, including React components, Express routes, and Prisma schema definitions.

2. **Code Generation**: AI generated boilerplate code for CRUD operations, form validation, API endpoints, and database repository patterns, significantly reducing development time.

3. **Best Practices**: AI suggestions helped ensure code follows modern best practices, including:
   - TypeScript type safety
   - Separation of concerns (Repository, Service, Route layers)
   - Error handling patterns
   - Form validation with Zod
   - Testing strategies

4. **Iterative Refinement**: The AI workflow enabled rapid iteration, allowing for quick adjustments to components, services, and test cases based on requirements.

5. **Documentation**: AI assistance was used to generate comprehensive documentation, including this README, code comments, and test specifications.

This AI-assisted approach allowed for faster development while maintaining code quality and following industry standards.

## Features

- ✅ Create, Read, Update, Delete (CRUD) operations for accounts
- ✅ Form validation with React Hook Form and Zod
- ✅ Responsive UI with modern design
- ✅ Type-safe API with TypeScript
- ✅ Database migrations with Prisma
- ✅ Unit tests for backend services
- ✅ End-to-end tests for frontend workflows

## API Endpoints

- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:id` - Get account by ID
- `POST /api/accounts` - Create a new account
- `PUT /api/accounts/:id` - Update an account
- `DELETE /api/accounts/:id` - Delete an account

## License

ISC

