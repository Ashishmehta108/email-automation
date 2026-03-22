import { z } from 'zod';

export const createCertificateSchema = z.object({
  studentId: z.number({ required_error: 'Student is required' }),
  templateId: z.number().optional(),
  eventName: z.string().min(1, 'Event name is required'),
  issuedBy: z.string().min(1, 'Issued by is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
});

export const updateCertificateSchema = z.object({
  eventName: z.string().min(1).optional(),
  issuedBy: z.string().min(1).optional(),
  issueDate: z.string().min(1).optional(),
  pdfPath: z.string().optional(),
  status: z.enum(['pending', 'generated', 'failed']).optional(),
});

export const generateCertificateSchema = z.object({
  studentId: z.number({ required_error: 'Student is required' }),
  templateId: z.number().optional(),
  eventName: z.string().min(1, 'Event name is required'),
  issuedBy: z.string().min(1, 'Issued by is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
});

export const bulkGenerateCertificatesSchema = z.object({
  studentIds: z.array(z.number()).min(1, 'At least one student is required'),
  templateId: z.number().optional(),
  eventName: z.string().min(1, 'Event name is required'),
  issuedBy: z.string().min(1, 'Issued by is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
});

export type CreateCertificateFormValues = z.infer<typeof createCertificateSchema>;
export type UpdateCertificateFormValues = z.infer<typeof updateCertificateSchema>;
export type GenerateCertificateFormValues = z.infer<typeof generateCertificateSchema>;
export type BulkGenerateCertificatesFormValues = z.infer<typeof bulkGenerateCertificatesSchema>;
