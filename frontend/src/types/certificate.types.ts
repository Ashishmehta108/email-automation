export type CertificateStatus = 'pending' | 'generated' | 'failed';

export interface CertificateDto {
  id: number;
  studentId: number;
  templateId: number | null;
  eventName: string;
  issuedBy: string;
  issueDate: string;
  pdfPath: string | null;
  status: CertificateStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateWithStudent extends CertificateDto {
  student?: {
    id: number;
    name: string;
    rollNo: string;
    email: string;
  };
}

export interface CertificateFilter {
  studentId?: number;
  status?: CertificateStatus;
  eventName?: string;
  limit?: number;
  offset?: number;
}

export interface CreateCertificateInput {
  studentId: number;
  templateId?: number;
  eventName: string;
  issuedBy: string;
  issueDate: string;
}

export interface UpdateCertificateInput extends Partial<Omit<CreateCertificateInput, 'studentId'>> {
  pdfPath?: string;
  status?: CertificateStatus;
}

export interface GenerateCertificateInput {
  studentId: number;
  templateId?: number;
  eventName: string;
  issuedBy: string;
  issueDate: string;
}

export interface BulkGenerateCertificatesInput {
  studentIds: number[];
  templateId?: number;
  eventName: string;
  issuedBy: string;
  issueDate: string;
}
