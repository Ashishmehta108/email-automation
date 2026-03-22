export interface TemplateDto {
  id: number;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateFilter {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CreateTemplateInput {
  name: string;
  subject: string;
  body: string;
  variables?: string[];
}

export interface UpdateTemplateInput extends Partial<CreateTemplateInput> {}
