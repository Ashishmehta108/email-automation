# Email Automation API - Backend Summary

## Overview

This document provides a comprehensive overview of the Email Automation API backend, including all endpoints, request/response DTOs, and data models. This is intended for frontend developers to understand the API structure and integrate with the backend.

---

## Base URL

```
http://localhost:3000/api
```

---

## Authentication

The API uses **Better-Auth** for session-based authentication. All authenticated endpoints require a valid session cookie.

### Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/sign-up` | Register a new user |
| `POST` | `/api/auth/sign-in` | Sign in with email/password |
| `POST` | `/api/auth/sign-out` | Sign out current session |
| `GET` | `/api/auth/me` | Get current authenticated user |
| `GET` | `/api/session` | Get current session details |

---

## API Endpoints

### 1. Students API

Base: `/api/students`

#### 1.1 List All Students

```http
GET /api/students
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | `string` | No | Search by student name |
| `limit` | `number` | No | Number of results to return |
| `offset` | `number` | No | Offset for pagination |

**Response:** `StudentListResponse`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "rollNo": "2024001",
      "email": "john@example.com",
      "createdAt": "2025-03-22T10:00:00.000Z",
      "updatedAt": "2025-03-22T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

#### 1.2 Get Student by ID

```http
GET /api/students/:id
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `number` | Yes | Student ID |

**Response:** `StudentResponse`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "rollNo": "2024001",
    "email": "john@example.com",
    "createdAt": "2025-03-22T10:00:00.000Z",
    "updatedAt": "2025-03-22T10:00:00.000Z"
  }
}
```

---

#### 1.3 Create Student

```http
POST /api/students
```

**Request Body:** `CreateStudentDto`

```json
{
  "name": "John Doe",
  "rollNo": "2024001",
  "email": "john@example.com"
}
```

**Response:** `StudentResponse`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "rollNo": "2024001",
    "email": "john@example.com",
    "createdAt": "2025-03-22T10:00:00.000Z",
    "updatedAt": "2025-03-22T10:00:00.000Z"
  }
}
```

**Error Response (409 Conflict):**

```json
{
  "success": false,
  "error": "Student with this roll number already exists"
}
```

---

#### 1.4 Update Student

```http
PUT /api/students/:id
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `number` | Yes | Student ID |

**Request Body:** `UpdateStudentDto` (all fields optional)

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response:** `StudentResponse`

---

#### 1.5 Delete Student

```http
DELETE /api/students/:id
```

**Response:**

```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

---

### 2. Certificates API

Base: `/api/certificates`

#### 2.1 List All Certificates

```http
GET /api/certificates
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `studentId` | `number` | No | Filter by student ID |
| `status` | `string` | No | Filter by status: `pending`, `generated`, `sent`, `failed` |
| `eventName` | `string` | No | Filter by event name |
| `limit` | `number` | No | Number of results to return |
| `offset` | `number` | No | Offset for pagination |

**Response:** `CertificateListResponse`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "studentId": 1,
      "eventName": "Hackathon 2025",
      "issuedBy": "Acme Organization",
      "issueDate": "March 2025",
      "pdfPath": "/path/to/certificate.pdf",
      "status": "generated",
      "createdAt": "2025-03-22T10:00:00.000Z",
      "updatedAt": "2025-03-22T10:05:00.000Z"
    }
  ],
  "count": 1
}
```

---

#### 2.2 Get Certificate by ID

```http
GET /api/certificates/:id
```

**Response:** `CertificateResponse`

---

#### 2.3 Create Certificate Record

```http
POST /api/certificates
```

**Request Body:** `CreateCertificateDto`

```json
{
  "studentId": 1,
  "eventName": "Hackathon 2025",
  "issuedBy": "Acme Organization",
  "issueDate": "March 2025"
}
```

**Response:** `CertificateResponse`

---

#### 2.4 Generate PDF Certificate

```http
POST /api/certificates/generate
```

**Request Body:** `GenerateCertificateDto`

```json
{
  "studentId": 1,
  "eventName": "Hackathon 2025",
  "issuedBy": "Acme Organization",
  "issueDate": "March 2025"
}
```

**Response:** `GenerateCertificateResponse`

```json
{
  "success": true,
  "data": {
    "certificateId": 1,
    "pdfPath": "/path/to/certificate.pdf",
    "student": {
      "id": 1,
      "name": "John Doe",
      "rollNo": "2024001",
      "email": "john@example.com",
      "createdAt": "2025-03-22T10:00:00.000Z",
      "updatedAt": "2025-03-22T10:00:00.000Z"
    }
  }
}
```

---

#### 2.5 Generate Bulk Certificates

```http
POST /api/certificates/generate/bulk
```

