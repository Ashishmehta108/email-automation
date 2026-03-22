# Email Automation - Project Context

## Project Overview

**Email Automation** is a TypeScript-based REST API application that generates personalized PDF certificates and emails them to students using Gmail's OAuth2 authentication. The application features a **certificate template editor** that allows creating and customizing certificate designs, with Drizzle ORM for PostgreSQL database operations, Better-Auth for authentication, and Express.js for the API layer.

## Refactored Architecture

```
email-automation/
├── src/
│   ├── index.ts                      # Express server entry point
│   ├── db/
│   │   ├── schema.ts                 # Drizzle ORM schema (PostgreSQL)
│   │   ├── index.ts                  # Database connection (Pg pool)
│   │   └── migrate.ts                # Database migrations
│   ├── repository/                   # Data access layer
│   │   ├── student.repository.ts     # Student CRUD operations
│   │   ├── certificate.repository.ts # Certificate CRUD operations
│   │   ├── email-log.repository.ts   # Email log CRUD operations
│   │   └── certificate-template.repository.ts # Template CRUD operations
│   ├── services/                     # Business logic layer
│   │   ├── auth.service.ts           # Better-Auth configuration
│   │   ├── certificate.service.ts    # PDF generation with templates
│   │   └── email.service.ts          # Email sending with Nodemailer
│   ├── routes/                       # API route handlers
│   │   ├── index.ts                  # API route aggregator
│   │   ├── student.routes.ts         # Student REST endpoints
│   │   ├── certificate.routes.ts     # Certificate REST endpoints
│   │   ├── certificate-template.routes.ts # Template editor endpoints
│   │   └── auth.routes.ts            # Authentication endpoints
│   ├── dto/                          # Data Transfer Objects
│   │   ├── common.dto.ts             # Common response types
│   │   ├── student.dto.ts            # Student DTOs
│   │   ├── certificate.dto.ts        # Certificate DTOs
│   │   ├── certificate-template.dto.ts # Template DTOs
│   │   └── auth.dto.ts               # Auth DTOs
│   ├── types/                        # Centralized types
│   │   └── index.ts                  # All shared types and interfaces
│   └── validation/                   # Zod validation schemas
│       └── index.ts                  # All validation schemas
├── input/
│   └── students.csv                  # Input CSV with student data
├── output/                           # Generated PDF certificates
├── drizzle/                          # Drizzle migrations (auto-generated)
├── drizzle.config.ts                 # Drizzle Kit configuration
├── .env.example                      # Environment configuration template
└── QWEN.md                           # This file
```

## Technology Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js with TypeScript (ES Modules) |
| Framework | Express.js 5 |
| Database | PostgreSQL 14+ |
| ORM | Drizzle ORM |
| Authentication | Better-Auth |
| Validation | Zod (centralized in `/validation`) |
| PDF Generation | PDFKit |
| Email | Nodemailer with Gmail OAuth2 |
| CSV Parsing | PapaParse |
| Concurrency | p-limit |

## Building and Running

### Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Gmail account with OAuth2 credentials configured (for email functionality)

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and configure:

```env
# Server
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/email_automation

# Gmail OAuth2 Credentials
GMAIL_USER=you@gmail.com
GMAIL_CLIENT_ID=<your-oauth-client-id>
GMAIL_CLIENT_SECRET=<your-oauth-client-secret>
GMAIL_REFRESH_TOKEN=<your-oauth-refresh-token>

# Certificate Configuration
CERT_EVENT_NAME=Hackathon 2025
CERT_ISSUED_BY=Acme Organization
CERT_DATE=March 2025

# Better-Auth Secret
BETTER_AUTH_SECRET=your-secret-key-here-at-least-32-chars
```

### Commands

| Command | Description |
|---------|-------------|
| `npm start` | Run the application |
| `npm run dev` | Run with hot reload (tsx watch) |
| `npm run build` | Type-check the project |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |

### PostgreSQL Setup

1. Create a PostgreSQL database:
```bash
createdb email_automation
```

2. Or using psql:
```sql
CREATE DATABASE email_automation;
```

3. Run migrations:
```bash
npm run db:generate
npm run db:migrate
```

## API Endpoints

### Students

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | List all students (supports `?search`, `?limit`, `?offset`) |
| GET | `/api/students/:id` | Get student by ID |
| POST | `/api/students` | Create a new student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

