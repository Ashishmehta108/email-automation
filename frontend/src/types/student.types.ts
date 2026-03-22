export interface StudentDto {
  id: number;
  name: string;
  rollNo: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentFilter {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CreateStudentInput {
  name: string;
  rollNo: string;
  email: string;
}

export interface UpdateStudentInput extends Partial<CreateStudentInput> {}