**Request Body:** `BulkGenerateCertificatesDto`

```json
{
  "studentIds": [1, 2, 3],
  "eventName": "Hackathon 2025",
  "issuedBy": "Acme Organization",
  "issueDate": "March 2025"
}
```

**Response:** `BulkGenerateCertificatesResponse`

```json
{
  "success": true,
  "data": [
    {
      "certificateId": 1,
      "pdfPath": "/path/to/cert1.pdf",
      "student": { ... }
    },
    {
      "certificateId": 2,
      "pdfPath": "/path/to/cert2.pdf",
      "student": { ... }
    }
  ],
  "count": 2
}
```

---

#### 2.6 Update Certificate

```http
PUT /api/certificates/:id
```

**Request Body:** `UpdateCertificateDto` (all fields optional)

```json
{
  "eventName": "Updated Event",
  "status": "sent"
}
```

**Response:** `CertificateResponse`

---

#### 2.7 Delete Certificate

```http
DELETE /api/certificates/:id
```

**Response:**

```json
{
  "success": true,
  "message": "Certificate deleted successfully"
}
```

---

### 3. Stats & Health API

#### 3.1 Get Dashboard Statistics

```http
GET /api/stats
```

**Response:** `StatsResponse`

```json
{
  "success": true,
  "data": {
    "students": {
      "total": 150
    },
    "certificates": {
      "pending": 10,
      "generated": 100,
      "sent": 35,
      "failed": 5
    },
    "emails": {
      "sent": 35,
      "failed": 5
    }
  }
}
```

---

#### 3.2 Health Check

```http
GET /api/health
```

