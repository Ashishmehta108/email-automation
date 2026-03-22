import { apiFetch } from './api';
import type {
  CertificateDto,
  CertificateFilter,
  CreateCertificateInput,
  UpdateCertificateInput,
  GenerateCertificateInput,
  BulkGenerateCertificatesInput,
} from '@/types/certificate.types';

export async function fetchCertificates(params?: CertificateFilter) {
  const searchParams = new URLSearchParams();
  if (params?.studentId) searchParams.set('studentId', String(params.studentId));
  if (params?.status) searchParams.set('status', params.status);
  if (params?.eventName) searchParams.set('eventName', params.eventName);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const res = await apiFetch<{ data: CertificateDto[]; count: number }>(
    '/api/certificates?' + searchParams.toString()
  );
  return res;
}

export async function fetchCertificate(id: number) {
  const res = await apiFetch<CertificateDto>(`/api/certificates/${id}`);
  return res;
}

export async function createCertificate(data: CreateCertificateInput) {
  const res = await apiFetch<CertificateDto>('/api/certificates', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res;
}

export async function updateCertificate(id: number, data: UpdateCertificateInput) {
  const res = await apiFetch<CertificateDto>(`/api/certificates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res;
}

export async function deleteCertificate(id: number) {
  const res = await apiFetch<void>(`/api/certificates/${id}`, {
    method: 'DELETE',
  });
  return res;
}

export async function generateCertificate(data: GenerateCertificateInput) {
  const res = await apiFetch<{
    certificateId: number;
    pdfPath: string;
    student: { id: number; name: string; rollNo: string; email: string };
    templateId?: number;
  }>('/api/certificates/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res;
}

export async function bulkGenerateCertificates(data: BulkGenerateCertificatesInput) {
  const res = await apiFetch<Array<{
    certificateId: number;
    pdfPath: string;
    student: { id: number; name: string; rollNo: string; email: string };
    templateId?: number;
  }>>('/api/certificates/generate/bulk', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res;
}
