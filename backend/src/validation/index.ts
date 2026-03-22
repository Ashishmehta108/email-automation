/**
 * Centralized Zod Validation Schemas
 * 
 * All validation schemas for the application are defined here
 * and can be imported by routes, services, and controllers.
 */

import { z } from 'zod';

// ============================================================================
// Student Validation Schemas
// ============================================================================

/**
 * Schema for creating a student
 */
export const createStudentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  rollNo: z.string().min(1, 'Roll number is required'),
  email: z.string().email('Invalid email format'),
});

/**
 * Schema for updating a student (all fields optional)
 */
export const updateStudentSchema = z.object({
  name: z.string().min(1).optional(),
  rollNo: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

/**
 * Schema for student list query parameters
 */
export const studentListQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).optional(),
  offset: z.string().transform((val) => parseInt(val, 10)).optional(),
});

/**
 * Schema for student ID parameter
 */
export const studentIdParamSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});

// ============================================================================
// Certificate Validation Schemas
// ============================================================================

/**
 * Schema for creating a certificate record
 */
export const createCertificateSchema = z.object({
  studentId: z.number().int().positive('Student ID must be positive'),
  templateId: z.number().int().positive().optional(),
  eventName: z.string().min(1, 'Event name is required'),
  issuedBy: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
});

/**
 * Schema for generating a certificate
 */
export const generateCertificateSchema = z.object({
  studentId: z.number().int().positive('Student ID must be positive'),
  templateId: z.number().int().positive().optional(),
  eventName: z.string().min(1, 'Event name is required'),
  issuedBy: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
});

/**
 * Schema for bulk certificate generation
 */
export const bulkGenerateCertificatesSchema = z.object({
  studentIds: z.array(z.number().int().positive()).min(1, 'At least one student ID required'),
  templateId: z.number().int().positive().optional(),
  eventName: z.string().min(1, 'Event name is required'),
  issuedBy: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
});

/**
 * Schema for updating a certificate
 */
export const updateCertificateSchema = z.object({
  eventName: z.string().min(1).optional(),
  issuedBy: z.string().min(1).optional(),
  issueDate: z.string().min(1).optional(),
  pdfPath: z.string().optional(),
  status: z.enum(['pending', 'generated', 'sent', 'failed']).optional(),
});

/**
 * Schema for certificate list query parameters
 */
export const certificateListQuerySchema = z.object({
  studentId: z.string().transform((val) => parseInt(val, 10)).optional(),
  status: z.enum(['pending', 'generated', 'sent', 'failed']).optional(),
  eventName: z.string().optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).optional(),
  offset: z.string().transform((val) => parseInt(val, 10)).optional(),
});

/**
 * Schema for certificate ID parameter
 */
export const certificateIdParamSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});

// ============================================================================
// Certificate Template Validation Schemas
// ============================================================================

/**
 * Schema for template element configuration
 */
export const templateElementSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'image', 'shape', 'line']),
  x: z.number(),
  y: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
  content: z.string().optional(),
  style: z.object({}).passthrough().optional(),
});

/**
 * Schema for template logo configuration
 */
export const templateLogoSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

/**
 * Schema for template signature configuration
 */
export const templateSignatureSchema = z.object({
  id: z.string(),
  label: z.string(),
  imageUrl: z.string().url().optional(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
});

/**
 * Schema for template configuration
 */
export const templateConfigSchema = z.object({
  elements: z.array(templateElementSchema).optional(),
  logos: z.array(templateLogoSchema).optional(),
  signatures: z.array(templateSignatureSchema).optional(),
});

/**
 * Schema for creating a certificate template
 */
export const createTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  config: templateConfigSchema.optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  backgroundColor: z.string().optional(),
  backgroundImageUrl: z.string().url().optional(),
  showBorder: z.boolean().optional(),
  borderColor: z.string().optional(),
  borderWidth: z.string().optional(),
  showInnerBorder: z.boolean().optional(),
  innerBorderColor: z.string().optional(),
  innerBorderWidth: z.string().optional(),
  titleText: z.string().optional(),
  titleFont: z.string().optional(),
  titleSize: z.string().optional(),
  titleColor: z.string().optional(),
  titleY: z.string().optional(),
  nameFont: z.string().optional(),
  nameSize: z.string().optional(),
  nameColor: z.string().optional(),
  nameY: z.string().optional(),
  descriptionText: z.string().optional(),
  descriptionFont: z.string().optional(),
  descriptionSize: z.string().optional(),
  descriptionColor: z.string().optional(),
  descriptionY: z.string().optional(),
  eventFont: z.string().optional(),
  eventSize: z.string().optional(),
  eventColor: z.string().optional(),
  eventY: z.string().optional(),
  dateText: z.string().optional(),
  dateFont: z.string().optional(),
  dateSize: z.string().optional(),
  dateColor: z.string().optional(),
  dateY: z.string().optional(),
  issuedByFont: z.string().optional(),
  issuedBySize: z.string().optional(),
  issuedByColor: z.string().optional(),
  issuedByY: z.string().optional(),
  footerText: z.string().optional(),
  footerFont: z.string().optional(),
  footerSize: z.string().optional(),
  footerColor: z.string().optional(),
});

