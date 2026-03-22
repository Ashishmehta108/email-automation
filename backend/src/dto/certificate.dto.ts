/**
 * Certificate DTOs - Data Transfer Objects for Certificate entity
 */

import type { Certificate, CertificateStatus } from '../types/index.js';
import type { StudentResponseDto } from './student.dto.js';
import type { ApiResponse, PaginatedResponse } from './common.dto.js';

// ============================================================================
// Request DTOs
// ============================================================================

/**
 * DTO for creating a new certificate record
 */
export interface CreateCertificateDto {
  /** ID of the student */
  studentId: number;
  /** ID of the template (optional) */
  templateId?: number;
  /** Name of the event */
  eventName: string;
  /** Organization/person issuing the certificate */
  issuedBy: string;
  /** Date of issue */
  issueDate: string;
}

/**
 * DTO for generating a PDF certificate
 */
export interface GenerateCertificateDto {
  /** ID of the student */
  studentId: number;
  /** ID of the template (optional) */
  templateId?: number;
  /** Name of the event */
  eventName: string;
  /** Organization/person issuing the certificate */
  issuedBy: string;
  /** Date of issue */
  issueDate: string;
}

/**
 * DTO for generating certificates in bulk
 */
export interface BulkGenerateCertificatesDto {
  /** Array of student IDs */
  studentIds: number[];
  /** ID of the template (optional) */
  templateId?: number;
  /** Name of the event */
  eventName: string;
  /** Organization/person issuing the certificate */
  issuedBy: string;
  /** Date of issue */
  issueDate: string;
}

/**
 * DTO for updating an existing certificate (all fields optional)
 */
export interface UpdateCertificateDto {
  eventName?: string;
  issuedBy?: string;
  issueDate?: string;
  pdfPath?: string;
  status?: CertificateStatus;
}

/**
 * Query parameters for listing certificates
 */
export interface CertificateListQuery {
  /** Filter by student ID */
  studentId?: number;
  /** Filter by status */
  status?: CertificateStatus;
  /** Filter by event name */
  eventName?: string;
  /** Number of results to return */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
}

// ============================================================================
// Response DTOs
// ============================================================================

/**
 * Certificate data returned in API responses
 */
export type CertificateResponseDto = Certificate;

/**
 * Result of certificate generation with student info
 */
export interface GenerateCertificateResultDto {
  /** ID of the generated certificate */
  certificateId: number;
  /** Path to the generated PDF file */
  pdfPath: string;
  /** Student information */
  student: StudentResponseDto;
  /** Template ID if used */
  templateId?: number;
}

/**
 * Response for single certificate operations
 */
export interface CertificateResponse extends ApiResponse<CertificateResponseDto> {}

/**
 * Response for certificate generation
 */
export interface GenerateCertificateResponse extends ApiResponse<GenerateCertificateResultDto> {}

/**
 * Response for bulk certificate generation
 */
export interface BulkGenerateCertificatesResponse
  extends PaginatedResponse<GenerateCertificateResultDto> {}

/**
 * Response for certificate list operations
 */
export interface CertificateListResponse extends PaginatedResponse<CertificateResponseDto> {}

/**
 * Response for certificate deletion
 */
export interface DeleteCertificateResponse extends ApiResponse {
  message: string;
}
