/**
 * Auth DTOs - Data Transfer Objects for Authentication
 */

import type { User, Session } from '../db/schema.js';
import type { ApiResponse } from './common.dto.js';

// ============================================================================
// Request DTOs
// ============================================================================

/**
 * DTO for user registration
 */
export interface SignUpDto {
  /** User's email address */
  email: string;
  /** User's password (min 8 characters) */
  password: string;
  /** User's full name (optional) */
  name?: string;
}

/**
 * DTO for user login
 */
export interface SignInDto {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

// ============================================================================
// Response DTOs
// ============================================================================

/**
 * User data returned in API responses
 */
export type UserResponseDto = User;

/**
 * Session data returned in API responses
 */
export type SessionResponseDto = Session;

/**
 * Response for authentication operations (sign up, sign in)
 */
export interface AuthResponse extends ApiResponse<AuthResponseData> {}

/**
 * Auth response data containing user and optional session
 */
export interface AuthResponseData {
  /** User information */
  user: UserResponseDto;
  /** Session information (if applicable) */
  session?: SessionResponseDto;
}

/**
 * Response for session retrieval
 */
export interface SessionResponse extends ApiResponse<SessionResponseData> {}

/**
 * Session response data containing session and user
 */
export interface SessionResponseData {
  /** Session information */
  session: SessionResponseDto | null;
  /** User information */
  user: UserResponseDto | null;
}

/**
 * Response for sign out
 */
export interface SignOutResponse extends ApiResponse {
  message?: string;
}