/**
 * Schema for updating a certificate template
 */
export const updateTemplateSchema = createTemplateSchema.extend({
  isActive: z.boolean().optional(),
}).partial();

/**
 * Schema for template list query parameters
 */
export const templateListQuerySchema = z.object({
  isActive: z.string().transform((val) => val === 'true').optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).optional(),
  offset: z.string().transform((val) => parseInt(val, 10)).optional(),
});

/**
 * Schema for template ID parameter
 */
export const templateIdParamSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});

/**
 * Schema for template preview request
 */
export const previewTemplateSchema = z.object({
  eventName: z.string().min(1, 'Event name is required'),
  issuedBy: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
});

// ============================================================================
// Email Template Validation Schemas
// ============================================================================

/**
 * Schema for creating an email template
 */
export const createEmailTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  variables: z.array(z.string()).optional(),
});

/**
 * Schema for updating an email template
 */
export const updateEmailTemplateSchema = createEmailTemplateSchema.partial();

/**
 * Schema for email template list query parameters
 */
export const emailTemplateListQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).optional(),
  offset: z.string().transform((val) => parseInt(val, 10)).optional(),
});

/**
 * Schema for email template ID parameter
 */
export const emailTemplateIdParamSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});

// ============================================================================
// Email Validation Schemas
// ============================================================================

/**
 * Schema for sending an email
 */
export const sendEmailSchema = z.object({
  to: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  html: z.string().min(1, 'Email body is required'),
  attachments: z.array(z.object({
    filename: z.string(),
    path: z.string(),
  })).optional(),
});

// ============================================================================
// Authentication Validation Schemas
// ============================================================================

/**
 * Schema for user sign up
 */
export const signUpSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
});

/**
 * Schema for user sign in
 */
export const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// ============================================================================
// CSV Import Validation Schema
// ============================================================================

/**
 * Schema for CSV student import
 */
export const csvStudentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  rollno: z.string().min(1, 'Roll number is required'),
  email: z.string().email('Invalid email format'),
});

/**
 * Schema for bulk CSV import validation
 */
export const csvImportSchema = z.array(csvStudentSchema);

// ============================================================================
// Utility Types for Validation
// ============================================================================

/**
 * Type for validated create student input
 */
export type CreateStudentInput = z.infer<typeof createStudentSchema>;

/**
 * Type for validated update student input
 */
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;

/**
 * Type for validated create certificate input
 */
export type CreateCertificateInput = z.infer<typeof createCertificateSchema>;

/**
 * Type for validated generate certificate input
 */
export type GenerateCertificateInput = z.infer<typeof generateCertificateSchema>;

/**
 * Type for validated bulk generate certificates input
 */
export type BulkGenerateCertificatesInput = z.infer<typeof bulkGenerateCertificatesSchema>;

/**
 * Type for validated create template input
 */
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;

/**
 * Type for validated update template input
 */
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;

/**
 * Type for validated preview template input
 */
export type PreviewTemplateInput = z.infer<typeof previewTemplateSchema>;

/**
 * Type for validated create email template input
 */
export type CreateEmailTemplateInput = z.infer<typeof createEmailTemplateSchema>;

/**
 * Type for validated update email template input
 */
export type UpdateEmailTemplateInput = z.infer<typeof updateEmailTemplateSchema>;
