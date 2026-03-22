/**
 * Centralized Types for Email Automation
 * 
 * This file re-exports all types from the database schema
 * and defines application-wide shared types.
 */

// Re-export all database types from schema
export type {
  User,
  NewUser,
  Session,
  NewSession,
  Student,
  NewStudent,
  CertificateTemplate,
  NewCertificateTemplate,
  CertificateTemplateConfig,
  TemplateElement,
  TemplateLogo,
  TemplateSignature,
  Certificate,
  NewCertificate,
  CertificateStatus,
  EmailLog,
  NewEmailLog,
  EmailLogStatus,
} from '../db/schema.js';

// ============================================================================
// Repository Input Types
// ============================================================================

/**
 * Input for creating a student
 */
export interface CreateStudentInput {
  name: string;
  rollNo: string;
  email: string;
}

/**
 * Input for updating a student
 */
export interface UpdateStudentInput {
  name?: string;
  rollNo?: string;
  email?: string;
}

/**
 * Filter options for student queries
 */
export interface StudentFilter {
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Input for creating a certificate
 */
export interface CreateCertificateInput {
  studentId: number;
  templateId?: number;
  eventName: string;
  issuedBy: string;
  issueDate: string;
}

/**
 * Input for updating a certificate
 */
export interface UpdateCertificateInput {
  eventName?: string;
  issuedBy?: string;
  issueDate?: string;
  pdfPath?: string;
  status?: import('../db/schema.js').CertificateStatus;
}

/**
 * Filter options for certificate queries
 */
export interface CertificateFilter {
  studentId?: number;
  status?: import('../db/schema.js').CertificateStatus;
  eventName?: string;
  limit?: number;
  offset?: number;
}

/**
 * Input for creating a certificate template
 */
export interface CreateTemplateInput {
  name: string;
  description?: string;
  config?: import('../db/schema.js').CertificateTemplateConfig;
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

/**
 * Input for updating a certificate template
 */
export interface UpdateTemplateInput extends Partial<CreateTemplateInput> {
  isActive?: boolean;
}

/**
 * Filter options for template queries
 */
export interface TemplateFilter {
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Input for creating an email log
 */
export interface CreateEmailLogInput {
  certificateId?: number | null;
  recipientEmail: string;
  subject: string;
  status?: import('../db/schema.js').EmailLogStatus;
}

/**
 * Input for updating an email log
 */
export interface UpdateEmailLogInput {
  status?: import('../db/schema.js').EmailLogStatus;
  errorMessage?: string | null;
  sentAt?: Date | null;
}

/**
 * Filter options for email log queries
 */
export interface EmailLogFilter {
  certificateId?: number;
  status?: import('../db/schema.js').EmailLogStatus;
  recipientEmail?: string;
  limit?: number;
  offset?: number;
}

// ============================================================================
// Service Types
// ============================================================================

/**
 * Certificate generation configuration
 */
export interface CertificateConfig {
  eventName: string;
  issuedBy: string;
  date: string;
}

/**
 * Result of certificate generation
 */
export interface GenerateCertificateResult {
  certificateId: number;
  pdfPath: string;
  student: import('../db/schema.js').Student;
  templateId?: number;
}

/**
 * Email configuration for Gmail OAuth2
 */
export interface EmailConfig {
  user: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

/**
 * Options for sending an email
 */
export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{ filename: string; path: string }>;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  issues?: ValidationError[];
}

/**
 * Zod validation error item
 */
export interface ValidationError {
  code: string;
  expected?: string;
  received?: string;
  path: string[];
  message: string;
}

/**
 * Paginated response for list endpoints
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  count: number;
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
}

/**
 * Query parameters for pagination
 */
export interface PaginationQuery {
  limit?: number;
  offset?: number;
}

// ============================================================================
// CSV Import Types
// ============================================================================

/**
 * Student data from CSV import
 */
export interface CsvStudent {
  name: string;
  rollno: string;
  email: string;
}

// ============================================================================
// Dashboard Types
// ============================================================================

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  students: {
    total: number;
  };
  templates: {
    total: number;
    active: number;
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
}

// ============================================================================
// Health Check Types
// ============================================================================

/**
 * Health check data
 */
export interface HealthData {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
}
