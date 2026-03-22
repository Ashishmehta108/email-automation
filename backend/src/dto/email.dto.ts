/**
 * Email DTOs - Data Transfer Objects for Email operations
 */

import type { EmailLog, EmailLogStatus } from '../db/schema.js';
import type { ApiResponse, PaginatedResponse } from './common.dto.js';

// ============================================================================
// Request DTOs
// ============================================================================

/**
 * DTO for sending an email
 */
export interface SendEmailDto {
  /** Recipient email address */
  to: string;
  /** Email subject */
  subject: string;
  /** Email body in HTML format */
  html: string;
  /** Optional attachments */
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
}

/**
 * DTO for sending a certificate email
 */
export interface SendCertificateEmailDto {
  /** Student's email address */
  studentEmail: string;
  /** Student's name */
  studentName: string;
  /** Event name */
  eventName: string;
  /** Path to the PDF certificate */
  pdfPath: string;
  /** Certificate ID for logging */
  certificateId: number;
}

/**
 * Query parameters for listing email logs
 */
export interface EmailLogListQuery {
  /** Filter by certificate ID */
  certificateId?: number;
  /** Filter by status */
  status?: EmailLogStatus;
  /** Filter by recipient email */
  recipientEmail?: string;
  /** Number of results to return */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
}

// ============================================================================
// Response DTOs
// ============================================================================

/**
 * Email log data returned in API responses
 */
export type EmailLogResponseDto = EmailLog;

/**
 * Response for single email log operations
 */
export interface EmailLogResponse extends ApiResponse<EmailLogResponseDto> {}

/**
 * Response for email log list operations
 */
export interface EmailLogListResponse extends PaginatedResponse<EmailLogResponseDto> {}

/**
 * Bulk email sending result
 */
export interface BulkEmailResult {
  /** Number of successfully sent emails */
  success: number;
  /** Number of failed emails */
  failed: number;
  /** Array of error messages */
  errors: string[];
}

/**
 * Response for bulk email operations
 */
export interface BulkEmailResponse extends ApiResponse<BulkEmailResult> {}