**Response:** `HealthResponse`

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-03-22T10:00:00.000Z"
  }
}
```

---

## Data Models (DTOs)

### Student DTOs

#### `CreateStudentDto`

```typescript
{
  name: string;      // min length: 1
  rollNo: string;    // min length: 1, must be unique
  email: string;     // valid email format
}
```

#### `UpdateStudentDto`

```typescript
{
  name?: string;     // min length: 1
  rollNo?: string;   // min length: 1
  email?: string;    // valid email format
}
```

#### `StudentDto` (Response)

```typescript
{
  id: number;
  name: string;
  rollNo: string;
  email: string;
  createdAt: string; // ISO 8601 datetime
  updatedAt: string; // ISO 8601 datetime
}
```

#### `StudentListResponse`

```typescript
{
  success: boolean;
  data: StudentDto[];
  count: number;
}
```

#### `StudentResponse`

```typescript
{
  success: boolean;
  data: StudentDto;
}
```

---

### Certificate DTOs

#### `CreateCertificateDto`

```typescript
{
  studentId: number;   // positive integer
  eventName: string;   // min length: 1
  issuedBy: string;    // min length: 1
  issueDate: string;   // min length: 1
}
```

#### `GenerateCertificateDto`

```typescript
{
  studentId: number;   // positive integer
  eventName: string;   // min length: 1
  issuedBy: string;    // min length: 1
  issueDate: string;   // min length: 1
}
```

#### `BulkGenerateCertificatesDto`

```typescript
{
  studentIds: number[];  // array of positive integers, min length: 1
  eventName: string;     // min length: 1
  issuedBy: string;      // min length: 1
  issueDate: string;     // min length: 1
}
```

#### `UpdateCertificateDto`

```typescript
{
  eventName?: string;
  issuedBy?: string;
  issueDate?: string;
  status?: 'pending' | 'generated' | 'sent' | 'failed';
}
```

#### `CertificateDto` (Response)

```typescript
{
  id: number;
  studentId: number;
  eventName: string;
  issuedBy: string;
  issueDate: string;
  pdfPath: string | null;
  status: 'pending' | 'generated' | 'sent' | 'failed';
  createdAt: string;
  updatedAt: string;
}
```

#### `GenerateCertificateResultDto`

```typescript
{
  certificateId: number;
  pdfPath: string;
  student: StudentDto;
}
```

#### `CertificateListResponse`

```typescript
{
  success: boolean;
  data: CertificateDto[];
  count: number;
}
```

#### `CertificateResponse`

```typescript
{
  success: boolean;
  data: CertificateDto;
}
```

#### `GenerateCertificateResponse`

```typescript
{
  success: boolean;
  data: GenerateCertificateResultDto;
}
```

#### `BulkGenerateCertificatesResponse`

```typescript
{
  success: boolean;
  data: GenerateCertificateResultDto[];
  count: number;
}
```

---

### Stats DTOs

#### `StatsResponse`

```typescript
{
  success: boolean;
  data: {
    students: {
      total: number;
    };
    certificates: {
      pending: number;
      generated: number;
      sent: number;
      failed: number;
    };
    emails: {
      sent: number;
      failed: number;
    };
  };
}
```

---

### Health DTOs

#### `HealthResponse`

```typescript
{
  success: boolean;
  data: {
    status: 'healthy' | 'unhealthy';
    timestamp: string; // ISO 8601 datetime
  };
}
```

---

### Auth DTOs

#### `SignUpRequest`

```typescript
{
  email: string;      // valid email
  password: string;   // min length: 8
  name?: string;
}
```

#### `SignInRequest`

```typescript
{
  email: string;
  password: string;
}
```

#### `AuthResponse`

```typescript
{
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      emailVerified: boolean;
      image?: string;
      createdAt: string;
      updatedAt: string;
    };
    session?: {
      id: string;
      userId: string;
      expiresAt: string;
      ipAddress?: string;
      userAgent?: string;
    };
  };
}
```

#### `SessionResponse`

```typescript
{
  success: boolean;
  data: {
    session: {
      id: string;
      userId: string;
      expiresAt: string;
      ipAddress?: string;
      userAgent?: string;
    };
    user: {
      id: string;
      email: string;
      name: string;
      emailVerified: boolean;
      image?: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}
```

---

## Error Responses

### Standard Error Response

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Validation Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": "Validation error",
  "issues": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["name"],
      "message": "Required"
    }
  ]
}
```

### Not Found Response (404)

```json
{
  "success": false,
  "error": "Student not found"
}
```

### Conflict Response (409)

```json
{
  "success": false,
  "error": "Student with this roll number already exists"
}
```

### Unauthorized Response (401)

```json
{
  "success": false,
  "error": "Not authenticated"
}
```

---

## Common HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation error or invalid input |
| 401 | Unauthorized | Not authenticated |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 500 | Internal Server Error | Server error |

---

## File Structure

```
src/
├── index.ts                  # Application entry point
├── db/
│   ├── schema.ts             # Database schema
│   └── index.ts              # Database connection
├── repository/
│   ├── student.repository.ts
│   ├── certificate.repository.ts
│   └── email-log.repository.ts
├── services/
│   ├── auth.service.ts
│   ├── certificate.service.ts
│   └── email.service.ts
├── routes/
│   ├── index.ts
│   ├── student.routes.ts
│   ├── certificate.routes.ts
│   └── auth.routes.ts
├── types/
│   └── index.ts              # Shared types & DTOs
└── dto/
    ├── student.dto.ts
    ├── certificate.dto.ts
    ├── auth.dto.ts
    ├── stats.dto.ts
    └── common.dto.ts
```

---

## Integration Examples

### Fetch API Example - Get Students

```typescript
const response = await fetch('http://localhost:3000/api/students');
const result = await response.json();

if (result.success) {
  console.log('Students:', result.data);
}
```

### Fetch API Example - Create Student

```typescript
const response = await fetch('http://localhost:3000/api/students', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    rollNo: '2024001',
    email: 'john@example.com'
  })
});

const result = await response.json();
```

### Fetch API Example - Generate Certificate

```typescript
const response = await fetch('http://localhost:3000/api/certificates/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    studentId: 1,
    eventName: 'Hackathon 2025',
    issuedBy: 'Acme Organization',
    issueDate: 'March 2025'
  })
});

const result = await response.json();
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` / `production` |
| `APP_URL` | Application URL | `http://localhost:3000` |
| `GMAIL_USER` | Gmail address | `you@gmail.com` |
| `GMAIL_CLIENT_ID` | OAuth2 client ID | `xxx.apps.googleusercontent.com` |
| `GMAIL_CLIENT_SECRET` | OAuth2 client secret | `xxx` |
| `GMAIL_REFRESH_TOKEN` | OAuth2 refresh token | `xxx` |
| `CERT_EVENT_NAME` | Default event name | `Hackathon 2025` |
| `CERT_ISSUED_BY` | Default issuer | `Acme Organization` |
| `CERT_DATE` | Default issue date | `March 2025` |
| `BETTER_AUTH_SECRET` | Auth secret key | `your-secret-key` |

---

## Notes for Frontend Developers

1. **CORS**: The API is configured with CORS enabled for cross-origin requests.
2. **Session Management**: Authentication uses session cookies. Ensure your frontend sends cookies with requests (`credentials: 'include'`).
3. **Validation**: All inputs are validated using Zod. Validation errors return detailed error messages.
4. **Pagination**: Use `limit` and `offset` query parameters for pagination on list endpoints.
5. **Error Handling**: Always check the `success` field in responses before processing data.
6. **PDF Files**: Generated PDFs are stored in the `output/` directory on the server.
