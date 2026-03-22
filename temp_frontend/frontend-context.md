# Email Automation — Backend Context

Full API reference for frontend integration. Read before writing any fetch, server action, or type.

---

## Base URL

```
NEXT_PUBLIC_API_URL=http://localhost:3000
All endpoints: /api/*
```

---

## Auth

- Provider: **Better Auth** — session cookies
- All requests must include `credentials: 'include'`
- Unauthenticated requests return `401 { success: false, error: "Not authenticated" }`

### Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/sign-up` | Register |
| `POST` | `/api/auth/sign-in` | Sign in |
| `POST` | `/api/auth/sign-out` | Sign out |
| `GET` | `/api/auth/session` | Get session + user |

#### Sign Up Body
```ts
{ email: string; password: string; name?: string }
```

#### Sign In Body
```ts
{ email: string; password: string }
```

#### Auth Response
```ts
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

---

## Students API `/api/students`

### List Students
```
GET /api/students?search=&limit=&offset=
```
Response:
```ts
{ success: true; data: StudentDto[]; count: number }
```

### Get Student
```
GET /api/students/:id
```
Response: `{ success: true; data: StudentDto }`

### Create Student
```
POST /api/students
Body: { name: string; rollNo: string; email: string }
```
Response: `{ success: true; data: StudentDto }`
Error 409: `{ success: false; error: "Student with this roll number already exists" }`

### Update Student
```
PUT /api/students/:id
Body: { name?: string; rollNo?: string; email?: string }
```

### Delete Student
```
DELETE /api/students/:id
```
Response: `{ success: true; message: "Student deleted successfully" }`

### StudentDto
```ts
interface StudentDto {
  id: number;
  name: string;
  rollNo: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## Certificates API `/api/certificates`

### List Certificates
```
GET /api/certificates?studentId=&status=&eventName=&limit=&offset=
```
Status values: `pending | generated | sent | failed`
Response: `{ success: true; data: CertificateDto[]; count: number }`

### Get Certificate
```
GET /api/certificates/:id
```

### Create Certificate Record
```
POST /api/certificates
Body: { studentId: number; eventName: string; issuedBy: string; issueDate: string }
```

### Generate Certificate (PDF)
```
POST /api/certificates/generate
Body: { studentId: number; templateId?: number; eventName: string; issuedBy: string; issueDate: string }
```
Response:
```ts
{
  success: true;
  data: {
    certificateId: number;
    pdfPath: string;
    student: StudentDto;
  }
}
```

### Bulk Generate
```
POST /api/certificates/generate/bulk
Body: { studentIds: number[]; eventName: string; issuedBy: string; issueDate: string }
```
Response:
```ts
{
  success: true;
  data: Array<{ certificateId: number; pdfPath: string; student: StudentDto }>;
  count: number;
}
```

### Update Certificate
```
PUT /api/certificates/:id
Body: { eventName?: string; issuedBy?: string; issueDate?: string; status?: CertificateStatus }
```

### Delete Certificate
```
DELETE /api/certificates/:id
```

### CertificateDto
```ts
type CertificateStatus = "pending" | "generated" | "sent" | "failed";

interface CertificateDto {
  id: number;
  studentId: number;
  eventName: string;
  issuedBy: string;
  issueDate: string;
  pdfPath: string | null;
  status: CertificateStatus;
  createdAt: string;
  updatedAt: string;
}
```

---

## Certificate Templates API `/api/templates`

### List Templates
```
GET /api/templates?isActive=&limit=&offset=
```

### List Active Templates
```
GET /api/templates/active
```

### Get Template
```
GET /api/templates/:id
```

### Create Template
```
POST /api/templates
```
Body (all optional except `name`):
```ts
{
  name: string;
  description?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  showBorder?: boolean;
  borderColor?: string;
  borderWidth?: string;
  showInnerBorder?: boolean;
  innerBorderColor?: string;
  innerBorderWidth?: string;
  titleText?: string;
  titleFont?: string;
  titleSize?: string;
  titleColor?: string;
  titleY?: string;
  nameFont?: string;
  nameSize?: string;
  nameColor?: string;
  nameY?: string;
  descriptionText?: string;
  descriptionFont?: string;
  descriptionSize?: string;
  descriptionColor?: string;
  descriptionY?: string;
  eventFont?: string;
  eventSize?: string;
  eventColor?: string;
  eventY?: string;
  dateText?: string;
  dateFont?: string;
  dateSize?: string;
  dateColor?: string;
  dateY?: string;
  issuedByFont?: string;
  issuedBySize?: string;
  issuedByColor?: string;
  issuedByY?: string;
  footerText?: string;
  footerFont?: string;
  footerSize?: string;
  footerColor?: string;
}
```

### Update Template
```
PUT /api/templates/:id
Body: Partial<CreateTemplateBody> & { isActive?: boolean }
```

### Toggle Active Status
```
PATCH /api/templates/:id/toggle
```

### Preview Template (returns PDF)
```
POST /api/templates/:id/preview
Body: { eventName: string; issuedBy: string; issueDate: string }
```

### Delete Template
```
DELETE /api/templates/:id
```

### CertificateTemplateDto
```ts
interface CertificateTemplateDto {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  width: string | null;
  height: string | null;
  backgroundColor: string | null;
  backgroundImageUrl: string | null;
  showBorder: boolean | null;
  borderColor: string | null;
  borderWidth: string | null;
  showInnerBorder: boolean | null;
  innerBorderColor: string | null;
  innerBorderWidth: string | null;
  titleText: string | null;
  titleFont: string | null;
  titleSize: string | null;
  titleColor: string | null;
  titleY: string | null;
  nameFont: string | null;
  nameSize: string | null;
  nameColor: string | null;
  nameY: string | null;
  descriptionText: string | null;
  descriptionFont: string | null;
  descriptionSize: string | null;
  descriptionColor: string | null;
  descriptionY: string | null;
  eventFont: string | null;
  eventSize: string | null;
  eventColor: string | null;
  eventY: string | null;
  dateText: string | null;
  dateFont: string | null;
  dateSize: string | null;
  dateColor: string | null;
  dateY: string | null;
  issuedByFont: string | null;
  issuedBySize: string | null;
  issuedByColor: string | null;
  issuedByY: string | null;
  footerText: string | null;
  footerFont: string | null;
  footerSize: string | null;
  footerColor: string | null;
  createdAt: string;
  updatedAt: string;
}
```

---

## Stats & Health

### Dashboard Stats
```
GET /api/stats
```
Response:
```ts
{
  success: true;
  data: {
    students: { total: number };
    templates: { total: number; active: number };
    certificates: {
      pending: number;
      generated: number;
      sent: number;
      failed: number;
    };
    emails: { sent: number; failed: number };
  };
}
```

### Health Check
```
GET /api/health
```
Response: `{ success: true; data: { status: "healthy" | "unhealthy"; timestamp: string } }`

---

## Error Response Shapes

```ts
// Generic error
{ success: false; error: string }

// Validation error (400)
{
  success: false;
  error: "Validation error";
  issues: Array<{
    code: string;
    expected?: string;
    received?: string;
    path: string[];
    message: string;
  }>;
}
```

| Status | Meaning |
|--------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Validation error |
| 401 | Not authenticated |
| 404 | Not found |
| 409 | Conflict (duplicate rollNo) |
| 500 | Server error |

---

## Environment Variables (Frontend)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
BETTER_AUTH_SECRET=<same as backend>
BETTER_AUTH_URL=http://localhost:3000
```

---

## Integration Notes

1. Always include `credentials: 'include'` — auth is session-cookie-based.
2. Check `success` field before consuming `data`.
3. Pagination: `?limit=20&offset=0` on all list endpoints.
4. Certificate `pdfPath` is a server-side path — not directly accessible as a URL unless backend serves it as static.
5. Template preview endpoint returns a PDF binary — open in new tab or use `blob` response.
6. `issueDate` is a free-text string (e.g. `"March 2025"`), not an ISO date.
7. `studentId` on certificates is a foreign key — always validate the student exists before generating.