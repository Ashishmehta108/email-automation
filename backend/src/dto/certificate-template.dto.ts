/**
 * Certificate Template DTOs - Data Transfer Objects for Template Management
 */

import type { CertificateTemplate, CertificateTemplateConfig } from '../types/index.js';
import type { ApiResponse, PaginatedResponse } from './common.dto.js';

// ============================================================================
// Request DTOs
// ============================================================================

/**
 * DTO for creating a new certificate template
 */
export interface CreateCertificateTemplateDto {
  /** Template name */
  name: string;
  /** Template description */
  description?: string;
  /** Template configuration (JSON) */
  config?: CertificateTemplateConfig;
  /** Canvas width in points */
  width?: string;
  /** Canvas height in points */
  height?: string;
  /** Background color (hex) */
  backgroundColor?: string;
  /** Background image URL */
  backgroundImageUrl?: string;
  /** Show outer border */
  showBorder?: boolean;
  /** Border color (hex) */
  borderColor?: string;
  /** Border width in points */
  borderWidth?: string;
  /** Show inner decorative border */
  showInnerBorder?: boolean;
  /** Inner border color (hex) */
  innerBorderColor?: string;
  /** Inner border width in points */
  innerBorderWidth?: string;
  /** Certificate title text */
  titleText?: string;
  /** Title font family */
  titleFont?: string;
  /** Title font size */
  titleSize?: string;
  /** Title color (hex) */
  titleColor?: string;
  /** Title Y position */
  titleY?: string;
  /** Name font family */
  nameFont?: string;
  /** Name font size */
  nameSize?: string;
  /** Name color (hex) */
  nameColor?: string;
  /** Name Y position */
  nameY?: string;
  /** Description text before name */
  descriptionText?: string;
  /** Description font family */
  descriptionFont?: string;
  /** Description font size */
  descriptionSize?: string;
  /** Description color (hex) */
  descriptionColor?: string;
  /** Description Y position */
  descriptionY?: string;
  /** Event name font family */
  eventFont?: string;
  /** Event name font size */
  eventSize?: string;
  /** Event name color (hex) */
  eventColor?: string;
  /** Event name Y position */
  eventY?: string;
  /** Date label text */
  dateText?: string;
  /** Date font family */
  dateFont?: string;
  /** Date font size */
  dateSize?: string;
  /** Date color (hex) */
  dateColor?: string;
  /** Date Y position */
  dateY?: string;
  /** Issued by font family */
  issuedByFont?: string;
  /** Issued by font size */
  issuedBySize?: string;
  /** Issued by color (hex) */
  issuedByColor?: string;
  /** Issued by Y position */
  issuedByY?: string;
  /** Footer label text */
  footerText?: string;
  /** Footer font family */
  footerFont?: string;
  /** Footer font size */
  footerSize?: string;
  /** Footer color (hex) */
  footerColor?: string;
}

/**
 * DTO for updating an existing certificate template
 */
export interface UpdateCertificateTemplateDto extends Partial<CreateCertificateTemplateDto> {
  /** Activate or deactivate template */
  isActive?: boolean;
}

/**
 * Query parameters for listing templates
 */
export interface TemplateListQuery {
  /** Filter by active status */
  isActive?: boolean;
  /** Number of results to return */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
}

/**
 * DTO for template preview request
 */
export interface PreviewTemplateDto {
  /** Template ID to preview */
  templateId: number;
  /** Event name for preview */
  eventName: string;
  /** Issued by for preview */
  issuedBy: string;
  /** Date for preview */
  issueDate: string;
}

// ============================================================================
// Response DTOs
// ============================================================================

/**
 * Template data returned in API responses
 */
export type CertificateTemplateResponseDto = CertificateTemplate;

/**
 * Response for single template operations
 */
export interface CertificateTemplateResponse extends ApiResponse<CertificateTemplateResponseDto> {}

/**
 * Response for template list operations
 */
export interface CertificateTemplateListResponse extends PaginatedResponse<CertificateTemplateResponseDto> {}

/**
 * Response for template deletion
 */
export interface DeleteTemplateResponse extends ApiResponse {
  message: string;
}

/**
 * Response for template preview
 */
export interface PreviewTemplateResponse extends ApiResponse<PreviewTemplateData> {}

/**
 * Preview template response data
 */
export interface PreviewTemplateData {
  /** Path to generated preview PDF */
  pdfPath: string;
  /** Download URL */
  downloadUrl: string;
  /** Template used */
  template: CertificateTemplateResponseDto;
}
