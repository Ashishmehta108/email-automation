/**
 * Stats DTOs - Data Transfer Objects for Statistics
 */

import type { ApiResponse } from './common.dto.js';

// ============================================================================
// Response DTOs
// ============================================================================

/**
 * Student statistics
 */
export interface StudentStats {
  /** Total number of students */
  total: number;
}

/**
 * Certificate statistics by status
 */
export interface CertificateStats {
  /** Number of pending certificates */
  pending: number;
  /** Number of generated certificates */
  generated: number;
  /** Number of sent certificates */
  sent: number;
  /** Number of failed certificates */
  failed: number;
}

/**
 * Email statistics
 */
export interface EmailStats {
  /** Number of sent emails */
  sent: number;
  /** Number of failed emails */
  failed: number;
}

/**
 * Complete dashboard statistics data
 */
export interface StatsData {
  /** Student statistics */
  students: StudentStats;
  /** Certificate statistics */
  certificates: CertificateStats;
  /** Email statistics */
  emails: EmailStats;
}

/**
 * Response for stats endpoint
 */
export interface StatsResponse extends ApiResponse<StatsData> {}
