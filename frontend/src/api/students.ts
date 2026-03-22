import { apiFetch } from './api';
import type { StudentDto, StudentFilter, CreateStudentInput, UpdateStudentInput } from '@/types/student.types';

export async function fetchStudents(params?: StudentFilter) {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set('search', params.search);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const res = await apiFetch<{ data: StudentDto[]; count: number }>(
    '/api/students?' + searchParams.toString()
  );
  return res;
}

export async function createStudent(data: CreateStudentInput) {
  const res = await apiFetch<StudentDto>('/api/students', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res;
}

export async function updateStudent(id: number, data: UpdateStudentInput) {
  const res = await apiFetch<StudentDto>('/api/students/' + id, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res;
}

export async function deleteStudent(id: number) {
  const res = await apiFetch<void>('/api/students/' + id, {
    method: 'DELETE',
  });
  return res;
}
