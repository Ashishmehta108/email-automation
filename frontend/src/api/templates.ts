import { apiFetch } from './api';
import type { TemplateDto, TemplateFilter, CreateTemplateInput, UpdateTemplateInput } from '@/types/template.types';

export async function fetchTemplates(params?: TemplateFilter) {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set('search', params.search);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const res = await apiFetch<{ data: TemplateDto[]; count: number }>(
    '/api/templates?' + searchParams.toString()
  );
  return res;
}

export async function createTemplate(data: CreateTemplateInput) {
  const res = await apiFetch<TemplateDto>('/api/templates', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res;
}

export async function updateTemplate(id: number, data: UpdateTemplateInput) {
  const res = await apiFetch<TemplateDto>('/api/templates/' + id, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res;
}

export async function deleteTemplate(id: number) {
  const res = await apiFetch<void>('/api/templates/' + id, {
    method: 'DELETE',
  });
  return res;
}
