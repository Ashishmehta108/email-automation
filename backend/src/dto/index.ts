/**
 * DTO Module Exports
 * 
 * Central export file for all Data Transfer Objects
 */

// Common DTOs
export type {
  ApiResponse,
  ValidationError,
  PaginatedResponse,
  PaginationQuery,
  HealthData,
  HealthResponse,
} from './common.dto.js';

// Student DTOs
export type {
  CreateStudentDto,
  UpdateStudentDto,
  StudentListQuery,
  StudentResponseDto,
  StudentResponse,
  StudentListResponse,
  DeleteStudentResponse,
} from './student.dto.js';

// Certificate DTOs
export type {
  CreateCertificateDto,
  GenerateCertificateDto,
  BulkGenerateCertificatesDto,
  UpdateCertificateDto,
  CertificateListQuery,
  CertificateResponseDto,
  GenerateCertificateResultDto,
  CertificateResponse,
  GenerateCertificateResponse,
  BulkGenerateCertificatesResponse,
  CertificateListResponse,
  DeleteCertificateResponse,
} from './certificate.dto.js';

// Auth DTOs
export type {
  SignUpDto,
  SignInDto,
  UserResponseDto,
  SessionResponseDto,
  AuthResponse,
  AuthResponseData,
  SessionResponse,
  SessionResponseData,
  SignOutResponse,
} from './auth.dto.js';

// Stats DTOs
export type {
  StudentStats,
  CertificateStats,
  EmailStats,
  StatsData,
  StatsResponse,
} from './stats.dto.js';

// Email DTOs
export type {
  SendEmailDto,
  SendCertificateEmailDto,
  EmailLogListQuery,
  EmailLogResponseDto,
  EmailLogResponse,
  EmailLogListResponse,
  BulkEmailResult,
  BulkEmailResponse,
} from './email.dto.js';
