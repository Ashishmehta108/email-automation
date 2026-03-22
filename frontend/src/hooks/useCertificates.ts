"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchCertificates,
  fetchCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  generateCertificate,
  bulkGenerateCertificates,
} from '@/api/certificates';
import type {
  CertificateFilter,
  CreateCertificateInput,
  UpdateCertificateInput,
  GenerateCertificateInput,
  BulkGenerateCertificatesInput,
} from '@/types/certificate.types';

export function useCertificates(params?: CertificateFilter) {
  return useQuery({
    queryKey: ['certificates', params],
    queryFn: () => fetchCertificates(params),
  });
}

export function useCertificate(id: number) {
  return useQuery({
    queryKey: ['certificate', id],
    queryFn: () => fetchCertificate(id),
    enabled: !!id,
  });
}

export function useCreateCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCertificateInput) => createCertificate(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Certificate created');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCertificateInput }) =>
      updateCertificate(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Certificate updated');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCertificate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Certificate deleted');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useGenerateCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: GenerateCertificateInput) => generateCertificate(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Certificate generated successfully');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useBulkGenerateCertificates() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: BulkGenerateCertificatesInput) => bulkGenerateCertificates(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Certificates generated successfully');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
