/**
 * Student DTOs - Data Transfer Objects for Student entity
 */

import type { Student } from '../types/index.js';
import type { ApiResponse, PaginatedResponse } from './common.dto.js';

// ============================================================================
// Request DTOs
// ============================================================================

/**
 * DTO for creating a new student
 */
export interface CreateStudentDto {
  /** Student's full name */
  name: string;
  /** Unique roll number/ID */
  rollNo: string;
  /** Student's email address */
  email: string;
}

/**
 * DTO for updating an existing student (all fields optional)
 */
export interface UpdateStudentDto {
  name?: string;
  rollNo?: string;
  email?: string;
}

/**
 * Query parameters for listing students
 */
export interface StudentListQuery {
  /** Search by student name */
  search?: string;
  /** Number of results to return */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
}

// ============================================================================
// Response DTOs
// ============================================================================

/**
 * Student data returned in API responses
 */
export type StudentResponseDto = Student;

/**
 * Response for single student operations
 */
export interface StudentResponse extends ApiResponse<StudentResponseDto> {}

/**
 * Response for student list operations
 */
export interface StudentListResponse extends PaginatedResponse<StudentResponseDto> {}

/**
 * Response for student deletion
 */
export interface DeleteStudentResponse extends ApiResponse {
  message: string;
}