### Certificates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/certificates` | List all certificates (supports filtering) |
| GET | `/api/certificates/:id` | Get certificate by ID |
| POST | `/api/certificates` | Create a certificate record |
| POST | `/api/certificates/generate` | Generate a PDF certificate (supports `templateId`) |
| POST | `/api/certificates/generate/bulk` | Generate multiple certificates |
| PUT | `/api/certificates/:id` | Update a certificate |
| DELETE | `/api/certificates/:id` | Delete a certificate |

### Certificate Templates (Editor)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/templates` | List all templates |
| GET | `/api/templates/active` | List active templates only |
| GET | `/api/templates/:id` | Get template by ID |
| POST | `/api/templates` | Create a new certificate template |
| PUT | `/api/templates/:id` | Update a template |
| PATCH | `/api/templates/:id/toggle` | Toggle template active status |
| POST | `/api/templates/:id/preview` | Generate a preview PDF |
| DELETE | `/api/templates/:id` | Delete a template |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/sign-up` | Register a new user |
| POST | `/api/auth/sign-in` | Sign in with email/password |
| POST | `/api/auth/sign-out` | Sign out current session |
| GET | `/api/auth/session` | Get current session |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Get dashboard statistics |
| GET | `/api/health` | Health check endpoint |
| GET | `/` | API info and available endpoints |

## Database Schema

### Tables

1. **users** - Authentication users (Better-Auth)
2. **sessions** - User sessions (Better-Auth)
3. **accounts** - OAuth provider accounts (Better-Auth)
4. **students** - Certificate recipients
5. **certificate_templates** - Certificate template designs with customization options
6. **certificates** - Generated certificates with status tracking (linked to templates)
7. **email_logs** - Email delivery logs

## Code Organization

### Types (`/src/types`)

All TypeScript types and interfaces are centralized in the `types` folder:
- Database entity types (re-exported from schema)
- Repository input/output types
- Service types
- API response types
- DTO base types

### Validation (`/src/validation`)

All Zod validation schemas are centralized in the `validation` folder:
- `createStudentSchema`, `updateStudentSchema`
- `createCertificateSchema`, `generateCertificateSchema`
- `createTemplateSchema`, `updateTemplateSchema`
- `signUpSchema`, `signInSchema`
- Parameter and query schemas

### Repository Pattern

Each entity has a repository class with standard CRUD operations:

```typescript
import { studentRepository } from './repository/student.repository.js';

// Create
const student = await studentRepository.create({
  name: 'John Doe',
  rollNo: '2024001',
  email: 'john@example.com'
});

// Find
const found = await studentRepository.findById(1);

// Update
const updated = await studentRepository.update(1, { name: 'Jane Doe' });

// Delete
await studentRepository.delete(1);
```

### Service Layer

Services contain business logic and orchestrate between repositories:

- `CertificateService` - PDF generation using PDFKit with template support
- `EmailService` - Email sending with logging
- `AuthService` - Better-Auth configuration

### Routes

Routes handle HTTP requests, validate input using Zod schemas, and call repositories/services:

```typescript
import { createStudentSchema } from '../validation/index.js';

router.post('/', async (req, res) => {
  const validatedData = createStudentSchema.parse(req.body);
  const student = await studentRepository.create(validatedData);
  return res.json({ success: true, data: student });
});
```

## Example API Usage

### Create a Certificate Template

```bash
curl -X POST http://localhost:3000/api/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Classic Blue & Gold",
    "description": "Traditional certificate with blue and gold theme",
    "backgroundColor": "#FFFFFF",
    "showBorder": true,
    "borderColor": "#1B2B4B",
    "titleText": "Certificate of Achievement",
    "titleColor": "#1B2B4B"
  }'
```

### Generate Certificate with Template

```bash
curl -X POST http://localhost:3000/api/certificates/generate \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "templateId": 1,
    "eventName": "Hackathon 2025",
    "issuedBy": "Acme Organization",
    "issueDate": "March 2025"
  }'
```

### Preview a Template

```bash
curl -X POST http://localhost:3000/api/templates/1/preview \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "Sample Event",
    "issuedBy": "Sample Org",
    "issueDate": "January 2025"
  }'
```
